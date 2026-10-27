import React, { useState } from 'react';
import { RiasecScores, MatchResult } from '../types/riasec';
import { RIASEC_DIMENSIONS } from '../data/riasecData';
import { getHollandTriad, getHollandConsistency, getDominantMatches, HEXAGON_ORDER } from '../utils/riasecMatching';
import { BranchIcon, getBranchShortCode } from './BranchIcon';
import { MosidBadge } from './MosidBadge';
import { useLanguage } from '../context/LanguageContext';
import { Printer, X, ShieldCheck, CheckSquare, Award, ExternalLink, Sparkles } from 'lucide-react';

interface PrintDossierModalProps {
  userScores: RiasecScores;
  matchedTrades: MatchResult[];
  candidateTrades?: MatchResult[];
  isSingleChoice?: boolean;
  onClose: () => void;
}

export const PrintDossierModal: React.FC<PrintDossierModalProps> = ({
  userScores,
  matchedTrades,
  candidateTrades = [],
  isSingleChoice = false,
  onClose
}) => {
  const { getTradeForcesUrl } = useLanguage();
  const [filterMode, setFilterMode] = useState<'chosen' | 'top20' | 'all'>(
    candidateTrades && candidateTrades.length > 0 ? 'chosen' : 'top20'
  );
  const triad = getHollandTriad(userScores);
  const consistency = getHollandConsistency(triad.letters);
  const dominantMatches = getDominantMatches(matchedTrades, 20);

  const displayedTrades =
    filterMode === 'chosen' && candidateTrades.length > 0
      ? candidateTrades
      : filterMode === 'all'
      ? matchedTrades
      : dominantMatches;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print bg-[#12161a] px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#c41230]" />
            <div>
              <h3 className="font-semibold text-sm">
                Préparation d’Entrevue CFRC & Dossier d’Orientation
              </h3>
              <p className="text-[11px] text-slate-400">
                {displayedTrades.length} métier{displayedTrades.length > 1 ? 's' : ''} inclus dans le dossier
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter modes */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
              {candidateTrades && candidateTrades.length > 0 && (
                <button
                  onClick={() => setFilterMode('chosen')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-colors flex items-center gap-1.5 ${
                    filterMode === 'chosen'
                      ? 'bg-[#f1b331] text-slate-950 shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="Afficher vos métiers choisis selon l'intérêt"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>
                    {isSingleChoice ? 'Mon choix unique' : `Mes 3 choix (${candidateTrades.length})`}
                  </span>
                </button>
              )}
              <button
                onClick={() => setFilterMode('top20')}
                className={`px-2.5 py-1 rounded-md font-bold transition-colors flex items-center gap-1.5 ${
                  filterMode === 'top20'
                    ? 'bg-[#f1b331] text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Afficher l'ensemble des 20 métiers dominants"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Top 20 ({dominantMatches.length})</span>
              </button>
              <button
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filterMode === 'all'
                    ? 'bg-[#f1b331] text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Afficher l'ensemble complet des 110 métiers"
              >
                <span>Tous ({matchedTrades.length})</span>
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f1b331] hover:bg-[#dfa222] text-slate-950 rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="p-8 max-h-[80vh] overflow-y-auto print:p-0 print:max-h-none print:overflow-visible bg-white text-slate-900">
          {/* Header */}
          <div className="border-b-2 border-[#c41230] pb-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-slate-800 font-extrabold uppercase text-xs tracking-wider">
                <span>Forces armées canadiennes · Canadian Armed Forces</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 font-display">
                Fiche d’Évaluation Psychométrique RIASEC & Orientation Opérationnelle
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Rapport d'aide à la décision pour le postulant et le conseiller en recrutement du CFRC
              </p>
            </div>
            <div className="text-right sm:border-l sm:border-slate-300 sm:pl-4">
              <div className="text-xs font-mono uppercase text-slate-500">Code Holland Dominant</div>
              <div className="text-3xl font-black text-[#c41230] font-mono tracking-wider">
                {triad.code}
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                {triad.letters.map((l) => RIASEC_DIMENSIONS[l].nameFr.split(' ')[0]).join(' - ')}
              </div>
            </div>
          </div>

          {/* Section 1: Scores breakdown */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 font-mono border-b border-slate-200 pb-1">
              1. Répartition des dimensions RIASEC du candidat (Modèle de John Holland)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {HEXAGON_ORDER.map((dim) => {
                const info = RIASEC_DIMENSIONS[dim];
                const score = userScores[dim] || 0;
                const isDominant = triad.letters.includes(dim);
                return (
                  <div
                    key={dim}
                    className={`p-2.5 rounded-lg border text-center ${
                      isDominant
                        ? 'border-[#c41230] bg-red-50 font-semibold'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-xs text-slate-500 uppercase font-mono">{info.letter}</div>
                    <div className="text-lg font-bold font-mono text-slate-900">{score}%</div>
                    <div className="text-[10px] text-slate-600 truncate">{info.nameFr.split(' ')[0]}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <strong>Cohérence du profil : </strong> {consistency.label}. {consistency.explanation}
            </div>
          </div>

          {/* Section 2: Matched CAF Trades with official forces.ca links */}
          <div className="mb-6">
            <div className="border-b border-slate-200 pb-2 mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                2.{' '}
                {filterMode === 'chosen'
                  ? isSingleChoice
                    ? `Métier choisi selon l'intérêt par le candidat (Candidature exclusive)`
                    : `3 Métiers choisis selon l'intérêt par le candidat (Trio officiel CFRC)`
                  : filterMode === 'all'
                  ? `Ensemble des métiers militaires évalués (${displayedTrades.length})`
                  : `Ensemble des 20 métiers dominants recommandés (${displayedTrades.length})`}
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">
                {filterMode === 'chosen'
                  ? 'Sélection prioritaire pour le dossier de candidature et entrevue CFRC'
                  : `Classés par ordre de concordance avec votre code ${triad.code}`}
              </span>
            </div>

            <div className="space-y-3">
              {displayedTrades.map((m, idx) => (
                <div
                  key={m.trade.id}
                  className="border border-slate-300 rounded-lg p-3 bg-white print:break-inside-avoid shadow-2xs"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#c41230] text-sm font-mono">#{idx + 1}</span>
                        <h3 className="font-bold text-slate-900 text-base">
                          {m.trade.nameFr}
                        </h3>
                        <span className="text-xs text-slate-500 font-mono">({m.trade.nameEn})</span>
                        {m.tier === 'dominant' && (
                          <span className="text-[10px] font-bold uppercase font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-950 border border-amber-300">
                            ★ Dominant
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-slate-900 font-semibold">
                          <BranchIcon branch={m.trade.branch} inBlack={true} className="w-7 h-5 text-black shrink-0" />
                          <span>Élément : <strong>{m.trade.branch} ({getBranchShortCode(m.trade.branch)})</strong></span>
                        </span>
                        <span>·</span>
                        <MosidBadge code={m.trade.mosid} className="text-slate-700" />
                        <span>·</span>
                        <span>Rang : <strong>{m.trade.rankCategory}</strong></span>
                        <span>·</span>
                        <span>Cible RIASEC : <strong className="text-[#c41230]">{m.trade.riasecCode}</strong></span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold font-mono text-emerald-700">
                        {m.matchScore}% de concordance
                      </div>
                      <a
                        href={m.trade.forcesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-slate-600 hover:text-black font-mono mt-0.5 block hover:underline"
                      >
                        {m.trade.forcesUrl}
                      </a>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                    {m.trade.summary}
                  </p>
                  <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                    <strong>Pourquoi ce profil convient : </strong> {m.trade.whyFitNote}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Next steps at CFRC */}
          <div className="border-t border-slate-200 pt-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 font-mono">
              3. Démarche d’enrôlement au Centre de Recrutement (CFRC)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-[#c41230]" />
                  Étapes officielles de recrutement
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  <li>Formulaire en ligne sur forces.ca/fr/postuler/</li>
                  <li>Test d’aptitude des Forces canadiennes (TAFC / CFAT)</li>
                  <li>Évaluation médicale et test physique d'aptitude FORCE</li>
                  <li>Entrevue individuelle avec le conseiller en recrutement militaire</li>
                  <li>Offre d’emploi et cérémonie solennelle d’enrôlement</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#c41230]" />
                  Points clés pour l'entrevue
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Mentionnez que votre profil d’intérêts professionnels a été évalué selon la typologie de John Holland (Code <strong>{triad.code}</strong>), en illustrant vos compétences concrètes par des réalisations vécues (scolaires, sportives ou bénévoles).
                </p>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-3 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between items-center">
            <span>Généré par la plateforme FAC RIASEC Orientation · Groupes Professionnels Militaires (GPM) des FAC</span>
            <span>Site officiel : forces.ca</span>
          </div>
        </div>
      </div>
    </div>
  );
};
