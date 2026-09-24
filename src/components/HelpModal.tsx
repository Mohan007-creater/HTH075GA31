import React from 'react';
import { X, HelpCircle, Sparkles, Database, ShieldCheck, CheckCircle } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[#151B28] border border-white/[0.08] shadow-2xl p-6 text-[#F5F7FB] relative max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] sticky top-0 bg-[#151B28] z-10">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#4F8CFF]/10 text-[#4F8CFF]">
              <HelpCircle className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-[#F5F7FB]">AI Data Analyst Guide</h3>
              <p className="text-xs text-[#9CA7BA]">How to interact and ask questions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9CA7BA] hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#101522] border border-white/[0.08] space-y-2">
            <h4 className="font-bold text-[#4F8CFF] flex items-center gap-1.5 text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Natural Language Queries</span>
            </h4>
            <p className="text-[#9CA7BA] leading-relaxed">
              Ask questions directly as you would speak to a human analyst. The engine dynamically maps your intent to mathematical operations against actual dataset columns:
            </p>
            <ul className="space-y-1.5 text-[#F5F7FB] pl-1 font-mono text-[11px]">
              <li>• "Which product generated the highest revenue?"</li>
              <li>• "Show monthly sales trend"</li>
              <li>• "What is the average order value by region?"</li>
              <li>• "Top 5 customers by units purchased"</li>
              <li>• "Are there any outliers in billed amount?"</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-[#101522] border border-white/[0.08] space-y-2">
            <h4 className="font-bold text-[#8B5CF6] flex items-center gap-1.5 text-xs">
              <Database className="w-3.5 h-3.5" />
              <span>Supported File Types</span>
            </h4>
            <p className="text-[#9CA7BA] leading-relaxed">
              Upload any tabular CSV (<span className="text-white font-mono">.csv</span>) or Excel (<span className="text-white font-mono">.xlsx</span>, <span className="text-white font-mono">.xls</span>) file. Headers are auto-detected, data types are inferred, and currency or numeric symbols are parsed safely.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#101522] border border-white/[0.08] space-y-2">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Hallucination & Explainability</span>
            </h4>
            <p className="text-[#9CA7BA] leading-relaxed">
              Calculations are computed strictly over in-memory dataset records. Every result comes with step-by-step mathematical reasoning and technical SQL-equivalent operations.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.08] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white text-xs font-bold hover:opacity-95"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
