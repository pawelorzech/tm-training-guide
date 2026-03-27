# TM Training Guide & Calculator — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static Next.js site that teaches Torn.com gym training and provides a personalized calculator, deployed to train.tri.ovh via Coolify.

**Architecture:** Next.js 15 App Router with `output: 'export'` for static site generation. All state lives client-side (React hooks + localStorage). Torn API calls are client-side fetch. No backend, no database. Chart.js for visualizations. Tailwind CSS dark theme.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Chart.js (react-chartjs-2), Vitest

**Reference docs:** `docs/PRD.md` (full game mechanics + requirements), `docs/plan.md` (detailed architecture reference)

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (dark theme, fonts, metadata)
│   ├── page.tsx                # Main page — assembles all sections
│   └── globals.css             # Tailwind base + custom CSS variables
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Title, API key input, profile badge
│   │   ├── Footer.tsx          # Credits, links
│   │   ├── TableOfContents.tsx # Sidebar nav with scroll tracking
│   │   └── RecommendationsPanel.tsx # Floating recommendations
│   ├── calculator/
│   │   ├── ApiKeyInput.tsx     # API key entry + fetch trigger
│   │   ├── StatInputPanel.tsx  # All input fields
│   │   ├── ResultsPanel.tsx    # Calculated outputs
│   │   ├── ComparisonToggle.tsx # "What if" mode
│   │   └── EnergySourcePicker.tsx # Energy source checkboxes
│   ├── charts/
│   │   ├── StatProjectionChart.tsx
│   │   ├── HappyRelevanceChart.tsx
│   │   └── EnergyCostChart.tsx
│   └── guide/
│       ├── Section01_GettingStarted.tsx
│       ├── Section02_GymFormula.tsx
│       ├── Section03_HappyJumping.tsx
│       ├── Section04_GymProgression.tsx
│       ├── Section05_EnergyManagement.tsx
│       ├── Section06_StatEnhancers.tsx
│       ├── Section07_CompanyPerks.tsx
│       ├── Section08_MeritsAndBooks.tsx
│       └── Section09_TrainingBreak.tsx
├── lib/
│   ├── formulas.ts             # All gym/training math (pure functions)
│   ├── torn-api.ts             # Torn API fetch client
│   ├── recommendations.ts     # Recommendation engine
│   ├── constants.ts            # Game data constants
│   └── format.ts               # Number formatting
├── hooks/
│   ├── useTornApi.ts           # API data fetching hook
│   ├── useCalculator.ts        # Central calculator state
│   └── useLocalStorage.ts      # Typed localStorage hook
└── types/
    ├── torn-api.ts             # Torn API response types
    └── calculator.ts           # Calculator state/result types
```

Test files: `__tests__/formulas.test.ts`, `__tests__/recommendations.test.ts`, `__tests__/format.test.ts`

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `vitest.config.ts`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/pawelorzech/Programowanie/tm-training-guide
npx create-next-app@latest . --typescript --tailwind --app --src-dir --no-import-alias --yes
```

- [ ] **Step 2: Configure static export in next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

- [ ] **Step 3: Install dependencies**

```bash
npm install react-chartjs-2 chart.js
npm install -D vitest @vitejs/plugin-react
```

- [ ] **Step 4: Create vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
```

- [ ] **Step 5: Add test script to package.json**

Add `"test": "vitest run"` and `"test:watch": "vitest"` to scripts.

- [ ] **Step 6: Set up globals.css with Torn dark theme**

```css
@import "tailwindcss";

:root {
  --torn-green: #7ca900;
  --torn-green-dark: #5a7a00;
  --bg-primary: #0f0f1a;
  --bg-secondary: #1a1a2e;
  --bg-card: #16213e;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0a0;
  --accent: var(--torn-green);
  --danger: #e74c3c;
  --warning: #f39c12;
  --success: var(--torn-green);
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
}
```

- [ ] **Step 7: Update layout.tsx with metadata**

```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TM Training Guide",
  description: "Torn.com gym training guide & calculator for The Masters faction",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```

Expected: Dev server starts at localhost:3000, shows default page with dark background.

- [ ] **Step 9: Commit**

```bash
git init && git add -A && git commit -m "feat: scaffold Next.js project with dark theme and static export config"
```

---

### Task 2: Types

**Files:**
- Create: `src/types/torn-api.ts`, `src/types/calculator.ts`

- [ ] **Step 1: Create Torn API types**

File `src/types/torn-api.ts`:

```typescript
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
```

- [ ] **Step 2: Create calculator types**

File `src/types/calculator.ts`:

```typescript
import { StatType } from './torn-api';

