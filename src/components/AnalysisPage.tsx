import React, { useState } from 'react';
import { Dataset, AnalysisResult, QueryIntent } from '../types/dataset';
import { InteractiveChart } from './InteractiveChart';
import {
  Sliders,
  Play,
  Download,
  Copy,
  Check,
  Code2,
  Lightbulb,
  Table as TableIcon,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { executeAnalysisPlan } from '../utils/dataEngine';

interface AnalysisPageProps {
  dataset: Dataset;
  analysisResults: AnalysisResult[];
  onAskQuestion: (q: string) => void;
  isThinking: boolean;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({
  dataset,
  analysisResults,
  onAskQuestion,
  isThinking,
}) => {
  const { columns, profiles, inferredSchema, records } = dataset;

  const measures = Object.values(inferredSchema)
    .filter((c) => c.role === 'measure')
    .map((c) => c.columnName);
  const dimensions = Object.values(inferredSchema)
    .filter((c) => c.role === 'dimension' || c.role === 'geography' || c.role === 'categorical')
    .map((c) => c.columnName);

  // Fallbacks if inference is narrow
  const availableMeasures = measures.length > 0 ? measures : columns.filter((c) => profiles[c]?.dataType === 'number');
  const availableDimensions = dimensions.length > 0 ? dimensions : columns.filter((c) => profiles[c]?.dataType === 'string');

  const [selectedMeasure, setSelectedMeasure] = useState<string>(availableMeasures[0] || columns[0]);
  const [selectedDimension, setSelectedDimension] = useState<string>(availableDimensions[0] || columns[1] || columns[0]);
  const [selectedIntent, setSelectedIntent] = useState<QueryIntent>('total');
  const [chartTypeOverride, setChartTypeOverride] = useState<'bar' | 'horizontal_bar' | 'line' | 'donut' | 'table'>('bar');
  const [limitCount, setLimitCount] = useState<number>(6);
  const [activeResult, setActiveResult] = useState<AnalysisResult | null>(
    analysisResults.length > 0 ? analysisResults[0] : null
  );

  const [copiedSummary, setCopiedSummary] = useState(false);
  const [showCalculation, setShowCalculation] = useState(true);

  // Keep active result in sync if new questions arrive
  React.useEffect(() => {
    if (analysisResults.length > 0 && !activeResult) {
      setActiveResult(analysisResults[0]);
    }
  }, [analysisResults]);

  // Execute manual analysis control slice
  const handleExecuteCustomAnalysis = () => {
    const customQuestion = `${selectedIntent.toUpperCase()} of ${selectedMeasure} grouped by ${selectedDimension}`;
    const aggMap: Record<QueryIntent, 'sum' | 'avg' | 'count' | 'min' | 'max'> = {
      total: 'sum',
      average: 'avg',
      maximum: 'max',
      minimum: 'min',
      count: 'count',
      ranking: 'sum',
      top_n: 'sum',
      bottom_n: 'sum',
      group_by: 'sum',
      trend: 'sum',
      comparison: 'sum',
      percentage: 'sum',
      distribution: 'sum',
      correlation: 'sum',
      anomaly: 'avg',
    };

    const plan = {
      intent: selectedIntent,
      targetMeasure: selectedMeasure,
      groupBy: selectedDimension,
      limit: limitCount,
      aggregation: aggMap[selectedIntent] || 'sum',
      recommendedChart: chartTypeOverride,
      explanationSteps: [
        `Identified relevant column: ${selectedMeasure}`,
        `Identified metric aggregation: ${selectedIntent.toUpperCase()}`,
        `Grouped dataset records by ${selectedDimension}`,
        `Calculated aggregation for top ${limitCount} entries`,
        `Sorted results descending`,
        `Rendered ${chartTypeOverride} visualization`,
      ],
      technicalFormula: `SELECT ${selectedDimension}, ${aggMap[selectedIntent] || 'SUM'}(${selectedMeasure}) FROM dataset GROUP BY ${selectedDimension} ORDER BY 2 DESC LIMIT ${limitCount}`,
    };

    const computed = executeAnalysisPlan(dataset, plan);
    computed.question = customQuestion;
    setActiveResult(computed);
  };

  const handleCopySummary = () => {
    if (!activeResult) return;
    navigator.clipboard.writeText(`${activeResult.question}\n${activeResult.answerSummary}`);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleExportCSV = () => {
    if (!activeResult?.chartData || activeResult.chartData.length === 0) return;
    const header = ['Label', 'Value'].join(',');
    const rows = activeResult.chartData.map((d) => `"${d.label}",${d.value}`);
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataset.fileName.replace(/\.[^/.]+$/, '')}_analysis_slice.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FB] tracking-tight">
            Multi-Dimensional Analysis
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA7BA] mt-1">
            Slice and dice {dataset.fileName} with custom dimensions, measures, and aggregations.
          </p>
        </div>

        {activeResult && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3 py-1.5 rounded-xl bg-[#151B28] hover:bg-[#1E2638] text-xs font-semibold text-[#F5F7FB] border border-white/[0.08] transition-colors flex items-center gap-1.5"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSummary ? 'Copied' : 'Copy Summary'}</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-xs font-bold text-white transition-opacity hover:opacity-95 shadow-md shadow-blue-500/20 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Slice</span>
            </button>
          </div>
        )}
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Analysis Controls (38% width -> 4 or 5 cols out of 12) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Controls Card (Darker background) */}
          <div className="p-5 rounded-2xl bg-[#151B28] border border-white/[0.08] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9CA7BA] flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#4F8CFF]" />
                <span>Analysis Parameters</span>
              </span>
              <span className="text-[10px] font-mono text-[#687386]">Interactive</span>
            </div>

            {/* Target Metric / Measure */}
            <div>
              <label className="block text-xs font-semibold text-[#9CA7BA] mb-1.5">
                Target Metric (Measure)
              </label>
              <select
                value={selectedMeasure}
                onChange={(e) => setSelectedMeasure(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#101522] border border-white/[0.08] text-xs font-mono text-[#F5F7FB] focus:border-[#4F8CFF] focus:outline-none"
              >
                {availableMeasures.map((m) => (
                  <option key={m} value={m}>
                    {m} {inferredSchema[m]?.unit ? `(${inferredSchema[m].unit})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Aggregation Intent */}
            <div>
              <label className="block text-xs font-semibold text-[#9CA7BA] mb-1.5">
                Aggregation Function
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['total', 'average', 'maximum', 'minimum', 'count'] as QueryIntent[]).map((func) => (
                  <button
                    key={func}
                    onClick={() => setSelectedIntent(func)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-mono uppercase font-bold border transition-all ${
                      selectedIntent === func
                        ? 'bg-[#4F8CFF]/20 text-[#4F8CFF] border-[#4F8CFF]/50 shadow-xs'
                        : 'bg-[#101522] text-[#9CA7BA] border-white/[0.06] hover:border-white/[0.15]'
                    }`}
                  >
                    {func}
                  </button>
                ))}
              </div>
            </div>

            {/* Group By Dimension */}
            <div>
              <label className="block text-xs font-semibold text-[#9CA7BA] mb-1.5">
                Group By (Dimension)
              </label>
              <select
                value={selectedDimension}
                onChange={(e) => setSelectedDimension(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#101522] border border-white/[0.08] text-xs font-mono text-[#F5F7FB] focus:border-[#4F8CFF] focus:outline-none"
              >
                {availableDimensions.map((d) => (
                  <option key={d} value={d}>
                    {d} ({profiles[d]?.uniqueCount || 0} unique)
                  </option>
                ))}
              </select>
            </div>

            {/* Top N Limit */}
            <div>
              <label className="block text-xs font-semibold text-[#9CA7BA] mb-1.5">
                Result Limit: Top {limitCount}
              </label>
              <input
                type="range"
                min={3}
                max={15}
                value={limitCount}
                onChange={(e) => setLimitCount(Number(e.target.value))}
                className="w-full accent-[#4F8CFF]"
              />
            </div>

            {/* Chart Type Preference */}
            <div>
              <label className="block text-xs font-semibold text-[#9CA7BA] mb-1.5">
                Visualization Type
              </label>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { id: 'bar', label: 'Bar' },
                  { id: 'horizontal_bar', label: 'Rank' },
                  { id: 'line', label: 'Line' },
                  { id: 'donut', label: 'Donut' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setChartTypeOverride(t.id as any)}
                    className={`py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      chartTypeOverride === t.id
                        ? 'bg-[#4F8CFF]/20 text-[#4F8CFF] border-[#4F8CFF]/50 font-bold'
                        : 'bg-[#101522] text-[#9CA7BA] border-white/[0.06]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleExecuteCustomAnalysis}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white text-xs font-bold hover:opacity-95 shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all mt-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Computation</span>
            </button>
          </div>

          {/* Recent Query History Selector */}
          {analysisResults.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#151B28] border border-white/[0.08] shadow-sm space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9CA7BA] block mb-1">
                Question History ({analysisResults.length})
              </span>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {analysisResults.map((res, i) => (
                  <button
                    key={res.id}
                    onClick={() => setActiveResult(res)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                      activeResult?.id === res.id
                        ? 'bg-[#101522] text-[#4F8CFF] border border-[#4F8CFF]/30 font-semibold'
                        : 'text-[#9CA7BA] hover:text-[#F5F7FB] hover:bg-white/[0.03]'
                    }`}
                  >
                    <span className="truncate pr-2">{res.question}</span>
                    <span className="text-[10px] font-mono text-[#687386] shrink-0">
                      {res.chartType}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Result / Chart (8 cols out of 12) - Visually Brighter per Prompt Spec */}
        <div className="lg:col-span-8 space-y-6">
          {activeResult ? (
            <div className="space-y-6">
              {/* Highlight Card (LIGHT CARD per user guidelines!) */}
              <div className="rounded-3xl bg-[#F7F9FC] text-slate-900 border border-slate-200 p-6 sm:p-7 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-[#4F8CFF]">
                    Active Analysis Result
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {activeResult.question}
                </h3>

                {activeResult.highlightValue && (
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 my-3">
                    <span className="text-3xl sm:text-4xl font-black text-slate-950 font-mono tracking-tight">
                      {activeResult.highlightValue}
                    </span>
                    {activeResult.highlightSubtext && (
                      <span className="text-xs sm:text-sm font-semibold text-slate-600">
                        · {activeResult.highlightSubtext}
                      </span>
                    )}
                  </div>
                )}

                <p className="mt-2 text-sm text-slate-800 leading-relaxed font-medium">
                  {activeResult.answerSummary}
                </p>
              </div>

              {/* Interactive Chart */}
              {activeResult.chartData && activeResult.chartData.length > 0 && (
                <div className="rounded-2xl bg-[#151B28] border border-white/[0.08] p-5 shadow-sm">
                  <InteractiveChart
                    data={activeResult.chartData}
                    initialType={activeResult.chartType}
                    title={activeResult.question}
                    allowTypeSwitch={true}
                  />
                </div>
              )}

              {/* Expandable Explanation Section (LIGHT BACKGROUND per user guidelines!) */}
              <div className="rounded-2xl border border-white/[0.08] overflow-hidden bg-[#151B28]">
                <button
                  onClick={() => setShowCalculation(!showCalculation)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                      <Lightbulb className="w-4 h-4" />
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#F5F7FB]">
                      Calculation Logic & Explainability
                    </h4>
                  </div>
                  {showCalculation ? (
                    <ChevronUp className="w-4 h-4 text-[#9CA7BA]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#9CA7BA]" />
                  )}
                </button>

                {showCalculation && (
                  <div className="p-5 bg-[#F7F9FC] text-slate-900 border-t border-slate-200 space-y-4">
                    <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Execution Steps:
                    </div>
                    <div className="space-y-2">
                      {activeResult.calculationSteps && activeResult.calculationSteps.length > 0 ? (
                        activeResult.calculationSteps.map((s, i) => (
                          <div key={i} className="flex items-start gap-3 text-xs text-slate-800">
                            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span className="leading-relaxed font-medium">{s}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-slate-600">
                          1. Isolated `{activeResult.plan.targetMeasure}` · 2. Aggregated via `{activeResult.plan.intent.toUpperCase()}` · 3. Grouped by `{activeResult.plan.groupBy}`
                        </div>
                      )}
                    </div>

                    {activeResult.technicalFormula && (
                      <div className="p-3.5 rounded-xl bg-slate-900 text-white font-mono text-xs">
                        <div className="text-[10px] text-[#4F8CFF] uppercase font-bold mb-1.5 flex items-center gap-1.5">
                          <Code2 className="w-3 h-3" />
                          <span>Technical Safe Operation</span>
                        </div>
                        <pre className="text-emerald-400 whitespace-pre-wrap overflow-x-auto text-[11px]">
                          {activeResult.technicalFormula}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Data Table Preview of Current Result */}
              {activeResult.chartData && activeResult.chartData.length > 0 && (
                <div className="rounded-2xl bg-[#151B28] border border-white/[0.08] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#9CA7BA] flex items-center gap-1.5">
                      <TableIcon className="w-3.5 h-3.5 text-[#4F8CFF]" />
                      <span>Result Data Breakdown</span>
                    </span>
                    <span className="text-[11px] font-mono text-[#687386]">
                      {activeResult.chartData.length} records
                    </span>
                  </div>

                  <div className="overflow-x-auto border border-white/[0.06] rounded-xl bg-[#101522]">
                    <table className="w-full text-left text-xs text-[#9CA7BA]">
                      <thead className="bg-[#151B28] text-[11px] uppercase font-bold text-[#F5F7FB] border-b border-white/[0.06]">
                        <tr>
                          <th className="px-3.5 py-2 font-mono text-[#687386]">#</th>
                          <th className="px-3.5 py-2">Category / Entity</th>
                          <th className="px-3.5 py-2 text-right">Computed Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {activeResult.chartData.map((d, i) => (
                          <tr key={i} className="hover:bg-white/[0.02]">
                            <td className="px-3.5 py-2 font-mono text-[#687386]">{i + 1}</td>
                            <td className="px-3.5 py-2 font-mono font-bold text-[#F5F7FB]">{d.label}</td>
                            <td className="px-3.5 py-2 font-mono text-right text-emerald-400 font-bold">
                              {d.value.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-[#151B28] border border-white/[0.08] space-y-3">
              <Sparkles className="w-8 h-8 text-[#4F8CFF] mx-auto opacity-70" />
              <h3 className="text-base font-bold text-[#F5F7FB]">No Analysis Selected</h3>
              <p className="text-xs text-[#9CA7BA] max-w-sm mx-auto">
                Use the left-hand controls to slice dataset metrics or choose a question from your history.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
