import React, { useMemo } from 'react';
import { Dataset } from '../types/dataset';
import { InteractiveChart } from './InteractiveChart';
import {
  TrendingUp,
  LayoutDashboard,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Download,
  Calendar,
  DollarSign,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { formatNumber, parseNumericValue, parseDateCandidate } from '../utils/dataEngine';

interface DashboardPageProps {
  dataset: Dataset;
  onAskQuestion: (q: string) => void;
  onOpenReport: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  dataset,
  onAskQuestion,
  onOpenReport,
}) => {
  const { records, columns, profiles, inferredSchema } = dataset;

  // Identify measures, dimensions, temporal and geography dynamically
  const measures = Object.values(inferredSchema).filter((c) => c.role === 'measure');
  const dimensions = Object.values(inferredSchema).filter((c) => c.role === 'dimension');
  const temporals = Object.values(inferredSchema).filter((c) => c.role === 'temporal');
  const geographics = Object.values(inferredSchema).filter((c) => c.role === 'geography');

  const primaryMeasure =
    measures[0]?.columnName ||
    columns.find((c) => profiles[c]?.dataType === 'number') ||
    columns[0];
  const secondaryMeasure = measures[1]?.columnName;

  const primaryDimension =
    dimensions[0]?.columnName ||
    columns.find((c) => profiles[c]?.dataType === 'string') ||
    columns[0];
  const geoDimension = geographics[0]?.columnName;
  const temporalCol = temporals[0]?.columnName;

  const unit = inferredSchema[primaryMeasure]?.unit || '$';

  // Compute Primary KPI stats
  const primaryStats = useMemo(() => {
    const vals = records
      .map((r) => parseNumericValue(r[primaryMeasure]))
      .filter((v): v is number => v !== null);

    const sum = vals.reduce((a, b) => a + b, 0);
    const avg = vals.length > 0 ? sum / vals.length : 0;
    const max = vals.length > 0 ? Math.max(...vals) : 0;

    return { sum, avg, max, count: records.length };
  }, [records, primaryMeasure]);

  // Compute Top Category / Product breakdown
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

  const topCategoryItem = categoryChartData[0]?.label || 'N/A';

  // Compute Regional / Segment breakdown
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
        key = String(r[temporalCol] || 'Other').slice(0, 7);
      }
      const val = parseNumericValue(r[primaryMeasure]) || 0;
      map[key] = (map[key] || 0) + val;
    }

    return Object.entries(map)
      .map(([label, value]) => ({ label, value: Number(value.toFixed(2)) }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [records, temporalCol, primaryMeasure]);

  // Compute Secondary Measure breakdown if available
  const secondaryChartData = useMemo(() => {
    if (!secondaryMeasure || !primaryDimension) return [];
    const map: Record<string, number> = {};
    for (const r of records) {
      const key = String(r[primaryDimension] || 'Other');
      const val = parseNumericValue(r[secondaryMeasure]) || 0;
      map[key] = (map[key] || 0) + val;
    }

    return Object.entries(map)
      .map(([label, value]) => ({ label, value: Number(value.toFixed(2)) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [records, secondaryMeasure, primaryDimension]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
      {/* 1. Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4F8CFF] uppercase tracking-wider">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Executive Business Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FB] mt-1 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA7BA] mt-1">
            Dynamic business metrics & visualizations synthesized for {dataset.fileName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onAskQuestion(`What are the key drivers for ${primaryMeasure}?`)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#151B28] hover:bg-[#1E2638] text-xs font-semibold text-[#F5F7FB] border border-white/[0.08] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#4F8CFF]" />
            <span>Explain Key Drivers</span>
          </button>

          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white text-xs font-bold hover:opacity-95 shadow-md shadow-blue-500/25 transition-opacity"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards (Hybrid: Total Revenue and Average Value on LIGHT CARDS per spec) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Primary Measure / Total Revenue (LIGHT CARD!) */}
        <div className="p-5 rounded-2xl bg-[#F7F9FC] text-slate-900 border border-slate-200 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Total {primaryMeasure}
            </span>
            <span className="p-1.5 rounded-lg bg-blue-100 text-[#4F8CFF]">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-950 font-mono tracking-tight">
            {formatNumber(primaryStats.sum, unit)}
          </div>
          <span className="mt-1 text-[11px] text-slate-500 font-medium">
            Aggregated sum across {records.length} records
          </span>
        </div>

        {/* KPI 2: Total Orders / Records (Dark) */}
        <div className="p-5 rounded-2xl bg-[#151B28] border border-white/[0.08] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9CA7BA] uppercase tracking-wider">
              Total Orders / Rows
            </span>
            <Layers className="w-3.5 h-3.5 text-[#687386]" />
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-[#F5F7FB] font-mono tracking-tight">
            {primaryStats.count.toLocaleString()}
          </div>
          <span className="mt-1 text-[11px] text-[#687386]">
            Verified data points
          </span>
        </div>

        {/* KPI 3: Average Order Value (LIGHT CARD!) */}
        <div className="p-5 rounded-2xl bg-[#F7F9FC] text-slate-900 border border-slate-200 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Avg {primaryMeasure}
            </span>
            <span className="p-1.5 rounded-lg bg-purple-100 text-[#8B5CF6]">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-950 font-mono tracking-tight">
            {formatNumber(primaryStats.avg, unit)}
          </div>
          <span className="mt-1 text-[11px] text-slate-500 font-medium">
            Per-record average
          </span>
        </div>

        {/* KPI 4: Top Product / Top Category (Dark) */}
        <div className="p-5 rounded-2xl bg-[#151B28] border border-white/[0.08] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9CA7BA] uppercase tracking-wider truncate">
              Top {primaryDimension}
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              #1 Lead
            </span>
          </div>
          <div className="mt-3 text-xl sm:text-2xl font-black text-[#F5F7FB] truncate">
            {topCategoryItem}
          </div>
          <span className="mt-1 text-[11px] text-[#687386]">
            Highest performing entity
          </span>
        </div>
      </div>

      {/* 3. Grid of Responsive Dynamic Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue Trend / Timeline */}
        {trendChartData.length > 0 ? (
          <div className="p-6 rounded-3xl bg-[#151B28] border border-white/[0.08] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#F5F7FB]">
                  {primaryMeasure} Trend Over Time
                </h3>
                <p className="text-xs text-[#9CA7BA]">
                  Temporal progression via `{temporalCol}`
                </p>
              </div>
              <button
                onClick={() => onAskQuestion(`What is the month over month growth for ${primaryMeasure}?`)}
                className="text-[11px] text-[#4F8CFF] hover:underline font-semibold"
              >
                Analyze Trend →
              </button>
            </div>
            <InteractiveChart
              data={trendChartData}
              initialType="line"
              unit={unit}
              title={`${primaryMeasure} Trend`}
              allowTypeSwitch={true}
            />
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-[#151B28] border border-white/[0.08] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#F5F7FB]">
                  Top {primaryDimension} by {primaryMeasure}
                </h3>
                <p className="text-xs text-[#9CA7BA]">Ranking breakdown</p>
              </div>
              <button
                onClick={() => onAskQuestion(`Compare top 5 ${primaryDimension} by ${primaryMeasure}`)}
                className="text-[11px] text-[#4F8CFF] hover:underline font-semibold"
              >
                Ask AI →
              </button>
            </div>
            <InteractiveChart
              data={categoryChartData}
              initialType="horizontal_bar"
              unit={unit}
              title={primaryDimension}
              allowTypeSwitch={true}
            />
          </div>
        )}

        {/* Chart 2: Top Products / Categories */}
        <div className="p-6 rounded-3xl bg-[#151B28] border border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#F5F7FB]">
                {primaryDimension} Performance
              </h3>
              <p className="text-xs text-[#9CA7BA]">
                Volume & contribution breakdown
              </p>
            </div>
            <button
              onClick={() => onAskQuestion(`Which ${primaryDimension} has the highest ${primaryMeasure}?`)}
              className="text-[11px] text-[#4F8CFF] hover:underline font-semibold"
            >
              Ask AI →
            </button>
          </div>
          <InteractiveChart
            data={categoryChartData}
            initialType="bar"
            unit={unit}
            title={primaryDimension}
            allowTypeSwitch={true}
          />
        </div>

        {/* Chart 3: Regional / Segment Distribution */}
        {geoChartData.length > 0 && (
          <div className="p-6 rounded-3xl bg-[#151B28] border border-white/[0.08] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#F5F7FB]">
                  {geoDimension || dimensions[1]?.columnName || 'Segment'} Distribution
                </h3>
                <p className="text-xs text-[#9CA7BA]">Part-to-whole market share</p>
              </div>
              <button
                onClick={() => onAskQuestion(`Show distribution of ${primaryMeasure} across ${geoDimension || dimensions[1]?.columnName}`)}
                className="text-[11px] text-[#4F8CFF] hover:underline font-semibold"
              >
                Ask AI →
              </button>
            </div>
            <InteractiveChart
              data={geoChartData}
              initialType="donut"
              unit={unit}
              title={geoDimension || 'Distribution'}
              allowTypeSwitch={true}
            />
          </div>
        )}

        {/* Chart 4: Secondary Measure or Ranking */}
        {secondaryChartData.length > 0 ? (
          <div className="p-6 rounded-3xl bg-[#151B28] border border-white/[0.08] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#F5F7FB]">
                  {secondaryMeasure} by {primaryDimension}
                </h3>
                <p className="text-xs text-[#9CA7BA]">Secondary metric cross-comparison</p>
              </div>
              <button
                onClick={() => onAskQuestion(`What is the relationship between ${primaryMeasure} and ${secondaryMeasure}?`)}
                className="text-[11px] text-[#4F8CFF] hover:underline font-semibold"
              >
                Analyze Correlation →
              </button>
            </div>
            <InteractiveChart
              data={secondaryChartData}
              initialType="horizontal_bar"
              title={secondaryMeasure}
              allowTypeSwitch={true}
            />
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-[#151B28] border border-white/[0.08] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#F5F7FB]">
                  Volume Distribution
                </h3>
                <p className="text-xs text-[#9CA7BA]">Distribution across active categories</p>
              </div>
            </div>
            <InteractiveChart
              data={categoryChartData}
              initialType="donut"
              unit={unit}
              title={primaryDimension}
              allowTypeSwitch={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};