export interface EnergySources {
  natural: boolean;
  xanax: boolean;
  pointRefill: boolean;
  fhc: boolean;
  energyCans: number; // 0-6
}

export type BookBonus = 'none' | 'single30' | 'all20';

export interface CalculatorState {
  currentStat: number;
  trainedStat: StatType;
  gymDots: number;
  happy: number;
  steadfastBonus: number;
  educationBonus: number;
  companyType: string | null;
  companyStarLevel: number;
  bookBonus: BookBonus;
  meritLevel: number;
  energySources: EnergySources;
}

export interface FhcComparison {
  useGain: number;
  sellAndBuyXanaxGain: number;
  ratio: number;
}

export interface SeComparison {
  seGain: number;
  seCostPerStat: number;
  xanaxCostPerStat: number;
  ratio: number;
}

export interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  category: 'energy' | 'gym' | 'company' | 'items' | 'warning';
}

export interface CalculatorResults {
  gainPerEnergy: number;
  gainPerNatural: number;
  gainPerXanax: number;
  gainPerDay: number;
  happyContributionPercent: number;
  fhcComparison: FhcComparison;
  seComparison: SeComparison;
  daysToNextMilestone: number;
  nextMilestone: number;
  monthlyProjection: number;
  yearlyProjection: number;
  recommendations: Recommendation[];
}
```

- [ ] **Step 3: Commit**

```bash
git add src/types/ && git commit -m "feat: add TypeScript types for Torn API and calculator"
```

---

### Task 3: Constants

**Files:**
- Create: `src/lib/constants.ts`

- [ ] **Step 1: Create constants file with all game data**

File `src/lib/constants.ts` — copy gym data, company data, energy sources, merit definitions, and default prices exactly from `docs/plan.md` "Data Reference" section. This file contains all static game data as typed constants. See `docs/plan.md` lines 682-815 for the complete data.

Key constants to include:
- `GYMS` array (14 gyms with id, name, dots, unlock conditions)
- `TRAINING_COMPANIES` array (8 companies with star-level perks)
- `ENERGY_SOURCES` array (6 sources with energy, cost, cooldown)
- `MERIT_STAT_BONUSES` object (STR/DEF/SPD/DEX with perLevel 0.03, maxLevel 10)
- `DEFAULT_PRICES` object (xanax: 839_000, fhc: 12_500_000, statEnhancer: 450_000_000, etc.)
- `STAT_MILESTONES` array: `[100_000_000, 250_000_000, 500_000_000, 1_000_000_000, 2_000_000_000, 5_000_000_000, 10_000_000_000]`

- [ ] **Step 2: Commit**

```bash
git add src/lib/constants.ts && git commit -m "feat: add game data constants (gyms, companies, energy sources, prices)"
```

---

### Task 4: Number Formatting (TDD)

**Files:**
- Create: `src/lib/format.ts`, `__tests__/format.test.ts`

- [ ] **Step 1: Write failing tests**

File `__tests__/format.test.ts`:

```typescript
import { describe, test, expect } from 'vitest';
import { formatStatShort, formatStatFull, formatMoney, formatMultiplier, formatPercent } from '../src/lib/format';

describe('formatStatShort', () => {
  test('formats billions', () => {
    expect(formatStatShort(1_276_323_613)).toBe('1.28B');
  });
  test('formats exact billion', () => {
    expect(formatStatShort(1_000_000_000)).toBe('1.00B');
  });
  test('formats millions', () => {
    expect(formatStatShort(500_000_000)).toBe('500M');
  });
  test('formats small millions', () => {
    expect(formatStatShort(12_500_000)).toBe('12.5M');
  });
  test('formats thousands', () => {
    expect(formatStatShort(250_000)).toBe('250K');
  });
  test('formats small numbers as-is', () => {
    expect(formatStatShort(999)).toBe('999');
  });
  test('formats zero', () => {
    expect(formatStatShort(0)).toBe('0');
  });
});

