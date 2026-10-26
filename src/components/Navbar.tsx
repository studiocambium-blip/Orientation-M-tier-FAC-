import React from 'react';
import { RiasecScores } from '../types/riasec';
import { getHollandTriad } from '../utils/riasecMatching';
import { useLanguage } from '../context/LanguageContext';
import { 
  Compass, 
  SlidersHorizontal, 
  BookOpen, 
  Printer, 
  ExternalLink,
  ShieldCheck,
  Languages
} from 'lucide-react';

export type ActiveTab = 'test' | 'results' | 'simulator' | 'directory';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userScores: RiasecScores | null;
  hasCompletedTest: boolean;
  onOpenPrintDossier: () => void;
  onReset?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userScores,
  hasCompletedTest,
  onOpenPrintDossier,
  onReset
}) => {
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const triad = userScores ? getHollandTriad(userScores) : null;

  return (
    <header className="no-print sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Official Government of Canada / Forces.ca banner */}
      <div className="bg-[#12161a] text-slate-300 text-[11px] px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-200 font-semibold">{t('govBanner')}</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://www.cafoap-pclfac.forces.gc.ca/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors font-medium"
          >
            <span>{t('govPortal')}</span>
            <ExternalLink className="w-3 h-3 text-[#f1b331]" />
          </a>
        </div>
      </div>

      {/* Main App Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onReset}
                  className="forces-logo-btn group inline-flex items-center text-left focus:outline-hidden cursor-pointer transition-transform active:scale-95 border-0"
                  title="FORCES.CA"
                  aria-label="FORCES.CA"
                >
                  <span className="text-lg font-extrabold text-slate-900 tracking-tight font-display group-hover:opacity-80 transition-opacity border-0">
                    FORCES<span className="text-[#f1b331]">.CA</span>
                  </span>
                </button>
                <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-semibold">
                  {t('riasecOrientation')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {t('brandSubtitle')}
              </p>
            </div>
          </div>

          {/* Navigation Controls without large outer contour */}
          <nav className="nav-tab-container flex items-center p-1 bg-slate-100 rounded-lg border-0 shadow-none" aria-label="Navigation principale">
            <button
              onClick={() => setActiveTab('test')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all border-0 ${
                activeTab === 'test'
                  ? 'bg-[#f1b331] text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t('tabTest')}</span>
              <span className="md:hidden">{t('tabTestShort')}</span>
            </button>

            {hasCompletedTest && (
              <button
                onClick={() => setActiveTab('results')}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all border-0 ${
                  activeTab === 'results'
                    ? 'bg-[#f1b331] text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{t('tabResults')}</span>
                <span className="md:hidden">{t('tabResultsShort')}</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all border-0 ${
                activeTab === 'simulator'
                  ? 'bg-[#f1b331] text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t('tabSimulator')}</span>
              <span className="md:hidden">{t('tabSimulatorShort')}</span>
            </button>

            <button
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all border-0 ${
                activeTab === 'directory'
                  ? 'bg-[#f1b331] text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t('tabDirectory')}</span>
              <span className="md:hidden">{t('tabDirectoryShort')}</span>
            </button>
          </nav>

          {/* Right Action / Profile Status & Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Tab FR / ENG */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-300 font-mono text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => setLanguage('fr')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  language === 'fr'
                    ? 'bg-[#f1b331] text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Afficher le site en français"
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  language === 'en'
                    ? 'bg-[#f1b331] text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Display the site in English"
              >
                ENG
              </button>
            </div>

            {triad && (
              <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono">
                <span className="text-slate-500">{t('profile')} :</span>
                <span className="text-slate-950 font-bold bg-[#f1b331] px-1.5 py-0.5 rounded tracking-wider">{triad.code}</span>
              </div>
            )}

            {userScores && (
              <button
                onClick={onOpenPrintDossier}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f1b331] hover:bg-[#dfa222] text-slate-950 text-xs font-bold rounded-md transition-colors shadow-xs shrink-0"
                title={t('generateDossierTooltip')}
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('cfrcDossier')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
