import React, { useState } from 'react';
import { Dataset, AnalysisResult, ChatMessage } from '../types/dataset';
import { InteractiveChart } from './InteractiveChart';
import { AmbiguityCard, UnanswerableCard } from './ClarificationCard';
import {
  Sparkles,
  Send,
  CheckCircle2,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Code2,
  Copy,
  Check,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
  HelpCircle,
  BarChart2,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface AIAnalystPageProps {
  dataset: Dataset;
  analysisResults: AnalysisResult[];
  onAskQuestion: (q: string) => void;
  isThinking: boolean;
  currentAmbiguity?: {
    question: string;
    options: string[];
    reason: string;
  } | null;
  currentUnanswerable?: {
    reason: string;
    suggestedAlternatives: string[];
  } | null;
  onResolveAmbiguity: (chosenOption: string) => void;
  onNavigateToDashboard: () => void;
}

export const AIAnalystPage: React.FC<AIAnalystPageProps> = ({
  dataset,
  analysisResults,
  onAskQuestion,
  isThinking,
  currentAmbiguity,
  currentUnanswerable,
  onResolveAmbiguity,
  onNavigateToDashboard,
}) => {
  const [queryInput, setQueryInput] = useState('');
  const [expandedCalculations, setExpandedCalculations] = useState<Record<string, boolean>>({ 'latest': true });
  const [copiedFormulaIndex, setCopiedFormulaIndex] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim() || isThinking) return;
    onAskQuestion(queryInput.trim());
    setQueryInput('');
  };

  const handleCopyFormula = (formula: string, idx: number) => {
    navigator.clipboard.writeText(formula);
    setCopiedFormulaIndex(idx);
    setTimeout(() => setCopiedFormulaIndex(null), 2000);
  };

  const toggleCalculation = (key: string) => {
    setExpandedCalculations((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Generate dynamic smart suggested questions based on dataset schema
  const dynamicSuggestions = React.useMemo(() => {
    const list: string[] = [];
    const measures = Object.values(dataset.inferredSchema).filter((c) => c.role === 'measure');
    const dimensions = Object.values(dataset.inferredSchema).filter((c) => c.role === 'dimension');
    const temporals = Object.values(dataset.inferredSchema).filter((c) => c.role === 'temporal');

    const mName = measures[0]?.columnName || 'Amount';
    const dName = dimensions[0]?.columnName || 'Category';

    list.push(`Top 5 ${dName} by ${mName}`);
    if (temporals.length > 0) {
      list.push(`Monthly ${mName} Trend`);
    } else {
      list.push(`Average ${mName} by ${dName}`);
    }
    if (dimensions.length > 1) {
      list.push(`Best ${dimensions[1].columnName} Performance`);
    } else {
      list.push(`Total ${mName}`);
    }
    list.push(`Average ${mName}`);
    list.push(`Find Anomalies in ${mName}`);
    if (measures.length > 1) {
      list.push(`Compare ${measures[1].columnName} across ${dName}`);
    } else {
      list.push(`Show ${mName} Distribution`);
    }

    return list;
  }, [dataset]);

  const latestResult = analysisResults[0];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
      {/* 1. Header & Dataset Ready Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#151B28] border border-white/[0.08] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Your dataset is ready.</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#F5F7FB] mt-1 tracking-tight truncate">
            {dataset.fileName}
          </h2>
          <div className="flex items-center gap-2 text-xs text-[#9CA7BA] mt-1 font-mono">
            <span>{dataset.records.length.toLocaleString()} Rows</span>
            <span>·</span>
            <span>{dataset.columns.length} Columns</span>
            <span>·</span>
            <span className="text-emerald-400 font-bold">{dataset.quality.score}% Quality Score</span>
          </div>
        </div>

        <button
          onClick={onNavigateToDashboard}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#101522] hover:bg-[#1E2638] text-xs font-bold text-[#4F8CFF] border border-[#4F8CFF]/30 transition-all shrink-0"
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Open Dashboard</span>
        </button>
      </div>

      {/* 2. LARGE Centered AI Question Input (LIGHT CARD per specification) */}
      <div className="relative rounded-3xl bg-[#F7F9FC] text-slate-900 border border-slate-200 shadow-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-[#4F8CFF] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#4F8CFF]" />
            <span>AI Natural Language Analyst</span>
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            Zero-hardcoded · Computes on real records
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative rounded-2xl bg-white border-2 border-slate-200 focus-within:border-[#4F8CFF] focus-within:ring-2 focus-within:ring-[#4F8CFF]/20 transition-all p-3 shadow-inner">
            <textarea
              rows={2}
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Which product generated the highest revenue?"
              disabled={isThinking}
              className="w-full bg-transparent resize-none text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-medium focus:outline-none min-h-[64px]"
            />

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-500">
                Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px] text-slate-700">Enter ↵</kbd> to ask
              </span>

              <button
                type="submit"
                disabled={!queryInput.trim() || isThinking}
                className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  queryInput.trim() && !isThinking
                    ? 'bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white shadow-md shadow-blue-500/25 hover:opacity-95 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isThinking ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Ask AI</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Dynamic Suggested Questions Chips */}
        <div className="mt-4 pt-3 border-t border-slate-200">
          <div className="text-[11px] font-bold text-slate-600 mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Suggested questions for this dataset:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {dynamicSuggestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onAskQuestion(item)}
                disabled={isThinking}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-[#4F8CFF] text-xs font-medium text-slate-700 hover:text-[#4F8CFF] transition-all shadow-2xs text-left"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Clarification Cards (Ambiguity or Unanswerable) */}
      {currentAmbiguity && (
        <AmbiguityCard
          question={currentAmbiguity.question}
          options={currentAmbiguity.options}
          reason={currentAmbiguity.reason}
          onSelectOption={onResolveAmbiguity}
        />
      )}

      {currentUnanswerable && (
        <UnanswerableCard
          reason={currentUnanswerable.reason}
          suggestedAlternatives={currentUnanswerable.suggestedAlternatives}
          onSelectAlternative={(alt) => onAskQuestion(alt)}
        />
      )}

      {/* 4. Thinking State Animation */}
      {isThinking && (
        <div className="p-8 rounded-3xl bg-[#151B28] border border-white/[0.08] shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#4F8CFF]/10 text-[#4F8CFF] border border-[#4F8CFF]/20 flex items-center justify-center mx-auto animate-spin">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#F5F7FB]">
              Executing Dynamic Analysis Plan...
            </h4>
            <p className="text-xs text-[#9CA7BA] mt-1 font-mono">
              Mapping natural language → Identifying columns → Calculating aggregation in-memory
            </p>
          </div>
        </div>
      )}

      {/* 5. Main Answers Stream */}
      {analysisResults.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#9CA7BA] px-1">
            <span>Analysis Answers ({analysisResults.length})</span>
            <span className="text-[#687386] font-mono">Verified Computations</span>
          </div>

          {analysisResults.map((result, idx) => {
            const isLatest = idx === 0;
            const isCalcOpen = expandedCalculations[result.id] ?? isLatest;

            return (
              <div
                key={result.id}
                className="rounded-3xl bg-[#151B28] border border-white/[0.08] shadow-xl overflow-hidden"
              >
                {/* Question Header */}
                <div className="bg-[#101522] px-6 py-4 border-b border-white/[0.08] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4F8CFF] to-[#8B5CF6] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                      Q
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#F5F7FB]">
                        {result.question}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-[#9CA7BA] font-mono mt-0.5">
                        <Clock className="w-3 h-3 text-[#687386]" />
                        <span>Executed at {result.timestamp}</span>
                        <span>·</span>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Verified from dataset
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg bg-blue-500/10 text-[#4F8CFF] border border-blue-500/20 shrink-0">
                    {result.plan.intent}
                  </span>
                </div>

                <div className="p-6 space-y-6">
                  {/* AI Answer Card (LIGHT CARD per user guidelines!) */}
                  <div className="rounded-2xl bg-[#F7F9FC] text-slate-900 border border-slate-200 p-6 shadow-md relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-[#4F8CFF] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#4F8CFF]" />
                        <span>AI Answer</span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified from dataset</span>
                      </span>
                    </div>

                    {result.highlightValue && (
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 my-2">
                        <span className="text-3xl sm:text-4xl font-black text-slate-950 font-mono tracking-tight">
                          {result.highlightValue}
                        </span>
                        {result.highlightSubtext && (
                          <span className="text-xs sm:text-sm font-semibold text-slate-600">
                            · {result.highlightSubtext}
                          </span>
                        )}
                      </div>
                    )}

                    <p className="mt-3 text-sm text-slate-800 leading-relaxed font-medium">
                      {result.answerSummary}
                    </p>
                  </div>

                  {/* Recommended Chart inside Clean Card */}
                  {result.chartData && result.chartData.length > 0 && (
                    <div className="rounded-2xl bg-[#101522] border border-white/[0.08] p-5 shadow-sm">
                      <InteractiveChart
                        data={result.chartData}
                        initialType={result.chartType}
                        title={result.question}
                        allowTypeSwitch={true}
                      />
                    </div>
                  )}

                  {/* Expandable "How was this calculated?" section (LIGHT background when opened per spec) */}
                  <div className="rounded-2xl border border-white/[0.08] overflow-hidden bg-[#101522]">
                    <button
                      onClick={() => toggleCalculation(result.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                          <Lightbulb className="w-4 h-4" />
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#F5F7FB]">
                            How was this calculated?
                          </h4>
                          <span className="text-[11px] text-[#9CA7BA]">
                            Transparent mathematical reasoning and query logic
                          </span>
                        </div>
                      </div>

                      {isCalcOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#9CA7BA]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#9CA7BA]" />
                      )}
                    </button>

                    {isCalcOpen && (
                      <div className="p-5 bg-[#F7F9FC] text-slate-900 border-t border-slate-200 space-y-4">
                        <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                          Mathematical Step-by-Step Breakdown:
                        </div>

                        {/* 6 Step list per prompt spec */}
                        <div className="space-y-2">
                          {result.calculationSteps && result.calculationSteps.length > 0 ? (
                            result.calculationSteps.map((step, sIdx) => (
                              <div key={sIdx} className="flex items-start gap-3 text-xs text-slate-800">
                                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                                  {sIdx + 1}
                                </span>
                                <span className="leading-relaxed font-medium">{step}</span>
                              </div>
                            ))
                          ) : (
                            [
                              `Identified relevant column: ${result.plan.targetMeasure || 'Value'}`,
                              `Identified metric aggregation: ${result.plan.intent.toUpperCase()}`,
                              `Grouped dataset records by ${result.plan.groupBy || 'dimension'}`,
                              `Calculated mathematical aggregation`,
                              `Sorted results descending`,
                              `Selected final answer`,
                            ].map((step, sIdx) => (
                              <div key={sIdx} className="flex items-start gap-3 text-xs text-slate-800">
                                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                                  {sIdx + 1}
                                </span>
                                <span className="leading-relaxed font-medium">{step}</span>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Technical Safe Operation / SQL equivalent */}
                        {result.technicalFormula && (
                          <div className="mt-3 p-3.5 rounded-xl bg-slate-900 text-white font-mono text-xs relative group">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] text-[#4F8CFF] flex items-center gap-1.5 font-bold">
                                <Code2 className="w-3.5 h-3.5" />
                                <span>Technical Safe Operation</span>
                              </span>
                              <button
                                onClick={() => handleCopyFormula(result.technicalFormula, idx)}
                                className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] text-slate-300 flex items-center gap-1 transition-colors"
                              >
                                {copiedFormulaIndex === idx ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span>Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="text-emerald-400 whitespace-pre-wrap overflow-x-auto text-[11px] leading-relaxed">
                              {result.technicalFormula}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
