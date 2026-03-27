# Implementation Plan: TM Training Guide & Calculator

**Target:** A developer agent with zero Torn.com knowledge can build this from scratch using this plan and the PRD.

---

## Tech Stack Decision

**Use: Next.js 15 (App Router) with static export**

Rationale:
- Static export (`output: 'export'`) = no server needed, deploys as static files
- React components for interactive calculator sections
- Tailwind CSS for rapid dark-theme styling
- Chart.js (via react-chartjs-2) for projections and comparisons — lightweight (~60KB)
- TypeScript for type safety on formula calculations
- All API calls are client-side `fetch()` to Torn API (CORS supported)

**NOT plain HTML/JS** because:
- Calculator has significant state management (many interdependent inputs)
- Multiple interactive sections share state (API data flows to all sections)
- Component reuse (stat input groups, comparison cards, etc.)
- Tailwind + Next.js is fast to build and maintain

---

## Project Structure

```
tm-training-guide/
├── docs/
│   ├── PRD.md                    # Product requirements (already exists)
│   └── plan.md                   # This file
├── README.md                     # Project overview (already exists)
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── public/
│   └── favicon.ico               # TM faction icon or generic
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout (dark theme, fonts, metadata)
│   │   ├── page.tsx              # Main page — assembles all sections
│   │   └── globals.css           # Tailwind base + custom variables
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx        # Top bar: title, API key input, profile badge
│   │   │   ├── Footer.tsx        # Credits, links
│   │   │   ├── TableOfContents.tsx   # Sidebar/floating TOC for navigation
│   │   │   └── RecommendationsPanel.tsx  # Floating/sticky recommendations
│   │   ├── calculator/
│   │   │   ├── ApiKeyInput.tsx       # API key entry + localStorage + fetch trigger
│   │   │   ├── StatInputPanel.tsx    # All manual input fields (stat, gym, happy, etc.)
│   │   │   ├── ResultsPanel.tsx      # Calculated outputs display
│   │   │   ├── ComparisonToggle.tsx  # "What if" comparison mode
│   │   │   └── EnergySourcePicker.tsx # Checkboxes for energy sources in daily calc
│   │   ├── charts/
│   │   │   ├── StatProjectionChart.tsx   # Line chart: stat over time
│   │   │   ├── HappyRelevanceChart.tsx   # Chart showing happy % vs stat level
│   │   │   └── EnergyCostChart.tsx       # Bar chart: energy source cost comparison
│   │   ├── guide/
│   │   │   ├── Section01_GettingStarted.tsx
│   │   │   ├── Section02_GymFormula.tsx       # Contains calculator embed
│   │   │   ├── Section03_HappyJumping.tsx     # Contains happy chart
│   │   │   ├── Section04_GymProgression.tsx   # Gym table with highlighting
│   │   │   ├── Section05_EnergyManagement.tsx # Energy ranking + FHC calc
│   │   │   ├── Section06_StatEnhancers.tsx    # SE comparison + interactive
│   │   │   ├── Section07_CompanyPerks.tsx     # Company table + comparison
│   │   │   ├── Section08_MeritsAndBooks.tsx   # Merit sliders + book info
│   │   │   └── Section09_TrainingBreak.tsx    # Prep checklist
│   │   └── ui/
│   │       ├── Slider.tsx            # Reusable range slider with label
│   │       ├── NumberInput.tsx       # Formatted number input (with commas)
│   │       ├── Dropdown.tsx          # Styled select
│   │       ├── Tooltip.tsx           # Info tooltips for Torn terminology
│   │       ├── Card.tsx              # Content card wrapper
│   │       ├── Badge.tsx             # Status badges (e.g., "irrelevant", "recommended")
│   │       └── Table.tsx             # Styled data table
│   ├── lib/
│   │   ├── formulas.ts          # All gym/training math (pure functions, tested)
│   │   ├── torn-api.ts          # Torn API client (fetch wrapper, types, error handling)
│   │   ├── recommendations.ts   # Logic for generating recommendations from state
│   │   ├── constants.ts         # Gym data, company data, merit data, prices
│   │   └── format.ts            # Number formatting helpers (1,276,323,613 -> "1.28B")
│   ├── hooks/
│   │   ├── useTornApi.ts        # Hook: fetch + cache Torn API data
│   │   ├── useCalculator.ts     # Hook: manages all calculator state + derived values
│   │   └── useLocalStorage.ts   # Hook: typed localStorage wrapper
│   └── types/
│       ├── torn-api.ts          # TypeScript types for Torn API responses
│       └── calculator.ts        # Calculator state and result types
└── __tests__/
    ├── formulas.test.ts         # Unit tests for gym formula calculations
    ├── recommendations.test.ts  # Tests for recommendation logic
    └── format.test.ts           # Tests for number formatting
```

