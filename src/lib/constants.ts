// Simplified gym list for the guide. "dots" is the quality rating used in the formula.
// API gym IDs (used by Torn API) are mapped separately in API_GYM_ID_TO_DOTS.
// Stage 1-2 gyms train all 4 stats. Stage 3+ gyms specialize.
export const GYMS = [
  // Stage 1: Beginner gyms
  { id: 1, name: "Premier Fitness", dots: 2.0, unlock: "Default", unlockType: "none" as const, unlockValue: 0, stage: 1 },
  { id: 2, name: "Average Joe's", dots: 3.0, unlock: "Any stat > 100", unlockType: "anyStat" as const, unlockValue: 100, stage: 1 },
  { id: 3, name: "Woody's Workout Club", dots: 4.0, unlock: "Any stat > 500", unlockType: "anyStat" as const, unlockValue: 500, stage: 1 },
  { id: 4, name: "Beach Bods", dots: 5.0, unlock: "Any stat > 1,000", unlockType: "anyStat" as const, unlockValue: 1_000, stage: 1 },
  { id: 5, name: "Silver Gym", dots: 6.0, unlock: "Any stat > 2,500", unlockType: "anyStat" as const, unlockValue: 2_500, stage: 1 },
  { id: 8, name: "Global Gym", dots: 7.0, unlock: "Any stat > 25,000", unlockType: "anyStat" as const, unlockValue: 25_000, stage: 1 },
  // Stage 2: Intermediate
  { id: 16, name: "Deep Burn", dots: 10.0, unlock: "Various", unlockType: "anyStat" as const, unlockValue: 100_000, stage: 2 },
  // Stage 3: Advanced (single-stat focus)
  { id: 24, name: "George's", dots: 20.0, unlock: "Any stat > 50M", unlockType: "anyStat" as const, unlockValue: 50_000_000, stage: 3 },
  // Stage 4: Endgame (specialized)
  { id: 25, name: "Balboas Gym", dots: 39.0, unlock: "Total stats > 1B", unlockType: "totalStats" as const, unlockValue: 1_000_000_000, stage: 4, stats: ["DEF", "DEX"] },
  { id: 26, name: "Frontline Fitness", dots: 39.0, unlock: "Total stats > 1B", unlockType: "totalStats" as const, unlockValue: 1_000_000_000, stage: 4, stats: ["STR", "SPD"] },
  { id: 27, name: "Gym 3000", dots: 42.0, unlock: "Advanced", unlockType: "specificStat" as const, unlockValue: 2_000_000_000, stage: 4, stats: ["STR"] },
  { id: 28, name: "Mr. Isoyamas", dots: 42.0, unlock: "Advanced", unlockType: "specificStat" as const, unlockValue: 2_000_000_000, stage: 4, stats: ["DEF"] },
  { id: 29, name: "Total Rebound", dots: 42.0, unlock: "Advanced", unlockType: "specificStat" as const, unlockValue: 2_000_000_000, stage: 4, stats: ["SPD"] },
  { id: 30, name: "Elites", dots: 42.0, unlock: "Advanced", unlockType: "specificStat" as const, unlockValue: 2_000_000_000, stage: 4, stats: ["DEX"] },
  { id: 31, name: "Sports Science Lab", dots: 47.0, unlock: "Advanced", unlockType: "totalStats" as const, unlockValue: 5_000_000_000, stage: 4, sslRestriction: true },
  { id: 32, name: "Unknown", dots: 52.0, unlock: "Endgame", unlockType: "totalStats" as const, unlockValue: 10_000_000_000, stage: 4 },
] as const;

export type Gym = (typeof GYMS)[number];

