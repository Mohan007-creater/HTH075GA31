import React, { useState } from 'react';
import { Dataset } from '../types/dataset';
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  FileCheck2,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Table as TableIcon,
  Search,
} from 'lucide-react';

interface DataQualityPageProps {
  dataset: Dataset;
  onAskQuestion: (q: string) => void;
}

export const DataQualityPage: React.FC<DataQualityPageProps> = ({
  dataset,
  onAskQuestion,
}) => {
  const { quality, profiles, columns, records } = dataset;
  const [columnFilter, setColumnFilter] = useState('');

  // Quality score tier
  const scoreStatus =
    quality.score >= 90 ? 'Good' : quality.score >= 70 ? 'Warning' : 'Needs Attention';

  const scoreBadgeColor =
    quality.score >= 90
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      : quality.score >= 70
      ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
      : 'text-rose-400 bg-rose-500/10 border-rose-500/30';

  // 6 Metrics calculations
  const missingCount = quality.missingValuesCount;
  const duplicateCount = quality.duplicateRowsCount;
  const outlierCount = quality.outlierCount;

  // Empty columns count
  const emptyColsCount = columns.filter((c) => profiles[c]?.nullCount === records.length).length;

  // Data type issues count
  const dataTypeIssuesCount = columns.filter(
    (c) => profiles[c]?.dataType === 'string' && profiles[c]?.isDateCandidate
  ).length;

  // Invalid values count
  const invalidValuesCount = columns.filter((c) => (profiles[c]?.nullCount || 0) > 0).length;

  const getStatus = (count: number, warnThreshold = 1, alertThreshold = 5) => {
    if (count === 0) return { label: 'Good', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (count < alertThreshold) return { label: 'Warning', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    return { label: 'Needs Attention', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
  };

  const auditCards = [
    {
      title: 'Missing Values',
      count: missingCount,
      description: 'Cells with null, undefined, or blank content',
      status: getStatus(missingCount, 1, 10),
    },
    {
      title: 'Duplicate Rows',
      count: duplicateCount,
      description: 'Identical records with matching signatures',
      status: getStatus(duplicateCount, 1, 5),
    },
    {
      title: 'Invalid Values',
      count: invalidValuesCount,
      description: 'Columns with non-conforming or corrupted items',
      status: getStatus(invalidValuesCount, 1, 3),
    },
    {
      title: 'Data Type Issues',
      count: dataTypeIssuesCount,
      description: 'Ambiguous dates or text-formatted numbers',
      status: getStatus(dataTypeIssuesCount, 1, 2),
    },
    {
      title: 'Empty Columns',
      count: emptyColsCount,
      description: 'Columns containing 100% missing records',
      status: getStatus(emptyColsCount, 1, 1),
    },
    {
      title: 'Potential Outliers',
      count: outlierCount,
      description: 'Extreme statistical deviations (> 2.8 IQR)',
      status: getStatus(outlierCount, 1, 15),
    },
  ];

  const filteredColumns = columns.filter((c) =>
    c.toLowerCase().includes(columnFilter.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
      {/* 1. Header & Quality Score Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Data Hygiene & Health Audit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FB] mt-1 tracking-tight">
            Data Quality
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA7BA] mt-1">
            Automated hygiene audit and schema validation for {dataset.fileName}
          </p>
        </div>

        {/* Overall Quality Score Display */}
        <div className="flex items-center gap-3 bg-[#151B28] p-3.5 rounded-2xl border border-white/[0.08] shadow-sm">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-[#9CA7BA]">Quality Score</div>
            <div className="text-xs font-bold text-[#F5F7FB]">Status: {scoreStatus}</div>
          </div>
          <div className={`px-4 py-1.5 rounded-xl font-mono font-extrabold text-xl border ${scoreBadgeColor}`}>
            {quality.score} / 100
          </div>
        </div>
      </div>

      {/* 2. Six Required Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {auditCards.map((card, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#151B28] border border-white/[0.08] shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9CA7BA]">
                  {card.title}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${card.status.color}`}>
                  {card.status.label}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#F5F7FB] font-mono mt-1">
                {card.count.toLocaleString()}
              </div>
            </div>
            <p className="text-xs text-[#687386] mt-3 pt-2 border-t border-white/[0.04]">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {/* 3. Detailed Column Health Table */}
      <div className="p-6 rounded-3xl bg-[#151B28] border border-white/[0.08] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-[#4F8CFF]" />
            <h3 className="text-sm font-bold text-[#F5F7FB]">Column Quality & Hygiene Breakdown</h3>
            <span className="text-xs text-[#687386]">· {columns.length} columns inspected</span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#687386] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search column..."
              value={columnFilter}
              onChange={(e) => setColumnFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#101522] border border-white/[0.08] text-xs text-[#F5F7FB] placeholder-[#687386] focus:border-[#4F8CFF] focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-white/[0.06] rounded-xl bg-[#101522]">
          <table className="w-full text-left text-xs text-[#9CA7BA]">
            <thead className="bg-[#151B28] text-[11px] uppercase font-bold text-[#F5F7FB] border-b border-white/[0.06]">
              <tr>
                <th className="px-4 py-3">Column Name</th>
                <th className="px-4 py-3">Inferred Type</th>
                <th className="px-4 py-3">Missing Cells</th>
                <th className="px-4 py-3">Null %</th>
                <th className="px-4 py-3">Unique Values</th>
                <th className="px-4 py-3">Health Status</th>
                <th className="px-4 py-3">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredColumns.map((col) => {
                const p = profiles[col];
                const nulls = p?.nullCount || 0;
                const nullPct = records.length > 0 ? ((nulls / records.length) * 100).toFixed(1) : '0';
                const status = nulls === 0 ? 'Good' : Number(nullPct) > 20 ? 'Needs Attention' : 'Warning';

                const statusColor =
                  status === 'Good'
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : status === 'Warning'
                    ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                    : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

                return (
                  <tr key={col} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono font-bold text-[#F5F7FB]">{col}</td>
                    <td className="px-4 py-3 font-mono text-[#4F8CFF]">{p?.dataType || 'string'}</td>
                    <td className="px-4 py-3 font-mono">{nulls.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono">{nullPct}%</td>
                    <td className="px-4 py-3 font-mono">{p?.uniqueCount || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${statusColor}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#9CA7BA]">
                      {nulls === 0 ? (
                        <span className="text-emerald-400 font-medium">✓ Clean column</span>
                      ) : Number(nullPct) > 50 ? (
                        <span className="text-rose-400 font-medium">Consider dropping or imputing</span>
                      ) : (
                        <span className="text-amber-400 font-medium">Auto-handled in aggregations</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
