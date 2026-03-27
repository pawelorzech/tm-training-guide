import { describe, test, expect } from 'vitest';
import { generateRecommendations } from '../src/lib/recommendations';
import type { CalculatorState, CalculatorResults } from '../src/types/calculator';

const baseState: CalculatorState = {
  currentStat: 1_000_000_000,
  trainedStat: 'DEF',
  gymDots: 39,
  happy: 4000,
  steadfastBonus: 0,
  educationBonus: 0,
  companyType: null,
  companyStarLevel: 0,
  bookBonus: 'none',
  meritLevel: 0,
  energySources: { natural: true, xanax: false, pointRefill: false, fhc: false, energyCans: 0 },
};

const baseResults: CalculatorResults = {
  gainPerEnergy: 3000,
  gainPerNatural: 450000,
  gainPerXanax: 750000,
  gainPerDay: 450000,
  happyContributionPercent: 0.005,
  fhcComparison: { useGain: 450000, sellAndBuyXanaxGain: 11000000, ratio: 24.4 },
  seComparison: { seGain: 10000000, seCostPerStat: 45, xanaxCostPerStat: 0.95, ratio: 47 },
  daysToNextMilestone: 200,
  nextMilestone: 2_000_000_000,
  monthlyProjection: 1_013_500_000,
  yearlyProjection: 1_164_250_000,
  recommendations: [],
};

describe('generateRecommendations', () => {
  test('suggests happy is irrelevant at high stats', () => {
    const recs = generateRecommendations(baseState, { ...baseResults, happyContributionPercent: 0.005 });
    const happyRec = recs.find(r => r.id === 'happy-irrelevant');
    expect(happyRec).toBeDefined();
    expect(happyRec!.priority).toBe('low');
  });

  test('suggests happy jumping at low stats', () => {
    const recs = generateRecommendations(
      { ...baseState, currentStat: 10_000 },
      { ...baseResults, happyContributionPercent: 30 },
    );
    const happyRec = recs.find(r => r.id === 'happy-jumping');
    expect(happyRec).toBeDefined();
    expect(happyRec!.priority).toBe('medium');
  });

  test('does not warn about SSL (SSL not recommended)', () => {
    const recs = generateRecommendations(baseState, baseResults, {
      personalstats: { xantaken: 100, exttaken: 25, energydrinkused: 0 },
    } as any);
    const sslRec = recs.find(r => r.id === 'ssl-warning');
    expect(sslRec).toBeUndefined();
  });

  test('recommends xanax when not using it', () => {
    const recs = generateRecommendations(baseState, baseResults);
    const xanaxRec = recs.find(r => r.id === 'use-xanax');
    expect(xanaxRec).toBeDefined();
  });

  test('suggests selling FHC', () => {
    const recs = generateRecommendations(
      { ...baseState, energySources: { ...baseState.energySources, fhc: true } },
      baseResults,
    );
    const fhcRec = recs.find(r => r.id === 'sell-fhc');
    expect(fhcRec).toBeDefined();
    expect(fhcRec!.priority).toBe('high');
  });

  test('suggests books when none active', () => {
    const recs = generateRecommendations(baseState, baseResults);
    const bookRec = recs.find(r => r.id === 'use-book');
    expect(bookRec).toBeDefined();
  });

  test('returns max 5 recommendations', () => {
    const recs = generateRecommendations(baseState, baseResults);
    expect(recs.length).toBeLessThanOrEqual(5);
  });
});