---

## Implementation Phases

### Phase 1: Foundation (Day 1)

**Goal:** Project scaffolding, core formula engine, basic calculator working.

#### Step 1.1: Initialize Project

```bash
cd ~/Programowanie/tm-training-guide
npx create-next-app@latest . --typescript --tailwind --app --src-dir --no-import-alias
```

Configuration:
- `next.config.ts`: set `output: 'export'` for static site generation
- `tailwind.config.ts`: add Torn color palette (`torn-green: '#7ca900'`, dark backgrounds)
- Add dependencies: `react-chartjs-2 chart.js`
- No additional UI library needed — build minimal components with Tailwind

#### Step 1.2: Implement Core Formulas (`src/lib/formulas.ts`)

Pure functions, no side effects. These are the mathematical heart of the app.

```typescript
// Core gym gain formula
function calculateGymGain(params: {
  gymDots: number;        // 1.0 - 39.0
  currentStat: number;    // raw stat value
  happy: number;          // current happy
  steadfastBonus: number; // 0.0 - 0.20
  educationBonus: number; // 0.0 - 0.15
  energyUsed: number;     // energy points spent
}): number

// Happy contribution percentage
function calculateHappyContribution(currentStat: number, happy: number): number
// Returns: percentage (0-100) of formula attributable to happy

// FHC use vs sell comparison
function compareFhcUseVsSell(params: {
  currentStat: number;
  gymDots: number;
  happy: number;
  steadfastBonus: number;
  educationBonus: number;
  fhcSellPrice: number;  // default $12,500,000
  xanaxPrice: number;    // default $839,000
}): { useGain: number; sellAndBuyXanaxGain: number; ratio: number }

// SE value comparison
function compareStatEnhancer(params: {
  currentStat: number;
  sePrice: number;        // default $450,000,000
  xanaxPrice: number;     // default $839,000
  gymDots: number;
  happy: number;
  steadfastBonus: number;
  educationBonus: number;
}): { seGain: number; seCostPerStat: number; xanaxCostPerStat: number; ratio: number }

// Daily gain projection
function projectDailyGain(params: {
  gainPerEnergy: number;
  energySources: {
    natural: boolean;     // 150E
    xanax: boolean;       // 250E
    pointRefill: boolean; // 150E
    fhc: boolean;         // 150E
    energyCans: number;   // number of cans (25E each)
  };
}): number

// Time to milestone
function daysToMilestone(currentStat: number, targetStat: number, dailyGain: number): number

// Company bonus impact
function applyCompanyBonus(baseGainPerDay: number, companyType: CompanyType): {
  modifiedGainPerDay: number;
  passiveStatBoost: number;
  gymGainMultiplier: number;
}
```

Write unit tests for all formulas immediately. Use known data points for validation:
- At 1.276B DEF, Balboas (39 dots), happy 4443: gain should be ~3,533 DEF/E
- Happy contribution at 1.276B DEF = ~0.004%
- FHC sell vs use ratio should be ~24.8x

#### Step 1.3: Implement Constants (`src/lib/constants.ts`)

All game data as typed constants:

```typescript
// Gym definitions
const GYMS: Gym[] = [
  { name: "Premier Fitness", dots: 2.0, unlock: "Default", unlockValue: 0 },
  { name: "Average Joe's", dots: 3.0, unlock: "Any stat > 100", unlockValue: 100 },
  // ... all gyms from PRD Section 3.2
];

// Company training effects
const COMPANY_TRAINING_PERKS: CompanyPerk[] = [
  {
    name: "Ladies Strip Club",
    perks: [
      { starLevel: 3, type: "passive", stat: "DEF", value: 0.25, description: "+25% passive DEF" },
      { starLevel: 5, type: "booster", stat: "DEF", value: 0.50, description: "+50% Serotonin effectiveness" },
      { starLevel: 7, type: "gymGain", stat: "DEF", value: 0.10, description: "+10% DEF gym gains" },
      { starLevel: 10, type: "combat", stat: "DEF", value: 0.30, description: "+30% melee reduction" },
    ]
  },
  // ... all companies from PRD Section 3.8
];

// Merit definitions
const MERIT_STAT_BONUSES = {
  STR: { name: "Brawn", perLevel: 0.03, maxLevel: 10 },
  DEF: { name: "Protection", perLevel: 0.03, maxLevel: 10 },
  SPD: { name: "Sharpness", perLevel: 0.03, maxLevel: 10 },
  DEX: { name: "Evasion", perLevel: 0.03, maxLevel: 10 },
};

// Default market prices
const DEFAULT_PRICES = {
  xanax: 839_000,
  fhc: 12_500_000,
  statEnhancer: 450_000_000,
  energyCan: 2_100_000,
  ecstasy: 200_000,
  lsd: 150_000,
  pointRefill: 845_000, // 25 points × ~$33,800
};
```

