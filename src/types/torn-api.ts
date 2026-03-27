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

export interface TornUserData {
  profile: TornProfile;
  battlestats: TornBattleStats;
  bars: TornBars;
  gym: TornGym;
  personalstats: TornPersonalStats;
}

export interface TornApiError {
  code: number;
  error: string;
}
