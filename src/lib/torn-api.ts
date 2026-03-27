import type { TornUserData } from '@/types/torn-api';

const TORN_API_BASE = 'https://api.torn.com/v2/';

export class TornApiError extends Error {
  code: number;
  constructor(code: number, message?: string) {
    super(message || `Torn API error (code ${code})`);
    this.code = code;
  }
}

export async function fetchUserData(apiKey: string): Promise<TornUserData> {
  const selections = [
    'profile', 'battlestats', 'bars', 'gym', 'personalstats',
  ].join(',');

  const response = await fetch(
    `${TORN_API_BASE}user?selections=${selections}&key=${apiKey}`
  );

  if (!response.ok) {
    throw new TornApiError(response.status, `HTTP ${response.status}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new TornApiError(data.error.code, data.error.error);
  }

  return {
    profile: data.profile ?? { name: 'Unknown', level: 0, player_id: 0, faction: null },
    battlestats: data.battlestats ?? { strength: 0, defense: 0, speed: 0, dexterity: 0, total: 0, strength_modifier: 0, defense_modifier: 0, speed_modifier: 0, dexterity_modifier: 0 },
    bars: data.bars ?? { happy: { current: 0, maximum: 0 }, energy: { current: 0, maximum: 0 } },
    gym: data.gym ?? { active_gym: 0 },
    personalstats: data.personalstats ?? { xantaken: 0, exttaken: 0, energydrinkused: 0 },
  };
}
