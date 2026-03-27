import type { CalculatorState, CalculatorResults, Recommendation } from '@/types/calculator';
import type { TornUserData } from '@/types/torn-api';
import { GYMS } from './constants';
import { formatStatShort, formatMultiplier } from './format';

export function generateRecommendations(
  state: CalculatorState,
  results: CalculatorResults,
  apiData?: Partial<TornUserData>,
): Recommendation[] {
  const recs: Recommendation[] = [];

  // Happy relevance
  if (results.happyContributionPercent > 5) {
    recs.push({
      id: 'happy-jumping',
      priority: 'medium',
      title: 'Happy Jumping Can Help',
      description: `Happy is ${results.happyContributionPercent.toFixed(1)}% of your formula. Using Ecstasy before gym can boost gains.`,
      impact: `+${results.happyContributionPercent.toFixed(1)}% potential gains`,
      category: 'items',
    });
  } else if (results.happyContributionPercent < 1) {
    recs.push({
      id: 'happy-irrelevant',
      priority: 'low',
      title: 'Skip Happy Jumping',
      description: `Happy is only ${results.happyContributionPercent.toFixed(3)}% of your formula. Don't waste time or money on Ecstasy.`,
      impact: 'Save money, skip Ecstasy',
      category: 'items',
    });
  }

  // Gym upgrade check
  const currentGymIndex = GYMS.findIndex(g => g.dots === state.gymDots);
  if (currentGymIndex >= 0 && currentGymIndex < GYMS.length - 1) {
    const nextGym = GYMS[currentGymIndex + 1];
    if (state.currentStat >= nextGym.unlockValue) {
      const improvement = ((nextGym.dots / state.gymDots) - 1) * 100;
      recs.push({
        id: 'upgrade-gym',
        priority: 'high',
        title: `Switch to ${nextGym.name}`,
        description: `You qualify for ${nextGym.name} (${nextGym.dots} dots). That's +${improvement.toFixed(0)}% gains.`,
        impact: `+${improvement.toFixed(0)}% gym gains`,
        category: 'gym',
      });
    }
  }

  // FHC sell vs use
  if (state.energySources.fhc) {
    recs.push({
      id: 'sell-fhc',
      priority: 'high',
      title: 'Sell FHC, Buy Xanax',
      description: `Selling your FHC ($12.5M) and buying Xanax gives ${formatMultiplier(results.fhcComparison.ratio)} more stats.`,
      impact: `${formatMultiplier(results.fhcComparison.ratio)} more stats per dollar`,
      category: 'energy',
    });
  }

  // No Xanax
  if (!state.energySources.xanax) {
    recs.push({
      id: 'use-xanax',
      priority: 'medium',
      title: 'Start Using Xanax',
      description: `Xanax is the most cost-efficient training drug. $839K for 250E = ${formatStatShort(results.gainPerXanax)} stat gain.`,
      impact: `+${formatStatShort(results.gainPerXanax * 2)} stat/day`,
      category: 'energy',
    });
  }

  // Steadfast at 0
  if (state.steadfastBonus === 0) {
    recs.push({
      id: 'check-steadfast',
      priority: 'medium',
      title: 'Check Steadfast Rotation',
      description: 'Ask your faction about Steadfast perk rotation. Up to +20% gym gains when your stat is primary.',
      impact: 'Up to +20% gym gains',
      category: 'gym',
    });
  }

  // No book
  if (state.bookBonus === 'none') {
    recs.push({
      id: 'use-book',
      priority: 'medium',
      title: 'Use a Training Book',
      description: 'A 30% stat book would add significant daily gains for 31 days. Stack with Steadfast for max impact.',
      impact: '+30% gym gains for 31 days',
      category: 'items',
    });
  }

  // No company gym perk
  if (!state.companyType) {
    recs.push({
      id: 'join-company',
      priority: 'medium',
      title: 'Join a Training Company',
      description: state.trainedStat === 'DEF'
        ? 'Ladies Strip Club 7-star gives +10% DEF gym gains + 25% passive DEF.'
        : state.trainedStat === 'DEX'
          ? "Gents Strip Club 7-star gives +10% DEX gym gains + 25% passive DEX."
          : 'Fitness Center 10-star gives +3% gym gains for all stats.',
      impact: 'Up to +10% gym gains',
      category: 'company',
    });
  }

  // SSL warning
  if (apiData?.personalstats) {
    const total = (apiData.personalstats.xantaken ?? 0) + (apiData.personalstats.exttaken ?? 0);
    if (total > 120) {
      recs.push({
        id: 'ssl-warning',
        priority: 'high',
        title: 'SSL Access at Risk!',
        description: `You've used ${total} total Xanax + Ecstasy. At 150 you lose Sports Science Lab access forever.`,
        impact: `${150 - total} uses remaining`,
        category: 'warning',
      });
    }
  }

  // Sort by priority, limit to 5
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  return recs.slice(0, 5);
}
