import React, { useMemo } from 'react';
import { Dataset } from '../types/dataset';
import { InteractiveChart } from './InteractiveChart';
import {
  TrendingUp,
  Layers,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Calendar,
  Hash,
} from 'lucide-react';
import { formatNumber, parseNumericValue, parseDateCandidate } from '../utils/dataEngine';

interface AutoDashboardProps {
  dataset: Dataset;
  onAskQuestion: (q: string) => void;
  onOpenReport: () => void;
}

export const AutoDashboard: React.FC<AutoDashboardProps> = ({
  dataset,
  onAskQuestion,
  onOpenReport,
}) => {
  const { records, columns, profiles, inferredSchema, quality, anomalies } = dataset;

  // Identify key measures and dimensions
  const measures = Object.values(inferredSchema).filter((c) => c.role === 'measure');
  const dimensions = Object.values(inferredSchema).filter((c) => c.role === 'dimension');
  const temporals = Object.values(inferredSchema).filter((c) => c.role === 'temporal');
  const geographics = Object.values(inferredSchema).filter((c) => c.role === 'geography');

  const primaryMeasure = measures[0]?.columnName || columns.find((c) => profiles[c].dataType === 'number') || columns[0];
  const secondaryMeasure = measures[1]?.columnName;
  const primaryDimension = dimensions[0]?.columnName || columns.find((c) => profiles[c].dataType === 'string') || columns[0];
  const geoDimension = geographics[0]?.columnName;
  const temporalCol = temporals[0]?.columnName;

  const unit = inferredSchema[primaryMeasure]?.unit;

  // Compute primary KPI stats
  const primaryStats = useMemo(() => {
    const vals = records
      .map((r) => parseNumericValue(r[primaryMeasure]))
      .filter((v): v is number => v !== null);

    const sum = vals.reduce((a, b) => a + b, 0);
    const avg = vals.length > 0 ? sum / vals.length : 0;
    const max = vals.length > 0 ? Math.max(...vals) : 0;

    return { sum, avg, max, count: vals.length };
  }, [records, primaryMeasure]);

  // Compute Top Category breakdown
  const categoryChartData = useMemo(() => {
    if (!primaryDimension) return [];
    const map: Record<string, number> = {};
    for (const r of records) {
      const cat = String(r[primaryDimension] || 'Unknown');
      const val = parseNumericValue(r[primaryMeasure]) || 0;
      map[cat] = (map[cat] || 0) + val;
    }

    return Object.entries(map)
      .map(([label, value]) => ({ label, value: Number(value.toFixed(2)) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [records, primaryDimension, primaryMeasure]);

  // Compute Geographic/Branch breakdown if available, else secondary dimension
  const geoChartData = useMemo(() => {
    const dim = geoDimension || dimensions[1]?.columnName;
    if (!dim) return [];
    const map: Record<string, number> = {};
    for (const r of records) {
      const key = String(r[dim] || 'Other');
      const val = parseNumericValue(r[primaryMeasure]) || 0;
      map[key] = (map[key] || 0) + val;
    }

    return Object.entries(map)
      .map(([label, value]) => ({ label, value: Number(value.toFixed(2)) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [records, geoDimension, dimensions, primaryMeasure]);

  // Compute Time Trend if temporal column exists
  const trendChartData = useMemo(() => {
    if (!temporalCol) return [];
    const map: Record<string, number> = {};

    for (const r of records) {
      const d = parseDateCandidate(r[temporalCol]);
      let key = 'Other';
      if (d) {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      } else {
        key = String(r[temporalCol] || '').slice(0, 7);
      }
      const val = parseNumericValue(r[primaryMeasure]) || 0;
      map[key] = (map[key] || 0) + val;
    }

    return Object.entries(map)
      .map(([label, value]) => ({ label, value: Number(value.toFixed(2)) }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [records, temporalCol, primaryMeasure]);

  const topCategory = categoryChartData[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Dashboard Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Autonomous BI Dashboard</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {dataset.name || dataset.fileName}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic aggregation based on detected schema ({columns.length} columns · {records.length} records)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenReport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-violet-600 hover:opacity-95 transition-opacity shadow-lg shadow-cyan-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate Executive Report</span>
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Primary Measure Total */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium truncate max-w-[130px]">
              Total {primaryMeasure.replace(/_/g, ' ')}
            </span>
            <span className="p-1 rounded bg-cyan-500/10 text-cyan-400 font-mono text-[10px]">
              SUM
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
            {formatNumber(primaryStats.sum, unit)}
          </div>
          <div className="text-[11px] text-cyan-400 mt-1 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3 h-3 text-cyan-400" />
            <span>Across all {records.length} records</span>
          </div>
        </div>

        {/* KPI 2: Average Measure */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-violet-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium truncate max-w-[130px]">
              Average {primaryMeasure.replace(/_/g, ' ')}
            </span>
            <span className="p-1 rounded bg-violet-500/10 text-violet-400 font-mono text-[10px]">
              AVG
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
            {formatNumber(primaryStats.avg, unit)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Max single record: {formatNumber(primaryStats.max, unit)}
          </div>
        </div>

        {/* KPI 3: Top Category Driver */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium truncate max-w-[130px]">
              Top {primaryDimension?.replace(/_/g, ' ') || 'Entity'}
            </span>
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
              #1 RANK
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate" title={topCategory?.label}>
            {topCategory?.label || 'N/A'}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">
            {topCategory ? formatNumber(topCategory.value, unit) : '-'} (
            {primaryStats.sum > 0 && topCategory
              ? ((topCategory.value / primaryStats.sum) * 100).toFixed(1)
              : 0}
            %)
          </div>
        </div>

        {/* KPI 4: Data Quality & Anomalies */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Data Health & Risk</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
            {quality.score} / 100
          </div>
          <div className="text-[11px] text-amber-400 mt-1 flex items-center gap-1 font-mono">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>{anomalies.length} outliers detected</span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Category Breakdown */}
        {categoryChartData.length > 0 && (
          <InteractiveChart
            data={categoryChartData}
            initialType="bar"
            unit={unit}
            title={`${primaryMeasure.replace(/_/g, ' ')} by ${primaryDimension?.replace(/_/g, ' ')}`}
          />
        )}

        {/* Chart 2: Time Trend or Regional Breakdown */}
        {trendChartData.length > 0 ? (
          <InteractiveChart
            data={trendChartData}
            initialType="line"
            unit={unit}
            title={`Temporal Trend (${temporalCol?.replace(/_/g, ' ')})`}
          />
        ) : geoChartData.length > 0 ? (
          <InteractiveChart
            data={geoChartData}
            initialType="donut"
            unit={unit}
            title={`${primaryMeasure.replace(/_/g, ' ')} by ${geoDimension || dimensions[1]?.columnName}`}
          />
        ) : (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-slate-400 text-xs">
            No temporal or secondary dimension detected.
          </div>
        )}
      </div>

      {/* Suggested Follow-up Questions based on Dashboard */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Ask Questions About This Dashboard</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {dataset.suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => onAskQuestion(q)}
              className="text-xs px-3 py-2 rounded-xl bg-slate-950 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/30 transition-all font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
