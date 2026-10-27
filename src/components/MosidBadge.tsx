import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MosidBadgeProps {
  code: string;
  className?: string;
  showIcon?: boolean;
  prefix?: string;
}

export const MosidBadge: React.FC<MosidBadgeProps> = ({
  code,
  className = '',
  showIcon = false,
  prefix = 'MOSID'
}) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const titleTooltip =
    'Military Occupation Structure Identification (Identificateur de la structure des professions militaires.)';

  return (
    <span
      className={`group/mosid relative inline-flex items-center gap-1 cursor-help underline decoration-dotted decoration-slate-400 underline-offset-2 hover:decoration-slate-700 transition-colors ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
      }}
      title={titleTooltip}
    >
      <span>
        {prefix ? `${prefix} ` : ''}
        <strong className="font-mono font-semibold">{code}</strong>
      </span>
      {showIcon && <HelpCircle className="w-3 h-3 text-slate-400 group-hover/mosid:text-slate-600 shrink-0" />}

      {/* Floating Tooltip Bubble */}
      <span
        role="tooltip"
        className={`pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-72 sm:w-80 p-3 bg-slate-950 text-white rounded-xl shadow-xl border border-slate-800 transition-all duration-200 text-left ${
          isOpen ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible translate-y-1 scale-95'
        }`}
      >
        {/* Header with acronym */}
        <span className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-[10px] font-mono">
          <span className="px-1.5 py-0.5 rounded bg-[#f1b331] text-slate-950 font-bold">
            MOSID {code}
          </span>
          <span className="text-slate-400 uppercase tracking-wider font-semibold">
            {language === 'en' ? 'CAF Career Code' : 'Code Métier FAC'}
          </span>
        </span>

        {/* English full name */}
        <span className="block text-xs font-bold text-white leading-snug">
          Military Occupation Structure Identification
        </span>

        {/* French translation */}
        <span className="block text-[11px] text-amber-300 font-medium italic mt-0.5 leading-snug">
          (Identificateur de la structure des professions militaires.)
        </span>

        {/* Informative description */}
        <span className="block text-[10px] text-slate-300 leading-relaxed mt-2 pt-1.5 border-t border-slate-800/80">
          {language === 'en'
            ? 'Official 5-digit code identifying each occupation and specialty within the Canadian Armed Forces (historically known as MOC).'
            : 'Code officiel unique à 5 chiffres identifiant chaque métier et spécialité au sein des Forces armées canadiennes (autrefois désigné code GPM).'}
        </span>

        {/* Arrow pointer */}
        <span
          aria-hidden="true"
          className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-950"
        />
      </span>
    </span>
  );
};