#### Step 1.4: Implement Number Formatting (`src/lib/format.ts`)

```typescript
// "1276323613" -> "1.28B"
function formatStatShort(value: number): string

// "1276323613" -> "1,276,323,613"
function formatStatFull(value: number): string

// "839000" -> "$839K"
function formatMoney(value: number): string

// "24.83" -> "24.8x"
function formatMultiplier(value: number): string

// "0.00418" -> "0.004%"
function formatPercent(value: number, decimals?: number): string
```

#### Step 1.5: Implement Types (`src/types/`)

```typescript
// torn-api.ts
interface TornUserData {
  profile: { name: string; level: number; player_id: number; faction: { name: string; id: number } };
  battlestats: { strength: number; defense: number; speed: number; dexterity: number; total: number;
                 strength_modifier: number; defense_modifier: number; speed_modifier: number; dexterity_modifier: number };
  bars: { happy: { current: number; maximum: number }; energy: { current: number; maximum: number } };
  gym: { active_gym: number; /* gym ID */ };
  education: { completed: number[] };
  merits: Record<string, number>;
  cooldowns: { drug: number; booster: number };
  personalstats: { xantaken: number; exttaken: number; /* etc */ };
  workstats: { manual_labor: number; intelligence: number; endurance: number };
}

// calculator.ts
interface CalculatorState {
  currentStat: number;
  trainedStat: 'STR' | 'DEF' | 'SPD' | 'DEX';
  gymDots: number;
  happy: number;
  steadfastBonus: number;
  educationBonus: number;
  companyType: string | null;
  companyStarLevel: number;
  bookBonus: 'none' | 'single30' | 'all20';
  meritLevel: number; // 0-10 for trained stat
  energySources: EnergySources;
}

interface CalculatorResults {
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

### Phase 2: Torn API Integration (Day 2)

#### Step 2.1: Torn API Client (`src/lib/torn-api.ts`)

```typescript
const TORN_API_BASE = 'https://api.torn.com/v2/';

