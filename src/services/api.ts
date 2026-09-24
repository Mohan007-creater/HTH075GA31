/**
 * API Service for interacting with server endpoints
 */

import {
  ColumnProfile,
  InferredColumn,
  AnalysisPlan,
  ChatMessage,
  Dataset
} from '../types/dataset';
import { inferSchemaHeuristics } from '../utils/dataEngine';

export async function requestSchemaInference(
  columns: string[],
  profiles: Record<string, ColumnProfile>,
  sampleRecords: Record<string, any>[]
): Promise<{
  inferredSchema: Record<string, InferredColumn>;
  suggestedQuestions: string[];
}> {
  try {
    const res = await fetch('/api/analyze-schema', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ columns, profiles, sampleRecords }),
    });

    if (res.ok) {
      const data = await res.json();
      if (!data.fallback && data.inferredSchema) {
        return {
          inferredSchema: data.inferredSchema,
          suggestedQuestions: data.suggestedQuestions || [],
        };
      }
    }
  } catch (err) {
    console.warn('Backend schema inference request failed, using heuristic engine:', err);
  }

  // Graceful fallback to heuristic inference
  return inferSchemaHeuristics(columns, profiles);
}

export async function requestAnalysisPlan(
  question: string,
  dataset: Dataset,
  conversationHistory: ChatMessage[]
): Promise<AnalysisPlan> {
  try {
    const historyPayload = conversationHistory.map((msg) => ({
      sender: msg.sender,
      text: msg.content || msg.analysisResult?.question || '',
      summary: msg.analysisResult?.answerSummary || '',
      targetMeasure: msg.analysisResult?.plan?.targetMeasure,
      groupBy: msg.analysisResult?.plan?.groupBy,
    }));

    const res = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        inferredSchema: dataset.inferredSchema,
        profiles: dataset.profiles,
        columns: dataset.columns,
        conversationHistory: historyPayload.slice(-6),
      }),
    });

    if (res.ok) {
      const plan = await res.json();
      if (!plan.fallback && (plan.intent || plan.isUnanswerable || plan.ambiguity?.isAmbiguous)) {
        return plan;
      }
    }
  } catch (err) {
    console.warn('Backend plan generation request failed, using client heuristic plan:', err);
  }

  // Heuristic rule-based fallback when AI key or endpoint is unavailable
  return generateClientHeuristicPlan(question, dataset);
}

export async function requestAIInsights(
  question: string,
  resultData: any,
  targetMeasure?: string,
  groupBy?: string
): Promise<string[]> {
  try {
    const res = await fetch('/api/generate-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, resultData, targetMeasure, groupBy }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.insights) && data.insights.length > 0) {
        return data.insights;
      }
    }
  } catch (err) {
    console.warn('Backend insights request failed:', err);
  }
  return [];
}

/**
 * Intelligent Client-side heuristic plan generator for offline or fallback resilience
 */
