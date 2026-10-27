import React, { useState, useRef, useEffect } from 'react';
import { RiasecScores, MilitaryTrade, MilitaryBranch, RiasecDimension, MatchResult } from '../types/riasec';
import { MILITARY_TRADES } from '../data/militaryTrades';
import { RIASEC_DIMENSIONS } from '../data/riasecData';
import { useLanguage } from '../context/LanguageContext';
import { 
  getHollandTriad, 
  getHollandConsistency, 
  computeTradeMatches, 
  getDominantMatches,
  HEXAGON_ORDER 
} from '../utils/riasecMatching';
import { RiasecRadarChart } from './RiasecRadarChart';
import { TradeDetailModal } from './TradeDetailModal';
import { BranchIcon, getBranchShortCode } from './BranchIcon';
import { MosidBadge } from './MosidBadge';
import { TriadBadge } from './TriadBadge';
import { 
  Shield, 
  Printer, 
  SlidersHorizontal, 
  ExternalLink,
  RotateCcw,
  LayoutGrid,
  List,
  Sparkles,
  CheckCircle,
  X,
  ArrowUp
} from 'lucide-react';

interface ResultsViewProps {
  userScores: RiasecScores;
  onRetakeTest: () => void;
  onResetTest?: () => void;
  onGoToSimulator: () => void;
  onOpenPrintDossier: () => void;
  candidateTrades?: MatchResult[];
  isSingleChoice?: boolean;
  onCandidateTradesChange?: (trades: MatchResult[], isSingle: boolean) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  userScores,
  onRetakeTest,
  onResetTest,
  onGoToSimulator,
  onOpenPrintDossier,
  candidateTrades = [],
  isSingleChoice = false,
  onCandidateTradesChange
}) => {
  const { 
    language, 
    t, 
    getBranchName, 
    getRankName, 
    getEducationName, 
    getTradeForcesUrl, 
    getTradeName, 
    getTradeSummary 
  } = useLanguage();

  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedRank, setSelectedRank] = useState<string>('all');
  const [selectedTradeForModal, setSelectedTradeForModal] = useState<MilitaryTrade | null>(null);
  const [comparedTrade, setComparedTrade] = useState<MilitaryTrade | null>(null);
  const [selectedDimension, setSelectedDimension] = useState<RiasecDimension | null>(null);
  const [displayMode, setDisplayMode] = useState<'cards' | 'table'>('cards');
  const [filterDominantsOnly, setFilterDominantsOnly] = useState<boolean>(true);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [selectedTrades, setSelectedTrades] = useState<MatchResult[]>(candidateTrades);
  const [isSingleChoiceMode, setIsSingleChoiceMode] = useState<boolean>(isSingleChoice);

  const triad = getHollandTriad(userScores);
  const consistency = getHollandConsistency(triad.letters);
  const allMatches = computeTradeMatches(userScores, MILITARY_TRADES);

  const filteredAll = allMatches.filter((item) => {
    if (selectedBranch !== 'all' && item.trade.branch !== selectedBranch) return false;
    if (selectedRank !== 'all' && item.trade.rankCategory !== selectedRank) return false;
    return true;
  });

  const dominantMatches = allMatches.slice(0, 20);
  const filteredMatches = filterDominantsOnly ? filteredAll.slice(0, 20) : filteredAll;

  const getBranchIcon = (branch: MilitaryBranch | string) => {
    return <BranchIcon branch={branch} inBlack={true} className="w-7 h-5 text-black shrink-0" />;
  };

  const topSectionRef = useRef<HTMLDivElement>(null);

  const scrollToTopResults = () => {
    // 1. Direct scroll into view on the banner or top container
    const banner = document.getElementById('selected-trade-banner');
    if (banner) {
      banner.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (topSectionRef.current) {
      topSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 2. Window / body / document scrolling
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, 0);
    }
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  };

  const hasCompletedSelection = selectedTrades.length === 3 || (isSingleChoiceMode && selectedTrades.length === 1);

  // Whenever selection completes, automatically scroll up to the top of the page so the user sees the results
  useEffect(() => {
    if (hasCompletedSelection) {
      scrollToTopResults();
      const t1 = setTimeout(scrollToTopResults, 60);
      const t2 = setTimeout(scrollToTopResults, 200);
      const t3 = setTimeout(scrollToTopResults, 450);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [hasCompletedSelection, isSingleChoiceMode, selectedTrades.length]);

  const handleToggleSelect = (m: MatchResult) => {
    setIsSingleChoiceMode(false);
    const exists = selectedTrades.some((t) => t.trade.id === m.trade.id);
    if (exists) {
      const next = selectedTrades.filter((t) => t.trade.id !== m.trade.id);
      setSelectedTrades(next);
      onCandidateTradesChange?.(next, false);
    } else {
      if (selectedTrades.length < 3) {
        const next = [...selectedTrades, m];
        setSelectedTrades(next);
        onCandidateTradesChange?.(next, false);
        if (next.length === 3) {
          setTimeout(scrollToTopResults, 60);
          setTimeout(scrollToTopResults, 200);
        }
      }
    }
  };

  const handleSelectOnlyThis = (m: MatchResult) => {
    setIsSingleChoiceMode(true);
    setSelectedTrades([m]);
    onCandidateTradesChange?.([m], true);
    setTimeout(scrollToTopResults, 60);
    setTimeout(scrollToTopResults, 200);
  };

  const handleClearSelection = () => {
    setSelectedTrades([]);
    setIsSingleChoiceMode(false);
    onCandidateTradesChange?.([], false);
  };

  return (
    <div ref={topSectionRef} id="top-of-results" className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white scroll-mt-24">
      {/* 1. SECTION MÉTIERS CHOISIS SELON L'INTÉRÊT : Bascule en haut lorsque 3 métiers sont choisis (ou 1 seul via l'option spécifique) */}
      {hasCompletedSelection && (
        <div id="selected-trade-banner" tabIndex={-1} className="bg-white border-2 border-[#f1b331] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 scroll-mt-24 ring-4 ring-[#f1b331]/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#f1b331] text-slate-950 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono shadow-2xs flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>
                    {isSingleChoiceMode
                      ? t('topBannerChosenSingle')
                      : t('topBannerChosenTrio')}
                  </span>
                </span>
                <span className="text-xs font-mono text-slate-500 font-semibold">
                  {isSingleChoiceMode
                    ? `${t('topBannerAffinity')} ${selectedTrades[0].matchScore}%`
                    : t('topBanner3Selected')}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
                {isSingleChoiceMode
                  ? getTradeName(selectedTrades[0].trade)
                  : (language === 'en' ? "Your selection of 3 trades for your application" : "Votre sélection de 3 métiers pour votre candidature")}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                {isSingleChoiceMode
                  ? t('topBannerSingleDesc')
                  : t('topBannerTrioDesc')}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onOpenPrintDossier}
                className="flex items-center gap-2 px-4 py-2 bg-[#f1b331] hover:bg-[#dfa222] text-slate-950 text-xs font-bold rounded-xl transition-all shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>{t('prepareInterviewBtn')}</span>
              </button>
              <button
                onClick={handleClearSelection}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 transition-colors"
                title={t('modifyChoicesBtn')}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('modifyChoicesBtn')}</span>
              </button>
            </div>
          </div>

          {/* If Single Choice Mode: display detailed single card */}
          {isSingleChoiceMode && selectedTrades[0] && (
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-800 font-bold flex items-center gap-2">
                  <BranchIcon branch={selectedTrades[0].trade.branch} inBlack={true} className="w-7 h-5 text-black shrink-0" />
                  <span>{getBranchName(selectedTrades[0].trade.branch)}</span>
                  <span className="text-[10px] font-black text-black bg-slate-200 border border-slate-300 px-1.5 py-0.5 rounded font-mono">
                    {getBranchShortCode(selectedTrades[0].trade.branch)}
                  </span>
                  <span aria-hidden="true" className="text-slate-400">·</span>
                  <MosidBadge code={selectedTrades[0].trade.mosid} className="text-slate-500 font-normal" />
                  <span aria-hidden="true" className="text-slate-400">·</span>
                  <span className="text-slate-600 font-normal">{getRankName(selectedTrades[0].trade.rankCategory)}</span>
                </div>

                <p className="text-sm text-slate-700 max-w-2xl leading-relaxed">
                  {getTradeSummary(selectedTrades[0].trade)}
                </p>

                <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <strong className="text-slate-900">{t('whyFitQuestion')} </strong>
                  {selectedTrades[0].compatibilityReason}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
                <a
                  href={getTradeForcesUrl(selectedTrades[0].trade)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#f1b331] hover:bg-[#dfa222] text-slate-950 text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  <span>{t('accessForcesPage')}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setSelectedTradeForModal(selectedTrades[0].trade)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  <span>{t('viewDetailRadar')}</span>
                </button>
              </div>
            </div>
          )}

          {/* If 3 choices mode: display 3 side-by-side cards */}
          {!isSingleChoiceMode && selectedTrades.length === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedTrades.map((item, idx) => (
                <div
                  key={item.trade.id}
                  className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="bg-[#f1b331] text-slate-950 font-black px-2 py-0.5 rounded text-[10px] font-mono uppercase shadow-2xs">
                        {t('choiceNum')}{idx + 1}
                      </span>
                      <div className="flex items-baseline gap-1 text-[11px] font-mono text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                        <span className="text-slate-400 text-[10px]">{t('matchTag')}</span>
                        <strong className="text-slate-900 font-bold">{item.matchScore}%</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-600 mb-1">
                      <BranchIcon branch={item.trade.branch} inBlack={true} className="w-7 h-5 text-black shrink-0" />
                      <span className="font-semibold text-slate-800 truncate">{getBranchName(item.trade.branch)}</span>
                      <span className="text-slate-400">·</span>
                      <MosidBadge code={item.trade.mosid} className="text-slate-500" />
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm font-display line-clamp-1">
                      {getTradeName(item.trade)}
                    </h3>
                    <div className="text-[11px] text-slate-500 italic mb-2">
                      {language === 'en' ? item.trade.nameFr : item.trade.nameEn} · {getRankName(item.trade.rankCategory)}
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {getTradeSummary(item.trade)}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedTradeForModal(item.trade)}
                      className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-medium rounded-lg border border-slate-300 transition-colors"
                    >
                      {t('details')}
                    </button>
                    <a
                      href={getTradeForcesUrl(item.trade)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#f1b331] hover:bg-[#dfa222] text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-2xs"
                    >
                      <span>{t('forcesCa')}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Candidate Holland Profile Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-700 font-bold">
              <span>{t('psychometricBilan')}</span>
              <span aria-hidden="true">·</span>
              <span>{t('hollandModel')}</span>
            </div>

            <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display">
              {t('yourTriad')}{' '}
              <span className="text-slate-950 font-mono tracking-widest bg-[#f1b331] px-2 py-0.5 rounded">{triad.code}</span>
            </h1>

            <p className="text-base text-slate-700 font-medium">
              {triad.letters
                .map((dim) => (language === 'en' ? RIASEC_DIMENSIONS[dim].nameEn.split(' ')[0] : RIASEC_DIMENSIONS[dim].nameFr.split(' ')[0]))
                .join(' · ')}
            </p>

            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              {t('triadExplanation')}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-500">{t('consistencyIndex')}</span>
              <span className="text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md">
                {consistency.label}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              onClick={onOpenPrintDossier}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#f1b331] hover:bg-[#dfa222] text-slate-950 text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>{t('prepareInterviewBtn')}</span>
            </button>
            <button
              onClick={onGoToSimulator}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-300 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-700" />
              <span>{t('slidersSimulator')}</span>
            </button>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold rounded-xl border border-rose-300 transition-colors shadow-2xs"
              title={t('resetTest')}
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span>{t('resetTest')}</span>
            </button>
            <button
              onClick={onRetakeTest}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium rounded-xl border border-transparent transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('retakeQuestionnaire')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Radar Chart & 6 Dimension Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Radar Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[460px] shadow-sm">
          <div className="w-full text-center">
            <h3 className="text-base font-bold text-slate-900 font-display">
              {t('hexagonMapping')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('hexagonSubtitle')}
            </p>
          </div>

          <div className="my-auto py-2">
            <RiasecRadarChart
              userScores={userScores}
              comparisonScores={comparedTrade ? comparedTrade.idealScores : null}
              comparisonLabel={comparedTrade ? getTradeName(comparedTrade) : undefined}
              size={310}
              onDimensionClick={(dim) => setSelectedDimension(dim === selectedDimension ? null : dim)}
              selectedDimension={selectedDimension}
            />
          </div>

          <div className="w-full text-center text-xs text-slate-500 border-t border-slate-100 pt-3">
            {comparedTrade ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-[#0284c7] font-semibold">{t('comparedTo')} {getTradeName(comparedTrade)}</span>
                <button
                  onClick={() => setComparedTrade(null)}
                  className="text-slate-500 hover:text-slate-900 underline text-[11px]"
                >
                  {t('clear')}
                </button>
              </div>
            ) : (
              <span>{t('radarHint')}</span>
            )}
          </div>
        </div>

        {/* 6 Dimension Details (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-base font-bold text-slate-900 font-display">
              {language === 'en' ? 'Scores by RIASEC Dimension' : 'Scores par dimension RIASEC'}
            </h3>
            <span className="text-xs font-mono text-slate-500 font-bold">{language === 'en' ? 'Scale 0 to 100%' : 'Échelle 0 à 100%'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HEXAGON_ORDER.map((dim) => {
              const info = RIASEC_DIMENSIONS[dim];
              const score = userScores[dim] || 0;
              const isDominant = triad.letters.includes(dim);
              const isSelected = selectedDimension === dim;
              const dimName = language === 'en' ? info.nameEn : info.nameFr;
              const tagline = language === 'en' && info.taglineEn ? info.taglineEn : info.tagline;
              const keywords = language === 'en' && info.militaryKeywordsEn ? info.militaryKeywordsEn.slice(0, 3).join(', ') : info.militaryKeywords.slice(0, 3).join(', ');

              return (
                <div
                  key={dim}
                  onClick={() => setSelectedDimension(isSelected ? null : dim)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#f1b331] bg-amber-50/50 ring-2 ring-[#f1b331]'
                      : isDominant
                      ? 'border-slate-300 bg-white shadow-xs'
                      : 'border-slate-200 bg-slate-50/90 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: info.color }}
                        />
                        <h4 className="font-bold text-slate-900 text-xs">
                          {dimName}
                        </h4>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {tagline}
                      </div>
                    </div>
                    <span className="text-lg font-mono font-bold text-slate-900">
                      {score}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${score}%`,
                        backgroundColor: info.color
                      }}
                    />
                  </div>

                  <div className="mt-2.5 text-[11px] text-slate-600">
                    <strong className="text-slate-800">{t('cafApplication')} </strong>
                    {keywords}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. CLEAR, STRUCTURED LIST OF MATCHED OCCUPATIONS */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-200 mb-1 font-bold">
              <a
                href="https://www.cafoap-pclfac.forces.gc.ca/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#f1b331] hover:bg-[#dfa222] text-slate-950 px-2 py-0.5 rounded inline-flex items-center gap-1 transition-colors font-bold shadow-2xs"
                title={t('govPortal')}
              >
                <span>{t('govPortal')}</span>
                <ExternalLink className="w-3 h-3 text-slate-950" />
              </a>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-mono font-bold text-xs ${
                filterDominantsOnly 
                  ? 'bg-amber-100 text-amber-950 border border-amber-300' 
                  : 'bg-slate-200 text-slate-800 border border-slate-300'
              }`}>
                {filterDominantsOnly && <Sparkles className="w-3 h-3 text-amber-700" />}
                <span>
                  {filterDominantsOnly 
                    ? `${t('top20Results')} (${filteredMatches.length} ${t('tradesWord')} · ${t('top20Grid5x4')})` 
                    : `${filteredMatches.length} ${t('totalTrades')}`}
                </span>
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white font-display">
              {filterDominantsOnly ? t('top20Title') : t('allTradesTitle')}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {filterDominantsOnly
                ? t('top20Desc', { code: triad.code })
                : t('allTradesDesc', { count: allMatches.length })}
            </p>
          </div>

          {/* Controls: Top 20 filter, Display mode & element/rank filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Top 20 vs All Switch */}
            <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-300 shadow-2xs text-xs">
              <button
                onClick={() => setFilterDominantsOnly(true)}
                className={`px-3 py-1.5 rounded-md font-bold transition-colors flex items-center gap-1.5 ${
                  filterDominantsOnly
                    ? 'bg-[#f1b331] text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={t('top20Btn')}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('top20Btn')} ({Math.min(20, filteredAll.length)})</span>
              </button>
              <button
                onClick={() => setFilterDominantsOnly(false)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  !filterDominantsOnly
                    ? 'bg-[#f1b331] text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={t('allBtn')}
              >
                <span>{t('allBtn')} ({filteredAll.length})</span>
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-300 shadow-2xs">
              <button
                onClick={() => setDisplayMode('cards')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  displayMode === 'cards' ? 'bg-[#f1b331] text-slate-950 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Cards"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDisplayMode('table')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  displayMode === 'table' ? 'bg-[#f1b331] text-slate-950 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Table"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Branch Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-slate-300 rounded-lg text-xs shadow-2xs">
              <button
                onClick={() => setSelectedBranch('all')}
                className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                  selectedBranch === 'all'
                    ? 'bg-[#f1b331] text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('allBranches')}
              </button>
              <button
                onClick={() => setSelectedBranch('Armée canadienne')}
                className={`px-2.5 py-1 rounded-md font-bold transition-colors flex items-center gap-1.5 ${
                  selectedBranch === 'Armée canadienne'
                    ? 'bg-[#f1b331] text-slate-950 shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <BranchIcon branch="Armée canadienne" inBlack={true} className="w-7 h-5 text-black shrink-0" />
                <span>{t('army')}</span>
              </button>
              <button
                onClick={() => setSelectedBranch('Aviation royale canadienne')}
                className={`px-2.5 py-1 rounded-md font-bold transition-colors flex items-center gap-1.5 ${
                  selectedBranch === 'Aviation royale canadienne'
                    ? 'bg-[#f1b331] text-slate-950 shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <BranchIcon branch="Aviation royale canadienne" inBlack={true} className="w-7 h-5 text-black shrink-0" />
                <span>{t('airForce')}</span>
              </button>
              <button
                onClick={() => setSelectedBranch('Marine royale canadienne')}
                className={`px-2.5 py-1 rounded-md font-bold transition-colors flex items-center gap-1.5 ${
                  selectedBranch === 'Marine royale canadienne'
                    ? 'bg-[#f1b331] text-slate-950 shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <BranchIcon branch="Marine royale canadienne" inBlack={true} className="w-7 h-5 text-black shrink-0" />
                <span>{t('navy')}</span>
              </button>
              <button
                onClick={() => setSelectedBranch('Services interarmées')}
                className={`px-2.5 py-1 rounded-md font-bold transition-colors flex items-center gap-1.5 ${
                  selectedBranch === 'Services interarmées'
                    ? 'bg-[#f1b331] text-slate-950 shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <BranchIcon branch="Services interarmées" inBlack={true} className="w-7 h-5 text-black shrink-0" />
                <span>{t('joint')}</span>
              </button>
            </div>

            {/* Rank Filter */}
            <div className="flex items-center gap-1 p-1 bg-white border border-slate-300 rounded-lg text-xs shadow-2xs">
              <button
                onClick={() => setSelectedRank('all')}
                className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                  selectedRank === 'all'
                    ? 'bg-[#f1b331] text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('allRanks')}
              </button>
              <button
                onClick={() => setSelectedRank('Membre du rang (MDR)')}
                className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                  selectedRank === 'Membre du rang (MDR)'
                    ? 'bg-[#f1b331] text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('ncm')}
              </button>
              <button
                onClick={() => setSelectedRank('Officier')}
                className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                  selectedRank === 'Officier'
                    ? 'bg-[#f1b331] text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('officer')}
              </button>
            </div>
          </div>
        </div>

        {/* DIRECTIVE DE SÉLECTION CFRC : CHOISIR 3 MÉTIERS OU 1 SEUL */}
        <div className="bg-[#12161a] border-2 border-[#f1b331] rounded-2xl p-5 shadow-sm text-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="bg-[#f1b331] text-slate-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded font-mono">
                  {t('cfrcDirectiveTag')}
                </span>
                <span className="text-xs font-mono text-slate-300 font-semibold">
                  {isSingleChoiceMode && selectedTrades.length === 1
                    ? t('singleSelectedStatus')
                    : t('completedStatus', { count: selectedTrades.length })}
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-display">
                {t('directiveTitle')}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t('directiveDesc')}
              </p>
            </div>

            {/* Slots de visualisation des choix et bouton d'accès direct */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {[0, 1, 2].map((slotIdx) => {
                const tradeMatch = selectedTrades[slotIdx];
                return (
                  <div
                    key={slotIdx}
                    className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all ${
                      tradeMatch
                        ? 'bg-[#f1b331] text-slate-950 font-bold border-2 border-[#f1b331] shadow-2xs'
                        : 'bg-black/50 text-slate-400 border border-slate-700'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[10px] shrink-0 font-bold">
                      {slotIdx + 1}
                    </span>
                    <span className="truncate max-w-[130px]">
                      {tradeMatch ? getTradeName(tradeMatch.trade) : `${t('choiceSlot')}${slotIdx + 1}`}
                    </span>
                    {tradeMatch && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTrades((prev) => prev.filter((_, i) => i !== slotIdx));
                          setIsSingleChoiceMode(false);
                        }}
                        className="hover:text-red-900 transition-colors shrink-0 ml-1"
                        title={t('removeTrade')}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}

              {hasCompletedSelection && (
                <button
                  type="button"
                  onClick={scrollToTopResults}
                  className="bg-[#f1b331] hover:bg-[#dfa222] text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-105 cursor-pointer ml-1"
                  title={t('viewChosenTopBtn')}
                >
                  <ArrowUp className="w-4 h-4 stroke-[3]" />
                  <span>{t('viewChosenTopBtn')}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* TABLE VIEW (Clear, structured list) */}
        {displayMode === 'table' && (
          <div className="bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-xs font-mono text-slate-600 uppercase">
                    <th className="py-3.5 px-4 font-bold">{language === 'en' ? 'Rank' : 'Rang'}</th>
                    <th className="py-3.5 px-4 font-bold">{language === 'en' ? 'Forces.ca Career' : 'Métier Forces.ca'}</th>
                    <th className="py-3.5 px-4 font-bold">{language === 'en' ? 'Branch' : 'Élément'}</th>
                    <th className="py-3.5 px-4 font-bold">{language === 'en' ? 'RIASEC Profile' : 'Profil RIASEC'}</th>
                    <th className="py-3.5 px-4 font-bold">{language === 'en' ? 'Match' : 'Concordance'}</th>
                    <th className="py-3.5 px-4 text-right font-bold">{language === 'en' ? 'Selection & Links' : 'Sélection & Liens'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredMatches.map((m, idx) => {
                    const isSelected = selectedTrades.some((t) => t.trade.id === m.trade.id);
                    const selectionIndex = selectedTrades.findIndex((t) => t.trade.id === m.trade.id);

                    return (
                      <tr key={m.trade.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                          #{idx + 1}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 font-display">
                            {getTradeName(m.trade)}
                          </div>
                          <div className="text-xs text-slate-500 italic flex items-center gap-1.5 flex-wrap">
                            <span>{language === 'en' ? m.trade.nameFr : m.trade.nameEn}</span>
                            <span aria-hidden="true">·</span>
                            <MosidBadge code={m.trade.mosid} className="not-italic text-slate-500 font-normal" />
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-900 font-semibold">
                            <BranchIcon branch={m.trade.branch} inBlack={true} className="w-7 h-5 text-black shrink-0" />
                            <span>{getBranchName(m.trade.branch)}</span>
                            <span className="text-[10px] font-black text-black bg-slate-200 border border-slate-300 px-1 py-0.2 rounded font-mono">
                              {getBranchShortCode(m.trade.branch)}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {getRankName(m.trade.rankCategory)}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <TriadBadge code={m.trade.riasecCode} size="sm" />
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-slate-900">
                              {m.matchScore}%
                            </span>
                            {m.tier === 'dominant' && (
                              <span className="bg-amber-50 text-amber-900 border border-amber-200 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase font-mono">
                                {language === 'en' ? 'Dominant' : 'Dominant'}
                              </span>
                            )}
                          </div>
                          <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                            <div
                              className="bg-[#f1b331] h-full rounded-full"
                              style={{ width: `${m.matchScore}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Toggle selection */}
                            {isSelected ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleToggleSelect(m)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition-colors bg-[#f1b331] text-slate-950 shadow-2xs"
                                  title={language === 'en' ? 'Remove this trade from your selection' : 'Retirer ce métier de votre sélection'}
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>
                                    {isSingleChoiceMode 
                                      ? (language === 'en' ? 'Single Choice ✓' : 'Choix unique ✓') 
                                      : (language === 'en' ? `Choice #${selectionIndex + 1} ✓` : `Choix #${selectionIndex + 1} ✓`)}
                                  </span>
                                </button>
                                {hasCompletedSelection && (
                                  <button
                                    type="button"
                                    onClick={scrollToTopResults}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-lg transition-colors bg-slate-900 text-[#f1b331] hover:bg-black border border-slate-700"
                                    title={language === 'en' ? 'Scroll to top to view your results' : 'Basculer en haut de page pour voir vos résultats'}
                                  >
                                    <ArrowUp className="w-3 h-3 stroke-[3]" />
                                    <span>{language === 'en' ? 'Top ↑' : 'En haut ↑'}</span>
                                  </button>
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={() => handleToggleSelect(m)}
                                disabled={selectedTrades.length >= 3 && !isSingleChoiceMode}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                                  selectedTrades.length >= 3 && !isSingleChoiceMode
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                                    : 'bg-slate-100 hover:bg-[#f1b331] text-slate-800 hover:text-slate-950 border border-slate-300'
                                }`}
                                title={language === 'en' ? 'Add to your 3 choices' : 'Ajouter à vos 3 choix'}
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>
                                  {language === 'en' 
                                    ? `Select (${selectedTrades.length + 1}/3)` 
                                    : `Choisir (${selectedTrades.length + 1}/3)`}
                                </span>
                              </button>
                            )}

                            {/* Choisir seulement ce métier */}
                            <button
                              onClick={() => handleSelectOnlyThis(m)}
                              className={`px-2 py-1 text-xs font-medium rounded-lg border transition-colors ${
                                isSingleChoiceMode && isSelected
                                  ? 'bg-slate-900 text-white border-slate-900'
                                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                              }`}
                              title={language === 'en' ? 'Select only this career and scroll to top' : 'Choisir seulement ce métier et basculer en haut'}
                            >
                              {language === 'en' ? 'Only this trade' : 'Seulement ce métier'}
                            </button>

                            <a
                              href={getTradeForcesUrl(m.trade)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f1b331] hover:bg-[#dfa222] text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-2xs"
                              title={language === 'en' ? 'Open official career page on forces.ca' : 'Ouvrir la page officielle du métier sur forces.ca'}
                            >
                              <span>Forces.ca</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => setSelectedTradeForModal(m.trade)}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg border border-slate-300 transition-colors"
                            >
                              {language === 'en' ? 'Details' : 'Détails'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CARD VIEW : Top 20 en grille 5x4 (5 colonnes × 4 rangées) */}
        {displayMode === 'cards' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredMatches.map((m, idx) => {
              const isCompared = comparedTrade?.id === m.trade.id;
              const isSelected = selectedTrades.some((t) => t.trade.id === m.trade.id);
              const selectionIndex = selectedTrades.findIndex((t) => t.trade.id === m.trade.id);

              return (
                <div
                  key={m.trade.id}
                  className={`bg-white border rounded-2xl p-4 flex flex-col justify-between transition-all hover:border-slate-400 hover:shadow-md ${
                    isSelected
                      ? 'border-[#f1b331] ring-2 ring-[#f1b331] shadow-md bg-amber-50/20'
                      : 'border-slate-300 shadow-2xs'
                  }`}
                >
                  <div>
                    {/* Card Header with Rank Badge #{idx + 1} */}
                    <div className="flex items-center justify-between gap-1.5 mb-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-700 min-w-0">
                        <span className="font-extrabold text-[#c41230] font-mono text-xs bg-red-50 border border-red-200 px-1.5 py-0.5 rounded shadow-2xs shrink-0">
                          #{idx + 1}
                        </span>
                        <BranchIcon branch={m.trade.branch} inBlack={true} className="w-7 h-5 text-black shrink-0" />
                        <span className="font-bold text-slate-900 truncate text-[11px]">{getBranchName(m.trade.branch)}</span>
                        <span className="text-[9px] font-black text-black bg-slate-100 border border-slate-200 px-1 py-0.2 rounded font-mono shrink-0">
                          {getBranchShortCode(m.trade.branch)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {isSelected && (
                          <span className="bg-[#f1b331] text-slate-950 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase font-mono shadow-2xs">
                            {isSingleChoiceMode ? (language === 'en' ? 'Single' : 'Unique') : `#${selectionIndex + 1}`}
                          </span>
                        )}
                        {m.tier === 'dominant' && !isSelected && (
                          <span className="bg-amber-50 text-amber-900 border border-amber-200 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase font-mono">
                            Top
                          </span>
                        )}
                        <div className="flex items-baseline gap-0.5 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[10px]">
                          <span className="text-slate-400 font-normal">Match</span>
                          <strong className="font-bold text-slate-900">
                            {m.matchScore}%
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono mb-1 flex items-center gap-1.5 flex-wrap">
                      <MosidBadge code={m.trade.mosid} className="text-slate-500 font-normal" />
                      <span aria-hidden="true" className="text-slate-400">·</span>
                      <span className="text-slate-700 font-medium">{getRankName(m.trade.rankCategory)}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 font-display leading-tight mb-0.5 line-clamp-2 min-h-[40px]">
                      {getTradeName(m.trade)}
                    </h3>
                    <div className="text-[11px] text-slate-500 italic mb-2 truncate">
                      {language === 'en' ? m.trade.nameFr : m.trade.nameEn}
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-2.5">
                      {getTradeSummary(m.trade)}
                    </p>

                    {/* RIASEC target code */}
                    <div className="bg-slate-50 border border-slate-200 p-2 rounded-lg mb-2.5">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-600 font-mono">
                          {language === 'en' ? 'RIASEC Code:' : 'Code RIASEC :'}
                        </span>
                        <TriadBadge code={m.trade.riasecCode} size="sm" />
                      </div>
                    </div>
                  </div>

                  {/* Card Actions designed for 5-columns width */}
                  <div className="pt-2.5 border-t border-slate-100 flex flex-col gap-1.5">
                    {/* Option 1: Choisir parmi 3 choix */}
                    {isSelected ? (
                      <div className="flex items-center gap-1 w-full">
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(m)}
                          className="flex-1 px-2 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 bg-[#f1b331] text-slate-950 shadow-2xs font-extrabold"
                          title={language === 'en' ? 'Remove this trade from selection' : 'Retirer ce métier de votre sélection'}
                        >
                          <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">
                            {isSingleChoiceMode 
                              ? (language === 'en' ? 'Single Choice · Remove' : 'Choix unique · Retirer') 
                              : (language === 'en' ? `Choice #${selectionIndex + 1} · Remove` : `Choix #${selectionIndex + 1} · Retirer`)}
                          </span>
                        </button>
                        {hasCompletedSelection && (
                          <button
                            type="button"
                            onClick={scrollToTopResults}
                            className="px-2 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 bg-slate-900 text-[#f1b331] hover:bg-black shadow-2xs border border-slate-700 shrink-0"
                            title={language === 'en' ? 'Scroll to top to view results' : 'Basculer en haut de page pour voir vos résultats'}
                          >
                            <ArrowUp className="w-3 h-3 stroke-[3]" />
                            <span>{language === 'en' ? 'Top ↑' : 'Haut ↑'}</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleSelect(m)}
                        disabled={selectedTrades.length >= 3 && !isSingleChoiceMode}
                        className={`w-full px-2 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${
                          selectedTrades.length >= 3 && !isSingleChoiceMode
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                            : 'bg-slate-100 hover:bg-[#f1b331] text-slate-800 hover:text-slate-950 border border-slate-300'
                        }`}
                        title={language === 'en' ? 'Add this trade to your 3 choices and scroll to top' : 'Ajouter ce métier à vos 3 choix pour basculer en haut'}
                      >
                        <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {language === 'en' 
                            ? `Select (${selectedTrades.length + 1}/3)` 
                            : `Choisir (${selectedTrades.length + 1}/3)`}
                        </span>
                      </button>
                    )}

                    {/* Option 2: Choisir seulement ce métier */}
                    <button
                      type="button"
                      onClick={() => handleSelectOnlyThis(m)}
                      className={`w-full px-2 py-1.5 text-[11px] font-medium rounded-lg border transition-colors text-center ${
                        isSingleChoiceMode && isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 hover:text-slate-950'
                      }`}
                      title={language === 'en' ? 'Select only this career and scroll to top' : 'Sélectionner uniquement cette carrière et basculer en haut'}
                    >
                      <span>{language === 'en' ? 'Select only this trade' : 'Choisir seulement ce métier'}</span>
                    </button>

                    {/* Secondary tools: Radar, Fiche, Forces.ca */}
                    <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setComparedTrade(isCompared ? null : m.trade)}
                          className={`px-1.5 py-1 text-[11px] font-medium rounded border transition-colors ${
                            isCompared
                              ? 'bg-amber-50 border-amber-300 text-slate-900 font-semibold'
                              : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                          }`}
                          title={language === 'en' ? 'Compare to Holland radar' : 'Comparer au radar de Holland'}
                        >
                          {isCompared ? 'Radar ✓' : 'Radar'}
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedTradeForModal(m.trade)}
                          className="px-1.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-medium rounded border border-slate-300 transition-colors"
                        >
                          {language === 'en' ? 'Sheet' : 'Fiche'}
                        </button>
                      </div>

                      <a
                        href={getTradeForcesUrl(m.trade)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-black font-semibold hover:underline"
                        title={language === 'en' ? 'Open official Forces.ca page' : 'Ouvrir la page officielle Forces.ca'}
                      >
                        <span>Forces.ca</span>
                        <ExternalLink className="w-3 h-3 text-[#f1b331]" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredMatches.length === 0 && (
          <div className="text-center py-10 bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-3">
            <p className="text-sm text-slate-700 font-medium">
              {filterDominantsOnly
                ? (language === 'en'
                    ? `No dominant trade found for selected filters (${selectedBranch !== 'all' ? getBranchName(selectedBranch) : ''} ${selectedRank !== 'all' ? getRankName(selectedRank) : ''}).`
                    : `Aucun métier dominant trouvé pour les filtres sélectionnés (${selectedBranch !== 'all' ? selectedBranch : ''} ${selectedRank !== 'all' ? selectedRank : ''}).`)
                : (language === 'en'
                    ? 'No trade matches the selected filter criteria.'
                    : 'Aucun métier ne correspond aux critères de filtre choisis.')}
            </p>
            {filterDominantsOnly && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => {
                    setSelectedBranch('all');
                    setSelectedRank('all');
                  }}
                  className="px-3 py-1.5 bg-[#f1b331] hover:bg-[#dfa222] text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-2xs"
                >
                  {language === 'en' 
                    ? `See all dominant trades (${dominantMatches.length})` 
                    : `Voir tous les métiers dominants (${dominantMatches.length})`}
                </button>
                <button
                  onClick={() => setFilterDominantsOnly(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 transition-colors"
                >
                  {language === 'en' 
                    ? 'Show all trades for this branch' 
                    : 'Afficher l’ensemble des métiers pour cet élément'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Recruitment Steps at Forces.ca */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              {language === 'en' 
                ? 'Ready for your Canadian Armed Forces application?' 
                : 'Prêt pour votre candidature aux Forces armées canadiennes ?'}
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {language === 'en'
                ? `Keep your RIASEC assessment (Code ${triad.code}) and present it during your meeting with a recruiter at a Canadian Forces Recruiting Centre (CFRC).`
                : `Conservez votre bilan RIASEC (Code ${triad.code}) et présentez-le lors de votre rencontre avec un conseiller au Centre de recrutement des Forces canadiennes (CFRC).`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={language === 'en' ? "https://forces.ca/en/apply-now/" : "https://forces.ca/fr/postuler/"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#f1b331] hover:bg-[#dfa222] text-slate-950 text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              <span>{language === 'en' ? 'Apply online on Forces.ca' : 'Postuler en ligne sur Forces.ca'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={language === 'en' ? "https://forces.ca/en/find-a-recruiting-centre/#/" : "https://forces.ca/fr/trouvez-un-centre-de-recrutement/#/"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-300 transition-colors"
            >
              <span>{language === 'en' ? 'Find my CFRC' : 'Trouver mon CFRC'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center font-display">
              {language === 'en' ? 'Reset your results?' : 'Réinitialiser vos résultats ?'}
            </h3>
            <p className="text-sm text-slate-600 text-center mt-2 leading-relaxed">
              {language === 'en'
                ? 'This action clears your current answers so you can complete another test at any time and view new results later.'
                : 'Cette action efface vos réponses actuelles afin que vous puissiez compléter un autre test à tout moment et consulter ses nouveaux résultats ultérieurement.'}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="w-full sm:w-auto px-4 py-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-xl border border-slate-300 transition-colors"
              >
                {language === 'en' ? 'Cancel' : 'Annuler'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirm(false);
                  if (onResetTest) {
                    onResetTest();
                  } else {
                    onRetakeTest();
                  }
                }}
                className="w-full sm:w-auto px-4 py-2.5 text-white bg-rose-600 hover:bg-rose-700 text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                {language === 'en' ? 'Yes, reset' : 'Oui, réinitialiser'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Shortcut to Chosen Results at Top */}
      {hasCompletedSelection && (
        <aside
          aria-label={language === 'en' ? 'Shortcut to your trade selection' : 'Raccourci vers votre sélection de métiers'}
          className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300 no-print"
        >
          <button
            type="button"
            onClick={scrollToTopResults}
            className="bg-[#f1b331] hover:bg-[#dfa222] text-slate-950 font-black px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border-2 border-slate-950 hover:scale-105 transition-all text-xs font-mono cursor-pointer"
            title={language === 'en' ? 'Scroll immediately to top to view your selection' : 'Basculer immédiatement en haut de page pour voir votre sélection'}
          >
            <ArrowUp className="w-4 h-4 stroke-[3]" />
            <span>
              {isSingleChoiceMode 
                ? (language === 'en' ? 'View my selected trade at top ↑' : 'Voir mon métier choisi en haut ↑') 
                : (language === 'en' ? 'View my 3 selected trades at top ↑' : 'Voir mes 3 métiers choisis en haut ↑')}
            </span>
          </button>
        </aside>
      )}

      {/* Trade Detail Modal */}
      {selectedTradeForModal && (
        <TradeDetailModal
          trade={selectedTradeForModal}
          userScores={userScores}
          matchScore={allMatches.find((x) => x.trade.id === selectedTradeForModal.id)?.matchScore}
          onClose={() => setSelectedTradeForModal(null)}
        />
      )}
    </div>
  );
};
