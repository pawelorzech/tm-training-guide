export const GYMS = [
  { id: 1, name: "Premier Fitness", dots: 2.0, unlock: "Default", unlockType: "none" as const, unlockValue: 0 },
  { id: 2, name: "Average Joe's", dots: 3.0, unlock: "Any stat > 100", unlockType: "anyStat" as const, unlockValue: 100 },
  { id: 3, name: "Woody's Workout Club", dots: 4.0, unlock: "Any stat > 500", unlockType: "anyStat" as const, unlockValue: 500 },
  { id: 4, name: "Beach Bum's", dots: 5.0, unlock: "Any stat > 1,000", unlockType: "anyStat" as const, unlockValue: 1_000 },
  { id: 5, name: "Silver Gym", dots: 6.0, unlock: "Any stat > 2,500", unlockType: "anyStat" as const, unlockValue: 2_500 },
  { id: 6, name: "Gold Gym", dots: 7.0, unlock: "Any stat > 5,000", unlockType: "anyStat" as const, unlockValue: 5_000 },
  { id: 7, name: "Platinum Gym", dots: 8.0, unlock: "Any stat > 10,000", unlockType: "anyStat" as const, unlockValue: 10_000 },
  { id: 8, name: "Hank's Gym", dots: 9.0, unlock: "Any stat > 25,000", unlockType: "anyStat" as const, unlockValue: 25_000 },
  { id: 9, name: "Mr. Isoyamas", dots: 10.0, unlock: "Total stats > 250,000", unlockType: "totalStats" as const, unlockValue: 250_000 },
  { id: 10, name: "Total Warfare", dots: 11.0, unlock: "Any 2 stats > 250,000", unlockType: "twoStats" as const, unlockValue: 250_000 },
  { id: 11, name: "Elites", dots: 11.5, unlock: "DEX > 500K or DEF > 500K", unlockType: "specificStat" as const, unlockValue: 500_000, stats: ["DEX", "DEF"] },
  { id: 12, name: "Sports Science Lab", dots: 12.0, unlock: "STR > 500K or SPD > 500K", unlockType: "specificStat" as const, unlockValue: 500_000, stats: ["STR", "SPD"], sslRestriction: true },
  { id: 13, name: "George's Gym", dots: 20.0, unlock: "Any stat > 50M", unlockType: "anyStat" as const, unlockValue: 50_000_000 },
  { id: 14, name: "Balboas Gym", dots: 39.0, unlock: "Total stats > 1B", unlockType: "totalStats" as const, unlockValue: 1_000_000_000 },
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

// Map Torn API gym IDs to our dots values
// API IDs from https://api.torn.com/v2/torn/gyms
export const API_GYM_ID_TO_DOTS: Record<number, number> = {
  1: 2.0,   // Premier Fitness
  2: 3.0,   // Average Joes
  3: 4.0,   // Woody's Workout Club
  4: 5.0,   // Beach Bods
  5: 6.0,   // Silver Gym
  6: 6.0,   // Pour Femme
  7: 6.0,   // Davies Den
  8: 7.0,   // Global Gym
  9: 8.0,   // Knuckle Heads
  10: 8.0,  // Pioneer Fitness
  11: 8.0,  // Anabolic Anomalies
  12: 8.0,  // Core
  13: 9.0,  // Racing Fitness
  14: 9.0,  // Complete Cardio
  15: 9.0,  // Legs, Bums and Tums
  16: 10.0, // Deep Burn
  17: 10.0, // Apollo Gym
  18: 10.0, // Gun Shop
  19: 11.0, // Force Training
  20: 11.0, // Cha Cha's
  21: 11.0, // Atlas
  22: 11.5, // Last Round
  23: 11.5, // The Edge
  24: 20.0, // George's
  25: 39.0, // Balboas Gym
  26: 12.0, // Frontline Fitness
  27: 10.0, // Gym 3000 (Mr. Isoyamas equivalent)
  28: 10.0, // Mr. Isoyamas
  29: 10.0, // Total Rebound
  30: 10.0, // Elites
  31: 12.0, // The Sports Science Lab
  32: 39.0, // Unknown (endgame)
  33: 5.0,  // The Jail Gym
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
