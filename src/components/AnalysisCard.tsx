import React, { useState } from 'react';
import { AnalysisResult } from '../types/dataset';
import { InteractiveChart } from './InteractiveChart';
import {
  Lightbulb,
  Code2,
  ChevronDown,
  ChevronUp,
  Table,
  CheckCircle,
  Sparkles,
  Copy,
  Check,
  MessageSquarePlus,
  ArrowRight,
} from 'lucide-react';

interface AnalysisCardProps {
  result: AnalysisResult;
  onAskFollowUp?: (question: string) => void;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({
  result,
  onAskFollowUp,
}) => {
  const [showCalculation, setShowCalculation] = useState(true);
  const [showDataTable, setShowDataTable] = useState(false);
  const [copiedFormula, setCopiedFormula] = useState(false);

  const handleCopyFormula = () => {
    navigator.clipboard.writeText(result.technicalFormula);
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 2000);
  };

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-300">
      {/* 1. Question Header Banner */}
      <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
            Q
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
              {result.question}
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Executed at {result.timestamp} · Verified calculation
            </span>
          </div>
        </div>

        <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold shrink-0">
          {result.plan.intent}
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* 2. AI Answer Highlight Card */}
        <div className="relative rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 p-5 shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI Verified Answer</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
            {result.highlightValue && (
              <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
                {result.highlightValue}
              </span>
            )}
            {result.highlightSubtext && (
              <span className="text-xs sm:text-sm font-medium text-slate-400">
                · {result.highlightSubtext}
              </span>
            )}
          </div>

          <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {result.answerSummary}
          </p>
        </div>

        {/* 3. Interactive Visualization */}
        {result.chartData && result.chartData.length > 0 && (
          <InteractiveChart
            data={result.chartData}
            initialType={result.chartType}
            title={result.question}
            allowTypeSwitch={true}
          />
        )}

        {/* 4. "How I Calculated This" Step-by-Step Breakdown */}
        <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-5">
          <button
            onClick={() => setShowCalculation(!showCalculation)}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Lightbulb className="w-4 h-4" />
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide group-hover:text-amber-300 transition-colors">
                HOW I CALCULATED THIS
              </h4>
            </div>
            {showCalculation ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showCalculation && (
            <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4">
              {/* Stepper list */}
              <div className="space-y-2">
                {result.calculationSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>

              {/* Technical SQL/Formula Representation */}
              {result.technicalFormula && (
                <div className="rounded-xl bg-slate-900 border border-slate-800 p-3.5 relative group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Technical Safe Operation</span>
                    </span>
                    <button
                      onClick={handleCopyFormula}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-[10px] flex items-center gap-1"
                    >
                      {copiedFormula ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-cyan-200 overflow-x-auto whitespace-pre leading-relaxed">
                    {result.technicalFormula}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 5. Business Insights */}
        {result.aiInsights && result.aiInsights.length > 0 && (
          <div className="rounded-2xl bg-slate-950/60 border border-slate-800/80 p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>AI Business Insights</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {result.aiInsights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 6. Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDataTable(!showDataTable)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                showDataTable
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>{showDataTable ? 'Hide Data' : 'Show Data'}</span>
            </button>
          </div>
        </div>

        {/* 7. Collapsible Data Preview */}
        {showDataTable && result.tableData && result.tableData.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-800 max-h-60 mt-2">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono sticky top-0 border-b border-slate-800">
                <tr>
                  {Object.keys(result.tableData[0]).map((col) => (
                    <th key={col} className="px-3.5 py-2 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {result.tableData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                    {Object.values(row).map((v: any, j) => (
                      <td key={j} className="px-3.5 py-2 font-mono text-slate-300 whitespace-nowrap">
                        {v !== null && v !== undefined ? String(v) : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
