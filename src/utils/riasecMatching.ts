import { RiasecDimension, RiasecScores, MilitaryTrade, MatchResult } from '../types/riasec';
import { RIASEC_QUESTIONS, RIASEC_DIMENSIONS } from '../data/riasecData';

export const HEXAGON_ORDER: RiasecDimension[] = ['R', 'I', 'A', 'S', 'E', 'C'];

// Calculate scores from answers (scale 1 to 5 per question)
export function calculateScoresFromAnswers(answers: Record<number, number>): RiasecScores {
  const sums: Record<RiasecDimension, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const counts: Record<RiasecDimension, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  for (const q of RIASEC_QUESTIONS) {
    const val = answers[q.id] || 3; // neutral default if missing
    sums[q.dimension] += val;
    counts[q.dimension] += 1;
  }

  const scores: RiasecScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  for (const dim of HEXAGON_ORDER) {
    const totalPossible = counts[dim] * 5;
    const rawVal = sums[dim];
    // Scale 0 to 100 (where 5 is 20% and 25 is 100%)
    scores[dim] = Math.round((rawVal / totalPossible) * 100);
  }

  return scores;
}

// Extract top 3 Holland letters (e.g., 'R-I-E')
export function getHollandTriad(scores: RiasecScores): { code: string; letters: RiasecDimension[] } {
  const sorted = [...HEXAGON_ORDER].sort((a, b) => scores[b] - scores[a]);
  const letters = sorted.slice(0, 3);
  return {
    code: letters.join('-'),
    letters
  };
}

// Distance on Holland hexagon (0 to 3)
export function getHexagonDistance(dim1: RiasecDimension, dim2: RiasecDimension): number {
  const idx1 = HEXAGON_ORDER.indexOf(dim1);
  const idx2 = HEXAGON_ORDER.indexOf(dim2);
  const diff = Math.abs(idx1 - idx2);
  return Math.min(diff, 6 - diff);
}

// Match calculation between candidate and military trades
export function computeTradeMatches(userScores: RiasecScores, trades: MilitaryTrade[]): MatchResult[] {
  const userTriad = getHollandTriad(userScores).letters;

  const results: MatchResult[] = trades.map((trade) => {
    // Parse trade top dimensions from riasecCode (e.g. 'R-C-I' -> ['R', 'C', 'I'])
    const tradeLetters = trade.riasecCode.split('-') as RiasecDimension[];

    // Weighting vector: Top trade dimensions matter much more
    let totalWeight = 0;
    let weightedDiffSum = 0;

    for (const dim of HEXAGON_ORDER) {
      let weight = 1.0;
      if (tradeLetters[0] === dim) weight = 3.6;
      else if (tradeLetters[1] === dim) weight = 2.4;
      else if (tradeLetters[2] === dim) weight = 1.8;

      const userVal = userScores[dim];
      const idealVal = trade.idealScores[dim];

      const diff = Math.abs(userVal - idealVal);
      weightedDiffSum += (diff * diff) * weight;
      totalWeight += weight;
    }

    const meanSquaredDiff = weightedDiffSum / totalWeight;
    const rootMeanDiff = Math.sqrt(meanSquaredDiff);

    // Congruence bonus based on Holland Hexagon alignment
    let matchBonus = 0;
    if (userTriad[0] === tradeLetters[0]) matchBonus += 8;
    else if (userTriad[1] === tradeLetters[0]) matchBonus += 4;
    else if (userTriad[2] === tradeLetters[0]) matchBonus += 2;

    if (userTriad.includes(tradeLetters[1])) matchBonus += 3;
    if (userTriad.includes(tradeLetters[2])) matchBonus += 2;

    // Penalty if trade's primary requirement corresponds to user's weakest dimension
    const sortedUserDims = [...HEXAGON_ORDER].sort((a, b) => userScores[a] - userScores[b]);
    if (tradeLetters[0] === sortedUserDims[0]) matchBonus -= 14;
    else if (tradeLetters[0] === sortedUserDims[1]) matchBonus -= 7;

    // Normalize to a percentage
    const rawScore = Math.max(30, Math.min(99, Math.round(100 - rootMeanDiff * 1.0 + matchBonus)));

    // Truly dominant categorization:
    // Requires high overall score (>=85) OR strong congruence with dominant dimensions
    const isPrimaryMatch = tradeLetters[0] === userTriad[0];
    const isTriadOverlap = userTriad.slice(0, 2).includes(tradeLetters[0]) && tradeLetters.includes(userTriad[0]);
    const isDominant = rawScore >= 82 || (rawScore >= 75 && (isPrimaryMatch || isTriadOverlap));

    let tier: 'dominant' | 'strong' | 'moderate' = 'moderate';
    if (isDominant) {
      tier = 'dominant';
    } else if (rawScore >= 70) {
      tier = 'strong';
    }

    // Shared dimensions
    const matchedDimensions = tradeLetters.filter((dim) => userScores[dim] >= 60);

    // Reason synthesis
    const leadDimInfo = RIASEC_DIMENSIONS[tradeLetters[0]];

    let compatibilityReason = '';
    if (tier === 'dominant') {
      compatibilityReason = `Adéquation dominante remarquable : votre profil valorise directement l’axe ${leadDimInfo.nameFr.split(' ')[0]} et répond prioritairement aux impératifs opérationnels de ce métier des Forces armées canadiennes.`;
    } else if (tier === 'strong') {
      compatibilityReason = `Forte compatibilité : vos aptitudes correspondent aux compétences clés de ce métier, avec des affinités naturelles pour les opérations associées.`;
    } else {
      compatibilityReason = `Compatibilité secondaire : certaines facettes du quotidien militaire vous conviendront, mais des ajustements de rôle ou de spécialité sont à envisager.`;
    }

    return {
      trade,
      matchScore: rawScore,
      tier,
      matchedDimensions,
      compatibilityReason,
      operationalHighlights: trade.whyFitNote
    };
  });

  // Sort by highest match score descending
  const sorted = results.sort((a, b) => b.matchScore - a.matchScore);

  // Mark the top 3 as dominant and ensure top 20 are strong or dominant
  sorted.forEach((m, idx) => {
    if (idx < 3) {
      m.tier = 'dominant';
    } else if (idx < 20 && m.tier === 'moderate') {
      m.tier = 'strong';
    }
  });

  return sorted;
}