function generateClientHeuristicPlan(question: string, dataset: Dataset): AnalysisPlan {
  const q = question.toLowerCase();
  const measures = Object.values(dataset.inferredSchema).filter((c) => c.role === 'measure');
  const dimensions = Object.values(dataset.inferredSchema).filter((c) => c.role === 'dimension');
  const temporals = Object.values(dataset.inferredSchema).filter((c) => c.role === 'temporal');
  const geographics = Object.values(dataset.inferredSchema).filter((c) => c.role === 'geography');

  // Check for unanswerable topics (e.g. employee, attendance, salary, password, weather)
  const unanswerableKeywords = ['attendance', 'salary', 'employee', 'weather', 'password', 'churn rate', 'nps', 'sentiment'];
  for (const kw of unanswerableKeywords) {
    if (q.includes(kw)) {
      const hasCol = dataset.columns.some((c) => c.toLowerCase().includes(kw));
      if (!hasCol) {
        return {
          intent: 'total',
          isUnanswerable: true,
          unanswerableReason: `I cannot answer this question because no "${kw}" information was detected in this dataset schema.`,
          suggestedAlternatives: dataset.suggestedQuestions.slice(0, 3),
          explanationSteps: [],
          technicalFormula: '',
          recommendedChart: 'table',
        };
      }
    }
  }

  // Check for ambiguous "amount" / "value" questions when multiple measures exist
  if ((q.includes('amount') || q.includes('value') || q.includes('metric')) && measures.length > 1) {
    const matchedMeasures = measures.filter((m) =>
      q.includes(m.columnName.toLowerCase().replace(/_/g, ' '))
    );
    if (matchedMeasures.length === 0) {
      return {
        intent: 'total',
        ambiguity: {
          isAmbiguous: true,
          question: `I found multiple numeric measures that could represent "${question.trim()}". Which one would you like to analyze?`,
          options: measures.map((m) => m.columnName),
          reason: `Multiple numeric measures exist in the dataset: ${measures.map((m) => m.columnName).join(', ')}.`,
        },
        explanationSteps: [],
        technicalFormula: '',
        recommendedChart: 'bar',
      };
    }
  }

  // Detect primary measure from query or default to first measure
  let targetMeasure = measures[0]?.columnName || dataset.columns[0];
  for (const m of measures) {
    const colClean = m.columnName.toLowerCase().replace(/_/g, ' ');
    if (q.includes(colClean) || q.includes(m.businessConcept.toLowerCase())) {
      targetMeasure = m.columnName;
      break;
    }
  }

  // Detect secondary measure
  let secondaryMeasure: string | undefined;
  for (const m of measures) {
    if (m.columnName !== targetMeasure && q.includes(m.columnName.toLowerCase().replace(/_/g, ' '))) {
      secondaryMeasure = m.columnName;
      break;
    }
  }

  // Detect grouping dimension
  let groupBy: string | undefined;
  for (const d of [...dimensions, ...geographics, ...temporals]) {
    const colClean = d.columnName.toLowerCase().replace(/_/g, ' ');
    if (q.includes(colClean) || q.includes(d.role)) {
      groupBy = d.columnName;
      break;
    }
  }

  // Check for date/time trend
  let dateGranularity: 'month' | 'year' | 'day' | undefined;
  if (q.includes('month') || q.includes('monthly')) dateGranularity = 'month';
  if (q.includes('year') || q.includes('yearly') || q.includes('annual')) dateGranularity = 'year';
  if (q.includes('trend') || q.includes('over time') || dateGranularity) {
    if (temporals.length > 0) {
      groupBy = temporals[0].columnName;
      dateGranularity = dateGranularity || 'month';
    }
  }

  // Check for ranking / top N
  let intent: AnalysisPlan['intent'] = 'total';
  let sort: 'asc' | 'desc' = 'desc';
  let limit: number | undefined = undefined;
  let chart: AnalysisPlan['recommendedChart'] = groupBy ? 'bar' : 'metric';

  if (q.includes('anomaly') || q.includes('unusual') || q.includes('outlier')) {
    intent = 'anomaly';
    chart = 'table';
  } else if (q.includes('correlation') || q.includes('relationship')) {
    intent = 'correlation';
    secondaryMeasure = secondaryMeasure || measures[1]?.columnName;
    chart = 'scatter';
    if (!targetMeasure || !secondaryMeasure) {
      return {
        intent: 'correlation',
        isUnanswerable: true,
        unanswerableReason: 'Correlation requires at least two numeric measures in the dataset.',
        suggestedAlternatives: dataset.suggestedQuestions.slice(0, 3),
        explanationSteps: [],
        technicalFormula: '',
        recommendedChart: 'table',
      };
    }
  } else if (
    q.includes('top') ||
    q.includes('best') ||
    q.includes('most') ||
    (q.includes('highest') && (groupBy || q.includes(' by ')))
  ) {
    intent = 'ranking';
    sort = 'desc';
    groupBy = groupBy || dimensions[0]?.columnName || geographics[0]?.columnName;
    const matchLimit = q.match(/top\s+(\d+)/);
    limit = matchLimit ? parseInt(matchLimit[1], 10) : 5;
    chart = 'horizontal_bar';
  } else if (
    q.includes('bottom') ||
    q.includes('worst') ||
    q.includes('least') ||
    (q.includes('lowest') && (groupBy || q.includes(' by ')))
  ) {
    intent = 'bottom_n';
    sort = 'asc';
    groupBy = groupBy || dimensions[0]?.columnName;
    limit = 5;
    chart = 'horizontal_bar';
  } else if (q.includes('average') || q.includes('avg') || q.includes('mean')) {
    intent = 'average';
  } else if (q.includes('minimum') || q.includes('minimum value') || q.includes('lowest value') || q.includes('min ')) {
    intent = 'minimum';
    chart = 'metric';
  } else if (q.includes('maximum') || q.includes('maximum value') || q.includes('highest value') || q.includes('max ')) {
    intent = 'maximum';
    chart = 'metric';
  } else if (q.includes('count') || q.includes('how many')) {
    intent = 'count';
  } else if (q.includes('percent') || q.includes('share') || q.includes('proportion')) {
    intent = 'percentage';
    groupBy = groupBy || dimensions[0]?.columnName;
    chart = 'donut';
  } else if (groupBy) {
    intent = 'group_by';
  }

  if (temporals.some((t) => t.columnName === groupBy)) {
    chart = 'line';
  }

  const steps = [
    `1. Scanned dataset for measure "${targetMeasure}" matching query context.`,
    groupBy ? `2. Grouped records by dimension "${groupBy}".` : `2. Aggregated measure across full dataset.`,
    `3. Calculated ${intent.toUpperCase()} of "${targetMeasure}".`,
    sort ? `4. Ordered aggregated values in ${sort.toUpperCase()} sequence.` : `4. Validated numerical output.`,
    limit ? `5. Retained top ${limit} results.` : `5. Prepared data representation.`,
  ];

  return {
    intent,
    targetMeasure,
    secondaryMeasure,
    groupBy,
    dateGranularity,
    aggregation: intent === 'average' ? 'avg' : 'sum',
    sort,
    limit,
    recommendedChart: chart,
    explanationSteps: steps,
    technicalFormula: groupBy
      ? `SELECT ${groupBy}, SUM(${targetMeasure})\nFROM dataset\nGROUP BY ${groupBy}\nORDER BY SUM(${targetMeasure}) ${sort.toUpperCase()}\nLIMIT ${limit || 5};`
      : `SELECT SUM(${targetMeasure})\nFROM dataset;`,
  };
}
