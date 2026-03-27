'use client';
import { useState, useMemo, useEffect } from 'react';
import type { CalculatorState, CalculatorResults, EnergySources } from '@/types/calculator';
import type { TornUserData } from '@/types/torn-api';
import { calculateGymGain, calculateHappyContribution, compareFhcUseVsSell, compareStatEnhancer, projectDailyGain, daysToMilestone } from '@/lib/formulas';
import { generateRecommendations } from '@/lib/recommendations';
import { DEFAULT_PRICES, STAT_MILESTONES, getGymGainById } from '@/lib/constants';

const defaultEnergySources: EnergySources = {
  natural: true, xanax: false, pointRefill: false, fhc: false, energyCans: 0,
};

const defaultState: CalculatorState = {
  currentStat: 100_000_000,
  trainedStat: 'DEF',
  gymDots: 20,
  happy: 4000,
  steadfastBonus: 0,
  educationBonus: 0,
  companyType: null,
  companyStarLevel: 0,
  bookBonus: 'none',
  meritLevel: 0,
  energySources: defaultEnergySources,
};

export function useCalculator(apiData: TornUserData | null) {
  const [state, setState] = useState<CalculatorState>(defaultState);

  useEffect(() => {
    if (!apiData) return;
    const stats = apiData.battlestats;
    const statValues = [
      { stat: 'STR' as const, value: stats.strength },
      { stat: 'DEF' as const, value: stats.defense },
      { stat: 'SPD' as const, value: stats.speed },
      { stat: 'DEX' as const, value: stats.dexterity },
    ];
    const highest = statValues.reduce((a, b) => a.value > b.value ? a : b);
    const gymDots = getGymGainById(apiData.gym.active_gym, highest.stat);

    setState(prev => ({
      ...prev,
      currentStat: highest.value,
      trainedStat: highest.stat,
      gymDots,
      happy: apiData.bars.happy.current,
    }));
  }, [apiData]);

  const updateField = <K extends keyof CalculatorState>(key: K, value: CalculatorState[K]) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const results = useMemo((): CalculatorResults => {
    const bookMultiplier = state.bookBonus === 'single30' ? 0.30 : state.bookBonus === 'all20' ? 0.20 : 0;
    const totalEducation = state.educationBonus + bookMultiplier;

    const gainPerEnergy = calculateGymGain({
      gymDots: state.gymDots,
      currentStat: state.currentStat,
      happy: state.happy,
      steadfastBonus: state.steadfastBonus,
      educationBonus: totalEducation,
      energyUsed: 1,
    });

    const happyContributionPercent = calculateHappyContribution(state.currentStat, state.happy);

    const fhcComparison = compareFhcUseVsSell({
      currentStat: state.currentStat,
      gymDots: state.gymDots,
      happy: state.happy,
      steadfastBonus: state.steadfastBonus,
      educationBonus: totalEducation,
      fhcSellPrice: DEFAULT_PRICES.fhc,
      xanaxPrice: DEFAULT_PRICES.xanax,
    });

    const seComparison = compareStatEnhancer({
      currentStat: state.currentStat,
      sePrice: DEFAULT_PRICES.statEnhancer,
      xanaxPrice: DEFAULT_PRICES.xanax,
      gymDots: state.gymDots,
      happy: state.happy,
      steadfastBonus: state.steadfastBonus,
      educationBonus: totalEducation,
    });

    const gainPerDay = projectDailyGain({
      gainPerEnergy,
      energySources: state.energySources,
    });

    const nextMilestone = STAT_MILESTONES.find(m => m > state.currentStat) ?? state.currentStat * 2;
    const daysToNext = gainPerDay > 0 ? daysToMilestone(state.currentStat, nextMilestone, gainPerDay) : Infinity;

    const partialResults: CalculatorResults = {
      gainPerEnergy,
      gainPerNatural: gainPerEnergy * 150,
      gainPerXanax: gainPerEnergy * 250,
      gainPerDay,
      happyContributionPercent,
      fhcComparison,
      seComparison,
      daysToNextMilestone: daysToNext,
      nextMilestone,
      monthlyProjection: state.currentStat + gainPerDay * 30,
      yearlyProjection: state.currentStat + gainPerDay * 365,
      recommendations: [],
    };

    const recommendations = generateRecommendations(state, partialResults, apiData ?? undefined);

    return { ...partialResults, recommendations };
  }, [state, apiData]);

  return { state, updateField, results };
}
