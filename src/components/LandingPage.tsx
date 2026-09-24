import React, { useRef, useState } from 'react';
import {
  Upload,
  Sparkles,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Layers,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { DEMO_DATASETS, DemoDatasetDefinition } from '../data/demoDatasets';

interface LandingPageProps {
  onLoadDemo: (demoId: string) => void;
  onFileUpload: (file: File) => void;
  analyzingFile: boolean;
  analysisStep: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLoadDemo,
  onFileUpload,
  analyzingFile,
  analysisStep,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const analysisSteps = [
    'Reading file & parsing tabular records',
    'Detecting dynamic column names & data types',
    'AI semantic schema inference & role mapping',
    'Auditing data quality & scanning anomalies',
    'Synthesizing dynamic business questions',
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#080B11]">
      {/* Background glowing gradients & grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))]" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Navigation */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-white tracking-tight">
              DataMind AI
            </span>
            <span className="ml-2 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Autonomous BI
            </span>
          </div>
        </div>

        <button
          onClick={() => onLoadDemo(DEMO_DATASETS[0].id)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Demo Mode</span>
        </button>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-10 pb-16 text-center flex-1 flex flex-col items-center justify-center">
        {/* Floating cards animation banner */}
        <div className="hidden lg:block relative w-full h-16 mb-4">
          <div className="absolute left-6 -top-2 animate-float-slow px-3.5 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/30 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-mono">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-white">Billed Amount ↑ 18.4%</span>
          </div>
          <div
            className="absolute left-1/3 -top-6 animate-float-slow px-3.5 py-2 rounded-xl bg-slate-900/90 border border-violet-500/30 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-mono"
            style={{ animationDelay: '1.5s' }}
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-white">5,240 Verified Records</span>
          </div>
          <div
            className="absolute right-1/4 -top-3 animate-float-slow px-3.5 py-2 rounded-xl bg-slate-900/90 border border-amber-500/30 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-mono"
            style={{ animationDelay: '3s' }}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-white">Potential Outliers: 3</span>
          </div>
          <div
            className="absolute right-8 -top-8 animate-float-slow px-3.5 py-2 rounded-xl bg-slate-900/90 border border-emerald-500/30 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-mono"
            style={{ animationDelay: '2s' }}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-white">Quality Score: 96/100</span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 mb-6 backdrop-blur-md">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Zero-Hardcoding · Schema-Agnostic · Real Data Calculations</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl leading-[1.15]">
          Talk to <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">Your Data.</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Upload any CSV or Excel file. Ask questions in plain English. Get verified mathematical answers, interactive charts, and explainable insights.
        </p>

        {/* Drag & Drop Upload Zone */}
        <div className="w-full max-w-2xl mt-10">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`relative p-8 sm:p-10 rounded-3xl border-2 border-dashed transition-all cursor-pointer group bg-slate-950/40 backdrop-blur-xl ${
              isDragOver
                ? 'border-cyan-400 bg-cyan-950/20 shadow-2xl shadow-cyan-500/20 scale-[1.01]'
                : 'border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/40 shadow-xl'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onFileUpload(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all shadow-lg">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">
                Drop your CSV or Excel file here
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                or <span className="text-cyan-400 font-semibold underline underline-offset-4">browse files</span> from your computer
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-slate-500">
                <span>Supports: .csv</span>
                <span>·</span>
                <span>.xlsx</span>
                <span>·</span>
                <span>.xls</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Datasets Grid */}
        <div className="w-full max-w-4xl mt-12">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Or explore preloaded demo datasets</span>
            </div>
            <span className="text-xs text-cyan-400 font-mono">1-Click Instant Demo</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {DEMO_DATASETS.map((demo) => (
              <div
                key={demo.id}
                onClick={() => onLoadDemo(demo.id)}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
                      {demo.tag}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{demo.records.length} rows</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {demo.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {demo.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 font-medium">
                  <span>Load Dataset</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Analysis Progress Modal during file upload */}
      {analyzingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <div className="w-full max-w-md rounded-3xl bg-slate-950 border border-cyan-500/40 p-8 shadow-2xl text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-sky-400 to-violet-600 animate-pulse" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center ring-1 ring-cyan-500/40 animate-spin">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Analyzing Dataset</h3>
                <p className="text-xs text-slate-400">Performing dynamic schema inference...</p>
              </div>
            </div>

            <div className="space-y-3">
              {analysisSteps.map((step, idx) => {
                const isDone = idx < analysisStep;
                const isCurrent = idx === analysisStep;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 text-xs p-2.5 rounded-xl transition-all ${
                      isDone
                        ? 'text-emerald-400 bg-emerald-950/20 border border-emerald-900/30'
                        : isCurrent
                        ? 'text-cyan-300 bg-cyan-950/30 border border-cyan-500/30 font-semibold'
                        : 'text-slate-500'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                    )}
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        DataMind AI · Schema-Agnostic Natural Language BI Platform · Powered by Gemini API
      </footer>
    </div>
  );
};
