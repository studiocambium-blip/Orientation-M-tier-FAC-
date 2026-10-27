import React, { useState } from 'react';
import { RIASEC_DIMENSIONS } from '../data/riasecData';
import { useLanguage } from '../context/LanguageContext';
import { RiasecDimension } from '../types/riasec';

interface TriadBadgeProps {
  code: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const DIMENSION_COLORS: Record<RiasecDimension, { bg: string; text: string; border: string }> = {
  R: { bg: 'bg-red-600', text: 'text-white', border: 'border-red-500' },
  I: { bg: 'bg-sky-600', text: 'text-white', border: 'border-sky-500' },
  A: { bg: 'bg-purple-600', text: 'text-white', border: 'border-purple-500' },
  S: { bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-500' },
  E: { bg: 'bg-amber-600', text: 'text-white', border: 'border-amber-500' },
  C: { bg: 'bg-slate-600', text: 'text-white', border: 'border-slate-500' },
};

export const TriadBadge: React.FC<TriadBadgeProps> = ({
  code,
  className = '',
  size = 'md',
  showLabel = false
}) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const letters = (code || '')
    .split('-')
    .map((l) => l.trim().toUpperCase())
    .filter((l) => ['R', 'I', 'A', 'S', 'E', 'C'].includes(l)) as RiasecDimension[];

  const sizeClasses = {
    sm: 'text-[11px] min-w-[58px] py-0.5 px-1.5',
    md: 'text-xs min-w-[68px] py-0.5 px-2',
    lg: 'text-sm min-w-[80px] py-1 px-2.5'
  }[size];

  const getRankLabel = (index: number) => {
    if (language === 'en') {
      if (index === 0) return 'Primary (Dominant)';
      if (index === 1) return 'Secondary (Support)';
      return 'Tertiary (Complementary)';
    }
    if (index === 0) return '1er pôle dominant';
    if (index === 1) return '2e pôle d’appui';
    return '3e pôle complémentaire';
  };

  return (
    <div
      className={`group/triad relative inline-flex items-center cursor-help ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
      }}
    >
      {showLabel && (
        <span className="text-[11px] text-slate-500 font-mono mr-1.5">
          {language === 'en' ? 'Holland Triad:' : 'Triade Holland :'}
        </span>
      )}

      {/* Uniform badge container */}
      <span
        className={`inline-flex items-center justify-center font-mono font-bold text-slate-950 bg-[#f1b331] hover:bg-[#f8cf6e] rounded shadow-2xs tracking-wider border border-amber-400/80 transition-colors select-none text-center ${sizeClasses}`}
        title={
          language === 'en'
            ? `RIASEC Triad: ${code} (Hover to view dimensions)`
            : `Triade RIASEC : ${code} (Survoler pour voir les dimensions)`
        }
      >
        {code}
      </span>

      {/* Floating Tooltip Bubble */}
      <div
        role="tooltip"
        className={`pointer-events-none absolute bottom-full right-0 sm:left-1/2 sm:-translate-x-1/2 mb-2 z-50 w-72 sm:w-80 p-3.5 bg-slate-950 text-white rounded-xl shadow-2xl border border-slate-800 transition-all duration-200 text-left ${
          isOpen ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible translate-y-1 scale-95'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-[#f1b331] text-slate-950 font-bold">
              {code}
            </span>
            <span className="text-white font-bold">
              {language === 'en' ? 'Holland Triad' : 'Triade RIASEC'}
            </span>
          </div>
          <span className="text-amber-400 font-semibold uppercase tracking-wider text-[9px]">
            {language === 'en' ? 'Vocational Dimensions' : 'Dimensions Vocationnelles'}
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-[11px] text-slate-300 mb-2.5 leading-snug">
          {language === 'en'
            ? 'The 3 dominant dimensions characterizing this occupation in the Canadian Armed Forces:'
            : 'Les 3 dimensions dominantes qui caractérisent ce métier dans les Forces armées canadiennes :'}
        </p>

        {/* 3 Dimensions Breakdown */}
        <div className="space-y-2">
          {letters.map((dim, idx) => {
            const info = RIASEC_DIMENSIONS[dim];
            if (!info) return null;
            const colors = DIMENSION_COLORS[dim] || { bg: 'bg-slate-700', text: 'text-white', border: 'border-slate-600' };
            const dimName = language === 'en' ? info.nameEn : info.nameFr;
            const tagline = language === 'en' ? info.taglineEn : info.tagline;

            return (
              <div
                key={dim}
                className="bg-slate-900/90 border border-slate-800 rounded-lg p-2 flex items-start gap-2.5"
              >
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-xs ${colors.bg} ${colors.text}`}
                >
                  {dim}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 text-[11px] leading-tight">
                    <span className="font-bold text-white truncate">
                      {dimName}
                    </span>
                    <span className="text-[9px] font-mono text-amber-300 shrink-0 font-medium">
                      {getRankLabel(idx)}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight line-clamp-2">
                    {tagline}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Theory Note */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 leading-relaxed">
          {language === 'en'
            ? 'In the Holland RIASEC model, occupational satisfaction and operational readiness peak when an individual’s profile aligns with this triad.'
            : 'Selon le modèle RIASEC de John Holland, la satisfaction professionnelle et l’efficacité opérationnelle sont maximales lorsqu’un profil concorde avec cette triade.'}
        </div>

        {/* Arrow Pointer */}
        <div
          aria-hidden="true"
          className="absolute top-full right-4 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto -mt-px border-4 border-transparent border-t-slate-950"
        />
      </div>
    </div>
  );
};
