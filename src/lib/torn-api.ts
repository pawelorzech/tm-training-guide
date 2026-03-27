import type { TornUserData } from '@/types/torn-api';

const TORN_API_BASE = 'https://api.torn.com/v2/';

export class TornApiError extends Error {
  code: number;
  constructor(code: number, message?: string) {
    super(message || `Torn API error (code ${code})`);
    this.code = code;
  }
}

async function fetchEndpoint(path: string, apiKey: string): Promise<Record<string, unknown>> {
  const url = `${TORN_API_BASE}${path}${path.includes('?') ? '&' : '?'}key=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new TornApiError(response.status, `HTTP ${response.status}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new TornApiError(data.error.code, data.error.error);
  }

  return data;
}

export async function fetchUserData(apiKey: string): Promise<TornUserData> {
  // v2 API uses separate sub-endpoints, fetch them in parallel
  const [profileData, statsData, barsData, gymData, drugStatsData] = await Promise.all([
    fetchEndpoint('user', apiKey),
    fetchEndpoint('user/battlestats', apiKey),
    fetchEndpoint('user/bars', apiKey),
    fetchEndpoint('user/gym', apiKey),
    fetchEndpoint('user/personalstats?cat=drugs', apiKey),
  ]);

  // Profile comes from the base /user endpoint
  const profile = profileData.profile as Record<string, unknown> | undefined;
  const battlestats = statsData.battlestats as Record<string, unknown> | undefined;
  const bars = barsData.bars as Record<string, unknown> | undefined;
  const drugs = (drugStatsData.personalstats as Record<string, unknown> | undefined)?.drugs as Record<string, unknown> | undefined;

  return {
    profile: {
      name: (profile?.name as string) ?? 'Unknown',
      level: (profile?.level as number) ?? 0,
      player_id: (profile?.id as number) ?? 0,
      faction: profile?.faction_id
        ? { name: '', tag: '', faction_id: profile.faction_id as number }
        : null,
    },
    battlestats: {
      strength: ((battlestats?.strength as Record<string, unknown>)?.value as number) ?? 0,
      defense: ((battlestats?.defense as Record<string, unknown>)?.value as number) ?? 0,
      speed: ((battlestats?.speed as Record<string, unknown>)?.value as number) ?? 0,
      dexterity: ((battlestats?.dexterity as Record<string, unknown>)?.value as number) ?? 0,
      total: ((battlestats?.total as number) ?? 0),
      strength_modifier: ((battlestats?.strength as Record<string, unknown>)?.modifier as number) ?? 0,
      defense_modifier: ((battlestats?.defense as Record<string, unknown>)?.modifier as number) ?? 0,
      speed_modifier: ((battlestats?.speed as Record<string, unknown>)?.modifier as number) ?? 0,
      dexterity_modifier: ((battlestats?.dexterity as Record<string, unknown>)?.modifier as number) ?? 0,
    },
    bars: {
      happy: {
        current: ((bars?.happy as Record<string, unknown>)?.current as number) ?? 0,
        maximum: ((bars?.happy as Record<string, unknown>)?.maximum as number) ?? 0,
      },
      energy: {
        current: ((bars?.energy as Record<string, unknown>)?.current as number) ?? 0,
        maximum: ((bars?.energy as Record<string, unknown>)?.maximum as number) ?? 0,
      },
    },
    gym: {
      active_gym: (gymData.active_gym as number) ?? 0,
    },
    personalstats: {
      xantaken: (drugs?.xanax as number) ?? 0,
      exttaken: (drugs?.ecstasy as number) ?? 0,
      energydrinkused: (drugs?.total as number) ?? 0,
    },
  };
}
