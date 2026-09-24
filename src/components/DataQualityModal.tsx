import React from 'react';
import { Dataset } from '../types/dataset';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  X,
  CheckCircle2,
  AlertOctagon,
  Copy,
} from 'lucide-react';

interface DataQualityModalProps {
  dataset: Dataset;
  onClose: () => void;
}

export const DataQualityModal: React.FC<DataQualityModalProps> = ({
  dataset,
  onClose,
}) => {
  const { quality, profiles, records } = dataset;

  const scoreBadgeColor =
    quality.score >= 90
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      : quality.score >= 70
      ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
      : 'text-rose-400 bg-rose-500/10 border-rose-500/30';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6">
      <div className="w-full max-w-3xl rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileCheck2 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Data Quality Health Audit</h3>
              <p className="text-xs text-slate-400">
                Automated hygiene assessment for {dataset.fileName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-xl font-mono font-bold text-sm border ${scoreBadgeColor}`}>
              {quality.score} / 100
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[11px] text-slate-400">Total Records</div>
              <div className="text-lg font-bold font-mono text-white">
                {records.length.toLocaleString()}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[11px] text-slate-400">Missing Cells</div>
              <div className={`text-lg font-bold font-mono ${quality.missingValuesCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {quality.missingValuesCount}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[11px] text-slate-400">Duplicate Rows</div>
              <div className={`text-lg font-bold font-mono ${quality.duplicateRowsCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {quality.duplicateRowsCount}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[11px] text-slate-400">Potential Outliers</div>
              <div className={`text-lg font-bold font-mono ${quality.outlierCount > 0 ? 'text-cyan-400' : 'text-emerald-400'}`}>
                {quality.outlierCount}
              </div>
            </div>
          </div>

          {/* Issues List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Detected Quality Observations ({quality.issues.length})
            </h4>

            {quality.issues.length === 0 ? (
              <div className="p-6 text-center text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 rounded-2xl flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero structural quality issues detected. Dataset is clean and ready for analysis!</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {quality.issues.map((issue) => {
                  const isHigh = issue.severity === 'high';
                  return (
                    <div
                      key={issue.id}
                      className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                        isHigh
                          ? 'bg-rose-950/20 border-rose-900/40 text-rose-200'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {isHigh ? (
                          <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="font-semibold text-white">
                            {issue.type === 'missing' && 'Missing Values in Column'}
                            {issue.type === 'duplicate' && 'Duplicate Records'}
                            {issue.type === 'outlier' && 'Extreme Value Outliers'}
                            {issue.type === 'constant_col' && 'Zero-Variance Column'}
                          </div>
                          <p className="mt-0.5 text-slate-400 leading-relaxed">
                            {issue.description}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold shrink-0 ${
                          isHigh
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {issue.severity}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Column Hygiene Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Per-Column Health Breakdown
            </h4>

            <div className="overflow-x-auto rounded-xl border border-slate-800 max-h-56">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono sticky top-0 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-2">Column Name</th>
                    <th className="px-4 py-2">Data Type</th>
                    <th className="px-4 py-2">Unique Values</th>
                    <th className="px-4 py-2">Missing</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {Object.values(profiles).map((col) => (
                    <tr key={col.name} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-2 font-mono font-medium text-slate-200">{col.name}</td>
                      <td className="px-4 py-2 font-mono text-cyan-400">{col.dataType}</td>
                      <td className="px-4 py-2 font-mono text-slate-300">{col.uniqueCount}</td>
                      <td className="px-4 py-2 font-mono text-slate-300">
                        {col.nullCount > 0 ? (
                          <span className="text-amber-400">{col.nullCount}</span>
                        ) : (
                          <span className="text-emerald-400">0</span>
                        )}
                      </td>
                      <td className="px-4 py-2 font-mono">
                        {col.nullCount === 0 && col.uniqueCount > 1 ? (
                          <span className="text-emerald-400 text-[10px]">Clean</span>
                        ) : (
                          <span className="text-amber-400 text-[10px]">Review</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Close Review
          </button>
        </div>
      </div>
    </div>
  );
};
