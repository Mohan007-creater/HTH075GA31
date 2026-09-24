import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, Sparkles, CheckCircle2, ArrowRight, RefreshCw, Layers } from 'lucide-react';
import { DEMO_DATASETS } from '../data/demoDatasets';
import { Dataset } from '../types/dataset';

interface UploadCardProps {
  onFileUpload: (file: File) => void;
  onLoadDemo: (demoId: string) => void;
  analyzingFile: boolean;
  analysisStep: number;
  dataset?: Dataset | null;
  onAnalyzeDataset?: () => void;
  onReplaceFile?: () => void;
  compact?: boolean;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  onFileUpload,
  onLoadDemo,
  analyzingFile,
  analysisStep,
  dataset,
  onAnalyzeDataset,
  onReplaceFile,
  compact = false,
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
    'Reading file',
    'Detecting columns',
    'Inferring schema',
    'Checking data quality',
    'Preparing AI Analyst',
  ];

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onFileUpload(e.target.files[0]);
          }
        }}
      />

      {/* Subtle Blue/Purple Radial Glow behind the card */}
      <div className="absolute -inset-4 bg-gradient-to-r from-[#4F8CFF]/20 via-[#8B5CF6]/20 to-[#4F8CFF]/15 rounded-3xl blur-2xl pointer-events-none opacity-70" />

      {/* Upload Processing Animation Modal */}
      {analyzingFile ? (
        <div className="relative z-10 w-full max-w-[650px] min-h-[320px] rounded-3xl bg-[#F7F9FC] text-slate-900 p-8 shadow-2xl border border-slate-200 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#4F8CFF] animate-ping" />
              <span>Analyzing Dataset</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Understanding your dataset...
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Autonomous semantic profiling, data quality auditing, and schema inference.
            </p>
          </div>

          {/* Stepper list */}
          <div className="my-6 space-y-2.5">
            {analysisSteps.map((step, idx) => {
              const isDone = idx < analysisStep;
              const isCurrent = idx === analysisStep;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 text-xs px-3.5 py-2 rounded-xl transition-all ${
                    isDone
                      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 font-semibold'
                      : isCurrent
                      ? 'text-blue-800 bg-blue-50 border border-blue-200 font-bold shadow-sm'
                      : 'text-slate-400 bg-white/60 border border-slate-100'
                  }`}
                >
                  {isDone ? (
                    <span className="text-emerald-600 font-bold text-sm">✓</span>
                  ) : isCurrent ? (
                    <span className="text-blue-600 font-bold text-sm animate-pulse">●</span>
                  ) : (
                    <span className="text-slate-300 font-normal text-sm">○</span>
                  )}
                  <span>{step}</span>
                  {isCurrent && (
                    <span className="ml-auto text-[10px] font-mono text-blue-600 animate-pulse">
                      Processing...
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] h-full transition-all duration-300"
              style={{ width: `${Math.min(100, ((analysisStep + 1) / analysisSteps.length) * 100)}%` }}
            />
          </div>
        </div>
      ) : dataset ? (
        /* Card State when Dataset is Loaded */
        <div className="relative z-10 w-full max-w-[650px] min-h-[300px] rounded-3xl bg-[#F7F9FC] text-slate-900 p-8 shadow-2xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#4F8CFF]">
                AI DATA ANALYST
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dataset ready</span>
              </span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-2 truncate" title={dataset.fileName}>
              {dataset.fileName}
            </h3>

            <div className="mt-4 grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-[10px] uppercase font-bold text-slate-500">Rows</div>
                <div className="text-base font-extrabold text-slate-900 font-mono">
                  {dataset.records.length.toLocaleString()}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-[10px] uppercase font-bold text-slate-500">Columns</div>
                <div className="text-base font-extrabold text-slate-900 font-mono">
                  {dataset.columns.length}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-[10px] uppercase font-bold text-slate-500">Quality</div>
                <div className="text-base font-extrabold text-emerald-600 font-mono">
                  {dataset.quality.score}%
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-[10px] uppercase font-bold text-slate-500">Anomalies</div>
                <div className="text-base font-extrabold text-amber-600 font-mono">
                  {dataset.anomalies.length}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                if (onReplaceFile) onReplaceFile();
                else fileInputRef.current?.click();
              }}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Replace File</span>
            </button>

            <button
              onClick={onAnalyzeDataset}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white hover:opacity-95 text-xs font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
            >
              <span>Analyze Dataset</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Empty State: Centered Large Light Card */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative z-10 w-full max-w-[660px] min-h-[340px] rounded-3xl bg-[#F7F9FC] text-slate-900 p-8 sm:p-9 shadow-2xl border-2 transition-all flex flex-col justify-between ${
            isDragOver
              ? 'border-[#4F8CFF] bg-[#EEF2F7] scale-[1.01] shadow-[0_0_30px_rgba(79,140,255,0.35)]'
              : 'border-slate-200/90 hover:border-slate-300'
          }`}
        >
          {/* Card Header */}
          <div className="text-center">
            <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-[#4F8CFF]">
              AI DATA ANALYST
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Talk to your data.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              Upload a CSV or Excel file and start asking questions instantly.
            </p>
          </div>

          {/* Central Drop Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="my-4 py-6 px-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#4F8CFF] bg-white transition-all cursor-pointer group flex flex-col items-center justify-center text-center shadow-xs"
          >
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-50 to-purple-50 border border-blue-200 flex items-center justify-center text-[#4F8CFF] transition-transform duration-200 ${
                isDragOver ? 'scale-110' : 'group-hover:scale-105'
              }`}
            >
              <Upload className="w-7 h-7" />
            </div>

            <h4 className="mt-3 text-sm font-bold text-slate-800">
              {isDragOver ? 'Release to analyze your dataset' : 'Drop your file here'}
            </h4>
            <p className="mt-0.5 text-xs text-slate-500 font-mono">CSV • XLSX • XLS</p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="mt-3.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:opacity-95 transition-opacity"
            >
              Browse Files
            </button>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600 pt-2 border-t border-slate-200/80">
            <span className="flex items-center gap-1 text-slate-700">
              <span className="text-[#4F8CFF] font-bold">✓</span> Schema-Agnostic
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1 text-slate-700">
              <span className="text-[#4F8CFF] font-bold">✓</span> Smart Visualization
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1 text-slate-700">
              <span className="text-[#4F8CFF] font-bold">✓</span> Explainable AI
            </span>
          </div>
        </div>
      )}

      {/* Demo Datasets Launcher Bar below the card */}
      {!analyzingFile && (
        <div className="w-full max-w-[660px] mt-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2 text-xs font-semibold text-[#9CA7BA]">
            <Layers className="w-3.5 h-3.5 text-[#4F8CFF]" />
            <span>Or explore with preloaded demo datasets:</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {DEMO_DATASETS.map((demo) => (
              <button
                key={demo.id}
                onClick={() => onLoadDemo(demo.id)}
                className="px-3.5 py-1.5 rounded-xl bg-[#151B28] hover:bg-[#1E2638] border border-white/[0.08] hover:border-[#4F8CFF]/50 text-xs font-medium text-[#F5F7FB] transition-all flex items-center gap-1.5 shadow-sm"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#4F8CFF]" />
                <span>{demo.name}</span>
                <span className="text-[10px] font-mono text-[#687386]">
                  ({demo.records.length})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
