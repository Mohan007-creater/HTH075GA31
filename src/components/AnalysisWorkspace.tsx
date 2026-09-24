import React, { useState } from 'react';
import {
  Dataset,
  AnalysisResult,
  ChatMessage,
  AnalysisPlan,
} from '../types/dataset';
import { AnalysisCard } from './AnalysisCard';
import { AmbiguityCard, UnanswerableCard } from './ClarificationCard';
import {
  Sparkles,
  Send,
  Upload,
  LayoutDashboard,
  FileText,
  CheckCircle2,
  Cpu,
  HelpCircle,
  Clock,
  Layers,
} from 'lucide-react';

interface AnalysisWorkspaceProps {
  dataset: Dataset;
  analysisResults: AnalysisResult[];
  onAskQuestion: (q: string) => void;
  isThinking: boolean;
  onOpenUpload: () => void;
  onOpenDashboard: () => void;
  onOpenReport: () => void;
  currentAmbiguity?: {
    question: string;
    options: string[];
    reason: string;
  } | null;
  currentUnanswerable?: {
    reason: string;
    suggestedAlternatives: string[];
  } | null;
  onResolveAmbiguity: (chosenOption: string) => void;
}

export const AnalysisWorkspace: React.FC<AnalysisWorkspaceProps> = ({
  dataset,
  analysisResults,
  onAskQuestion,
  isThinking,
  onOpenUpload,
  onOpenDashboard,
  onOpenReport,
  currentAmbiguity,
  currentUnanswerable,
  onResolveAmbiguity,
}) => {
  const [queryInput, setQueryInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim() || isThinking) return;
    onAskQuestion(queryInput.trim());
    setQueryInput('');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-6">
      {/* 1. Top Workspace Greeting & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
            <span>Good day 👋</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">Autonomous Business Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
            Ask questions about your data.
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenDashboard}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 transition-all shadow-sm"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Generate Dashboard</span>
          </button>

          <button
            onClick={onOpenReport}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Report</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-violet-600 hover:opacity-95 transition-opacity shadow-lg shadow-cyan-500/20"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>+ Upload Dataset</span>
          </button>
        </div>
      </div>

      {/* Dataset Status Banner */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
        <div className="flex items-center gap-2.5 truncate">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Dataset Ready</span>
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-300 font-mono truncate">{dataset.fileName}</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">{dataset.records.length} records</span>
        </div>

        <span className="text-[11px] font-mono text-cyan-400 px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 shrink-0">
          Schema Inferred
        </span>
      </div>

      {/* 2. Main AI Query Box */}
      <div className="rounded-3xl bg-slate-900/90 border border-cyan-500/30 p-2 shadow-2xl backdrop-blur-xl relative">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="pl-4 pr-1 text-cyan-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Ask anything about your dataset in natural language (e.g. 'Show top 5 items', 'What is total revenue?')..."
            className="w-full bg-transparent py-3 px-2 text-sm text-white placeholder-slate-500 focus:outline-none"
            disabled={isThinking}
          />

          <button
            type="submit"
            disabled={!queryInput.trim() || isThinking}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <span>Ask AI</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Suggested Questions Chips */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 px-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Dynamic Suggested Questions</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {dataset.suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => onAskQuestion(q)}
              className="text-xs px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all font-medium text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* AI Thinking Animation */}
      {isThinking && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/40 shadow-xl flex items-center gap-4 text-xs text-cyan-300">
          <div className="w-6 h-6 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shrink-0" />
          <div>
            <div className="font-bold text-white text-sm">Analyzing dataset...</div>
            <p className="text-slate-400 text-xs mt-0.5">
              Converting natural language question → Structured operations → Executing mathematical aggregation on real records...
            </p>
          </div>
        </div>
      )}

      {/* Ambiguity Card (if triggered) */}
      {currentAmbiguity && (
        <AmbiguityCard
          question={currentAmbiguity.question}
          options={currentAmbiguity.options}
          reason={currentAmbiguity.reason}
          onSelectOption={onResolveAmbiguity}
        />
      )}

      {/* Unanswerable Question Card (if triggered) */}
      {currentUnanswerable && (
        <UnanswerableCard
          reason={currentUnanswerable.reason}
          suggestedAlternatives={currentUnanswerable.suggestedAlternatives}
          onSelectAlternative={onAskQuestion}
        />
      )}

      {/* 3. Conversation & Analysis Results List */}
      <div className="space-y-6 pt-2">
        {analysisResults.length === 0 && !currentAmbiguity && !currentUnanswerable ? (
          <div className="p-12 text-center rounded-3xl bg-slate-950/40 border border-slate-800/80 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Ask your first question above</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Click any of the suggested chips above or ask custom questions in plain English. Every calculation is verified against the real uploaded records.
            </p>
          </div>
        ) : (
          analysisResults.map((result) => (
            <AnalysisCard
              key={result.id}
              result={result}
              onAskFollowUp={onAskQuestion}
            />
          ))
        )}
      </div>
    </div>
  );
};
