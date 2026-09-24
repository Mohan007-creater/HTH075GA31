import React, { useState, useMemo } from 'react';
import { AnomalyItem, Dataset } from '../types/dataset';
import {
  AlertTriangle,
  ShieldCheck,
  Search,
  ArrowUpDown,
  Sparkles,
  Filter,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { formatNumber } from '../utils/dataEngine';

interface AnomaliesPageProps {
  dataset: Dataset;
  onAskAboutAnomaly: (anomaly: AnomalyItem) => void;
}

export const AnomaliesPage: React.FC<AnomaliesPageProps> = ({
  dataset,
  onAskAboutAnomaly,
}) => {
  const { anomalies } = dataset;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColumnFilter, setSelectedColumnFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'row' | 'deviation' | 'column'>('deviation');

  const uniqueAnomalyColumns = useMemo(() => {
    return Array.from(new Set(anomalies.map((a) => a.columnName)));
  }, [anomalies]);

  const filteredAndSortedAnomalies = useMemo(() => {
    let result = [...anomalies];

    // Filter by column
    if (selectedColumnFilter !== 'all') {
      result = result.filter((a) => a.columnName === selectedColumnFilter);
    }

    // Filter by search query (value, row, reason)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.columnName.toLowerCase().includes(q) ||
          String(a.value).toLowerCase().includes(q) ||
          String(a.rowNumber).includes(q) ||
          a.reason.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'deviation') {
        return (b.zScore || b.deviationMultiplier || 0) - (a.zScore || a.deviationMultiplier || 0);
      }
      if (sortBy === 'row') {
        return a.rowNumber - b.rowNumber;
      }
      return a.columnName.localeCompare(b.columnName);
    });

    return result;
  }, [anomalies, selectedColumnFilter, searchQuery, sortBy]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Statistical Outlier Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FB] mt-1 tracking-tight">
            Potential Anomalies Detected
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA7BA] mt-1 max-w-2xl">
            Statistical deviations flagged using Interquartile Range (IQR &gt; 1.5) and Z-score distributions. These indicate unusual data points for review rather than verified errors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
            {anomalies.length} Flagged Records
          </div>
        </div>
      </div>

      {anomalies.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-[#151B28] border border-white/[0.08] space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#F5F7FB]">No Potential Anomalies Detected</h3>
          <p className="text-xs text-[#9CA7BA] max-w-md mx-auto">
            All numerical data points fall comfortably within standard variance expectations and interquartile limits.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* 2. Filters & Sorting Toolbar */}
          <div className="p-4 rounded-2xl bg-[#151B28] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              {/* Search input */}
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 text-[#687386] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter anomaly..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#101522] border border-white/[0.08] text-xs text-[#F5F7FB] placeholder-[#687386] focus:border-[#4F8CFF] focus:outline-none"
                />
              </div>

              {/* Column dropdown filter */}
              <div className="flex items-center gap-1.5 text-xs text-[#9CA7BA]">
                <Filter className="w-3.5 h-3.5 text-[#687386]" />
                <select
                  value={selectedColumnFilter}
                  onChange={(e) => setSelectedColumnFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-[#101522] border border-white/[0.08] text-xs text-[#F5F7FB] focus:border-[#4F8CFF] focus:outline-none font-mono"
                >
                  <option value="all">All Columns ({anomalies.length})</option>
                  {uniqueAnomalyColumns.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort controls */}
            <div className="flex items-center gap-2 text-xs text-[#9CA7BA] w-full sm:w-auto justify-end">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#687386]" />
              <span className="text-[11px]">Sort:</span>
              <div className="flex items-center gap-1 p-1 bg-[#101522] rounded-xl border border-white/[0.06]">
                <button
                  onClick={() => setSortBy('deviation')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                    sortBy === 'deviation' ? 'bg-[#151B28] text-[#F5F7FB]' : 'text-[#687386]'
                  }`}
                >
                  Deviation
                </button>
                <button
                  onClick={() => setSortBy('row')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                    sortBy === 'row' ? 'bg-[#151B28] text-[#F5F7FB]' : 'text-[#687386]'
                  }`}
                >
                  Row #
                </button>
                <button
                  onClick={() => setSortBy('column')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                    sortBy === 'column' ? 'bg-[#151B28] text-[#F5F7FB]' : 'text-[#687386]'
                  }`}
                >
                  Column
                </button>
              </div>
            </div>
          </div>

          {/* 3. Anomalies Table */}
          <div className="overflow-x-auto border border-white/[0.08] rounded-3xl bg-[#151B28] shadow-sm">
            <table className="w-full text-left text-xs text-[#9CA7BA]">
              <thead className="bg-[#101522] text-[11px] uppercase font-bold text-[#F5F7FB] border-b border-white/[0.06]">
                <tr>
                  <th className="px-4 py-3.5">Row #</th>
                  <th className="px-4 py-3.5">Column</th>
                  <th className="px-4 py-3.5">Observed Value</th>
                  <th className="px-4 py-3.5">Expected Range</th>
                  <th className="px-4 py-3.5">Statistical Deviation</th>
                  <th className="px-4 py-3.5">Reason & Nature</th>
                  <th className="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredAndSortedAnomalies.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3.5 font-mono text-[#F5F7FB] font-semibold">
                      #{item.rowNumber}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[#4F8CFF] font-bold">
                      {item.columnName}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-amber-300 font-extrabold text-sm">
                      {formatNumber(Number(item.value))}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-400">
                      [{formatNumber(item.expectedMin)} – {formatNumber(item.expectedMax)}]
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {item.zScore ? `z = ${item.zScore}` : `dev = ${item.deviationMultiplier}x`}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-300 max-w-xs">
                      {item.reason}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => onAskAboutAnomaly(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white text-[11px] font-bold hover:opacity-95 shadow-xs transition-opacity"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Analyze with AI</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