async function fetchUserData(apiKey: string): Promise<TornUserData> {
  const selections = [
    'profile', 'battlestats', 'bars', 'gym',
    'education', 'merits', 'cooldowns', 'personalstats', 'workstats'
  ].join(',');

  const response = await fetch(
    `${TORN_API_BASE}user?selections=${selections}&key=${apiKey}`
  );

  if (!response.ok) throw new TornApiError(response.status);

  const data = await response.json();
  if (data.error) throw new TornApiError(data.error.code, data.error.error);

  return transformApiResponse(data);
}
```

Error handling:
- Invalid key (error code 2) -> show "Invalid API key" message
- Rate limited (error code 5) -> show "Please wait, rate limited"
- Network error -> show "Could not reach Torn API. Enter stats manually."
- All errors gracefully degrade to manual input mode

#### Step 2.2: Hooks

**`useTornApi.ts`:**
- Manages API key in localStorage
- Fetches on key entry, caches response
- Provides `data`, `loading`, `error` states
- Re-fetch button for manual refresh

**`useCalculator.ts`:**
- Central state manager for all calculator inputs
- Derives all outputs using `formulas.ts`
- Auto-populates from API data when available
- Allows manual override of any auto-populated field
- Memoizes expensive calculations

**`useLocalStorage.ts`:**
- Generic typed hook for localStorage read/write
- Handles SSR (returns null on server, reads on client mount)

### Phase 3: UI Components (Days 3-4)

#### Step 3.1: Layout Components

**`Header.tsx`:**
- Title: "TM Training Guide"
- Subtitle: "The Masters — Member Council"
- API key input (collapsible on mobile)
- If API data loaded: show player name, level, faction badge

**`Footer.tsx`:**
- "Built by bombel for The Masters"
- "Powered by Torn API v2"
- Link to Torn.com
- Version number

**`TableOfContents.tsx`:**
- Desktop: fixed sidebar with section links
- Mobile: hamburger menu or collapsed at top
- Highlights current section on scroll (IntersectionObserver)

**`RecommendationsPanel.tsx`:**
- Desktop: floating panel on right side
- Mobile: collapsible section between guide sections
- Updates reactively as calculator state changes
- Shows top 3-5 recommendations with priority badges

#### Step 3.2: Calculator Components

**`ApiKeyInput.tsx`:**
- Text input with password mask toggle (API keys are sensitive)
- "Load My Stats" button
- Loading spinner during fetch
- Success: green checkmark + player name
- Error: red message with fallback instruction
- "Clear" button to remove key from localStorage
- Privacy note below input

**`StatInputPanel.tsx`:**
- Grid of input fields (responsive: 2 columns desktop, 1 mobile)
- Number inputs with formatting (show "1.28B" but edit raw number)
- Dropdowns for stat type, gym, company
- Sliders for Steadfast %, Education %, Merit level
- Visual indicator when field is auto-populated from API (blue border/icon)
- Override icon: click to switch from API value to manual entry

**`ResultsPanel.tsx`:**
- Card-based layout for each result
- Large hero number for "Gain per Energy Point"
- Supporting stats in smaller cards
- Color-coded: green = good, yellow = could be better, red = issue
- Animated number transitions when inputs change

**`ComparisonToggle.tsx`:**
- Dropdown: "Compare with..." -> list of companies, book bonuses, scenarios
- Shows side-by-side: current vs. hypothetical
- Difference highlighted in green/red

**`EnergySourcePicker.tsx`:**
- Checkboxes for each energy source (natural, Xanax, point refill, FHC, cans)
- Each shows cost and energy gain
- Total daily energy and projected gain updates live

#### Step 3.3: Chart Components

**`StatProjectionChart.tsx`:**
- Line chart (Chart.js)
- X-axis: days (30, 90, 365 toggleable)
- Y-axis: total stat value
- Lines: "Current strategy" (solid), "Optimized" (dashed)
- Milestone markers on Y-axis (500M, 1B, 2B, 5B)
- Tooltips on hover showing exact date and value

**`HappyRelevanceChart.tsx`:**
- Line chart
- X-axis: stat value (logarithmic scale, 1K to 10B)
- Y-axis: happy contribution % (0-50%)
- Vertical line marking user's current stat
- Threshold zones: green (happy matters), yellow (diminishing), red (irrelevant)

**`EnergyCostChart.tsx`:**
- Horizontal bar chart
- Bars: Xanax, Point Refill, Energy Cans, FHC (use), SE
- Value: cost per 1,000 stat gained
- Color: green (cheap) -> red (expensive)
- Xanax bar should visually dominate as most efficient

#### Step 3.4: Guide Section Components

Each section follows the pattern:
1. Section title with anchor ID
2. Introductory text (brief — Torn players don't read essays)
3. Key data table or visual
4. Interactive element (calculator embed, chart, or comparison)
5. "TL;DR" box at bottom with 1-3 bullet summary

**Section-specific notes:**

**Section01_GettingStarted:** Text-only, gym progression table, no calculator. Target audience: new players.

**Section02_GymFormula:** This is the main calculator section. Show the formula visually (large, styled, each variable colored). Below: the full StatInputPanel and ResultsPanel. User should be able to interact immediately.

**Section03_HappyJumping:** HappyRelevanceChart embedded. Below chart: explanation of what the chart means. Personal stat marker on chart with callout "You are here — happy is X% of your formula."

**Section04_GymProgression:** Table of all gyms. If API data loaded, highlight current gym in green, next unlock in yellow. Show: "You're in [Gym] (X dots). Next unlock: [Gym] (Y dots) at [requirement]."

**Section05_EnergyManagement:** EnergyCostChart embedded. Below: EnergySourcePicker with daily projection. FHC comparison card with bold "Sell FHC, buy Xanax" recommendation when applicable.

**Section06_StatEnhancers:** SE comparison table (interactive — updates with user's stat). Bold verdict. Show: "At your stat level (X), 1 SE = +Y stat. Same money buys Z Xanax = +W stat. Xanax is N times better."

**Section07_CompanyPerks:** Company table. If API data loaded, highlight current company. "What if" comparison: "If you join Ladies Strip Club 10-star: +A% gym gains, +B passive DEF, total +C extra DEF after 1 year."

**Section08_MeritsAndBooks:** Merit sliders (interactive — each level shows impact on yearly projection). Book stacking advice. Calendar suggestion: "Stack 30% book + Steadfast rotation + Xanax + FHC selling for max 31-day window."

**Section09_TrainingBreak:** Checklist format. "Before break: [ ] Stack energy [ ] Coordinate Xanax timing [ ] Save FHCs for burst."

#### Step 3.5: UI Primitives

Keep these minimal — Tailwind handles most styling.

- `Slider`: Range input with label, min/max, current value display, optional % formatting
- `NumberInput`: Text input that formats as you type (commas), parses to number on change. Handle B/M/K suffixes in display.
- `Dropdown`: Styled select with Torn-themed styling
- `Tooltip`: Click/hover info icon that shows term explanation. Use for Torn jargon: "Steadfast", "SSL", "FHC", etc.
- `Card`: Wrapper div with dark background, border, padding, optional title
- `Badge`: Small pill showing status: "Recommended" (green), "Not Worth It" (red), "Irrelevant" (gray)
- `Table`: Styled table with dark theme, zebra striping, optional row highlighting

### Phase 4: Recommendations Engine (Day 4)

#### Step 4.1: Implement Recommendations Logic (`src/lib/recommendations.ts`)

```typescript
interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;           // Short: "Sell FHC, Buy Xanax"
  description: string;     // 1-2 sentences with numbers
  impact: string;          // "+24.8x more stats per dollar"
  category: 'energy' | 'gym' | 'company' | 'items' | 'warning';
}

