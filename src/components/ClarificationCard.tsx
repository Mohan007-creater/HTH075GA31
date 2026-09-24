import React from 'react';
import { HelpCircle, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

interface AmbiguityProps {
  question: string;
  options: string[];
  reason: string;
  onSelectOption: (option: string) => void;
}

export const AmbiguityCard: React.FC<AmbiguityProps> = ({
  question,
  options,
  reason,
  onSelectOption,
}) => {
  return (
    <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-5 shadow-xl text-left space-y-3">
      <div className="flex items-center gap-2.5 text-amber-400">
        <HelpCircle className="w-5 h-5 shrink-0" />
        <h4 className="text-sm font-bold tracking-wide">Clarification Needed: Ambiguous Question</h4>
      </div>

      <p className="text-xs text-amber-200/90 leading-relaxed">
        {reason || "I found multiple columns in your dataset that could answer this question. Please select which measure you intended:"}
      </p>

      <div className="flex flex-wrap gap-2 pt-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelectOption(opt)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 hover:text-white border border-amber-500/40 text-xs font-semibold font-mono transition-all shadow-sm"
          >
            <span>[{opt}]</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ))}
      </div>
    </div>
  );
};

interface UnanswerableProps {
  reason: string;
  suggestedAlternatives: string[];
  onSelectAlternative: (question: string) => void;
}

export const UnanswerableCard: React.FC<UnanswerableProps> = ({
  reason,
  suggestedAlternatives,
  onSelectAlternative,
}) => {
  return (
    <div className="rounded-2xl bg-slate-900/90 border border-rose-500/30 p-5 shadow-xl text-left space-y-3">
      <div className="flex items-center gap-2.5 text-rose-400">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <h4 className="text-sm font-bold tracking-wide">Information Not in Dataset</h4>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        {reason || "I can't answer this question from the uploaded dataset because the required dimensions or metrics were not detected."}
      </p>

      {suggestedAlternatives && suggestedAlternatives.length > 0 && (
        <div className="pt-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Here are questions you CAN ask:</span>
          </span>

          <div className="flex flex-wrap gap-2">
            {suggestedAlternatives.map((alt, idx) => (
              <button
                key={idx}
                onClick={() => onSelectAlternative(alt)}
                className="text-left px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-500/10 text-xs text-slate-300 hover:text-cyan-300 border border-slate-700/80 hover:border-cyan-500/40 transition-all flex items-center gap-1.5"
              >
                <span>{alt}</span>
                <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
