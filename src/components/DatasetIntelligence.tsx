import React from 'react';
import { Dataset } from '../types/dataset';
import {
  Database,
  Calendar,
  Hash,
  AlertTriangle,
  ShieldCheck,
  Tag,
  ArrowRight,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface DatasetIntelligenceProps {
  dataset: Dataset | null;
  onOpenQualityAudit: () => void;
  onOpenAnomalies: () => void;
}

export const DatasetIntelligence: React.FC<DatasetIntelligenceProps> = ({
  dataset,
  onOpenQualityAudit,
  onOpenAnomalies,
}) => {
  if (!dataset) {
    return (
      <aside className="w-80 border-l border-slate-800/80 bg-[#080B11]/80 backdrop-blur-xl p-6 hidden xl:flex flex-col justify-center items-center text-center text-slate-500">
        <Database className="w-10 h-10 mb-3 text-slate-600 opacity-60" />
        <p className="text-sm font-medium text-slate-400">No Dataset Active</p>
        <p className="text-xs mt-1">Upload a CSV/Excel file or launch Demo Mode to see live schema intelligence.</p>
      </aside>
    );
  }

  const { quality, inferredSchema, profiles, columns, anomalies } = dataset;

  const numericCount = Object.values(profiles).filter((p) => p.dataType === 'number').length;
  const dateCount = Object.values(profiles).filter((p) => p.dataType === 'date' || p.isDateCandidate).length;

  // Quality score color
  const scoreColor =
    quality.score >= 90
      ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
      : quality.score >= 70
      ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
      : 'text-rose-400 border-rose-500/30 bg-rose-500/10';

  return (
    <aside className="w-80 border-l border-slate-800/80 bg-[#0A0E17]/95 backdrop-blur-2xl flex flex-col h-full overflow-y-auto hidden xl:block">
      {/* Header */}
      <div className="p-5 border-b border-slate-800/80 sticky top-0 bg-[#0A0E17]/95 backdrop-blur-md z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Database className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Dataset Intelligence
            </h3>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
            Dynamic
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1 truncate" title={dataset.fileName}>
          {dataset.fileName}
        </p>
      </div>

      <div className="p-5 space-y-6">
        {/* Quality Score & Stats Grid */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Data Quality Score</span>
            </div>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${scoreColor}`}>
              {quality.score} / 100
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-slate-800/80">
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <div className="text-[11px] text-slate-400">Rows</div>
              <div className="text-base font-bold font-mono text-white">
                {dataset.records.length.toLocaleString()}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <div className="text-[11px] text-slate-400">Columns</div>
              <div className="text-base font-bold font-mono text-white">{columns.length}</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <div className="text-[11px] text-slate-400">Numeric Fields</div>
              <div className="text-base font-bold font-mono text-cyan-400">{numericCount}</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <div className="text-[11px] text-slate-400">Date Fields</div>
              <div className="text-base font-bold font-mono text-violet-400">{dateCount}</div>
            </div>
          </div>

          <button
            onClick={onOpenQualityAudit}
            className="w-full mt-3 flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-700/50"
          >
            <span>Review Data Quality</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Anomaly Callout */}
        {anomalies.length > 0 && (
          <div
            onClick={onOpenAnomalies}
            className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3.5 cursor-pointer hover:bg-amber-500/15 transition-all group"
          >
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-amber-200 group-hover:text-amber-100 flex items-center gap-1">
                  <span>{anomalies.length} Potential Anomalies Detected</span>
                  <ExternalLink className="w-3 h-3 text-amber-400 opacity-60" />
                </h4>
                <p className="text-[11px] text-amber-300/80 mt-1 leading-snug">
                  Statistical outliers detected in measure fields (Z-Score &gt; 2.8). Click to inspect.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Detected Schema Breakdown */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              <span>Detected Schema</span>
            </h4>
            <span className="text-[10px] text-slate-400">Zero-Hardcoding</span>
          </div>

          <div className="space-y-2">
            {columns.map((col) => {
              const inf = inferredSchema[col];
              const prof = profiles[col];

              let roleBadge = 'bg-slate-800 text-slate-300 border-slate-700';
              if (inf?.role === 'measure') roleBadge = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
              if (inf?.role === 'dimension') roleBadge = 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
              if (inf?.role === 'temporal') roleBadge = 'bg-violet-500/10 text-violet-300 border-violet-500/30';
              if (inf?.role === 'geography') roleBadge = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
              if (inf?.role === 'identifier') roleBadge = 'bg-amber-500/10 text-amber-300 border-amber-500/30';

              return (
                <div
                  key={col}
                  className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-medium text-slate-200 truncate" title={col}>
                      {col}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${roleBadge} shrink-0`}
                    >
                      {inf?.role || prof?.dataType || 'attr'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1.5">
                    <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate text-slate-300">
                      {inf?.businessConcept || col.replace(/_/g, ' ')}
                    </span>
                    {inf?.unit && (
                      <span className="text-[10px] font-mono text-cyan-400 ml-auto shrink-0">
                        [{inf.unit}]
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