describe('formatStatFull', () => {
  test('formats with commas', () => {
    expect(formatStatFull(1_276_323_613)).toBe('1,276,323,613');
  });
  test('formats small number', () => {
    expect(formatStatFull(999)).toBe('999');
  });
});

describe('formatMoney', () => {
  test('formats thousands', () => {
    expect(formatMoney(839_000)).toBe('$839K');
  });
  test('formats millions', () => {
    expect(formatMoney(12_500_000)).toBe('$12.5M');
  });
  test('formats billions', () => {
    expect(formatMoney(450_000_000)).toBe('$450M');
  });
  test('formats zero', () => {
    expect(formatMoney(0)).toBe('$0');
  });
});

describe('formatMultiplier', () => {
  test('formats ratio', () => {
    expect(formatMultiplier(24.83)).toBe('24.8x');
  });
  test('formats small ratio', () => {
    expect(formatMultiplier(1.5)).toBe('1.5x');
  });
});

describe('formatPercent', () => {
  test('formats small percent', () => {
    expect(formatPercent(0.00418)).toBe('0.004%');
  });
  test('formats large percent', () => {
    expect(formatPercent(35.7)).toBe('35.7%');
  });
  test('formats with custom decimals', () => {
    expect(formatPercent(35.789, 1)).toBe('35.8%');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run __tests__/format.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement format.ts**

File `src/lib/format.ts`:

```typescript
export function formatStatShort(value: number): string {
  if (value === 0) return '0';
  if (value >= 1_000_000_000) {
    const b = value / 1_000_000_000;
    return b >= 10 ? `${Math.round(b)}B` : `${b.toFixed(2).replace(/\.?0+$/, '')}B`;
  }
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return m >= 100 ? `${Math.round(m)}M` : `${m.toFixed(1).replace(/\.?0+$/, '')}M`;
  }
  if (value >= 1_000) {
    const k = value / 1_000;
    return k >= 100 ? `${Math.round(k)}K` : `${k.toFixed(1).replace(/\.?0+$/, '')}K`;
  }
  return Math.round(value).toString();
}

export function formatStatFull(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

export function formatMoney(value: number): string {
  if (value === 0) return '$0';
  if (value >= 1_000_000_000) {
    const b = value / 1_000_000_000;
    return `$${b.toFixed(1).replace(/\.?0+$/, '')}B`;
  }
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `$${m.toFixed(1).replace(/\.?0+$/, '')}M`;
  }
  if (value >= 1_000) {
    const k = value / 1_000;
    return `$${k.toFixed(0).replace(/\.?0+$/, '')}K`;
  }
  return `$${value}`;
}

export function formatMultiplier(value: number): string {
  return `${value.toFixed(1)}x`;
}

export function formatPercent(value: number, decimals?: number): string {
  if (decimals !== undefined) {
    return `${value.toFixed(decimals)}%`;
  }
  if (value < 0.01) return `${value.toFixed(3)}%`;
  if (value < 1) return `${value.toFixed(2)}%`;
  return `${value.toFixed(1)}%`;
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run __tests__/format.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/format.ts __tests__/format.test.ts && git commit -m "feat: add number formatting utilities with tests"
```

---

### Task 5: Core Gym Formulas (TDD)

**Files:**
- Create: `src/lib/formulas.ts`, `__tests__/formulas.test.ts`

- [ ] **Step 1: Write failing tests**

File `__tests__/formulas.test.ts`:

```typescript
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
      gymDots: 39,
      currentStat: 1_276_323_613,
      happy: 4443,
      steadfastBonus: 0,
      educationBonus: 0.10,
      energyUsed: 1,
    });
    // Expected ~3,533 DEF per energy — allow 10% tolerance for education variance
    expect(gain).toBeGreaterThan(3000);
    expect(gain).toBeLessThan(4000);
  });

  test('gain scales linearly with energy', () => {
    const gain1 = calculateGymGain({
      gymDots: 39, currentStat: 1_000_000_000, happy: 4000,
      steadfastBonus: 0, educationBonus: 0, energyUsed: 1,
    });
    const gain10 = calculateGymGain({
      gymDots: 39, currentStat: 1_000_000_000, happy: 4000,
      steadfastBonus: 0, educationBonus: 0, energyUsed: 10,
    });
    expect(gain10).toBeCloseTo(gain1 * 10, 0);
  });

  test('gain scales with gym dots', () => {
    const params = {
      currentStat: 1_000_000_000, happy: 4000,
      steadfastBonus: 0, educationBonus: 0, energyUsed: 1,
    };
    const gainGeorges = calculateGymGain({ ...params, gymDots: 20 });
    const gainBalboas = calculateGymGain({ ...params, gymDots: 39 });
    expect(gainBalboas / gainGeorges).toBeCloseTo(39 / 20, 1);
  });

  test('steadfast bonus increases gain', () => {
    const params = {
      gymDots: 39, currentStat: 1_000_000_000, happy: 4000,
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
      gymDots: 39,
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
      gymDots: 39,
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

  test('natural + xanax = 150 + 250 * 2 = 650E worth', () => {
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
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run __tests__/formulas.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement formulas.ts**

File `src/lib/formulas.ts`:

```typescript
import type { EnergySources } from '@/types/calculator';

export interface GymGainParams {
  gymDots: number;
  currentStat: number;
  happy: number;
  steadfastBonus: number;
  educationBonus: number;
  energyUsed: number;
}

export function calculateGymGain(params: GymGainParams): number {
  const { gymDots, currentStat, happy, steadfastBonus, educationBonus, energyUsed } = params;
  const statComponent = 0.00019106 * currentStat;
  const happyComponent = 0.00226263 * happy;
  const inner = statComponent + happyComponent + 0.55;
  const raw = (gymDots * 4) * inner * (1 + steadfastBonus + educationBonus) / 150 * energyUsed;
  return raw;
}

export function calculateHappyContribution(currentStat: number, happy: number): number {
  const statComponent = 0.00019106 * currentStat;
  const happyComponent = 0.00226263 * happy;
  const total = statComponent + happyComponent + 0.55;
  return (happyComponent / total) * 100;
}

export interface FhcComparisonParams {
  currentStat: number;
  gymDots: number;
  happy: number;
  steadfastBonus: number;
  educationBonus: number;
  fhcSellPrice: number;
  xanaxPrice: number;
}

export function compareFhcUseVsSell(params: FhcComparisonParams) {
  const { fhcSellPrice, xanaxPrice, ...gymParams } = params;
  const gainPerEnergy = calculateGymGain({ ...gymParams, energyUsed: 1 });
  const useGain = gainPerEnergy * 150; // FHC gives 150E
  const xanaxCount = fhcSellPrice / xanaxPrice;
  const sellAndBuyXanaxGain = xanaxCount * 250 * gainPerEnergy;
  return { useGain, sellAndBuyXanaxGain, ratio: sellAndBuyXanaxGain / useGain };
}

export interface SeComparisonParams {
  currentStat: number;
  sePrice: number;
  xanaxPrice: number;
  gymDots: number;
  happy: number;
  steadfastBonus: number;
  educationBonus: number;
}

export function compareStatEnhancer(params: SeComparisonParams) {
  const { currentStat, sePrice, xanaxPrice, ...gymParams } = params;
  const seGain = currentStat * 0.01;
  const seCostPerStat = sePrice / seGain;
  const gainPerEnergy = calculateGymGain({
    ...gymParams, currentStat, energyUsed: 1,
  });
  const xanaxGain = gainPerEnergy * 250;
  const xanaxCostPerStat = xanaxPrice / xanaxGain;
  return { seGain, seCostPerStat, xanaxCostPerStat, ratio: seCostPerStat / xanaxCostPerStat };
}

export function projectDailyGain(params: {
  gainPerEnergy: number;
  energySources: EnergySources;
}): number {
  const { gainPerEnergy, energySources } = params;
  let totalEnergy = 0;
  if (energySources.natural) totalEnergy += 150;
  if (energySources.xanax) totalEnergy += 250 * 2; // 2 Xanax per day (~8h cooldown)
  if (energySources.pointRefill) totalEnergy += 150;
  if (energySources.fhc) totalEnergy += 150;
  totalEnergy += energySources.energyCans * 25;
  return gainPerEnergy * totalEnergy;
}

export function daysToMilestone(currentStat: number, targetStat: number, dailyGain: number): number {
  if (currentStat >= targetStat) return 0;
  return Math.ceil((targetStat - currentStat) / dailyGain);
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run __tests__/formulas.test.ts
```

Expected: All PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/formulas.ts __tests__/formulas.test.ts && git commit -m "feat: implement core gym formula engine with tests"
```

---

### Task 6: Torn API Client

**Files:**
- Create: `src/lib/torn-api.ts`

- [ ] **Step 1: Implement API client**

File `src/lib/torn-api.ts`:

```typescript
import type { TornUserData, TornApiError as TornApiErrorType } from '@/types/torn-api';

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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/torn-api.ts && git commit -m "feat: add Torn API v2 client with error handling"
```

---

### Task 7: Recommendations Engine (TDD)

**Files:**
- Create: `src/lib/recommendations.ts`, `__tests__/recommendations.test.ts`

- [ ] **Step 1: Write failing tests**

File `__tests__/recommendations.test.ts`:

```typescript
import { describe, test, expect } from 'vitest';
import { generateRecommendations } from '../src/lib/recommendations';
import type { CalculatorState, CalculatorResults } from '../src/types/calculator';

const baseState: CalculatorState = {
  currentStat: 1_000_000_000,
  trainedStat: 'DEF',
  gymDots: 39,
  happy: 4000,
  steadfastBonus: 0,
  educationBonus: 0,
  companyType: null,
  companyStarLevel: 0,
  bookBonus: 'none',
  meritLevel: 0,
  energySources: { natural: true, xanax: false, pointRefill: false, fhc: false, energyCans: 0 },
};

const baseResults: CalculatorResults = {
  gainPerEnergy: 3000,
  gainPerNatural: 450000,
  gainPerXanax: 750000,
  gainPerDay: 450000,
  happyContributionPercent: 0.005,
  fhcComparison: { useGain: 450000, sellAndBuyXanaxGain: 11000000, ratio: 24.4 },
  seComparison: { seGain: 10000000, seCostPerStat: 45, xanaxCostPerStat: 0.95, ratio: 47 },
  daysToNextMilestone: 200,
  nextMilestone: 2_000_000_000,
  monthlyProjection: 1_013_500_000,
  yearlyProjection: 1_164_250_000,
  recommendations: [],
};

describe('generateRecommendations', () => {
  test('suggests happy is irrelevant at high stats', () => {
    const recs = generateRecommendations(baseState, { ...baseResults, happyContributionPercent: 0.005 });
    const happyRec = recs.find(r => r.id === 'happy-irrelevant');
    expect(happyRec).toBeDefined();
    expect(happyRec!.priority).toBe('low');
  });

  test('suggests happy jumping at low stats', () => {
    const recs = generateRecommendations(
      { ...baseState, currentStat: 10_000 },
      { ...baseResults, happyContributionPercent: 30 },
    );
    const happyRec = recs.find(r => r.id === 'happy-jumping');
    expect(happyRec).toBeDefined();
    expect(happyRec!.priority).toBe('medium');
  });

  test('warns about SSL at 120+ xanax+ecstasy', () => {
    const recs = generateRecommendations(baseState, baseResults, {
      personalstats: { xantaken: 100, exttaken: 25, energydrinkused: 0 },
    } as any);
    const sslRec = recs.find(r => r.id === 'ssl-warning');
    expect(sslRec).toBeDefined();
    expect(sslRec!.priority).toBe('high');
  });

  test('recommends xanax when not using it', () => {
    const recs = generateRecommendations(baseState, baseResults);
    const xanaxRec = recs.find(r => r.id === 'use-xanax');
    expect(xanaxRec).toBeDefined();
  });

  test('suggests selling FHC', () => {
    const recs = generateRecommendations(
      { ...baseState, energySources: { ...baseState.energySources, fhc: true } },
      baseResults,
    );
    const fhcRec = recs.find(r => r.id === 'sell-fhc');
    expect(fhcRec).toBeDefined();
    expect(fhcRec!.priority).toBe('high');
  });

  test('suggests books when none active', () => {
    const recs = generateRecommendations(baseState, baseResults);
    const bookRec = recs.find(r => r.id === 'use-book');
    expect(bookRec).toBeDefined();
  });

  test('returns max 5 recommendations', () => {
    const recs = generateRecommendations(baseState, baseResults);
    expect(recs.length).toBeLessThanOrEqual(5);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run __tests__/recommendations.test.ts
```

- [ ] **Step 3: Implement recommendations.ts**

File `src/lib/recommendations.ts`:

```typescript
import type { CalculatorState, CalculatorResults, Recommendation } from '@/types/calculator';
import type { TornUserData } from '@/types/torn-api';
import { GYMS } from './constants';
import { formatStatShort, formatMoney, formatMultiplier } from './format';

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

  // Gym upgrade available
  const currentGymIndex = GYMS.findIndex(g => g.dots === state.gymDots);
  if (currentGymIndex >= 0 && currentGymIndex < GYMS.length - 1) {
    const nextGym = GYMS[currentGymIndex + 1];
    const qualifies = checkGymUnlock(nextGym, state.currentStat);
    if (qualifies) {
      const improvement = ((nextGym.dots / state.gymDots) - 1) * 100;
      recs.push({
        id: 'upgrade-gym',
        priority: 'high',
        title: `Switch to ${nextGym.name}`,
        description: `You qualify for ${nextGym.name} (${nextGym.dots} dots). That's +${improvement.toFixed(0)}% gains over your current gym.`,
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

function checkGymUnlock(gym: typeof GYMS[number], currentStat: number): boolean {
  if (gym.unlockType === 'none') return true;
  if (gym.unlockType === 'anyStat') return currentStat >= gym.unlockValue;
  if (gym.unlockType === 'totalStats') return currentStat * 4 >= gym.unlockValue; // rough estimate
  return currentStat >= gym.unlockValue;
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run __tests__/recommendations.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/recommendations.ts __tests__/recommendations.test.ts && git commit -m "feat: implement recommendation engine with tests"
```

---

### Task 8: React Hooks

**Files:**
- Create: `src/hooks/useLocalStorage.ts`, `src/hooks/useTornApi.ts`, `src/hooks/useCalculator.ts`

- [ ] **Step 1: Implement useLocalStorage hook**

```typescript
// src/hooks/useLocalStorage.ts
'use client';
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) setStoredValue(JSON.parse(item));
    } catch { /* ignore */ }
  }, [key]);

  const setValue = (value: T) => {
    setStoredValue(value);
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch { /* ignore */ }
  };

  return [storedValue, setValue];
}
```

- [ ] **Step 2: Implement useTornApi hook**

```typescript
// src/hooks/useTornApi.ts
'use client';
import { useState, useCallback } from 'react';
import type { TornUserData } from '@/types/torn-api';
import { fetchUserData, TornApiError } from '@/lib/torn-api';

interface UseTornApiReturn {
  data: TornUserData | null;
  loading: boolean;
  error: string | null;
  fetch: (apiKey: string) => Promise<void>;
  clear: () => void;
}

export function useTornApi(): UseTornApiReturn {
  const [data, setData] = useState<TornUserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (apiKey: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchUserData(apiKey);
      setData(result);
    } catch (e) {
      if (e instanceof TornApiError) {
        if (e.code === 2) setError('Invalid API key');
        else if (e.code === 5) setError('Rate limited — please wait');
        else setError(e.message);
      } else {
        setError('Could not reach Torn API. Enter stats manually.');
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, fetch: fetchData, clear };
}
```

- [ ] **Step 3: Implement useCalculator hook**

```typescript
// src/hooks/useCalculator.ts
'use client';
import { useState, useMemo, useEffect } from 'react';
import type { CalculatorState, CalculatorResults, EnergySources } from '@/types/calculator';
import type { TornUserData } from '@/types/torn-api';
import { calculateGymGain, calculateHappyContribution, compareFhcUseVsSell, compareStatEnhancer, projectDailyGain, daysToMilestone } from '@/lib/formulas';
import { generateRecommendations } from '@/lib/recommendations';
import { DEFAULT_PRICES, STAT_MILESTONES } from '@/lib/constants';

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
    setState(prev => ({
      ...prev,
      currentStat: apiData.battlestats.defense,
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

    const recommendations = generateRecommendations(state, {
      gainPerEnergy,
      gainPerNatural: gainPerEnergy * 150,
      gainPerXanax: gainPerEnergy * 250,
      gainPerDay,
      happyContributionPercent,
      fhcComparison,
      seComparison,
      daysToNextMilestone: gainPerDay > 0 ? daysToMilestone(state.currentStat, nextMilestone, gainPerDay) : Infinity,
      nextMilestone,
      monthlyProjection: state.currentStat + gainPerDay * 30,
      yearlyProjection: state.currentStat + gainPerDay * 365,
      recommendations: [],
    }, apiData ?? undefined);

    return {
      gainPerEnergy,
      gainPerNatural: gainPerEnergy * 150,
      gainPerXanax: gainPerEnergy * 250,
      gainPerDay,
      happyContributionPercent,
      fhcComparison,
      seComparison,
      daysToNextMilestone: gainPerDay > 0 ? daysToMilestone(state.currentStat, nextMilestone, gainPerDay) : Infinity,
      nextMilestone,
      monthlyProjection: state.currentStat + gainPerDay * 30,
      yearlyProjection: state.currentStat + gainPerDay * 365,
      recommendations,
    };
  }, [state, apiData]);

  return { state, updateField, results };
}
```

- [ ] **Step 4: Commit**

```bash
git add src/hooks/ && git commit -m "feat: add React hooks for localStorage, Torn API, and calculator state"
```

---

### Task 9: UI Components — Layout

**Files:**
- Create: `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/TableOfContents.tsx`, `src/components/layout/RecommendationsPanel.tsx`

Build all 4 layout components. See `docs/plan.md` steps 3.1 and 4.1 for detailed specs:
- **Header:** Title "TM Training Guide", subtitle, API key input area, profile badge when loaded
- **Footer:** "Built by bombel for The Masters", Torn API link, version
- **TableOfContents:** Desktop sidebar with section links, highlights current section using IntersectionObserver, collapses on mobile
- **RecommendationsPanel:** Shows top 5 recommendations with priority badges (high=red, medium=yellow, low=gray), updates reactively

- [ ] **Step 1: Implement all 4 layout components**
- [ ] **Step 2: Commit**

```bash
git add src/components/layout/ && git commit -m "feat: add layout components (Header, Footer, TOC, Recommendations)"
```

---

### Task 10: UI Components — Calculator

**Files:**
- Create: `src/components/calculator/ApiKeyInput.tsx`, `src/components/calculator/StatInputPanel.tsx`, `src/components/calculator/ResultsPanel.tsx`, `src/components/calculator/ComparisonToggle.tsx`, `src/components/calculator/EnergySourcePicker.tsx`

Build all 5 calculator components. See `docs/plan.md` steps 3.2 for detailed specs:
- **ApiKeyInput:** Password-masked input, "Load My Stats" button, loading/success/error states, clear button, privacy notice
- **StatInputPanel:** Grid of inputs for stat value, stat type, gym dots, happy, steadfast %, education %, company, book, merit level. Blue border on API-populated fields.
- **ResultsPanel:** Card-based layout. Hero number "Gain per Energy Point". Supporting cards for daily/monthly/yearly projections, FHC comparison, SE analysis.
- **ComparisonToggle:** Dropdown for "what if" scenarios — companies, books. Side-by-side current vs hypothetical.
- **EnergySourcePicker:** Checkboxes for energy sources with cost labels, total daily energy calculation.

- [ ] **Step 1: Implement all 5 calculator components**
- [ ] **Step 2: Commit**

```bash
git add src/components/calculator/ && git commit -m "feat: add calculator UI components"
```

---

### Task 11: Chart Components

**Files:**
- Create: `src/components/charts/StatProjectionChart.tsx`, `src/components/charts/HappyRelevanceChart.tsx`, `src/components/charts/EnergyCostChart.tsx`

All charts use Chart.js via react-chartjs-2 with dark theme styling. See `docs/plan.md` step 3.3:
- **StatProjectionChart:** Line chart, X=days (30/90/365), Y=stat value, solid "current" + dashed "optimized" lines, milestone markers
- **HappyRelevanceChart:** Line chart, X=stat value (log scale 1K-10B), Y=happy contribution %, user's position marked, color zones
- **EnergyCostChart:** Horizontal bar chart comparing cost per 1K stat for each energy source, color-coded green-to-red

All charts must be dynamically imported (`next/dynamic` with `ssr: false`) since Chart.js doesn't support SSR.

- [ ] **Step 1: Implement all 3 chart components with dynamic imports**
- [ ] **Step 2: Commit**

```bash
git add src/components/charts/ && git commit -m "feat: add Chart.js visualization components"
```

---

### Task 12: Guide Sections

**Files:**
- Create: 9 files in `src/components/guide/` (Section01 through Section09)

Each section follows the pattern from `docs/plan.md` step 3.4:
1. Section title with anchor ID
2. Brief intro text (casual Torn player tone — "you", not "the player")
3. Key data table or visual
4. Interactive element (calculator embed, chart, or comparison)
5. TL;DR box with 1-3 bullet summary

Content comes from `docs/PRD.md` sections 4.2 (guide content) and section 3 (game mechanics). All interactive elements wire into calculator state via props.

Key sections:
- **Section02** embeds the full StatInputPanel + ResultsPanel
- **Section03** embeds HappyRelevanceChart
- **Section04** shows gym table with API-highlighted current gym
- **Section05** embeds EnergyCostChart + EnergySourcePicker
- **Section06** shows SE comparison with live numbers
- **Section07** shows company table with comparison toggle
- **Section08** shows merit impact sliders

- [ ] **Step 1: Implement all 9 guide sections**
- [ ] **Step 2: Commit**

```bash
git add src/components/guide/ && git commit -m "feat: add 9 guide sections with interactive elements"
```

---

### Task 13: Main Page Assembly

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Wire everything together in page.tsx**

The main page:
1. Initializes `useLocalStorage` for API key
2. Initializes `useTornApi` for data fetching
3. Initializes `useCalculator` with API data
4. Renders Header (with API key input)
5. Renders TableOfContents (desktop sidebar)
6. Renders all 9 guide sections in order, passing calculator state/results
7. Renders RecommendationsPanel (floating/sticky)
8. Renders Footer

- [ ] **Step 2: Verify full page renders in dev**

```bash
npm run dev
```

Test: page loads, sections scroll, calculator inputs work, charts render.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx && git commit -m "feat: assemble main page with all sections and calculator"
```

---

### Task 14: Build & Docker

**Files:**
- Create: `Dockerfile`, `.dockerignore`

- [ ] **Step 1: Create Dockerfile**

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/out/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

- [ ] **Step 2: Create nginx.conf**

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ /index.html;
    }
}
```

- [ ] **Step 3: Create .dockerignore**

```
node_modules
.next
out
.git
docs
__tests__
```

- [ ] **Step 4: Run tests**

```bash
npm run test
```

Expected: All tests pass.

- [ ] **Step 5: Build static export**

```bash
npm run build
```

Expected: `out/` directory created with static files.

- [ ] **Step 6: Test Docker locally**

```bash
docker build -t tm-training-guide . && docker run -p 8080:80 tm-training-guide
```

Visit http://localhost:8080 — verify site works.

- [ ] **Step 7: Commit**

```bash
git add Dockerfile .dockerignore nginx.conf && git commit -m "feat: add Docker config for static site deployment"
```

---

### Task 15: Deploy to Coolify

- [ ] **Step 1: Push to git remote (or configure Coolify for local build)**
- [ ] **Step 2: Create new application in Coolify**
  - Build pack: Dockerfile
  - Port: 80
  - Domain: train.tri.ovh
  - SSL: Let's Encrypt
- [ ] **Step 3: Configure DNS for train.tri.ovh**
  - Add A record or CNAME pointing to Coolify server IP
- [ ] **Step 4: Deploy and verify**
  - Visit https://train.tri.ovh
  - Verify SSL works
  - Test calculator, charts, mobile layout

---

## Dependency Graph

```
Task 1 (scaffold) ─┬─> Task 2 (types) ─┬─> Task 3 (constants)
                    │                    ├─> Task 4 (format + tests)
                    │                    └─> Task 6 (API client)
                    │
                    └─> Task 5 (formulas + tests) ──> Task 7 (recommendations + tests)
                                                           │
Task 8 (hooks) <── depends on Tasks 3,4,5,6,7 ────────────┘
                    │
Tasks 9,10,11 (UI) <── depend on Task 8
                    │
Task 12 (guide sections) <── depends on Tasks 9,10,11
                    │
Task 13 (page assembly) <── depends on Task 12
                    │
Task 14 (Docker + build) <── depends on Task 13
                    │
Task 15 (deploy) <── depends on Task 14
```

**Parallelizable groups:**
- Tasks 3, 4, 6 can run in parallel (after Task 2)
- Tasks 9, 10, 11 can run in parallel (after Task 8)