function generateRecommendations(state: CalculatorState, results: CalculatorResults, apiData?: TornUserData): Recommendation[]
```

**Recommendation rules (implement all from PRD Section 4.3):**

| Condition | Priority | Recommendation |
|-----------|----------|---------------|
| `happyContribution > 5%` | medium | Suggest happy jumping |
| `happyContribution < 1%` | low | Note happy is irrelevant |
| Gym dots < max available for stats | high | Switch to better gym |
| Using FHC (checkbox on) | high | Sell FHC, buy Xanax with comparison numbers |
| Steadfast at 0% | medium | Ask faction about Steadfast |
| No book active | medium | Suggest 30% stat book |
| Company has no gym perk | medium | Suggest optimal company |
| `xanaxUsed + ecstasyUsed > 120` | high (warning) | SSL warning |
| `totalStats < 250000` | high | Push for Mr. Isoyamas unlock |
| `totalStats < 1000000000` | medium | Push for Balboas unlock |
| SE checkbox on | high | Show Xanax is better |

Sort by priority, then by impact magnitude. Show max 5 at a time.

### Phase 5: Styling and Polish (Day 5)

#### Step 5.1: Global Theme

```css
/* globals.css */
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
```

#### Step 5.2: Responsive Breakpoints

- Mobile: < 768px — single column, stacked cards, hamburger TOC
- Tablet: 768-1024px — two column calculator, sidebar TOC
- Desktop: > 1024px — full layout with floating recommendations panel

#### Step 5.3: Animations

- Number transitions: count-up animation when results change (requestAnimationFrame)
- Section reveal: subtle fade-in on scroll (IntersectionObserver, CSS transitions)
- Chart transitions: Chart.js built-in animation
- Keep animations minimal — no flashy effects, just smooth transitions

#### Step 5.4: Loading States

- API fetch: skeleton loaders in input fields
- Calculator: instant (formulas are pure math, no async)
- Charts: Chart.js handles its own loading

### Phase 6: Testing (Day 5-6)

#### Step 6.1: Unit Tests (`__tests__/`)

**`formulas.test.ts`** — Critical. Must verify:

```typescript
// Known data point: bombel at 1.276B DEF, Balboas (39 dots), happy 4443
test('gym gain matches known data point', () => {
  const gain = calculateGymGain({
    gymDots: 39,
    currentStat: 1_276_323_613,
    happy: 4443,
    steadfastBonus: 0,
    educationBonus: 0.10, // approximate
    energyUsed: 1,
  });
  // Expected: ~3,533 DEF per energy point
  expect(gain).toBeCloseTo(3533, -1); // within 10
});

test('happy contribution at 1B+ is < 0.01%', () => {
  const pct = calculateHappyContribution(1_000_000_000, 4500);
  expect(pct).toBeLessThan(0.01);
});

test('happy contribution at 10K stat is significant', () => {
  const pct = calculateHappyContribution(10_000, 4500);
  expect(pct).toBeGreaterThan(20);
});

test('FHC sell vs use ratio is ~25x', () => {
  const result = compareFhcUseVsSell({
    currentStat: 1_276_323_613,
    gymDots: 39,
    happy: 4443,
    steadfastBonus: 0,
    educationBonus: 0.10,
    fhcSellPrice: 12_500_000,
    xanaxPrice: 839_000,
  });
  expect(result.ratio).toBeCloseTo(25, 0);
});

