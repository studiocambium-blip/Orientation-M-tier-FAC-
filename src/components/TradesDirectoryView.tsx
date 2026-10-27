import React, { useState, useMemo } from 'react';
import { MilitaryTrade, RiasecScores, MilitaryBranch } from '../types/riasec';
import { MILITARY_TRADES } from '../data/militaryTrades';
import { TradeDetailModal } from './TradeDetailModal';
import { BranchIcon, getBranchShortCode } from './BranchIcon';
import { MosidBadge } from './MosidBadge';
import { TriadBadge } from './TriadBadge';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, 
  Shield, 
  ExternalLink,
  GraduationCap, 
  Compass
} from 'lucide-react';

interface TradesDirectoryViewProps {
  userScores?: RiasecScores | null;
}

export const TradesDirectoryView: React.FC<TradesDirectoryViewProps> = ({
  userScores
}) => {
  const { 
    language, 
    t, 
    getBranchName, 
    getRankName, 
    getEducationName, 
    getTradeForcesUrl, 
    getTradeName, 
    getTradeSummary, 
    getTradeEnvironment 
  } = useLanguage();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedRank, setSelectedRank] = useState<string>('all');
  const [selectedDimension, setSelectedDimension] = useState<string>('all');
  const [selectedTradeForModal, setSelectedTradeForModal] = useState<MilitaryTrade | null>(null);

  const filteredTrades = useMemo(() => {
    return MILITARY_TRADES.filter((trade) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = trade.nameFr.toLowerCase().includes(query);
        const matchesEn = trade.nameEn.toLowerCase().includes(query);
        const matchesMosid = trade.mosid.includes(query);
        const matchesSummary = trade.summary.toLowerCase().includes(query);
        const matchesEnv = trade.operationalEnvironment.toLowerCase().includes(query);
        if (!matchesName && !matchesEn && !matchesMosid && !matchesSummary && !matchesEnv) {
          return false;
        }
      }

      if (selectedBranch !== 'all' && trade.branch !== selectedBranch) {
        return false;
      }

      if (selectedRank !== 'all' && trade.rankCategory !== selectedRank) {
        return false;
      }

      if (selectedDimension !== 'all') {
        const firstLetter = trade.riasecCode.split('-')[0];
        if (firstLetter !== selectedDimension) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedBranch, selectedRank, selectedDimension]);

  const getBranchIcon = (branch: MilitaryBranch | string) => {
    return <BranchIcon branch={branch} inBlack={true} className="w-7 h-5 text-black shrink-0" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white">
      {/* Directory Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-700 mb-1 font-bold">
          <Shield className="w-4 h-4" />
          <span>
            {language === 'en' ? 'Official Career Directory' : 'Répertoire Officiel des Carrières'}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {language === 'en' 
              ? `${MILITARY_TRADES.length} Listed Occupations` 
              : `${MILITARY_TRADES.length} Métiers Répertoriés`}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
          {language === 'en' 
            ? 'Canadian Armed Forces Occupations Directory' 
            : 'Répertoire des Métiers des Forces armées canadiennes'}
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          {language === 'en' ? (
            <>
              Explore all official military careers (MOSID), their target RIASEC psychometric profiles, and access official pages directly on <strong>forces.ca</strong>.
            </>
          ) : (
            <>
              Consultez l'ensemble des carrières militaires officielles (GPM / MOSID), leurs profils psychométriques RIASEC cibles et accédez directement aux pages officielles sur <strong>forces.ca</strong>.
            </>
          )}
        </p>

        {/* Search Bar & Multi-Filters */}
        <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'en'
                  ? "Search by career name, MOSID code (e.g. 00010), keyword (e.g. pilot, armour, health, cyber)..."
                  : "Rechercher par nom de métier, code MOSID (ex : 00010), mot-clé (ex : pilote, blindé, santé, cyber)..."
              }
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f1b331] focus:border-transparent transition-all"
            />
          </div>

          {/* Filter bars */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Branch selector */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-lg text-xs shadow-2xs">
              <span className="text-slate-500 px-2 font-mono text-[11px] font-semibold">
                {language === 'en' ? 'Branch:' : 'Élément :'}
              </span>
              {['all', 'Armée canadienne', 'Aviation royale canadienne', 'Marine royale canadienne', 'Services interarmées'].map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBranch(b)}
                  className={`px-2.5 py-1 rounded-md font-bold transition-colors flex items-center gap-1.5 ${
                    selectedBranch === b ? 'bg-[#f1b331] text-slate-950 shadow-xs' : 'text-slate-700 hover:text-slate-950 bg-white/60'
                  }`}
                >
                  {b !== 'all' && <BranchIcon branch={b} inBlack={true} className="w-7 h-5 text-black shrink-0" />}
                  <span>
                    {b === 'all'
                      ? (language === 'en' ? 'All Branches' : 'Tous les éléments')
                      : b === 'Armée canadienne'
                      ? (language === 'en' ? 'Army (ARMY)' : 'Armée (ARMY)')
                      : b === 'Aviation royale canadienne'
                      ? (language === 'en' ? 'Air Force (AIR)' : 'Aviation (AIR)')
                      : b === 'Marine royale canadienne'
                      ? (language === 'en' ? 'Navy (NAVY)' : 'Marine (NAVY)')
                      : (language === 'en' ? 'Joint Services' : 'Interarmées')}
                  </span>
                </button>
              ))}
            </div>

            {/* Rank Category */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg text-xs shadow-2xs">
              <span className="text-slate-500 px-2 font-mono text-[11px] font-semibold">
                {language === 'en' ? 'Rank:' : 'Grade :'}
              </span>
              {['all', 'Membre du rang (MDR)', 'Officier'].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRank(r)}
                  className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                    selectedRank === r ? 'bg-[#f1b331] text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r === 'all'
                    ? (language === 'en' ? 'All' : 'Tous')
                    : getRankName(r)}
                </button>
              ))}
            </div>

            {/* RIASEC Dominant letter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg text-xs shadow-2xs">
              <span className="text-slate-500 px-2 font-mono text-[11px] font-semibold">
                {language === 'en' ? 'Domain:' : 'Pôle :'}
              </span>
              {['all', 'R', 'I', 'A', 'S', 'E', 'C'].map((dim) => (
                <button
                  key={dim}
                  onClick={() => setSelectedDimension(dim)}
                  className={`px-2 py-1 rounded-md font-mono font-bold transition-colors ${
                    selectedDimension === dim ? 'bg-[#f1b331] text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {dim === 'all' ? (language === 'en' ? 'All' : 'Tous') : dim}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trades Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs font-mono text-slate-200 font-semibold">
          <span>{filteredTrades.length} {language === 'en' ? 'occupation(s) found' : 'métier(s) trouvé(s)'}</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-950 bg-[#f1b331] px-2 py-0.5 rounded font-bold hover:underline"
            >
              {language === 'en' ? 'Clear Search' : 'Effacer la recherche'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTrades.map((trade) => {
            return (
              <div
                key={trade.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-400 transition-all shadow-2xs group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5 min-h-[28px]">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-slate-800 flex-1 min-w-0">
                      <BranchIcon branch={trade.branch} inBlack={true} className="w-7 h-5 text-black shrink-0" />
                      <span className="font-bold text-slate-900 truncate">{getBranchName(trade.branch)}</span>
                      <span className="text-[10px] font-black text-black bg-slate-200 border border-slate-300 px-1.5 py-0.5 rounded font-mono shrink-0">
                        {getBranchShortCode(trade.branch)}
                      </span>
                      <span aria-hidden="true" className="text-slate-400 shrink-0">·</span>
                      <MosidBadge code={trade.mosid} className="text-slate-500 shrink-0" />
                    </div>

                    <TriadBadge code={trade.riasecCode} className="shrink-0" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 font-display group-hover:text-amber-600 transition-colors">
                    {getTradeName(trade)}
                  </h3>
                  <div className="text-xs text-slate-500 italic mb-3">
                    {language === 'en' ? trade.nameFr : trade.nameEn} · <span className="text-slate-700 not-italic font-medium">{getRankName(trade.rankCategory)}</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {getTradeSummary(trade)}
                  </p>

                  <div className="space-y-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-500 font-mono">
                    <div className="flex items-center gap-1.5 truncate">
                      <Compass className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{getTradeEnvironment(trade)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{getEducationName(trade.educationLevel)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedTradeForModal(trade)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    {language === 'en' ? 'Details' : 'Fiche détaillée'}
                  </button>

                  <a
                    href={getTradeForcesUrl(trade)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f1b331] hover:bg-[#dfa222] text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-2xs"
                  >
                    <span>Forces.ca</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTrades.length === 0 && (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <p className="text-base text-slate-700 font-medium">
              {language === 'en' ? 'No military occupations match your search criteria.' : 'Aucun métier ne correspond à vos critères.'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'en' ? 'Broaden your filters or modify your search keyword.' : 'Élargissez vos filtres ou modifiez votre mot-clé de recherche.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedTradeForModal && (
        <TradeDetailModal
          trade={selectedTradeForModal}
          userScores={userScores || { R: 50, I: 50, A: 50, S: 50, E: 50, C: 50 }}
          onClose={() => setSelectedTradeForModal(null)}
        />
      )}
    </div>
  );
};
