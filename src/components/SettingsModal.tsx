import React from 'react';
import { X, Settings, Sliders, DollarSign, ShieldAlert, Trash2 } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  currencyUnit: string;
  onChangeCurrency: (unit: string) => void;
  onClearDataset: () => void;
  hasDataset: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  currencyUnit,
  onChangeCurrency,
  onClearDataset,
  hasDataset,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-[#151B28] border border-white/[0.08] shadow-2xl p-6 text-[#F5F7FB] relative">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#4F8CFF]/10 text-[#4F8CFF]">
              <Settings className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-[#F5F7FB]">Application Settings</h3>
              <p className="text-xs text-[#9CA7BA]">Configure analytical preferences and session</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9CA7BA] hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-5 space-y-5">
          {/* Currency / Unit Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#9CA7BA] mb-2 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#4F8CFF]" />
              <span>Default Financial Currency Symbol</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['$', '₹', '€', '£'].map((sym) => (
                <button
                  key={sym}
                  onClick={() => onChangeCurrency(sym)}
                  className={`py-2 text-sm font-bold rounded-xl border transition-all ${
                    currencyUnit === sym
                      ? 'bg-[#4F8CFF]/20 text-[#4F8CFF] border-[#4F8CFF]/50 shadow-sm'
                      : 'bg-[#101522] text-[#9CA7BA] border-white/[0.08] hover:border-white/[0.2]'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {/* Anomaly Mode */}
          <div>
            <label className="block text-xs font-semibold text-[#9CA7BA] mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Outlier Detection Sensitivity</span>
            </label>
            <div className="p-3 rounded-xl bg-[#101522] border border-white/[0.08] text-xs text-[#9CA7BA]">
              Standard IQR (1.5x) and Z-score threshold (|z| &gt; 2.8) enabled. Ensures robust identification of statistical deviations without false alarms.
            </div>
          </div>

          {/* Data Reset */}
          {hasDataset && (
            <div className="pt-2 border-t border-white/[0.08]">
              <label className="block text-xs font-semibold text-rose-400 mb-2">
                Active Session
              </label>
              <button
                onClick={() => {
                  onClearDataset();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset & Clear Current Dataset</span>
              </button>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-white/[0.08] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white text-xs font-bold hover:opacity-95 shadow-md shadow-blue-500/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
