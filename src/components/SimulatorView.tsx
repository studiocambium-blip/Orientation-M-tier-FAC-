import React, { useState } from 'react';
import { RiasecScores, RiasecDimension, MilitaryTrade } from '../types/riasec';
import { MILITARY_TRADES } from '../data/militaryTrades';
import { RIASEC_DIMENSIONS } from '../data/riasecData';
import { useLanguage } from '../context/LanguageContext';
import { 
  computeTradeMatches, 
  getHollandTriad, 
  getDominantMatches,
  HEXAGON_ORDER 
} from '../utils/riasecMatching';
import { RiasecRadarChart } from './RiasecRadarChart';
import { TradeDetailModal } from './TradeDetailModal';
import { BranchIcon, getBranchShortCode } from './BranchIcon';
import { 
  Sliders, 
  RotateCcw, 
  TrendingUp,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface SimulatorViewProps {
  initialScores?: RiasecScores;
  onApplyScoresToProfile?: (scores: RiasecScores) => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({
  initialScores,
  onApplyScoresToProfile
}) => {
  const { 
    language, 
    t, 
    getBranchName, 
    getTradeForcesUrl, 
    getTradeName, 
    getTradeSummary 
  } = useLanguage();
  const defaultScores: RiasecScores = initialScores || {
    R: 75,
    I: 60,
    A: 30,
    S: 50,
    E: 70,
    C: 65
  };

  const [scores, setScores] = useState<RiasecScores>(defaultScores);
  const [selectedTradeForModal, setSelectedTradeForModal] = useState<MilitaryTrade | null>(null);
  const [selectedTradeForProfileCopy, setSelectedTradeForProfileCopy] = useState<string>('');
  const [filterDominantsOnly, setFilterDominantsOnly] = useState<boolean>(true);

  const triad = getHollandTriad(scores);
  const matches = computeTradeMatches(scores, MILITARY_TRADES);
  const dominantMatches = getDominantMatches(matches);
  const displayedMatches = filterDominantsOnly ? dominantMatches : matches;

  const handleSliderChange = (dim: RiasecDimension, val: number) => {
    setScores((prev) => ({
      ...prev,
      [dim]: val
    }));
  };

  const handleResetToDefault = () => {
    setScores({
      R: 50,
      I: 50,
      A: 50,
      S: 50,
      E: 50,
      C: 50
    });
  };

  const handleLoadTradeIdealScores = (tradeId: string) => {
    const trade = MILITARY_TRADES.find((t) => t.id === tradeId);
    if (trade) {
      setScores({ ...trade.idealScores });
      setSelectedTradeForProfileCopy(tradeId);
    }
  };

  const PRESETS = [
    {
      label: 'Soldat d’infanterie',
      triad: 'R-E-S',
      scores: { R: 95, I: 40, A: 20, S: 65, E: 75, C: 55 }
    },
    {
      label: 'Pilote militaire',
      triad: 'R-I-E',
      scores: { R: 92, I: 85, A: 25, S: 45, E: 90, C: 75 }
    },
    {
      label: 'Opérateur cybernétique',
      triad: 'I-C-R',
      scores: { R: 60, I: 98, A: 30, S: 30, E: 55, C: 92 }
    },
    {
      label: 'Technicien médical',
      triad: 'S-I-R',
      scores: { R: 78, I: 85, A: 20, S: 96, E: 60, C: 70 }
    },
    {
      label: 'Officier de guerre navale',
      triad: 'E-R-I',
      scores: { R: 85, I: 80, A: 20, S: 55, E: 95, C: 78 }
    },
    {
      label: 'Officier de la logistique',
      triad: 'E-C-S',
      scores: { R: 50, I: 70, A: 20, S: 65, E: 92, C: 88 }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-800 mb-1 font-bold">
              <Sliders className="w-4 h-4 text-slate-900" />
              <span>{language === 'en' ? 'Dynamic Career Simulator & Advisor Mode' : 'Simulateur d’Orientation Dynamique & Mode Conseiller'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              {language === 'en' ? 'RIASEC Scores Simulator · Canadian Armed Forces' : 'Simulateur de Scores RIASEC · Forces armées canadiennes'}
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
              {language === 'en'
                ? 'Adjust sliders to observe recommended occupations live, or select an official occupation on forces.ca to discover the required score profile.'
                : 'Déplacez les curseurs pour observer en direct les métiers recommandés, ou sélectionnez un métier officiel sur forces.ca pour découvrir le profil de scores requis.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={handleResetToDefault}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Reset (50%)' : 'Réinitialiser (50%)'}</span>
            </button>
            {onApplyScoresToProfile && (
              <button
                onClick={() => onApplyScoresToProfile(scores)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#f1b331] hover:bg-[#dfa222] text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <span>{language === 'en' ? 'Apply to My Profile' : 'Appliquer à mon profil'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Reverse lookup dropdown */}
        <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold shrink-0">
            {language === 'en' ? 'Reverse lookup by occupation:' : 'Recherche inversée par métier :'}
          </span>
          <select
            value={selectedTradeForProfileCopy}
            onChange={(e) => handleLoadTradeIdealScores(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#f1b331] focus:outline-none w-full sm:max-w-md font-medium"
          >
            <option value="">{language === 'en' ? '-- Choose an occupation to load target scores --' : '-- Choisir un métier pour charger ses scores cibles --'}</option>
            {MILITARY_TRADES.map((t) => (
              <option key={t.id} value={t.id}>
                {getTradeName(t)} (MOSID {t.mosid} · Code : {t.riasecCode})
              </option>
            ))}
          </select>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setScores({ ...p.scores })}
                className="px-2.5 py-1 text-[11px] font-bold bg-white hover:bg-slate-100 text-slate-800 rounded-lg border border-slate-300 transition-colors shadow-2xs"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sliders & Live Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sliders (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                {language === 'en' ? '6 RIASEC Dimension Sliders' : 'Curseurs des 6 Dimensions RIASEC'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'en' ? 'Adjust scores from 0 to 100%' : 'Modifiez les scores de 0 à 100%'}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 font-mono text-xs">
              <span className="text-slate-500">{language === 'en' ? 'Active Triad:' : 'Triade active :'}</span>
              <strong className="text-slate-950 font-bold tracking-wider bg-[#f1b331] px-1.5 py-0.5 rounded">{triad.code}</strong>
            </div>
          </div>

          <div className="space-y-5">
            {HEXAGON_ORDER.map((dim) => {
              const info = RIASEC_DIMENSIONS[dim];
              const val = scores[dim];
              const isDominant = triad.letters.includes(dim);
              const dimName = language === 'en' ? info.nameEn : info.nameFr;
              const traits = language === 'en' && info.typicalTraitsEn ? info.typicalTraitsEn.slice(0, 2).join(', ') : info.typicalTraits.slice(0, 2).join(', ');
              const keyword = language === 'en' && info.militaryKeywordsEn ? info.militaryKeywordsEn[0] : info.militaryKeywords[0];

              return (
                <div key={dim} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full inline-block"
                        style={{ backgroundColor: info.color }}
                      />
                      <span className="font-bold text-slate-900">
                        {dim} · {dimName}
                      </span>
                      {isDominant && (
                        <span className="text-[10px] uppercase font-mono font-bold text-slate-950 bg-[#f1b331] px-1.5 py-0.5 rounded">
                          {language === 'en' ? 'Dominant' : 'Dominant'}
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {val}%
                    </span>
                  </div>

                  <div className="relative flex items-center">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={val}
                      onChange={(e) => handleSliderChange(dim, parseInt(e.target.value, 10))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#f1b331] focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
                    <span>{traits}</span>
                    <span>{language === 'en' ? 'CAF Application:' : 'Application FAC :'} {keyword}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Radar (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[460px] shadow-sm">
          <div className="w-full text-center">
            <h2 className="text-base font-bold text-slate-900 font-display">
              {language === 'en' ? 'Simulated Psychometric Profile' : 'Empreinte Psychométrique Simulée'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'en' ? 'Holland Code:' : 'Code de Holland :'} <strong className="text-slate-950 bg-[#f1b331] px-1.5 py-0.5 rounded font-mono">{triad.code}</strong>
            </p>
          </div>

          <div className="my-auto py-2">
            <RiasecRadarChart
              userScores={scores}
              size={300}
            />
          </div>

          <div className="w-full text-center text-xs text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-xl">
            <strong className="text-slate-900">{language === 'en' ? 'Interpretation:' : 'Interprétation :'} </strong>
            {language === 'en' ? 'This profile primarily seeks roles combining ' : 'Ce profil recherche principalement des rôles combinant '}
            <span className="text-slate-900 font-bold">
              {triad.letters.map((l) => (language === 'en' ? RIASEC_DIMENSIONS[l].nameEn.split(' ')[0] : RIASEC_DIMENSIONS[l].nameFr.split(' ')[0])).join(', ')}
            </span>.
          </div>
        </div>
      </div>

      {/* Re-ranked Trades List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-mono font-bold text-xs ${
                filterDominantsOnly 
                  ? 'bg-amber-100 text-amber-950 border border-amber-300' 
                  : 'bg-slate-200 text-slate-800 border border-slate-300'
              }`}>
                {filterDominantsOnly && <Sparkles className="w-3 h-3 text-amber-700" />}
                <span>
                  {filterDominantsOnly 
                    ? (language === 'en' 
                        ? `${displayedMatches.length} Dominant Occupation${displayedMatches.length > 1 ? 's' : ''}` 
                        : `${displayedMatches.length} Métier${displayedMatches.length > 1 ? 's' : ''} Dominant${displayedMatches.length > 1 ? 's' : ''}`)
                    : (language === 'en'
                        ? `${displayedMatches.length} Total Occupation${displayedMatches.length > 1 ? 's' : ''}`
                        : `${displayedMatches.length} Métier${displayedMatches.length > 1 ? 's' : ''} au Total`)}
                </span>
              </span>
            </div>
            <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              {filterDominantsOnly
                ? (language === 'en' ? `Top 10 Live Occupations (${displayedMatches.length})` : `Top 10 des métiers en direct (${displayedMatches.length})`)
                : (language === 'en' ? `All Live Occupations Ranking (${displayedMatches.length})` : `Classement de tous les métiers en direct (${displayedMatches.length})`)}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {filterDominantsOnly
                ? (language === 'en' 
                    ? `Displaying the 10 occupations with the highest affinity to your current sliders (${triad.code}).`
                    : `Affichage des 10 métiers présentant la plus forte adéquation avec vos curseurs actuels (${triad.code}).`)
                : (language === 'en' ? `Direct access to official forces.ca pages` : `Accès direct aux pages officielles de forces.ca`)}
            </p>
          </div>

          {/* Toggle Top 10 / Tous */}
          <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-300 shadow-2xs text-xs">
            <button
              onClick={() => setFilterDominantsOnly(true)}
              className={`px-3 py-1.5 rounded-md font-bold transition-colors flex items-center gap-1.5 ${
                filterDominantsOnly
                  ? 'bg-[#f1b331] text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Top 10 ({dominantMatches.length})</span>
            </button>
            <button
              onClick={() => setFilterDominantsOnly(false)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                !filterDominantsOnly
                  ? 'bg-[#f1b331] text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{language === 'en' ? `All (${matches.length})` : `Tous (${matches.length})`}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedMatches.map((m, idx) => (
            <div
              key={m.trade.id}
              className={`bg-white border rounded-2xl p-4 flex flex-col justify-between transition-all hover:border-slate-400 shadow-sm ${
                idx === 0
                  ? 'border-[#f1b331] ring-2 ring-[#f1b331]/30'
                  : 'border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-700 min-w-0">
                    <BranchIcon branch={m.trade.branch} inBlack={true} className="w-7 h-5 text-black shrink-0" />
                    <span className="font-bold text-slate-900 truncate">{getBranchName(m.trade.branch)}</span>
                    <span className="text-[9px] font-black text-black bg-slate-100 border border-slate-200 px-1 py-0.2 rounded font-mono shrink-0">
                      {getBranchShortCode(m.trade.branch)}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-500 shrink-0 text-[10px]">MOSID {m.trade.mosid}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {m.tier === 'dominant' && (
                      <span className="bg-amber-50 text-amber-900 border border-amber-200 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase font-mono">
                        Dominant
                      </span>
                    )}
                    <div className="flex items-baseline gap-0.5 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[10px]">
                      <span className="text-slate-400 font-normal">Score</span>
                      <strong className="font-bold text-slate-900">
                        {m.matchScore}%
                      </strong>
                    </div>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base font-display">
                  {getTradeName(m.trade)}
                </h3>
                <p className="text-xs text-slate-500 italic mb-2">
                  {language === 'en' ? m.trade.nameFr : m.trade.nameEn}
                </p>

                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs mb-3 flex items-center justify-between">
                  <span className="text-slate-500 font-mono">Profil RIASEC cible :</span>
                  <span className="text-slate-950 font-bold font-mono bg-[#f1b331] px-1.5 py-0.5 rounded">{m.trade.riasecCode}</span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {getTradeSummary(m.trade)}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                <button
                  onClick={() => setSelectedTradeForModal(m.trade)}
                  className="text-xs text-slate-600 hover:text-slate-900 font-medium"
                >
                  Fiche détaillée
                </button>

                <a
                  href={getTradeForcesUrl(m.trade)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f1b331] hover:bg-[#dfa222] text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-2xs"
                >
                  <span>Forces.ca</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trade Modal */}
      {selectedTradeForModal && (
        <TradeDetailModal
          trade={selectedTradeForModal}
          userScores={scores}
          matchScore={matches.find((x) => x.trade.id === selectedTradeForModal.id)?.matchScore}
          onClose={() => setSelectedTradeForModal(null)}
        />
      )}
    </div>
  );
};
