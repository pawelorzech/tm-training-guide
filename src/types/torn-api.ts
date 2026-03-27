export type StatType = 'STR' | 'DEF' | 'SPD' | 'DEX';

export interface TornProfile {
  name: string;
  level: number;
  player_id: number;
  faction: { name: string; tag: string; faction_id: number } | null;
}

export interface TornBattleStats {
  strength: number;
  defense: number;
  speed: number;
  dexterity: number;
  total: number;
  strength_modifier: number;
  defense_modifier: number;
  speed_modifier: number;
  dexterity_modifier: number;
}

export interface TornBars {
  happy: { current: number; maximum: number };
  energy: { current: number; maximum: number };
}

export interface TornGym {
  active_gym: number;
}

export interface TornPersonalStats {
  xantaken: number;
  exttaken: number;
  energydrinkused: number;
}

export interface TornMerits {
  brawn: number;      // STR passive, merit id 9
  sharpness: number;  // SPD passive, merit id 10
  evasion: number;    // DEX passive, merit id 11
  protection: number; // DEF passive, merit id 12
}

export interface TornSteadfast {
  strength: number;  // % bonus
  defense: number;
  speed: number;
  dexterity: number;
}

export interface TornUserData {
  profile: TornProfile;
  battlestats: TornBattleStats;
  bars: TornBars;
  gym: TornGym;
  personalstats: TornPersonalStats;
  merits: TornMerits;
  steadfast: TornSteadfast;
  educationCompleted: number[];
}

export interface TornApiError {
  code: number;
  error: string;
}
