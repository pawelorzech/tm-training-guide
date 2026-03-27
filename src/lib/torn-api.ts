import type { TornUserData, TornMerits, TornSteadfast } from '@/types/torn-api';

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

// Merit IDs for stat passives (from Torn API /torn/merits)
const MERIT_IDS = { brawn: 9, sharpness: 10, evasion: 11, protection: 12 };

function parseMerits(data: Record<string, unknown>): TornMerits {
  const upgrades = ((data.merits as Record<string, unknown>)?.upgrades as Array<{ id: number; level: number }>) ?? [];
  const byId = new Map(upgrades.map(u => [u.id, u.level]));
  return {
    brawn: byId.get(MERIT_IDS.brawn) ?? 0,
    sharpness: byId.get(MERIT_IDS.sharpness) ?? 0,
    evasion: byId.get(MERIT_IDS.evasion) ?? 0,
    protection: byId.get(MERIT_IDS.protection) ?? 0,
  };
}

// Steadfast upgrade IDs (from faction peace branch)
const STEADFAST_IDS: Record<number, keyof TornSteadfast> = {
  36: 'strength', 37: 'speed', 38: 'defense', 39: 'dexterity',
};

function parseSteadfast(data: Record<string, unknown>): TornSteadfast {
  const result: TornSteadfast = { strength: 0, defense: 0, speed: 0, dexterity: 0 };
  try {
    const upgrades = data.upgrades as Record<string, unknown>;
    const peace = upgrades?.peace as Array<Record<string, unknown>> | undefined;
    if (!peace) return result;
    for (const branch of peace) {
      if (branch.name !== 'Steadfast') continue;
      const branchUpgrades = branch.upgrades as Array<{ id: number; level: number; ability: string }> | undefined;
      if (!branchUpgrades) continue;
      for (const upg of branchUpgrades) {
        const stat = STEADFAST_IDS[upg.id];
        if (stat) {
          // Parse "Increases defense gym gains by 15%" → 15
          const match = upg.ability.match(/(\d+)%/);
          result[stat] = match ? parseInt(match[1]) : upg.level;
        }
      }
    }
  } catch { /* faction data may not be accessible with limited key */ }
  return result;
}

function parseEducation(data: Record<string, unknown>): number[] {
  const edu = data.education as Record<string, unknown> | undefined;
  return (edu?.complete as number[]) ?? [];
}

export async function fetchUserData(apiKey: string): Promise<TornUserData> {
  // Fetch all endpoints in parallel
  const [profileData, statsData, barsData, gymData, drugStatsData, meritsData, educationData, factionData] = await Promise.all([
    fetchEndpoint('user', apiKey),
    fetchEndpoint('user/battlestats', apiKey),
    fetchEndpoint('user/bars', apiKey),
    fetchEndpoint('user/gym', apiKey),
    fetchEndpoint('user/personalstats?cat=drugs', apiKey),
    fetchEndpoint('user/merits', apiKey),
    fetchEndpoint('user/education', apiKey),
    fetchEndpoint('faction?selections=upgrades', apiKey).catch(() => ({ upgrades: {} })), // may fail with limited key
  ]);

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
    merits: parseMerits(meritsData),
    steadfast: parseSteadfast(factionData),
    educationCompleted: parseEducation(educationData),
  };
}
