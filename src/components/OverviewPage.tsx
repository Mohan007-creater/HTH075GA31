import React, { useState } from 'react';
import { Dataset } from '../types/dataset';
import { UploadCard } from './UploadCard';
import {
  Sparkles,
  LayoutDashboard,
  ShieldCheck,
  AlertOctagon,
  ArrowRight,
  Database,
  Table as TableIcon,
  CheckCircle2,
  Layers,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface OverviewPageProps {
  dataset: Dataset | null;
  onFileUpload: (file: File) => void;
  onLoadDemo: (demoId: string) => void;
  analyzingFile: boolean;
  analysisStep: number;
  onNavigateTab: (tab: NavTab) => void;
  onAskQuestion: (q: string) => void;
  onTriggerUpload: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  dataset,
  onFileUpload,
  onLoadDemo,
  analyzingFile,
  analysisStep,
  onNavigateTab,
  onAskQuestion,
  onTriggerUpload,
}) => {
  const [activePreviewTab, setActivePreviewTab] = useState<'records' | 'schema'>('records');

  // If NO dataset loaded, show the clean large central upload area!
  if (!dataset) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-full">
        <div className="text-center mb-8 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151B28] border border-white/[0.08] text-xs text-[#9CA7BA] mb-3">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            <span>Schema-Agnostic Natural Language BI</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7FB] tracking-tight">
            AI Data Analyst
          </h1>
          <p className="text-sm text-[#9CA7BA] mt-2">
            Turn your data into answers.
          </p>
        </div>

        <UploadCard
          onFileUpload={onFileUpload}
          onLoadDemo={onLoadDemo}
          analyzingFile={analyzingFile}
          analysisStep={analysisStep}
          dataset={null}
        />
      </div>
    );
  }

  // When Dataset is Loaded
  const { records, columns, profiles, inferredSchema, quality, anomalies, suggestedQuestions } = dataset;
  const sampleRecords = records.slice(0, 6);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
      {/* 1. Header & Dataset Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Dataset Ready</span>
            </span>
            <span className="text-[#687386]">·</span>
            <span className="text-[#9CA7BA] truncate">{dataset.fileName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FB] mt-2 tracking-tight">
            AI Data Analyst
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA7BA] mt-1">
            Turn your data into answers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('ai-analyst')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white text-xs font-bold shadow-lg shadow-blue-500/25 hover:opacity-95 transition-opacity"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch AI Analyst</span>
          </button>

          <button
            onClick={onTriggerUpload}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#151B28] hover:bg-[#1E2638] text-[#F5F7FB] border border-white/[0.08] text-xs font-semibold transition-colors"
          >
            <span>Replace File</span>
          </button>
        </div>
      </div>

      {/* 2. Attractive KPI Cards (Light + Dark Hybrid: Data Quality and Anomalies on Light Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* KPI 1: Rows (Dark) */}
        <div className="p-5 rounded-2xl bg-[#151B28] border border-white/[0.08] shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-[#9CA7BA] uppercase tracking-wider">
            Total Rows
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[#F5F7FB] font-mono">
            {records.length.toLocaleString()}
          </div>
          <span className="mt-1 text-[11px] text-[#687386]">In-memory records</span>
        </div>

        {/* KPI 2: Columns (Dark) */}
        <div className="p-5 rounded-2xl bg-[#151B28] border border-white/[0.08] shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-[#9CA7BA] uppercase tracking-wider">
            Columns
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[#F5F7FB] font-mono">
            {columns.length}
          </div>
          <span className="mt-1 text-[11px] text-[#4F8CFF]">All types inferred</span>
        </div>

        {/* KPI 3: Data Quality (LIGHT CARD per user guidelines!) */}
        <div className="p-5 rounded-2xl bg-[#F7F9FC] text-slate-900 border border-slate-200 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Data Quality
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
            {quality.score}%
          </div>
          <span className="mt-1 text-[11px] text-slate-500 font-medium">
            {quality.score >= 90 ? 'Healthy schema' : 'Review recommendations'}
          </span>
        </div>

        {/* KPI 4: Missing Values (Dark) */}
        <div className="p-5 rounded-2xl bg-[#151B28] border border-white/[0.08] shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-[#9CA7BA] uppercase tracking-wider">
            Missing Values
          </span>
          <div className={`mt-2 text-2xl sm:text-3xl font-black font-mono ${
            quality.missingValuesCount > 0 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {quality.missingValuesCount}
          </div>
          <span className="mt-1 text-[11px] text-[#687386]">
            {quality.missingValuesCount === 0 ? '0% null cells' : 'Handled automatically'}
          </span>
        </div>

        {/* KPI 5: Potential Anomalies (LIGHT CARD per user guidelines!) */}
        <div className="p-5 rounded-2xl bg-[#F7F9FC] text-slate-900 border border-slate-200 shadow-md flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Anomalies
            </span>
            <AlertOctagon className="w-4 h-4 text-amber-600" />
          </div>
          <div className={`mt-2 text-2xl sm:text-3xl font-black font-mono ${
            anomalies.length > 0 ? 'text-amber-600' : 'text-emerald-600'
          }`}>
            {anomalies.length}
          </div>
          <span className="mt-1 text-[11px] text-slate-500 font-medium">
            Statistical outliers
          </span>
        </div>
      </div>

      {/* 3. Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hub Card 1: AI Analyst */}
        <div
          onClick={() => onNavigateTab('ai-analyst')}
          className="p-5 rounded-2xl bg-[#151B28] hover:bg-[#1A2234] border border-white/[0.08] hover:border-[#4F8CFF]/50 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-[#4F8CFF]/10 text-[#4F8CFF] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#F5F7FB] group-hover:text-[#4F8CFF] transition-colors">
              Ask AI Analyst
            </h3>
            <p className="text-xs text-[#9CA7BA] mt-1 leading-relaxed">
              Ask any natural language question. Get verified calculations, charts, and explainable formulas.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold text-[#4F8CFF]">
            <span>Start conversation</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Hub Card 2: Visual Dashboard */}
        <div
          onClick={() => onNavigateTab('dashboard')}
          className="p-5 rounded-2xl bg-[#151B28] hover:bg-[#1A2234] border border-white/[0.08] hover:border-[#8B5CF6]/50 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#F5F7FB] group-hover:text-[#8B5CF6] transition-colors">
              Auto BI Dashboard
            </h3>
            <p className="text-xs text-[#9CA7BA] mt-1 leading-relaxed">
              Dynamically synthesized charts, revenue trends, top category breakdowns, and key measures.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold text-[#8B5CF6]">
            <span>Open dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Hub Card 3: Data Quality & Anomalies */}
        <div
          onClick={() => onNavigateTab('quality')}
          className="p-5 rounded-2xl bg-[#151B28] hover:bg-[#1A2234] border border-white/[0.08] hover:border-emerald-500/50 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#F5F7FB] group-hover:text-emerald-400 transition-colors">
              Data Quality Audit
            </h3>
            <p className="text-xs text-[#9CA7BA] mt-1 leading-relaxed">
              Full audit of null counts, type inferences, duplicates, and statistical outliers with recommendations.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold text-emerald-400">
            <span>View audit report</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* 4. Suggested Questions / Instant Queries */}
      {suggestedQuestions && suggestedQuestions.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#151B28] border border-white/[0.08]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9CA7BA] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#4F8CFF]" />
              <span>Recommended Questions For This Dataset</span>
            </span>
            <span className="text-[11px] text-[#687386] font-mono">1-Click Analyze</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onNavigateTab('ai-analyst');
                  onAskQuestion(q);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#101522] hover:bg-[#1E2638] text-xs font-medium text-[#F5F7FB] border border-white/[0.08] hover:border-[#4F8CFF]/50 transition-all flex items-center gap-2 group text-left"
              >
                <span>{q}</span>
                <ArrowRight className="w-3 h-3 text-[#4F8CFF] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5. Dataset Data & Schema Preview */}
      <div className="p-6 rounded-2xl bg-[#151B28] border border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-[#4F8CFF]" />
            <h3 className="text-sm font-bold text-[#F5F7FB]">Dataset Schema & Records</h3>
            <span className="text-xs text-[#687386]">· {records.length.toLocaleString()} total rows</span>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#101522] rounded-xl border border-white/[0.06]">
            <button
              onClick={() => setActivePreviewTab('records')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activePreviewTab === 'records'
                  ? 'bg-[#151B28] text-white shadow-xs'
                  : 'text-[#9CA7BA] hover:text-white'
              }`}
            >
              Raw Records Sample
            </button>
            <button
              onClick={() => setActivePreviewTab('schema')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activePreviewTab === 'schema'
                  ? 'bg-[#151B28] text-white shadow-xs'
                  : 'text-[#9CA7BA] hover:text-white'
              }`}
            >
              Inferred Schema
            </button>
          </div>
        </div>

        {activePreviewTab === 'records' ? (
          <div className="overflow-x-auto border border-white/[0.06] rounded-xl bg-[#101522]">
            <table className="w-full text-left text-xs text-[#9CA7BA]">
              <thead className="bg-[#151B28] text-[11px] uppercase font-bold text-[#F5F7FB] border-b border-white/[0.06]">
                <tr>
                  <th className="px-3.5 py-2.5 font-mono text-[#687386]">#</th>
                  {columns.map((col) => (
                    <th key={col} className="px-3.5 py-2.5 font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {sampleRecords.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="px-3.5 py-2 font-mono text-[#687386]">{idx + 1}</td>
                    {columns.map((col) => (
                      <td key={col} className="px-3.5 py-2 font-mono text-[#F5F7FB] whitespace-nowrap">
                        {row[col] !== undefined && row[col] !== null ? String(row[col]) : '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto border border-white/[0.06] rounded-xl bg-[#101522]">
            <table className="w-full text-left text-xs text-[#9CA7BA]">
              <thead className="bg-[#151B28] text-[11px] uppercase font-bold text-[#F5F7FB] border-b border-white/[0.06]">
                <tr>
                  <th className="px-3.5 py-2.5">Column Name</th>
                  <th className="px-3.5 py-2.5">Data Type</th>
                  <th className="px-3.5 py-2.5">Inferred Role</th>
                  <th className="px-3.5 py-2.5">Null Count</th>
                  <th className="px-3.5 py-2.5">Unique Count</th>
                  <th className="px-3.5 py-2.5">Sample Values</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {columns.map((col) => {
                  const prof = profiles[col];
                  const inf = inferredSchema[col];
                  return (
                    <tr key={col} className="hover:bg-white/[0.02]">
                      <td className="px-3.5 py-2 font-mono font-bold text-[#F5F7FB]">{col}</td>
                      <td className="px-3.5 py-2 font-mono text-[#4F8CFF]">{prof?.dataType || 'string'}</td>
                      <td className="px-3.5 py-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-white/[0.06] text-[#F5F7FB]">
                          {inf?.role || 'dimension'}
                        </span>
                      </td>
                      <td className="px-3.5 py-2 font-mono">{prof?.nullCount || 0}</td>
                      <td className="px-3.5 py-2 font-mono">{prof?.uniqueCount || 0}</td>
                      <td className="px-3.5 py-2 font-mono text-[#687386] truncate max-w-xs">
                        {prof?.sampleValues ? prof.sampleValues.slice(0, 3).join(', ') : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
