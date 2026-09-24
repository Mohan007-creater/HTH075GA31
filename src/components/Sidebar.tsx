import React from 'react';
import {
  Compass,
  Sparkles,
  BarChart2,
  LayoutDashboard,
  ShieldCheck,
  AlertOctagon,
  FileText,
  Settings as SettingsIcon,
  HelpCircle,
  Database,
  Layers,
  ChevronRight,
  Upload,
  User,
  CheckCircle2,
} from 'lucide-react';
import { Dataset } from '../types/dataset';
import { DEMO_DATASETS } from '../data/demoDatasets';

export type NavTab =
  | 'overview'
  | 'ai-analyst'
  | 'analysis'
  | 'dashboard'
  | 'quality'
  | 'anomalies'
  | 'reports';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  dataset: Dataset | null;
  onSelectDemo: (demoId: string) => void;
  onTriggerUpload: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  dataset,
  onSelectDemo,
  onTriggerUpload,
  onOpenSettings,
  onOpenHelp,
  mobileOpen,
  onCloseMobile,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'ai-analyst', label: 'AI Analyst', icon: Sparkles, badge: 'Main' },
    { id: 'analysis', label: 'Analysis', icon: BarChart2 },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'quality', label: 'Data Quality', icon: ShieldCheck, badge: dataset ? `${dataset.quality.score}%` : undefined },
    { id: 'anomalies', label: 'Anomalies', icon: AlertOctagon, badge: dataset && dataset.anomalies.length > 0 ? `${dataset.anomalies.length}` : undefined },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#0B0F18] border-r border-white/[0.08] flex flex-col justify-between transition-transform duration-300 select-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Logo & Navigation */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Logo Header */}
          <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4F8CFF] to-[#8B5CF6] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-[#F5F7FB] tracking-tight">
                    AI Data Analyst
                  </span>
                </div>
                <p className="text-[10px] text-[#9CA7BA] font-medium leading-none mt-1">
                  Schema-Agnostic BI
                </p>
              </div>
            </div>
          </div>

          {/* Active Dataset Status Mini-Card */}
          {dataset ? (
            <div className="mx-3 mt-3 p-2.5 rounded-xl bg-[#151B28] border border-white/[0.08] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-[#F5F7FB] truncate">
                    {dataset.fileName}
                  </div>
                  <div className="text-[10px] text-[#9CA7BA] font-mono">
                    {dataset.records.length.toLocaleString()} rows · {dataset.columns.length} cols
                  </div>
                </div>
              </div>
              <button
                onClick={onTriggerUpload}
                title="Replace dataset"
                className="p-1 rounded-lg hover:bg-white/[0.06] text-[#9CA7BA] hover:text-[#4F8CFF] transition-colors shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="mx-3 mt-3 p-2.5 rounded-xl bg-[#151B28]/60 border border-white/[0.06] flex items-center justify-between text-xs text-[#9CA7BA]">
              <span className="text-[11px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                <span>No dataset loaded</span>
              </span>
              <button
                onClick={onTriggerUpload}
                className="text-[10px] font-bold text-[#4F8CFF] hover:underline"
              >
                Upload
              </button>
            </div>
          )}

          {/* Navigation Items (Numbered 1-7 per specification) */}
          <div className="px-3 py-4 space-y-1">
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#687386]">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-[#151B28] text-[#F5F7FB] border-l-[3px] border-[#4F8CFF] shadow-[inset_0_0_12px_rgba(79,140,255,0.12)]'
                      : 'text-[#9CA7BA] hover:text-[#F5F7FB] hover:bg-[#151B28]/60 border-l-[3px] border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-[#4F8CFF]' : 'text-[#687386] group-hover:text-[#9CA7BA]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold ${
                        isActive
                          ? 'bg-[#4F8CFF]/20 text-[#4F8CFF]'
                          : 'bg-white/[0.04] text-[#687386]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Demo Datasets Quick Switcher */}
          <div className="px-3 pt-3 border-t border-white/[0.08] mt-auto">
            <div className="px-3 mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#687386]">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-[#4F8CFF]" />
                <span>Demo Datasets</span>
              </span>
              <span>3 Sets</span>
            </div>

            <div className="space-y-1">
              {DEMO_DATASETS.map((demo) => {
                const isSelected = dataset?.id === demo.id;
                return (
                  <button
                    key={demo.id}
                    onClick={() => {
                      onSelectDemo(demo.id);
                      onTabChange('overview');
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[11px] font-medium transition-all ${
                      isSelected
                        ? 'bg-[#151B28] text-[#4F8CFF] font-semibold border border-[#4F8CFF]/30'
                        : 'text-[#9CA7BA] hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="truncate">{demo.name}</span>
                    <span className="text-[10px] font-mono text-[#687386] shrink-0">
                      {demo.records.length}r
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section: Settings, Help, and User Profile */}
        <div className="p-3 border-t border-white/[0.08] space-y-1 bg-[#0B0F18]">
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#9CA7BA] hover:text-[#F5F7FB] hover:bg-white/[0.04] transition-colors"
          >
            <SettingsIcon className="w-4 h-4 text-[#687386]" />
            <span>Settings</span>
          </button>

          <button
            onClick={onOpenHelp}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#9CA7BA] hover:text-[#F5F7FB] hover:bg-white/[0.04] transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-[#687386]" />
            <span>Help & Docs</span>
          </button>

          {/* User Profile Card */}
          <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-[#151B28]/80 border border-white/[0.06]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4F8CFF] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-xs shrink-0">
              AR
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-[#F5F7FB] truncate leading-tight">
                Alex Rivera
              </div>
              <div className="text-[10px] text-[#9CA7BA] truncate leading-tight mt-0.5">
                Senior Data Analyst
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-[#4F8CFF] border border-blue-500/20">
              PRO
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
