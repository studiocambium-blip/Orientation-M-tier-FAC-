import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, MilitaryTrade } from '../types/riasec';
import { translations } from '../translations/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations.fr, params?: Record<string, string | number>) => string;
  getBranchName: (branch: string) => string;
  getRankName: (rank: string) => string;
  getEducationName: (edu: string) => string;
  getPhysicalDemandName: (demand: string) => string;
  getDeploymentTypeName: (dep: string) => string;
  getTradeForcesUrl: (trade: MilitaryTrade) => string;
  getTradeName: (trade: MilitaryTrade) => string;
  getTradeSummary: (trade: MilitaryTrade) => string;
  getTradeResponsibilities: (trade: MilitaryTrade) => string[];
  getTradeWhyFit: (trade: MilitaryTrade) => string;
  getTradeEnvironment: (trade: MilitaryTrade) => string;
  getTradeTraining: (trade: MilitaryTrade) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_LANG_KEY = 'fac_riasec_selected_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG_KEY);
      if (saved === 'fr' || saved === 'en') return saved;
    } catch {
      // Ignore
    }
    return 'fr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
    } catch {
      // Ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  const t = (key: keyof typeof translations.fr, params?: Record<string, string | number>): string => {
    const langDict = translations[language] || translations.fr;
    let str = (langDict as any)[key] || (translations.fr as any)[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return str;
  };

  const getBranchName = (branch: string): string => {
    if (language === 'fr') return branch;
    switch (branch) {
      case 'Armée canadienne':
        return 'Canadian Army';
      case 'Aviation royale canadienne':
        return 'Royal Canadian Air Force';
      case 'Marine royale canadienne':
        return 'Royal Canadian Navy';
      case 'Services interarmées':
        return 'Joint Services';
      default:
        return branch;
    }
  };

  const getRankName = (rank: string): string => {
    if (language === 'fr') return rank;
    switch (rank) {
      case 'Membre du rang (MDR)':
        return 'Non-Commissioned Member (NCM)';
      case 'Officier':
        return 'Officer';
      default:
        return rank;
    }
  };

  const getEducationName = (edu: string): string => {
    if (language === 'fr') return edu;
    switch (edu) {
      case 'Secondaire V / DES':
        return 'High School Diploma (Grade 12)';
      case 'Collégial / Technique (DEC/DEP)':
        return 'College / Technical Diploma';
      case 'Universitaire (Baccalauréat)':
        return 'University Degree (Bachelor)';
      default:
        return edu;
    }
  };

  const getPhysicalDemandName = (demand: string): string => {
    if (language === 'fr') return demand;
    switch (demand) {
      case 'Très élevée':
        return 'Very High';
      case 'Élevée':
        return 'High';
      case 'Modérée':
        return 'Moderate';
      case 'Standard':
        return 'Standard';
      default:
        return demand;
    }
  };

  const getDeploymentTypeName = (dep: string): string => {
    if (language === 'fr') return dep;
    switch (dep) {
      case 'Opérations terrestres':
        return 'Land Operations';
      case 'Navires et mer':
        return 'Ships & Sea';
      case 'Aviation et escadrons':
        return 'Aviation & Squadrons';
      case 'Bases et QG tactiques':
        return 'Bases & Tactical HQ';
      default:
        return dep;
    }
  };

  const getTradeForcesUrl = (trade: MilitaryTrade): string => {
    if (language === 'en') {
      const enSlug = (trade.nameEn || trade.forcesSlug)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      return `https://forces.ca/en/career/${enSlug}/`;
    }
    return trade.forcesUrl || `https://forces.ca/fr/carriere/${trade.forcesSlug}/`;
  };

  const getTradeName = (trade: MilitaryTrade): string => {
    if (language === 'en' && trade.nameEn) return trade.nameEn;
    return trade.nameFr;
  };

  const getTradeSummary = (trade: MilitaryTrade): string => {
    if (language === 'en') {
      return `As a ${trade.nameEn} within the ${getBranchName(trade.branch)} of the Canadian Armed Forces, you will play a critical operational role in defending Canada and its interests, engaging in specialized missions, tactical duties, and maintaining high standards of military excellence.`;
    }
    return trade.summary;
  };

  const getTradeResponsibilities = (trade: MilitaryTrade): string[] => {
    if (language === 'en') {
      return [
        `Rigorous execution of technical and tactical duties specific to the role of ${trade.nameEn}`,
        "Operation, maintenance, and tactical deployment of specialized military equipment and systems",
        "Participation in regular military training exercises, simulations, and domestic or international operations",
        "Strict adherence to operational standards, military discipline, and team cohesion"
      ];
    }
    return trade.keyResponsibilities;
  };

  const getTradeWhyFit = (trade: MilitaryTrade): string => {
    if (language === 'en') {
      return `Aligned with your Holland RIASEC code (${trade.riasecCode}), this career path reflects your vocational preferences and operational aptitude for service in the Canadian Armed Forces.`;
    }
    return trade.whyFitNote;
  };

  const getTradeEnvironment = (trade: MilitaryTrade): string => {
    if (language === 'en') {
      return `Operating in domestic bases, tactical headquarters, or international deployments with the ${getBranchName(trade.branch)}.`;
    }
    return trade.operationalEnvironment;
  };

  const getTradeTraining = (trade: MilitaryTrade): string => {
    if (language === 'en') {
      return `CFLRS Saint-Jean & Canadian Forces School of ${getBranchName(trade.branch)}`;
    }
    return trade.trainingBase;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
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
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
