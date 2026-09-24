import React, { useState } from 'react';
import {
  Dataset,
  AnalysisResult,
  ChatMessage,
  AnomalyItem,
} from './types/dataset';
import { DEMO_DATASETS, DemoDatasetDefinition } from './data/demoDatasets';
import {
  profileDataset,
  detectAnomalies,
  assessDataQuality,
  inferSchemaHeuristics,
  executeAnalysisPlan,
} from './utils/dataEngine';
import { parseUploadedFile } from './utils/fileParser';
import { requestAnalysisPlan, requestAIInsights } from './services/api';

import { Sidebar, NavTab } from './components/Sidebar';
import { OverviewPage } from './components/OverviewPage';
import { AIAnalystPage } from './components/AIAnalystPage';
import { AnalysisPage } from './components/AnalysisPage';
import { DashboardPage } from './components/DashboardPage';
import { DataQualityPage } from './components/DataQualityPage';
import { AnomaliesPage } from './components/AnomaliesPage';
import { ReportsPage } from './components/ReportsPage';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { ReportModal } from './components/ReportModal';

import {
  Menu,
  ChevronRight,
  Database,
  Upload,
  RefreshCw,
  Sparkles,
  Layers,
  Settings as SettingsIcon,
  HelpCircle,
} from 'lucide-react';

