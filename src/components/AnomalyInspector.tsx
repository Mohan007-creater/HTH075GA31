import React, { useState } from 'react';
import { AnomalyItem, Dataset } from '../types/dataset';
import { AlertTriangle, ShieldCheck, Eye, Hash, ArrowUpRight, Search } from 'lucide-react';
import { formatNumber } from '../utils/dataEngine';

interface AnomalyInspectorProps {
  dataset: Dataset;
  onAskAboutAnomaly: (anomaly: AnomalyItem) => void;
}

export const AnomalyInspector: React.FC<AnomalyInspectorProps> = ({
  dataset,
  onAskAboutAnomaly,
}) => {
  const { anomalies, profiles } = dataset;
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyItem | null>(
    anomalies.length > 0 ? anomalies[0] : null
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Statistical Outlier Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Potential Anomalies Detection
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Flagged via Interquartile Range (IQR &gt; 1.5) and Z-Score (|z| &gt; 2.8). These indicate unusual records rather than proven errors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
            {anomalies.length} Flagged Points
          </div>
        </div>
      </div>

      {anomalies.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Statistical Anomalies Detected</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            All numeric measurements in this dataset fall within typical interquartile bounds and variance distributions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Anomaly list */}
          <div className="lg:col-span-1 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Flagged Records ({anomalies.length})
            </h4>

            <div className="space-y-2">
              {anomalies.map((item) => {
                const isSelected = selectedAnomaly?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedAnomaly(item)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/20 border-amber-500/50 shadow-lg'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono font-semibold text-slate-200">
                        Row #{item.rowNumber}
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                        Z-Score: {item.zScore}
                      </span>
                    </div>

                    <div className="text-xs font-medium text-slate-300">
                      Column: <span className="font-mono text-cyan-300">{item.columnName}</span>
                    </div>

                    <div className="mt-2 flex items-baseline justify-between text-xs font-mono">
                      <span className="text-amber-300 font-bold text-sm">
                        {formatNumber(Number(item.value))}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Range: {formatNumber(item.expectedMin)} - {formatNumber(item.expectedMax)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Anomaly Detail Card */}
          <div className="lg:col-span-2">
            {selectedAnomaly && (
              <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-6 shadow-2xl">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-mono font-bold text-amber-400 tracking-wider">
                      Potential Anomaly Detected
                    </span>
                    <button
                      onClick={() => onAskAboutAnomaly(selectedAnomaly)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all"
                    >
                      <span>Analyze with AI</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-white mt-1">
                    Record #{selectedAnomaly.rowNumber} · {selectedAnomaly.columnName}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {selectedAnomaly.reason}
                  </p>
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Recorded Value</span>
                    <div className="text-lg font-extrabold font-mono text-amber-300 mt-1">
                      {formatNumber(Number(selectedAnomaly.value))}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Normal Range</span>
                    <div className="text-xs font-bold font-mono text-slate-200 mt-1">
                      {formatNumber(selectedAnomaly.expectedMin)} – {formatNumber(selectedAnomaly.expectedMax)}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Deviation</span>
                    <div className="text-lg font-extrabold font-mono text-cyan-400 mt-1">
                      {selectedAnomaly.deviationMultiplier
                        ? `${selectedAnomaly.deviationMultiplier}x Median`
                        : `z = ${selectedAnomaly.zScore}`}
                    </div>
                  </div>
                </div>

                {/* Full Record Snapshot */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Complete Row Snapshot
                  </h4>
                  <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 overflow-x-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Object.entries(selectedAnomaly.recordSnapshot).map(([k, v]) => {
                        const isFlagged = k === selectedAnomaly.columnName;
                        return (
                          <div
                            key={k}
                            className={`p-2.5 rounded-xl border text-xs ${
                              isFlagged
                                ? 'bg-amber-500/10 border-amber-500/40'
                                : 'bg-slate-900/60 border-slate-800/80'
                            }`}
                          >
                            <div className="text-[10px] font-mono text-slate-400 truncate">{k}</div>
                            <div
                              className={`font-semibold font-mono mt-0.5 truncate ${
                                isFlagged ? 'text-amber-300 font-bold' : 'text-slate-200'
                              }`}
                            >
                              {String(v)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
