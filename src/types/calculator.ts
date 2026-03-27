import { StatType } from './torn-api';

export interface EnergySources {
  natural: boolean;
  xanax: boolean;
  pointRefill: boolean;
  fhc: boolean;
  energyCans: number; // 0-6
}

export type BookBonus = 'none' | 'single30' | 'all20';

export interface CalculatorState {
  currentStat: number;
  trainedStat: StatType;
  gymDots: number;
  happy: number;
  steadfastBonus: number;
  educationBonus: number;
  companyType: string | null;
  companyStarLevel: number;
  bookBonus: BookBonus;
  meritLevel: number;
  energySources: EnergySources;
}

export interface FhcComparison {
  useGain: number;
  sellAndBuyXanaxGain: number;
  ratio: number;
}

export interface SeComparison {
  seGain: number;
  seCostPerStat: number;
  xanaxCostPerStat: number;
  ratio: number;
}

export interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  category: 'energy' | 'gym' | 'company' | 'items' | 'warning';
}

export interface CalculatorResults {
  gainPerEnergy: number;
  gainPerNatural: number;
  gainPerXanax: number;
  gainPerDay: number;
  happyContributionPercent: number;
  fhcComparison: FhcComparison;
  seComparison: SeComparison;
  daysToNextMilestone: number;
  nextMilestone: number;
  monthlyProjection: number;
  yearlyProjection: number;
  recommendations: Recommendation[];
}
