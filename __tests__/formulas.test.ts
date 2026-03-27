import { describe, test, expect } from 'vitest';
import {
  calculateGymGain,
  calculateHappyContribution,
  compareFhcUseVsSell,
  compareStatEnhancer,
  projectDailyGain,
  daysToMilestone,
} from '../src/lib/formulas';

describe('calculateGymGain', () => {
  test('matches known data point: bombel at 1.276B DEF, Balboas', () => {
    const gain = calculateGymGain({
      gymDots: 7.5,  // Balboas DEF wiki gain multiplier
      currentStat: 1_276_323_613,
      happy: 4443,
      steadfastBonus: 0,
      educationBonus: 0.10,
      energyUsed: 1,
    });
    expect(gain).toBeGreaterThan(3000);
    expect(gain).toBeLessThan(4000);
  });

  test('gain scales linearly with energy', () => {
    const gain1 = calculateGymGain({
      gymDots: 7.5, currentStat: 1_000_000_000, happy: 4000,
      steadfastBonus: 0, educationBonus: 0, energyUsed: 1,
    });
    const gain10 = calculateGymGain({
      gymDots: 7.5, currentStat: 1_000_000_000, happy: 4000,
      steadfastBonus: 0, educationBonus: 0, energyUsed: 10,
    });
    expect(gain10).toBeCloseTo(gain1 * 10, 0);
  });

  test('gain scales with gym dots', () => {
    const params = {
      currentStat: 1_000_000_000, happy: 4000,
      steadfastBonus: 0, educationBonus: 0, energyUsed: 1,
    };
    const gainGeorges = calculateGymGain({ ...params, gymDots: 7.3 });  // George's all stats
    const gainBalboas = calculateGymGain({ ...params, gymDots: 7.5 });  // Balboas DEF
    expect(gainBalboas / gainGeorges).toBeCloseTo(7.5 / 7.3, 1);
  });

  test('steadfast bonus increases gain', () => {
    const params = {
      gymDots: 7.5, currentStat: 1_000_000_000, happy: 4000,
      educationBonus: 0, energyUsed: 1,
    };
    const base = calculateGymGain({ ...params, steadfastBonus: 0 });
    const boosted = calculateGymGain({ ...params, steadfastBonus: 0.20 });
    expect(boosted / base).toBeCloseTo(1.20, 1);
  });
});

describe('calculateHappyContribution', () => {
  test('happy is < 0.01% at 1B+ stats', () => {
    const pct = calculateHappyContribution(1_000_000_000, 4500);
    expect(pct).toBeLessThan(0.01);
  });

  test('happy is significant at 10K stats', () => {
    const pct = calculateHappyContribution(10_000, 4500);
    expect(pct).toBeGreaterThan(20);
  });

  test('happy is moderate at 50M stats', () => {
    const pct = calculateHappyContribution(50_000_000, 4500);
    expect(pct).toBeGreaterThan(0.05);
    expect(pct).toBeLessThan(5);
  });
});

describe('compareFhcUseVsSell', () => {
  test('selling FHC is ~25x better than using at high stats', () => {
    const result = compareFhcUseVsSell({
      currentStat: 1_276_323_613,
      gymDots: 7.5,  // Balboas DEF
      happy: 4443,
      steadfastBonus: 0,
      educationBonus: 0.10,
      fhcSellPrice: 12_500_000,
      xanaxPrice: 839_000,
    });
    expect(result.ratio).toBeGreaterThan(20);
    expect(result.ratio).toBeLessThan(30);
    expect(result.sellAndBuyXanaxGain).toBeGreaterThan(result.useGain);
  });
});

describe('compareStatEnhancer', () => {
  test('SE is much more expensive per stat than Xanax', () => {
    const result = compareStatEnhancer({
      currentStat: 1_276_323_613,
      sePrice: 450_000_000,
      xanaxPrice: 839_000,
      gymDots: 7.5,  // Balboas DEF
      happy: 4443,
      steadfastBonus: 0,
      educationBonus: 0.10,
    });
    expect(result.seGain).toBeCloseTo(1_276_323_613 * 0.01, -5);
    expect(result.seCostPerStat).toBeGreaterThan(result.xanaxCostPerStat);
    expect(result.ratio).toBeGreaterThan(10);
  });
});

describe('projectDailyGain', () => {
  test('natural only = 150E worth', () => {
    const gain = projectDailyGain({
      gainPerEnergy: 3533,
      energySources: { natural: true, xanax: false, pointRefill: false, fhc: false, energyCans: 0 },
    });
    expect(gain).toBe(3533 * 150);
  });

  test('natural + xanax = 150 + 500 = 650E worth', () => {
    const gain = projectDailyGain({
      gainPerEnergy: 3533,
      energySources: { natural: true, xanax: true, pointRefill: false, fhc: false, energyCans: 0 },
    });
    expect(gain).toBe(3533 * (150 + 250 * 2));
  });

  test('includes energy cans', () => {
    const gain = projectDailyGain({
      gainPerEnergy: 100,
      energySources: { natural: true, xanax: false, pointRefill: false, fhc: false, energyCans: 6 },
    });
    expect(gain).toBe(100 * (150 + 25 * 6));
  });
});

describe('daysToMilestone', () => {
  test('calculates correctly', () => {
    expect(daysToMilestone(900_000_000, 1_000_000_000, 500_000)).toBe(200);
  });

  test('returns 0 if already past milestone', () => {
    expect(daysToMilestone(1_100_000_000, 1_000_000_000, 500_000)).toBe(0);
  });
});