export default function App() {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [analyzingFile, setAnalyzingFile] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [currencyUnit, setCurrencyUnit] = useState('$');

  const [currentAmbiguity, setCurrentAmbiguity] = useState<{
    question: string;
    options: string[];
    reason: string;
  } | null>(null);

  const [currentUnanswerable, setCurrentUnanswerable] = useState<{
    reason: string;
    suggestedAlternatives: string[];
  } | null>(null);

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Hidden file input for uploads triggered from sidebar / workspace
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  /**
   * Helper to instantiate a demo dataset into a full Dataset object
   */
  const instantiateDemoDataset = (demo: DemoDatasetDefinition): Dataset => {
    const { columns, profiles } = profileDataset(demo.records);
    const anomalies = detectAnomalies(demo.records, profiles);
    const quality = assessDataQuality(demo.records, profiles, anomalies);
    const { inferredSchema, suggestedQuestions } = inferSchemaHeuristics(columns, profiles);

    return {
      id: demo.id,
      name: demo.name,
      fileName: `${demo.id}.csv`,
      records: demo.records,
      columns,
      profiles,
      inferredSchema,
      quality,
      anomalies,
      suggestedQuestions,
      uploadedAt: new Date().toISOString(),
    };
  };

  /**
   * Load one of the 3 pre-built Demo Datasets
   */
  const handleLoadDemo = async (demoId: string) => {
    const found = DEMO_DATASETS.find((d) => d.id === demoId) || DEMO_DATASETS[0];
    const initialDataset = instantiateDemoDataset(found);

    setDataset(initialDataset);
    setAnalysisResults([]);
    setConversationHistory([]);
    setCurrentAmbiguity(null);
    setCurrentUnanswerable(null);
    setActiveTab('ai-analyst');

    // Run first suggested question automatically to populate initial view
    if (initialDataset.suggestedQuestions.length > 0) {
      setTimeout(() => {
        handleAskQuestion(initialDataset.suggestedQuestions[0], initialDataset);
      }, 200);
    }
  };

  /**
   * Handle user uploaded file (.csv, .xlsx, .xls)
   */
  const handleFileUpload = async (file: File) => {
    try {
      setAnalyzingFile(true);
      setAnalysisStep(0);
      const parsedDataset = await parseUploadedFile(file, (step) => {
        setAnalysisStep(step);
      });

      setDataset(parsedDataset);
      setAnalysisResults([]);
      setConversationHistory([]);
      setCurrentAmbiguity(null);
      setCurrentUnanswerable(null);
      setActiveTab('ai-analyst');

      // Auto-run first question
      if (parsedDataset.suggestedQuestions.length > 0) {
        setTimeout(() => {
          handleAskQuestion(parsedDataset.suggestedQuestions[0], parsedDataset);
        }, 300);
      }
    } catch (err: any) {
      console.warn('File parsing notice:', err?.message || err);
      setUploadError(err?.message || 'Failed to parse file. Please upload a valid CSV or Excel document.');
    } finally {
      setAnalyzingFile(false);
    }
  };

  /**
   * Main Question Execution Flow
   */
  const handleAskQuestion = async (questionText: string, activeDs = dataset, overrideMeasure?: string) => {
    const targetDataset = activeDs || dataset;
    if (!targetDataset) return;

    setIsThinking(true);
    setCurrentAmbiguity(null);
    setCurrentUnanswerable(null);

    try {
      // 1. Convert natural language to structured plan
      const plan = await requestAnalysisPlan(questionText, targetDataset, conversationHistory);

      // 2. Check if question is unanswerable from the dataset
      if (plan.isUnanswerable) {
        setCurrentUnanswerable({
          reason: plan.unanswerableReason || "Information requested is not available in the uploaded dataset.",
          suggestedAlternatives: plan.suggestedAlternatives || targetDataset.suggestedQuestions.slice(0, 3),
        });
        setIsThinking(false);
        return;
      }

      // 3. Check for ambiguity
      if (plan.ambiguity?.isAmbiguous && !overrideMeasure) {
        setCurrentAmbiguity({
          question: questionText,
          options: plan.ambiguity.options || [],
          reason: plan.ambiguity.reason || "Multiple matching columns found in dataset.",
        });
        setIsThinking(false);
        return;
      }

      // 4. If an ambiguity override was selected
      if (overrideMeasure) {
        plan.targetMeasure = overrideMeasure;
      }

      // 5. Execute computation on real dataset records
      const computedResult = executeAnalysisPlan(targetDataset, plan);
      computedResult.question = questionText;

      // 6. Request AI Insights based strictly on computed results
      try {
        const insights = await requestAIInsights(
          questionText,
          computedResult.chartData,
          plan.targetMeasure,
          plan.groupBy
        );
        if (insights && insights.length > 0) {
          computedResult.aiInsights = insights;
        }
      } catch (e) {
        // Fallback insights are already in computedResult
      }

      // 7. Update state
      setAnalysisResults((prev) => [computedResult, ...prev]);

      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}-u`,
        sender: 'user',
        content: questionText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-a`,
        sender: 'assistant',
        analysisResult: computedResult,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setConversationHistory((prev) => [...prev, userMsg, aiMsg]);
    } catch (err: any) {
      console.warn('Notice answering question:', err?.message || err);
    } finally {
      setIsThinking(false);
    }
  };

  /**
   * Ambiguity selection resolution
   */
  const handleResolveAmbiguity = (chosenOption: string) => {
    if (!currentAmbiguity) return;
    const originalQ = currentAmbiguity.question;
    setCurrentAmbiguity(null);
    handleAskQuestion(originalQ, dataset, chosenOption);
  };

  /**
   * Ask AI about a specific detected anomaly
   */
  const handleAskAboutAnomaly = (anomaly: AnomalyItem) => {
    setActiveTab('ai-analyst');
    handleAskQuestion(
      `Why is row #${anomaly.rowNumber} (${anomaly.columnName}: ${anomaly.value}) considered a potential anomaly?`
    );
  };

  /**
   * Reset / re-route to initial landing state
   */
  const handleGoHome = () => {
    setDataset(null);
    setAnalysisResults([]);
    setConversationHistory([]);
    setCurrentAmbiguity(null);
    setCurrentUnanswerable(null);
    setUploadError(null);
    setActiveTab('overview');
  };

  const getBreadcrumbLabel = (tab: NavTab) => {
    switch (tab) {
      case 'overview':
        return 'Overview';
      case 'ai-analyst':
        return 'AI Analyst';
      case 'analysis':
        return 'Analysis';
      case 'dashboard':
        return 'Dashboard';
      case 'quality':
        return 'Data Quality';
      case 'anomalies':
        return 'Anomalies';
      case 'reports':
        return 'Reports';
      default:
        return 'Overview';
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#080B12] text-[#F5F7FB] font-sans selection:bg-[#4F8CFF]/30 selection:text-white">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />

      {/* Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        dataset={dataset}
        onSelectDemo={handleLoadDemo}
        onTriggerUpload={() => fileInputRef.current?.click()}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenHelp={() => setShowHelpModal(true)}
        onGoHome={handleGoHome}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#080B12]">
        {/* Top Navbar with Breadcrumbs and Dataset Status */}
        <header className="h-14 border-b border-white/[0.08] bg-[#080B12]/95 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg bg-[#151B28] border border-white/[0.08] text-[#9CA7BA]"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs font-medium">
              <button
                onClick={handleGoHome}
                title="Return to initial landing state"
                className="text-[#687386] hover:text-[#4F8CFF] transition-colors cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-[#687386]" />
              <span className="text-[#F5F7FB] font-semibold">
                {getBreadcrumbLabel(activeTab)}
              </span>
            </nav>
          </div>

          {/* Right Header Status Bar */}
          <div className="flex items-center gap-3">
            {dataset ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[#F5F7FB] font-semibold truncate max-w-[160px]">
                    {dataset.fileName}
                  </span>
                  <span className="text-[#687386]">·</span>
                  <span className="text-[#9CA7BA]">{dataset.records.length.toLocaleString()} rows</span>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-[#151B28] hover:bg-[#1E2638] text-xs font-semibold text-[#F5F7FB] border border-white/[0.08] transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3 text-[#9CA7BA]" />
                  <span>Replace File</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLoadDemo(DEMO_DATASETS[0].id)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-[#151B28] hover:bg-[#1E2638] text-[#4F8CFF] border border-[#4F8CFF]/30 font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Layers className="w-3 h-3" />
                  <span>Launch Demo</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white font-bold shadow-md shadow-blue-500/25 hover:opacity-95 transition-opacity"
                >
                  Upload File
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Upload Error Banner */}
        {uploadError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300">
            <span>{uploadError}</span>
            <button
              onClick={() => setUploadError(null)}
              className="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-bold ml-3"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Page Switcher */}
        {activeTab === 'overview' && (
          <OverviewPage
            dataset={dataset}
            onFileUpload={handleFileUpload}
            onLoadDemo={handleLoadDemo}
            analyzingFile={analyzingFile}
            analysisStep={analysisStep}
            onNavigateTab={setActiveTab}
            onAskQuestion={(q) => {
              setActiveTab('ai-analyst');
              handleAskQuestion(q);
            }}
            onTriggerUpload={() => fileInputRef.current?.click()}
          />
        )}

        {activeTab === 'ai-analyst' && (
          dataset ? (
            <AIAnalystPage
              dataset={dataset}
              analysisResults={analysisResults}
              onAskQuestion={(q) => handleAskQuestion(q)}
              isThinking={isThinking}
              currentAmbiguity={currentAmbiguity}
              currentUnanswerable={currentUnanswerable}
              onResolveAmbiguity={handleResolveAmbiguity}
              onNavigateToDashboard={() => setActiveTab('dashboard')}
            />
          ) : (
            <OverviewPage
              dataset={null}
              onFileUpload={handleFileUpload}
              onLoadDemo={handleLoadDemo}
              analyzingFile={analyzingFile}
              analysisStep={analysisStep}
              onNavigateTab={setActiveTab}
              onAskQuestion={(q) => {
                setActiveTab('ai-analyst');
                handleAskQuestion(q);
              }}
              onTriggerUpload={() => fileInputRef.current?.click()}
            />
          )
        )}

        {activeTab === 'analysis' && (
          dataset ? (
            <AnalysisPage
              dataset={dataset}
              analysisResults={analysisResults}
              onAskQuestion={(q) => handleAskQuestion(q)}
              isThinking={isThinking}
            />
          ) : (
            <OverviewPage
              dataset={null}
              onFileUpload={handleFileUpload}
              onLoadDemo={handleLoadDemo}
              analyzingFile={analyzingFile}
              analysisStep={analysisStep}
              onNavigateTab={setActiveTab}
              onAskQuestion={(q) => {
                setActiveTab('ai-analyst');
                handleAskQuestion(q);
              }}
              onTriggerUpload={() => fileInputRef.current?.click()}
            />
          )
        )}

        {activeTab === 'dashboard' && (
          dataset ? (
            <DashboardPage
              dataset={dataset}
              onAskQuestion={(q) => {
                setActiveTab('ai-analyst');
                handleAskQuestion(q);
              }}
              onOpenReport={() => setActiveTab('reports')}
            />
          ) : (
            <OverviewPage
              dataset={null}
              onFileUpload={handleFileUpload}
              onLoadDemo={handleLoadDemo}
              analyzingFile={analyzingFile}
              analysisStep={analysisStep}
              onNavigateTab={setActiveTab}
              onAskQuestion={(q) => {
                setActiveTab('ai-analyst');
                handleAskQuestion(q);
              }}
              onTriggerUpload={() => fileInputRef.current?.click()}
            />
          )
        )}

        {activeTab === 'quality' && (
          dataset ? (
            <DataQualityPage
              dataset={dataset}
              onAskQuestion={(q) => {
                setActiveTab('ai-analyst');
                handleAskQuestion(q);
              }}
            />
          ) : (
            <OverviewPage
              dataset={null}
              onFileUpload={handleFileUpload}
              onLoadDemo={handleLoadDemo}
              analyzingFile={analyzingFile}
              analysisStep={analysisStep}
              onNavigateTab={setActiveTab}
              onAskQuestion={(q) => {
                setActiveTab('ai-analyst');
                handleAskQuestion(q);
              }}
              onTriggerUpload={() => fileInputRef.current?.click()}
            />
          )
        )}

        {activeTab === 'anomalies' && (
          dataset ? (
            <AnomaliesPage
              dataset={dataset}
              onAskAboutAnomaly={handleAskAboutAnomaly}
            />
          ) : (
            <OverviewPage
              dataset={null}
              onFileUpload={handleFileUpload}
              onLoadDemo={handleLoadDemo}
              analyzingFile={analyzingFile}
              analysisStep={analysisStep}
              onNavigateTab={setActiveTab}
              onAskQuestion={(q) => {
                setActiveTab('ai-analyst');
                handleAskQuestion(q);
              }}
              onTriggerUpload={() => fileInputRef.current?.click()}
            />
          )
        )}

        {activeTab === 'reports' && (
          dataset ? (
            <ReportsPage
              dataset={dataset}
              analysisResults={analysisResults}
            />
          ) : (
            <OverviewPage
              dataset={null}
              onFileUpload={handleFileUpload}
              onLoadDemo={handleLoadDemo}
              analyzingFile={analyzingFile}
              analysisStep={analysisStep}
              onNavigateTab={setActiveTab}
              onAskQuestion={(q) => {
                setActiveTab('ai-analyst');
                handleAskQuestion(q);
              }}
              onTriggerUpload={() => fileInputRef.current?.click()}
            />
          )
        )}
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
          currencyUnit={currencyUnit}
          onChangeCurrency={(u) => setCurrencyUnit(u)}
          onClearDataset={() => {
            setDataset(null);
            setAnalysisResults([]);
            setConversationHistory([]);
            setActiveTab('overview');
          }}
          hasDataset={!!dataset}
        />
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}

      {/* Fullscreen Report Modal */}
      {showReportModal && dataset && (
        <ReportModal
          dataset={dataset}
          analysisResults={analysisResults}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}