test('SE is thousands of times more expensive per stat than Xanax', () => {
  const result = compareStatEnhancer({
    currentStat: 1_276_323_613,
    sePrice: 450_000_000,
    xanaxPrice: 839_000,
    gymDots: 39,
    happy: 4443,
    steadfastBonus: 0,
    educationBonus: 0.10,
  });
  expect(result.ratio).toBeGreaterThan(30);
});
```

**`recommendations.test.ts`:**
- Test each rule fires under correct conditions
- Test priority sorting
- Test max 5 recommendations

**`format.test.ts`:**
- `formatStatShort(1_276_323_613)` -> "1.28B"
- `formatStatShort(500_000_000)` -> "500M"
- `formatMoney(839_000)` -> "$839K"
- `formatMoney(12_500_000)` -> "$12.5M"

#### Step 6.2: Manual Testing Checklist

- [ ] Calculator works without API key (all manual input)
- [ ] Calculator auto-fills with valid API key
- [ ] Invalid API key shows error, falls back to manual
- [ ] All charts render on mobile (TornPDA WebView)
- [ ] Dark theme is default, looks good
- [ ] TOC navigation works (scroll to section)
- [ ] Recommendations update when inputs change
- [ ] FHC comparison shows correct numbers
- [ ] SE comparison shows correct numbers
- [ ] Number formatting works at all scales (1K to 10B)
- [ ] Responsive: test at 375px, 768px, 1440px widths
- [ ] Sliders work on touch devices

### Phase 7: Deployment (Day 6)

#### Step 7.1: Build

```bash
npm run build
# Output: /out/ directory with static files
```

Verify `out/` contains index.html and all static assets.

#### Step 7.2: Dockerize

```dockerfile
FROM nginx:alpine
COPY out/ /usr/share/nginx/html/
EXPOSE 80
```

Simple nginx serving static files. No Node.js runtime needed.

#### Step 7.3: Deploy to Coolify

- Same Coolify instance as tm-war-room
- Subdomain: `train.tri.ovh`
- Docker deployment from Git or direct image push
- Traefik handles SSL (Let's Encrypt)

**Coolify config:**
- Build: Dockerfile
- Port: 80
- Domain: train.tri.ovh
- SSL: enabled (Let's Encrypt)

---

## Data Reference for Implementation

### Gym Data (Complete)

Copy this exactly into `constants.ts`:

```typescript
const GYMS = [
  { id: 1, name: "Premier Fitness", dots: 2.0, unlock: "Default", unlockType: "none", unlockValue: 0 },
  { id: 2, name: "Average Joe's", dots: 3.0, unlock: "Any stat > 100", unlockType: "anyStat", unlockValue: 100 },
  { id: 3, name: "Woody's Workout Club", dots: 4.0, unlock: "Any stat > 500", unlockType: "anyStat", unlockValue: 500 },
  { id: 4, name: "Beach Bum's", dots: 5.0, unlock: "Any stat > 1,000", unlockType: "anyStat", unlockValue: 1_000 },
  { id: 5, name: "Silver Gym", dots: 6.0, unlock: "Any stat > 2,500", unlockType: "anyStat", unlockValue: 2_500 },
  { id: 6, name: "Gold Gym", dots: 7.0, unlock: "Any stat > 5,000", unlockType: "anyStat", unlockValue: 5_000 },
  { id: 7, name: "Platinum Gym", dots: 8.0, unlock: "Any stat > 10,000", unlockType: "anyStat", unlockValue: 10_000 },
  { id: 8, name: "Hank's Gym", dots: 9.0, unlock: "Any stat > 25,000", unlockType: "anyStat", unlockValue: 25_000 },
  { id: 9, name: "Mr. Isoyamas", dots: 10.0, unlock: "Total stats > 250,000", unlockType: "totalStats", unlockValue: 250_000 },
  { id: 10, name: "Total Warfare", dots: 11.0, unlock: "Any 2 stats > 250,000", unlockType: "twoStats", unlockValue: 250_000 },
  { id: 11, name: "Elites", dots: 11.5, unlock: "DEX > 500K or DEF > 500K", unlockType: "specificStat", unlockValue: 500_000, stats: ["DEX", "DEF"] },
  { id: 12, name: "Sports Science Lab", dots: 12.0, unlock: "STR > 500K or SPD > 500K", unlockType: "specificStat", unlockValue: 500_000, stats: ["STR", "SPD"], sslRestriction: true },
  { id: 13, name: "George's Gym", dots: 20.0, unlock: "Any stat > 50M", unlockType: "anyStat", unlockValue: 50_000_000 },
  { id: 14, name: "Balboas Gym", dots: 39.0, unlock: "Total stats > 1B", unlockType: "totalStats", unlockValue: 1_000_000_000 },
];
```

### Company Training Data (Complete)

```typescript
const TRAINING_COMPANIES = [
  {
    name: "Ladies Strip Club",
    cost: "$5M",
    employees: 4,
    perks: [
      { star: 1, name: "Hot Flush", effect: "50 happiness", type: "jp", jpCost: 1 },
      { star: 3, name: "Hench", effect: "+25% passive DEF", type: "passive", stat: "DEF", value: 0.25 },
      { star: 5, name: "Hormonal", effect: "+50% Serotonin effectiveness", type: "booster" },
      { star: 7, name: "Boxercise", effect: "+10% DEF gym gains", type: "gymGain", stat: "DEF", value: 0.10 },
      { star: 10, name: "Hardbody", effect: "+30% melee damage reduction", type: "combat" },
    ]
  },
  {
    name: "Gents Strip Club",
    cost: "$5M",
    employees: 4,
    perks: [
      { star: 1, name: "Happy Ending", effect: "50 happiness", type: "jp", jpCost: 1 },
      { star: 3, name: "Dancer's Flair", effect: "+25% passive DEX", type: "passive", stat: "DEX", value: 0.25 },
      { star: 5, name: "Supple", effect: "+50% Tyrosine effectiveness", type: "booster" },
      { star: 7, name: "Pilates", effect: "+10% DEX gym gains", type: "gymGain", stat: "DEX", value: 0.10 },
      { star: 10, name: "No Touching", effect: "25% dodge melee", type: "combat" },
    ]
  },
  {
    name: "Fitness Center",
    cost: "$17M",
    employees: 8,
    perks: [
      { star: 1, name: "Healthy Mind", effect: "30 min edu reduction", type: "jp", jpCost: 1 },
      { star: 3, name: "Goal Oriented", effect: "50% happy loss reduction in gym", type: "passive" },
      { star: 5, name: "Roid Rage", effect: "~4.5E STR gains", type: "jpTraining", stat: "STR", jpCost: 1 },
      { star: 7, name: "Athlete", effect: "3% life regen", type: "passive" },
      { star: 10, name: "Training Regime", effect: "+3% gym gains (all)", type: "gymGain", stat: "ALL", value: 0.03 },
    ]
  },
  {
    name: "Music Store",
    cost: "$1.5M",
    employees: 4,
    perks: [
      { star: 1, name: "Ambience", effect: "50 happiness", type: "jp", jpCost: 1 },
      { star: 3, name: "Well Tuned", effect: "+30% gym XP", type: "passive" },
      { star: 5, name: "High-fidelity", effect: "2.0 stealth reduction", type: "passive" },
      { star: 7, name: "Deafened", effect: "Max stealth", type: "jp", jpCost: 10 },
      { star: 10, name: "The Score", effect: "+15% ALL battle stats", type: "passive", stat: "ALL", value: 0.15 },
    ]
  },
  {
    name: "Mining Corporation",
    cost: "$3.5B",
    employees: 8,
    perks: [
      { star: 1, name: "Salty", effect: "Salt Shaker item", type: "jp", jpCost: 5 },
      { star: 3, name: "Thirsty Work", effect: "30% alcohol CD reduction", type: "passive" },
      { star: 5, name: "Rock Salt", effect: "~4.5E DEF gains", type: "jpTraining", stat: "DEF", jpCost: 1 },
      { star: 7, name: "Essential Salts", effect: "+10% max life", type: "passive" },
      { star: 10, name: "Preserved Meat", effect: "150% life boost", type: "jp", jpCost: 25 },
    ]
  },
  {
    name: "Furniture Store",
    cost: "$2.5M",
    employees: 4,
    perks: [
      { star: 1, name: "Coffee Break", effect: "3 energy", type: "jp", jpCost: 1 },
      { star: 3, name: "Heavy Lifting", effect: "~4.5E STR gains", type: "jpTraining", stat: "STR", jpCost: 1 },
      { star: 5, name: "Removal", effect: "+15% theft crime XP", type: "passive" },
      { star: 7, name: "Beefcake", effect: "+25% passive STR", type: "passive", stat: "STR", value: 0.25 },
      { star: 10, name: "Brute Force", effect: "2x fist/kick damage", type: "combat" },
    ]
  },
  {
    name: "Gas Station",
    cost: "$7.5M",
    employees: 4,
    perks: [
      { star: 1, name: "Molotov Cocktail", effect: "Molotov item", type: "jp", jpCost: 3 },
      { star: 3, name: "Fueled", effect: "+25% passive SPD", type: "passive", stat: "SPD", value: 0.25 },
      { star: 5, name: "Cauterize", effect: "Heal during combat", type: "combat" },
      { star: 7, name: "Fireproof", effect: "50% fire damage mitigation", type: "combat" },
      { star: 10, name: "Blaze of Glory", effect: "50% fire damage dealt", type: "combat" },
    ]
  },
  {
    name: "Logistics Management",
    cost: "$1.8B",
    employees: 6,
    perks: [
      { star: 1, name: "Efficiency", effect: "~4.5E SPD gains", type: "jpTraining", stat: "SPD", jpCost: 1 },
      { star: 3, name: "Organized", effect: "+2 mission contracts", type: "passive" },
      { star: 5, name: "Repatriated", effect: "Return from abroad in hospital", type: "passive" },
      { star: 7, name: "Contraband", effect: "Foreign goods shipment", type: "jp", jpCost: 50 },
      { star: 10, name: "Logistics Report", effect: "Company productivity boost", type: "jp", jpCost: 250 },
    ]
  },
];
```

### Energy Source Data (Complete)

```typescript
const ENERGY_SOURCES = [
  { id: "natural", name: "Natural Energy", energy: 150, cost: 0, cooldown: "Regenerates over 24h", daily: 1, notes: "Free. 5E every 15 min." },
  { id: "xanax", name: "Xanax", energy: 250, cost: 839_000, cooldown: "~8h drug cooldown", daily: 2, notes: "Primary training drug. Can boost over max energy cap." },
  { id: "pointRefill", name: "Point Refill", energy: 150, cost: 845_000, cooldown: "1 per day", daily: 1, notes: "~25 points from Points Building." },
  { id: "fhc", name: "FHC (Full Happy Cake)", energy: 150, cost: 12_500_000, cooldown: "None (consumable)", daily: 1, notes: "Usually better to sell and buy Xanax (25x more efficient)." },
  { id: "energyCan", name: "Energy Can", energy: 25, cost: 2_100_000, cooldown: "None", daily: 6, notes: "$12.7M for 6-pack (150E total). Mid-tier efficiency." },
  { id: "lsd", name: "LSD", energy: 50, cost: 150_000, cooldown: "~7h drug cooldown", daily: 0, notes: "Shares drug cooldown with Xanax. +50% DEF buff (combat)." },
];
```

---

## Key Implementation Notes

### Formula Verification

The gym formula was verified against real API logs (bombel, March 2026). The known data point:
- **Input:** 1.276B DEF, Balboas 39 dots, 4443 happy, ~10% education, 0% Steadfast
- **Output:** ~3,533 DEF per energy point

If your formula implementation doesn't match this within ~5%, something is wrong. Debug using the component parts:
- `0.00019106 * 1,276,323,613 = 243,854` (stat component)
- `0.00226263 * 4443 = 10.05` (happy component)
- `0.55` (constant)
- Total inner: `243,864.05`
- `(39 * 4) * 243,864.05 = 38,042,392`
- `* 1.10 / 150 = 279,111` (with 10% education)
- Per energy = 279,111 / 150 * 150 = hmm, need to verify energy scaling

**IMPORTANT:** The formula's `/150` divisor and `* Energy_Used` interaction should be validated. The formula gives total gain for `Energy_Used` amount of energy. For per-energy-point calculation, set `Energy_Used = 1`.

If the math doesn't land exactly at 3,533, the education bonus % or Steadfast value might differ. Provide a calibration mode: user enters known gain from a gym session, tool back-calculates their education + Steadfast bonus.

### Content Tone

- Faction members, not academics. Casual, direct.
- Use "you" and "your". Not "the player" or "one should".
- Bold key takeaways. Bullet points. Short sentences.
- Humor is OK: "Happy jumping at 1B stats is like bringing a water pistol to a tsunami."
- No BS: if something is irrelevant, say "skip this, it doesn't matter for you."
- Numbers always concrete: "$839K" not "approximately $800K-$900K".

### API Key Security

- NEVER log the API key
- NEVER send it anywhere except api.torn.com
- Store in localStorage only (no cookies, no sessionStorage)
- Clear button prominently visible
- Show privacy notice on first use

### Performance

- Formula calculations are instant (pure math, no async)
- Chart rendering: lazy-load Chart.js (dynamic import)
- API fetch: single combined request on load, cache in memory
- Static export: all HTML pre-rendered, JS hydrates
- Images: none needed (text + charts only)
- Total bundle target: < 300KB JS (excluding Chart.js ~60KB)

---

## Deployment Checklist

- [ ] `npm run build` produces clean `/out/` directory
- [ ] All tests pass (`npm run test`)
- [ ] Formula matches known data point (3,533 DEF/E)
- [ ] Works without API key (manual mode)
- [ ] Works with valid API key (auto-fill mode)
- [ ] Dark theme is default and looks good
- [ ] Mobile layout works at 375px width
- [ ] All 9 guide sections render with content
- [ ] Charts render correctly
- [ ] Recommendations panel shows correct advice
- [ ] localStorage persists API key across page reloads
- [ ] No console errors
- [ ] Dockerfile builds and serves correctly
- [ ] Deploys to train.tri.ovh via Coolify
- [ ] SSL cert works (https://train.tri.ovh)

---

## Timeline Summary

| Day | Phase | Deliverable |
|-----|-------|-------------|
| 1 | Foundation | Project setup, formulas, constants, types, unit tests |
| 2 | API Integration | Torn API client, hooks, auto-fill logic |
| 3 | UI (Part 1) | Layout, calculator components, input/output panels |
| 4 | UI (Part 2) | Guide sections, charts, recommendations panel |
| 5 | Polish | Styling, animations, responsive, testing |
| 6 | Deploy | Docker, Coolify config, launch |

**Total: ~6 working days for a developer agent.**
