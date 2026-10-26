import React from 'react';
import { MilitaryTrade, RiasecScores, RiasecDimension } from '../types/riasec';
import { RIASEC_DIMENSIONS } from '../data/riasecData';
import { RiasecRadarChart } from './RiasecRadarChart';
import { BranchIcon, getBranchShortCode } from './BranchIcon';
import { useLanguage } from '../context/LanguageContext';
import { 
  X, 
  Shield, 
  MapPin, 
  GraduationCap, 
  Compass, 
  CheckCircle2, 
  Activity, 
  ExternalLink 
} from 'lucide-react';

interface TradeDetailModalProps {
  trade: MilitaryTrade | null;
  userScores: RiasecScores;
  matchScore?: number;
  onClose: () => void;
}

export const TradeDetailModal: React.FC<TradeDetailModalProps> = ({
  trade,
  userScores,
  matchScore,
  onClose
}) => {
  const { 
    language, 
    t, 
    getBranchName, 
    getRankName, 
    getEducationName, 
    getPhysicalDemandName, 
    getDeploymentTypeName, 
    getTradeForcesUrl, 
    getTradeName, 
    getTradeSummary, 
    getTradeResponsibilities, 
    getTradeWhyFit, 
    getTradeEnvironment, 
    getTradeTraining 
  } = useLanguage();

  if (!trade) return null;

  const triadLetters = trade.riasecCode.split('-') as RiasecDimension[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white border border-slate-300 rounded-2xl shadow-xl overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Bar */}
        <div className="relative bg-slate-50 border-b border-slate-200 p-6">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            aria-label={t('closeBtn')}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-700 uppercase tracking-wider mb-1.5 flex-wrap">
            <span className="flex items-center gap-1.5 font-bold text-slate-950">
              <BranchIcon branch={trade.branch} inBlack={true} className="w-7 h-5 text-black shrink-0" />
              <span>{getBranchName(trade.branch)}</span>
              <span className="text-[10px] font-black text-black bg-slate-200 border border-slate-300 px-1.5 py-0.5 rounded font-mono">
                {getBranchShortCode(trade.branch)}
              </span>
            </span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="font-semibold text-slate-600">MOSID {trade.mosid}</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="text-slate-600">{getRankName(trade.rankCategory)}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-display tracking-tight">
                {getTradeName(trade)}
              </h2>
              <p className="text-sm text-slate-500 italic">
                {language === 'en' ? trade.nameFr : trade.nameEn}
              </p>
            </div>

            {matchScore !== undefined && (
              <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-2xs">
                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">{t('matchTh')}</div>
                  <div className={`text-2xl font-bold font-mono ${
                    matchScore >= 85 ? 'text-emerald-700' : matchScore >= 70 ? 'text-cyan-700' : 'text-amber-700'
                  }`}>
                    {matchScore}%
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Summary */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-700 text-sm leading-relaxed">
            {getTradeSummary(trade)}
          </div>

          {/* Triad & Radar Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-50/80 border border-slate-200 p-5 rounded-xl">
            <div>
              <div className="text-xs uppercase font-mono tracking-wider text-slate-500 mb-1 font-semibold">
                {language === 'en' ? 'Ideal RIASEC Profile for this Occupation' : 'Profil RIASEC Idéal pour ce métier'}
              </div>
              <div className="text-xl font-bold text-slate-900 font-mono flex items-center gap-2 mb-4">
                {language === 'en' ? 'Holland Code:' : 'Code Holland :'} <span className="bg-[#f1b331] text-slate-950 px-2 py-0.5 rounded tracking-wider font-extrabold">{trade.riasecCode}</span>
              </div>

              <div className="space-y-2.5">
                {triadLetters.map((dim, idx) => {
                  const info = RIASEC_DIMENSIONS[dim];
                  const userVal = userScores[dim] || 0;
                  const idealVal = trade.idealScores[dim] || 0;
                  const dimName = language === 'en' ? info.nameEn : info.nameFr;
                  return (
                    <div key={dim} className="bg-white border border-slate-200 p-2.5 rounded-lg shadow-2xs">
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-semibold text-slate-800">
                          {idx + 1}. {dimName} ({dim})
                        </span>
                        <div className="flex items-center gap-2 text-slate-500 font-mono">
                          <span>{language === 'en' ? 'You:' : 'Vous :'} <strong className="text-slate-900">{userVal}%</strong></span>
                          <span>·</span>
                          <span>{language === 'en' ? 'Target:' : 'Cible :'} <strong className="text-[#0284c7]">{idealVal}%</strong></span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
                        <div 
                          className="bg-[#f1b331] h-full"
                          style={{ width: `${userVal}%` }}
                          title={`Score: ${userVal}%`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 text-xs text-slate-600 leading-normal">
                <strong className="text-slate-800">{language === 'en' ? 'Fit Analysis:' : 'Analyse d’adéquation :'} </strong>
                {getTradeWhyFit(trade)}
              </div>
            </div>

            {/* Radar Comparison Chart */}
            <div className="flex flex-col items-center justify-center pt-2">
              <RiasecRadarChart
                userScores={userScores}
                comparisonScores={trade.idealScores}
                comparisonLabel={getTradeName(trade)}
                size={270}
              />
            </div>
          </div>

          {/* Operational Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-semibold">
                <Compass className="w-4 h-4 text-[#c41230]" />
                {language === 'en' ? 'Operational Environment' : 'Environnement d’opération'}
              </div>
              <p className="text-sm text-slate-900 font-medium">
                {getTradeEnvironment(trade)}
              </p>
              <div className="mt-2 text-xs text-slate-600">
                {language === 'en' ? 'Type:' : 'Type :'} <span className="text-slate-800">{getDeploymentTypeName(trade.deploymentType)}</span> · {language === 'en' ? 'Physical Demand:' : 'Exigence physique :'} <span className="text-slate-800">{getPhysicalDemandName(trade.physicalDemand)}</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-semibold">
                <MapPin className="w-4 h-4 text-[#c41230]" />
                {language === 'en' ? 'Training & Bases' : 'Formation & Garnisons'}
              </div>
              <p className="text-sm text-slate-900 font-medium">
                {getTradeTraining(trade)}
              </p>
              <div className="mt-2 text-xs text-slate-600 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                {language === 'en' ? 'Minimum Education:' : 'Scolarité minimale :'} <span className="text-slate-800">{getEducationName(trade.educationLevel)}</span>
              </div>
            </div>
          </div>

          {/* Key Responsibilities */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#c41230]" />
              {language === 'en' ? 'Daily Missions & Responsibilities' : 'Missions quotidiennes et responsabilités'}
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {getTradeResponsibilities(trade).map((resp, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions: DIRECT FORCES.CA LINK */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-mono">
            {language === 'en' ? 'Source: Military Occupational Structure (MOS) - Forces.ca' : 'Source : Structure des Groupes Professionnels Militaires (GPM) - Forces.ca'}
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={getTradeForcesUrl(trade)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#f1b331] hover:bg-[#dfa222] text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              <span>{t('accessForcesPage')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
            >
              {t('closeBtn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
