import React, { useState, useEffect } from 'react';
import { RiasecScores, MatchResult } from './types/riasec';
import { Navbar, ActiveTab } from './components/Navbar';
import { RiasecTestView } from './components/RiasecTestView';
import { ResultsView } from './components/ResultsView';
import { SimulatorView } from './components/SimulatorView';
import { TradesDirectoryView } from './components/TradesDirectoryView';
import { PrintDossierModal } from './components/PrintDossierModal';
import { computeTradeMatches } from './utils/riasecMatching';
import { MILITARY_TRADES } from './data/militaryTrades';
import { ExternalLink } from 'lucide-react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

const STORAGE_KEY = 'fac_riasec_candidate_scores_v2';

function AppContent() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>('test');
  const [userScores, setUserScores] = useState<RiasecScores | null>(null);
  const [hasCompletedTest, setHasCompletedTest] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [testSessionKey, setTestSessionKey] = useState<number>(0);
  const [selectedCandidateTrades, setSelectedCandidateTrades] = useState<MatchResult[]>([]);
  const [isSingleCandidateChoice, setIsSingleCandidateChoice] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setUserScores(parsed);
        setHasCompletedTest(true);
        setActiveTab('results');
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleCompleteTest = (scores: RiasecScores) => {
    setUserScores(scores);
    setHasCompletedTest(true);
    setActiveTab('results');
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    } catch {
      // Ignore
    }
  };

  const handleRetakeTest = () => {
    setActiveTab('test');
  };

  const handleResetTest = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
    setUserScores(null);
    setHasCompletedTest(false);
    setSelectedCandidateTrades([]);
    setIsSingleCandidateChoice(false);
    setTestSessionKey((prev) => prev + 1);
    setActiveTab('test');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplySimulatorScores = (scores: RiasecScores) => {
    setUserScores(scores);
    setHasCompletedTest(true);
    setActiveTab('results');
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    } catch {
      // Ignore
    }
  };

  const matchedTrades = userScores ? computeTradeMatches(userScores, MILITARY_TRADES) : [];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-[#f1b331] selection:text-slate-950">
      {/* Top Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userScores={userScores}
        hasCompletedTest={hasCompletedTest}
        onOpenPrintDossier={() => setIsPrintModalOpen(true)}
        onReset={handleResetTest}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {activeTab === 'test' && (
          <RiasecTestView key={testSessionKey} onCompleteTest={handleCompleteTest} />
        )}

        {activeTab === 'results' && userScores && (
          <ResultsView
            userScores={userScores}
            onRetakeTest={handleRetakeTest}
            onResetTest={handleResetTest}
            onGoToSimulator={() => setActiveTab('simulator')}
            onOpenPrintDossier={() => setIsPrintModalOpen(true)}
            candidateTrades={selectedCandidateTrades}
            isSingleChoice={isSingleCandidateChoice}
            onCandidateTradesChange={(trades, isSingle) => {
              setSelectedCandidateTrades(trades);
              setIsSingleCandidateChoice(isSingle);
            }}
          />
        )}

        {activeTab === 'simulator' && (
          <SimulatorView
            initialScores={userScores || undefined}
            onApplyScoresToProfile={handleApplySimulatorScores}
          />
        )}

        {activeTab === 'directory' && (
          <TradesDirectoryView userScores={userScores} />
        )}
      </main>

      {/* Official Federal Footer */}
      <footer className="no-print bg-[#12161a] text-slate-400 py-8 px-4 sm:px-6 lg:px-8 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetTest}
              className="forces-logo-btn text-[#f1b331] hover:text-[#f8cf6e] font-bold text-sm cursor-pointer transition-colors focus:outline-hidden border-0"
              title="FORCES.CA"
            >
              FORCES.CA
            </button>
            <span className="text-slate-600" aria-hidden="true">|</span>
            <span className="text-slate-300">
              {t('footerAffiliation')}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href={language === 'en' ? "https://forces.ca/en/careers" : "https://forces.ca/fr/carrieres"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>{t('footerAllCareers')}</span>
              <ExternalLink className="w-3 h-3 text-[#f1b331]" />
            </a>
            <a
              href={language === 'en' ? "https://forces.ca/en/apply-now/" : "https://forces.ca/fr/postuler/"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>{t('footerApplyOnline')}</span>
              <ExternalLink className="w-3 h-3 text-[#f1b331]" />
            </a>
            <span className="text-slate-500 font-mono">
              {t('footerPsychometrics')}
            </span>
          </div>
        </div>
      </footer>

      {/* Printable Dossier Modal */}
      {isPrintModalOpen && userScores && (
        <PrintDossierModal
          userScores={userScores}
          matchedTrades={matchedTrades}
          candidateTrades={selectedCandidateTrades}
          isSingleChoice={isSingleCandidateChoice}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