export const TRAINING_COMPANIES = [
  {
    name: "Ladies Strip Club",
    perks: [
      { star: 3, effect: "+25% passive DEF", type: "passive" as const, stat: "DEF", value: 0.25 },
      { star: 5, effect: "+50% Serotonin effectiveness", type: "booster" as const },
      { star: 7, effect: "+10% DEF gym gains", type: "gymGain" as const, stat: "DEF", value: 0.10 },
      { star: 10, effect: "+30% melee damage reduction", type: "combat" as const },
    ]
  },
  {
    name: "Gents Strip Club",
    perks: [
      { star: 3, effect: "+25% passive DEX", type: "passive" as const, stat: "DEX", value: 0.25 },
      { star: 5, effect: "+50% Tyrosine effectiveness", type: "booster" as const },
      { star: 7, effect: "+10% DEX gym gains", type: "gymGain" as const, stat: "DEX", value: 0.10 },
      { star: 10, effect: "25% dodge melee", type: "combat" as const },
    ]
  },
  {
    name: "Fitness Center",
    perks: [
      { star: 3, effect: "50% happy loss reduction in gym", type: "passive" as const },
      { star: 5, effect: "~4.5E STR gains per JP", type: "jpTraining" as const, stat: "STR" },
      { star: 10, effect: "+3% gym gains (all)", type: "gymGain" as const, stat: "ALL", value: 0.03 },
    ]
  },
  {
    name: "Music Store",
    perks: [
      { star: 3, effect: "+30% gym XP", type: "passive" as const },
      { star: 10, effect: "+15% ALL battle stats", type: "passive" as const, stat: "ALL", value: 0.15 },
    ]
  },
  {
    name: "Mining Corporation",
    perks: [
      { star: 5, effect: "~4.5E DEF gains per JP", type: "jpTraining" as const, stat: "DEF" },
      { star: 7, effect: "+10% max life", type: "passive" as const },
    ]
  },
  {
    name: "Furniture Store",
    perks: [
      { star: 3, effect: "~4.5E STR gains per JP", type: "jpTraining" as const, stat: "STR" },
      { star: 7, effect: "+25% passive STR", type: "passive" as const, stat: "STR", value: 0.25 },
    ]
  },
  {
    name: "Gas Station",
    perks: [
      { star: 3, effect: "+25% passive SPD", type: "passive" as const, stat: "SPD", value: 0.25 },
      { star: 5, effect: "Cauterize (heal during combat)", type: "combat" as const },
    ]
  },
  {
    name: "Logistics Management",
    perks: [
      { star: 1, effect: "~4.5E SPD gains per JP", type: "jpTraining" as const, stat: "SPD" },
    ]
  },
];

export const ENERGY_SOURCES = [
  { id: "natural", name: "Natural Energy", energy: 150, cost: 0, cooldown: "Regenerates over 24h", daily: 1, notes: "Free. 5E every 15 min." },
  { id: "xanax", name: "Xanax", energy: 250, cost: 839_000, cooldown: "~8h drug cooldown", daily: 2, notes: "Primary training drug. Can boost over max energy cap." },
  { id: "pointRefill", name: "Point Refill", energy: 150, cost: 845_000, cooldown: "1 per day", daily: 1, notes: "~25 points from Points Building." },
  { id: "fhc", name: "FHC (Full Happy Cake)", energy: 150, cost: 12_500_000, cooldown: "None (consumable)", daily: 1, notes: "Usually better to sell and buy Xanax (25x more efficient)." },
  { id: "energyCan", name: "Energy Can", energy: 25, cost: 2_100_000, cooldown: "None", daily: 6, notes: "$12.7M for 6-pack (150E total). Mid-tier efficiency." },
  { id: "lsd", name: "LSD", energy: 50, cost: 150_000, cooldown: "~7h drug cooldown", daily: 0, notes: "Shares drug cooldown with Xanax. +50% DEF buff (combat)." },
] as const;

export const MERIT_STAT_BONUSES = {
  STR: { name: "Brawn", perLevel: 0.03, maxLevel: 10 },
  DEF: { name: "Protection", perLevel: 0.03, maxLevel: 10 },
  SPD: { name: "Sharpness", perLevel: 0.03, maxLevel: 10 },
  DEX: { name: "Evasion", perLevel: 0.03, maxLevel: 10 },
} as const;

export const DEFAULT_PRICES = {
  xanax: 839_000,
  fhc: 12_500_000,
  statEnhancer: 450_000_000,
  energyCan: 2_100_000,
  ecstasy: 200_000,
  lsd: 150_000,
  pointRefill: 845_000,
};

// Map Torn API gym IDs to dots values for the formula.
// API IDs from https://api.torn.com/v2/torn/gyms
export const API_GYM_ID_TO_DOTS: Record<number, number> = {
  1: 2.0, 2: 3.0, 3: 4.0, 4: 5.0, 5: 6.0, 6: 6.0, 7: 6.0, 8: 7.0,
  9: 8.0, 10: 8.0, 11: 8.0, 12: 8.0, 13: 9.0, 14: 9.0, 15: 9.0, 16: 10.0,
  17: 10.0, 18: 10.0, 19: 11.0, 20: 11.0, 21: 11.0, 22: 11.5, 23: 11.5,
  24: 20.0,  // George's
  25: 39.0,  // Balboas Gym (DEF/DEX)
  26: 39.0,  // Frontline Fitness (STR/SPD)
  27: 42.0,  // Gym 3000 (STR)
  28: 42.0,  // Mr. Isoyamas (DEF)
  29: 42.0,  // Total Rebound (SPD)
  30: 42.0,  // Elites (DEX)
  31: 47.0,  // Sports Science Lab
  32: 52.0,  // Unknown (endgame)
  33: 5.0,   // Jail Gym
};

export const STAT_MILESTONES = [
  100_000_000,
  250_000_000,
  500_000_000,
  1_000_000_000,
  2_000_000_000,
  5_000_000_000,
  10_000_000_000,
];