// Extract dominant matches for a candidate profile (Top 20 recommended trades)
export function getDominantMatches(matches: MatchResult[], limit: number = 20): MatchResult[] {
  return matches.slice(0, limit);
}

// Holland consistency interpretation
export function getHollandConsistency(letters: RiasecDimension[], lang: string = 'fr'): { label: string; explanation: string } {
  if (letters.length < 2) {
    return lang === 'en'
      ? { label: 'Balanced', explanation: 'Homogeneous profile across dimensions.' }
      : { label: 'Équilibré', explanation: 'Profil homogène.' };
  }

  const dist = getHexagonDistance(letters[0], letters[1]);
  if (dist === 1) {
    return lang === 'en'
      ? {
          label: 'Highly Consistent (Adjacent Types)',
          explanation: 'Your top two vocational interests are adjacent on the Holland hexagon, providing a focused, stable, and distinct military career direction.'
        }
      : {
          label: 'Très cohérent (Types adjacents)',
          explanation: 'Vos deux intérêts majeurs sont voisins sur l’hexagone de Holland, ce qui confère une orientation professionnelle très nette, stable et ciblée.'
        };
  } else if (dist === 2) {
    return lang === 'en'
      ? {
          label: 'Complementary (Intermediate Types)',
          explanation: 'Your vocational interests blend diverse aptitudes, offering tactical versatility and adaptability to unexpected operational challenges.'
        }
      : {
          label: 'Complémentaire (Types intermédiaires)',
          explanation: 'Vos intérêts combinent des aptitudes variées qui apportent de la polyvalence et de l’adaptabilité face aux défis imprévus des forces armées.'
        };
  } else {
    return lang === 'en'
      ? {
          label: 'Versatile / Contrasting (Opposing Poles)',
          explanation: 'Your two dominant themes are on opposite sides of the Holland hexagon (e.g. Realistic & Social). This is a valuable combination for hybrid roles (combat rescue, tactical mediation, people-oriented command).'
        }
      : {
          label: 'Profil polyvalent / Contrasté (Pôles opposés)',
          explanation: 'Vos deux pôles dominants sont opposés sur le modèle Holland (ex. Réaliste et Social). C’est une combinaison rare et précieuse pour des rôles hybrides (sauvetage, médiation tactique, commandement humain).'
        };
  }
}
