export type Language = 'fr' | 'en';

export type RiasecDimension = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export type RiasecScores = Record<RiasecDimension, number>;

export interface RiasecDimensionInfo {
  code: RiasecDimension;
  letter: string;
  nameFr: string;
  nameEn: string;
  tagline: string;
  taglineEn?: string;
  description: string;
  descriptionEn?: string;
  militaryRelevance: string;
  militaryRelevanceEn?: string;
  typicalTraits: string[];
  typicalTraitsEn?: string[];
  militaryKeywords: string[];
  militaryKeywordsEn?: string[];
  color: string;
  badgeBg: string;
  accentBorder: string;
}

export interface Question {
  id: number;
  dimension: RiasecDimension;
  prompt: string;
  promptEn?: string;
  operationalContext: string;
  operationalContextEn?: string;
}

export type MilitaryBranch = 
  | 'Armée canadienne'
  | 'Aviation royale canadienne'
  | 'Marine royale canadienne'
  | 'Services interarmées';

export type RankCategory = 'Membre du rang (MDR)' | 'Officier';

export type EducationLevel = 'Secondaire V / DES' | 'Collégial / Technique (DEC/DEP)' | 'Universitaire (Baccalauréat)';

export interface MilitaryTrade {
  id: string;
  mosid: string;
  nameFr: string;
  nameEn: string;
  forcesSlug: string; // Slug sur forces.ca/fr/carriere/[slug]/
  forcesUrl: string; // URL directe https://forces.ca/fr/carriere/[slug]/
  branch: MilitaryBranch;
  rankCategory: RankCategory;
  educationLevel: EducationLevel;
  riasecCode: string; // Ex: "R-I-E"
  idealScores: Record<RiasecDimension, number>; // 0 to 100
  summary: string;
  operationalEnvironment: string;
  trainingBase: string;
  keyResponsibilities: string[];
  whyFitNote: string;
  physicalDemand: 'Très élevée' | 'Élevée' | 'Modérée' | 'Standard';
  deploymentType: 'Opérations terrestres' | 'Navires et mer' | 'Aviation et escadrons' | 'Bases et QG tactiques';
}

export interface MatchResult {
  trade: MilitaryTrade;
  matchScore: number; // 0 to 100
  tier: 'dominant' | 'strong' | 'moderate';
  matchedDimensions: RiasecDimension[];
  compatibilityReason: string;
  operationalHighlights: string;
}
