# PRD: TM Training Guide & Calculator

**Product:** Torn.com Gym Training Guide with Interactive Calculator
**Author:** bombel (Pawel Orzech) — The Masters faction, Member Council
**Date:** 2026-03-27
**Status:** Draft

---

## 1. Background

### 1.1 What is Torn.com?

Torn.com is a text-based online RPG (MMORPG) with ~2M registered accounts. Players have four battle stats: **Strength (STR)**, **Defense (DEF)**, **Speed (SPD)**, and **Dexterity (DEX)**. Stats grow by spending **energy** in the **gym**. Training is the single most impactful long-term activity in the game.

### 1.2 What is The Masters (TM)?

A faction (guild) in Torn, ID 11559. ~25 members ranging from mid-game (~500M total stats) to endgame (8B+ total stats). The faction participates in Ranked Wars every ~2 weeks, runs Organized Crimes, and has collective progression goals.

### 1.3 Why this tool?

The **Member Council** (advisory board within TM) is launching monthly educational topics. The first topic is **"How to Train"** because:
- Most faction members don't understand the gym formula
- Many waste money on Stat Enhancers or FHCs when they shouldn't
- Happy jumping advice from 2019 guides is outdated (irrelevant at high stats)
- No existing tool combines a guide with a personalized calculator
- Members at different levels need different strategies

### 1.4 Success Criteria

- Faction members actually use the calculator (track via simple page view count or Coolify analytics)
- Members change behavior based on recommendations (e.g., sell FHCs instead of using them)
- Content is referenceable in faction chat ("check the training guide")
- Tool is sharable — other factions can use it too

---

## 2. Users

### 2.1 Primary: TM Faction Members

- ~25 players, stats ranging from ~100M to 8B+ total
- Mix of mobile (TornPDA browser) and desktop users
- Varying game knowledge: some know the formula, most don't
- All have Torn API keys (standard for faction tools)

### 2.2 Secondary: Torn Community

- Other factions may share the link
- Forum posts can reference it
- Should work for any Torn player, not just TM members

---

## 3. Core Mechanics (Torn Game Context)

This section provides the complete game mechanics knowledge needed to build the tool. A developer with zero Torn knowledge should be able to implement everything from this section alone.

### 3.1 The Gym Formula

```
Gym_Gain = ((Gym_Dots * 4) * ((0.00019106 * Current_Stat) + (0.00226263 * Happy) + 0.55))
           * (1 + Steadfast_Bonus + Education_Bonus) / 150 * Energy_Used
```

**Variables:**
| Variable | Description | Range | Source |
|----------|-------------|-------|--------|
| `Gym_Dots` | Gym quality rating (dots/bars) | 1.0 - 39.0 | Torn API: `gym` selection |
| `Current_Stat` | Current value of stat being trained | 0 - ~10B+ | Torn API: `battlestats` |
| `Happy` | Current happiness level | 0 - ~15,000+ | Torn API: `bars.happy` |
| `Steadfast_Bonus` | Faction perk: training bonus (decimal) | 0.0 - 0.20 | Faction-dependent, user input |
| `Education_Bonus` | Education courses bonus (decimal) | 0.0 - ~0.10 | Torn API: `education_completed` |
| `Energy_Used` | Energy spent on this gym session | 1 - 250+ | User choice |

**Critical insight: At stats above ~500M, the `0.00019106 * Current_Stat` term dominates.**
- At 1B stat: stat component = 191,060 vs happy component at 4500 happy = 10.18
- Happy is 0.005% of the formula at 1B stats
- This means happy jumping is irrelevant for high-stat players

### 3.2 Gyms and Dots

Torn has multiple gyms. Each gym has a "dots" rating (quality) and trains specific stats at specific ratios.

**Gym Progression (unlocks):**

| Gym | Dots | Unlock Condition | Stat Training Ratios |
|-----|------|-----------------|---------------------|
| Premier Fitness | 2.0 | Default | Equal all 4 stats |
| Average Joe's | 3.0 | Any stat > 100 | Equal all 4 stats |
| Woody's Workout Club | 4.0 | Any stat > 500 | Equal all 4 stats |
| Beach Bum's | 5.0 | Any stat > 1,000 | Equal all 4 stats |
| Silver Gym | 6.0 | Any stat > 2,500 | Equal all 4 stats |
| Gold Gym | 7.0 | Any stat > 5,000 | Equal all 4 stats |
| Platinum Gym | 8.0 | Any stat > 10,000 | Equal all 4 stats |
| Hank's Gym | 9.0 | Any stat > 25,000 | Equal all 4 stats |
| Mr. Isoyamas | 10.0 | Total stats > 250,000 | Train 1 stat at time |
| Total Warfare | 11.0 | Any 2 stats > 250,000 | 2-stat specialization |
| Elites | 11.5 | DEX > 500,000 OR DEF > 500,000 | DEX/DEF focus |
| Sports Science Lab (SSL) | 12.0 | STR > 500,000 OR SPD > 500,000 | STR/SPD focus |
| George's Gym | 20.0 | Any stat > 50M | Train any single stat |
| Balboas Gym | 39.0 | Total stats > 1B | Train any single stat |

**Note:** George's (20 dots) and Balboas (39 dots) are the endgame gyms. Balboas at 39 dots is 2x the dots of George's, meaning ~2x gains per energy.

**SSL Restriction:** If total Xanax + Ecstasy usage exceeds 150, player is **permanently kicked out** of SSL. LSD and other drugs are safe.

### 3.3 Energy Sources

Energy is the currency for gym training. Base max energy is 150. Sources:

| Source | Energy | Cooldown | Approx Cost | Notes |
|--------|--------|----------|-------------|-------|
| Natural Regen | Up to 150 (fills over 24h) | None | Free | 5E per tick (every 15 min) |
| Xanax (drug) | +250E (over max) | ~8h drug CD | ~$839K | Primary training drug. Boosts over max energy. |
| FHC (Full Happy Cake) | Refills to max (150) | None (consumable) | ~$12.5M | Expensive. Often better to sell and buy Xanax. |
| Energy Can (6-pack) | +25E each (150 total) | None | ~$12.7M for 6 | Moderate cost per E. |
| Point Refill | Refills to max (150) | 1 per day | ~25 points ($845K) | Buy from Points Building. |
| MCS Stock Dividend | +100E per week | Weekly | Stock investment | Requires 1M shares of MCS stock. |
| Company (Farm 10*) | 7E per 1 JP | Job Points | Free (from work) | Only Farm 10-star company. |
| Faction Energy Perk | +10-50E | Varies | Free | Faction-dependent perk. |

**Key decision: FHC (use vs sell)**
- FHC gives 150E -> at 3,533 DEF/E = 530K DEF gain
- Selling FHC ($12.5M) buys ~14.9 Xanax ($839K each) = 14.9 * 250E * 3,533/E = 13.2M DEF
- **Selling FHC and buying Xanax = 24.8x more stats per dollar**
- Exception: during Ranked Wars, FHCs are valuable for instant refills regardless of cost

### 3.4 Stat Enhancers (SEs)

Items that give +1% of current stat value as permanent stat gain.

| Metric | Value |
|--------|-------|
| Effect | +1% of stat (e.g., at 1B DEF = +10M DEF) |
| Cost | ~$450M per SE |
| Cooldown | 6 hours |
| Max per day | 4 |

**SE breakeven analysis vs other methods:**

| Method | Cost | DEF Gain | Cost per 1K DEF |
|--------|------|----------|-----------------|
| Xanax (250E) | $839K | ~883K DEF | $0.95 |
| FHC (150E) | $12.5M | ~530K DEF | $23.58 |
| SE (at 1B DEF) | $450M | ~10M DEF | $45.00 |

**Verdict:** SEs are the most expensive per-stat method. Only worth it for very wealthy players who want marginal acceleration after maximizing all energy sources. The calculator should show this comparison clearly.

### 3.5 Happy Jumping

Historical strategy: use Ecstasy (2x happy) before gym sessions for bigger gains.

**How it works:**
1. Take Ecstasy -> doubles current happy (e.g., 4500 -> 9000)
2. Train in gym -> slightly higher gains due to happy multiplier in formula
3. Repeat

**Why it's obsolete at high stats:**
- At 100M stat: happy contributes ~2% of formula -> minor benefit
- At 500M stat: happy contributes ~0.2% -> negligible
- At 1B+ stat: happy contributes ~0.005% -> completely irrelevant
- Happy jumps cost Ecstasy ($?) + planning time -> not worth the effort above ~500M

**When it matters:**
- New players (stats under ~50M) -> happy can be 20-40% of formula
- Mid-game players (50M-500M) -> diminishing returns, still noticeable
- The calculator should show the exact happy contribution % at any stat level

### 3.6 Steadfast (Faction Training Perk)

Faction perk that boosts gym gains for specific stats on a rotation.

- Primary stat in rotation: up to +20% gym gains
- Secondary stat: up to +15%
- Third stat: up to +10%
- Exact values depend on faction's Steadfast upgrade level

**Strategy:** Coordinate training with Steadfast rotation. When DEF is the primary Steadfast stat, go hard on DEF training (use Xanax, FHCs, books, etc.).

### 3.7 Education Bonus

Completing education courses gives permanent gym gain bonuses. All bonuses are multiplicative in the formula.

Key courses:
- Sports Science: +2% gym gains all stats + 2% passive bonus
- Various fitness courses: +1-3% passive to specific stats
- Total education bonus: approximately +10% total gym gains (when all complete)
- Education completion status comes from Torn API

### 3.8 Companies Affecting Training

Companies (jobs) provide passive and active bonuses to gym training.

**Top companies for gym gains:**

| Company | Star Level | Training Effect | Other Perks |
|---------|-----------|----------------|-------------|
| **Ladies Strip Club** | 3-star | +25% passive DEF | -- |
| | 5-star | +50% Serotonin (DEF booster needle) effectiveness | -- |
| | 7-star | **+10% DEF gym gains (permanent while employed)** | -- |
| | 10-star | +30% incoming melee damage reduction | Combat |
| **Gents Strip Club** | 3-star | +25% passive DEX | -- |
| | 7-star | +10% DEX gym gains | -- |
| | 10-star | 25% dodge incoming melee | Combat |
| **Music Store** | 3-star | +30% gym XP | -- |
| | 10-star | +15% ALL battle stats (passive) | Combat |
| **Fitness Center** | 3-star | 50% happy loss reduction in gym | -- |
| | 5-star | ~4.5E STR gains per JP | Active training |
| | 10-star | +3% gym gains (all stats) | Training |
| **Mining Corporation** | 5-star | ~4.5E DEF gains per JP | Active training |
| | 7-star | +10% max life | Survivability |
| **Furniture Store** | 3-star | ~4.5E STR gains per JP | Active training |
| | 7-star | +25% passive STR | -- |
| **Gas Station** | 3-star | +25% passive SPD | -- |
| | 5-star | Cauterize (heal during combat) | Combat |
| **Logistics Management** | 1-star | ~4.5E SPD gains per JP | Active training |

### 3.9 Merits Affecting Training

Merits are permanent upgrades bought with merit points (earned from awards/honors).

| Merit | Effect per Level | Max Level | Total at Max |
|-------|-----------------|-----------|-------------|
| Brawn (STR passive) | +3% | 10 | +30% STR |
| Protection (DEF passive) | +3% | 10 | +30% DEF |
| Sharpness (SPD passive) | +3% | 10 | +30% SPD |
| Evasion (DEX passive) | +3% | 10 | +30% DEX |

**Cost:** Level 1 costs 1 merit, level 2 costs 2, ..., level 10 costs 10. Total 0->10 = 55 merits.

Merit stat bonuses apply as effective stat multipliers (shown in API as "effective" vs "raw" stats). They do NOT directly increase gym gains but increase the stat value used in the formula.

### 3.10 Books Affecting Training

Books provide temporary or permanent stat bonuses.

| Book Type | Effect | Duration |
|-----------|--------|----------|
| +30% single stat gym gains | +30% gym gains for STR/DEF/SPD/DEX | 31 days |
| +20% all stats gym gains | +20% gym gains for all stats | 31 days |
| +5% of stat (flat) | +5% of current stat, up to 10M cap | Permanent |

**Strategy:** Stack 30% DEF book with Steadfast DEF rotation for multiplicative bonus. Use all energy boosters during the 31-day window.

### 3.11 Drug Effects on Training

| Drug | Training Effect | Other | Cooldown |
|------|----------------|-------|----------|
| Xanax | +250 energy (primary training drug) | +75 happy | ~8h drug CD |
| Ecstasy | 2x current happy (happy jump) | -- | ~8h drug CD |
| LSD | +50 energy | +50% DEF buff (combat), +200-500 happy | ~7h drug CD |

**SSL Warning:** Combined Xanax + Ecstasy usage > 150 total = permanently kicked from Sports Science Lab gym. LSD is safe (no SSL impact).

### 3.12 Torn API v2 Endpoints

The calculator will use these endpoints. All are client-side GET requests with `?key=API_KEY`.

**Base URL:** `https://api.torn.com/v2/`

| Endpoint | Data | Use |
|----------|------|-----|
| `user?selections=profile` | Level, faction, age, name | Profile display |
| `user?selections=battlestats` | STR, DEF, SPD, DEX (raw + effective), stat modifiers | Core calculator input |
| `user?selections=bars` | Energy (current/max), Happy (current/max), Nerve, Life | Current bars |
| `user?selections=gym` | Currently selected gym + dots, available gyms | Gym dots for formula |
| `user?selections=education` | Completed courses, current course, time remaining | Education bonus calc |
| `user?selections=merits` | All merit levels | Merit bonus display |
| `user?selections=cooldowns` | Drug cooldown, booster cooldown | Timing recommendations |
| `user?selections=jobpoints` | Current company, job points, company type | Company perk identification |
| `user?selections=personalstats` | Xanax used, ecstasy used, energy drinks used, etc. | SSL eligibility check |
| `user?selections=workstats` | Manual labor, intelligence, endurance | Company efficiency calc |

**Multiple selections:** `?selections=battlestats,bars,gym,education,merits,cooldowns,personalstats,workstats`

**API Key Types:** Players generate keys at Settings > API Key. Minimum required access level: "Limited" (public+limited data). The tool only reads data, never writes.

**Rate Limits:** 100 requests per minute per key. Single page load = 1 request (combine selections).

**CORS:** Torn API supports CORS for browser requests. No proxy needed.

---

## 4. Features

### 4.1 Calculator (Core Feature)

**Input Panel:**

| Field | Auto-filled from API? | Manual entry type | Required? |
|-------|----------------------|-------------------|-----------|
| API Key | N/A (user enters) | Text input, stored in localStorage | No (enables auto-fill) |
| Current Stat Value | Yes (battlestats) | Number input | Yes |
| Stat Being Trained | Yes (inferred from gym) | Dropdown: STR/DEF/SPD/DEX | Yes |
| Gym Dots | Yes (gym selection) | Number slider/dropdown (1-39) | Yes |
| Current Happy | Yes (bars.happy) | Number input | Yes |
| Steadfast Bonus | No | Slider: 0-20% | No (default 0) |
| Education Bonus | Partial (can count courses) | Slider: 0-15% | No (default 0) |
| Company Bonus | Partial (can identify company) | Dropdown of known companies | No |
| Book Bonus | No | Checkbox: 30% single / 20% all / none | No (default none) |
| Merit Levels (stat-specific) | Yes (merits) | Slider: 0-10 | No |

**Output Panel (Calculated Results):**

| Output | Description |
|--------|-------------|
| **Gain per energy point** | Stat gain for 1 energy spent |
| **Gain per natural (150E)** | Stat gain from full natural energy |
| **Gain per Xanax (250E)** | Stat gain from one Xanax cycle |
| **Gain per day (natural only)** | Conservative daily estimate |
| **Gain per day (natural + Xanax)** | Standard daily estimate |
| **Gain per day (all sources)** | Optimistic with FHC/cans/refills (user picks sources) |
| **Happy contribution %** | What % of formula is happy (shows why it's irrelevant at high stats) |
| **FHC: Use vs Sell** | Dollar comparison showing which is more efficient |
| **SE analysis** | Cost per stat vs Xanax, whether worth it at current level |
| **Days to next milestone** | Estimated days to reach next round number (e.g., 500M, 1B, 2B) |
| **Monthly projection** | Projected stat after 30 days |
| **Yearly projection** | Projected stat after 365 days |

**Comparison Mode:**
- Toggle "What if I join [company]?" to see impact of company perks
- Toggle "What if I use 30% book?" to see impact of books
- Show before/after side-by-side for any modifier change

### 4.2 Guide Content (Inline with Calculator)

The guide is NOT a separate page. It surrounds and contextualizes the calculator. Structure:

**Section 1: "Getting Started (Levels 1-15)"**
- Explain: energy, gym, stats
- Which gym to use at each unlock
- Train all 4 stats equally until you understand the game
- Don't specialize yet
- _No calculator needed here — just text + progression table_

**Section 2: "The Gym Formula — Demystified"**
- Show the formula with plain-English explanation
- **Interactive: plug in YOUR numbers** (this is where the calculator sits)
- Explain each variable with sliders
- Show the happy contribution % live as user changes stat value

**Section 3: "Happy Jumping — When It Matters and When It Doesn't"**
- Explain happy jumping step by step
- **Interactive chart:** X-axis = stat value, Y-axis = happy contribution %. User sees where they fall.
- Clear threshold markers: "Below 50M: happy matters", "Above 500M: irrelevant"
- Calculator shows their personal happy contribution %

**Section 4: "Gym Progression — Which Gym, When"**
- Table of all gyms with unlock requirements
- Highlight which gym the user should be in based on their stats (API data)
- Explain dots and their impact (2x dots = 2x gains)
- Special focus on SSL restriction (Xanax + Ecstasy > 150 = kicked out)

**Section 5: "Energy Management — Getting the Most Out of Every Point"**
- Ranking of energy sources by cost efficiency:
  1. Natural energy (free)
  2. Xanax ($839K for 250E = $3.36/E)
  3. Point refill ($845K for 150E = $5.63/E)
  4. Energy cans ($12.7M for 150E = $84.67/E)
  5. FHC ($12.5M for 150E = $83.33/E — BUT sell for $12.5M and buy Xanax instead)
- **Interactive:** enter your available energy sources, see projected daily gains
- FHC sell vs use comparison with current market prices

**Section 6: "Stat Enhancers — The Math"**
- What SEs do (+1% of stat)
- Cost comparison table vs Xanax and FHC
- **Interactive:** at your stat level, how much does 1 SE give? How many Xanax could you buy instead?
- Clear verdict with thresholds

**Section 7: "Company Perks for Training"**
- Table of all companies that affect gym training (from Section 3.8)
- Highlight the user's current company (from API)
- Show what they'd gain by switching to optimal company
- **Interactive:** "If I join [company], my gains would be X% higher"
- Special focus: Ladies Strip Club for DEF, Gents Strip Club for DEX, Fitness Center for all

**Section 8: "Merits, Education, and Books"**
- Which merits affect training (stat passives)
- Education bonus explained
- Book stacking strategy
- **Interactive:** show impact of each merit level on yearly stat projection

**Section 9: "Preparing for Training Break"**
- Context: many players (and TM specifically) have periodic training breaks for Ranked Wars
- Before a break: stack energy, coordinate Xanax timing
- During break: don't waste energy (stacking for war), save FHCs/cans for burst
- After break: resume normal schedule, consider using saved resources in a book window

### 4.3 Recommendations Engine

Based on calculator inputs, generate a personalized action list:

**Priority recommendations (show top 3-5):**

| Condition | Recommendation |
|-----------|---------------|
| Happy > 5% of formula | "Happy jumping can boost your gains by X%. Consider Ecstasy before gym." |
| Happy < 1% of formula | "Happy is only X% of your formula. Skip happy jumping — focus on energy." |
| Gym dots < max available | "You qualify for [Gym Name] (X dots). Switch from your current Y dots for +Z% gains." |
| Using FHC | "Selling your FHC ($12.5M) and buying Xanax gives 24.8x more stats." |
| No Xanax usage | "Xanax is the most cost-efficient training drug. $839K for 250E = ~883K stat." |
| Steadfast at 0% | "Ask your faction about Steadfast rotation. Up to +20% gym gains when active." |
| No book active | "A 30% stat book would add +X stat/day for 31 days." |
| Company has no gym perk | "Joining [Ladies Strip Club] would give +10% DEF gym gains + 25% passive DEF." |
| SE considered | "At your stat level, 1 SE costs $450M for +X stat. Same money buys Y Xanax for Z stat." |
| Xanax + Ecstasy > 120 | "WARNING: You've used X total Xanax + Ecstasy. At 150 you lose SSL access forever." |
| Stats < 250K total | "Focus on unlocking Mr. Isoyamas gym (need 250K total stats) for single-stat training." |

### 4.4 Visual Elements

- **Stat projection chart:** line chart showing stat growth over 30/90/365 days under current vs optimized strategy
- **Happy relevance chart:** shows happy contribution % across stat levels (logarithmic X-axis)
- **Energy cost efficiency bar chart:** visual comparison of all energy sources ($/stat)
- **Company comparison radar:** overlay your current company perks vs recommended company

---

## 5. UX/Design

### 5.1 Layout

Single scrollable page. Sections flow top-to-bottom.

```
[Header: TM Training Guide]
[API Key Input Bar — sticky at top or in sidebar]

[Section 1: Getting Started — text only]
[Section 2: The Formula — calculator here, interactive]
[Section 3: Happy Jumping — chart + explanation]
[Section 4: Gym Progression — table, highlighted current]
[Section 5: Energy Management — ranked list, FHC calc]
[Section 6: Stat Enhancers — comparison table, interactive]
[Section 7: Company Perks — table, comparison mode]
[Section 8: Merits & Books — merit sliders]
[Section 9: Training Break Prep — text + checklist]

[Recommendations Panel — sticky/floating, updates as user scrolls]
[Footer: Credits, Torn API link, TM faction]
```

### 5.2 API Key Handling

- **Input:** text field at top of page or in collapsible sidebar
- **Storage:** `localStorage` only. Never sent to any backend.
- **Privacy notice:** "Your API key stays in your browser. We never store or transmit it."
- **Without API key:** all fields are manual entry. Calculator works fine.
- **With API key:** auto-fills all fields, shows profile info, highlights recommendations

### 5.3 Mobile

- Must work in TornPDA's built-in browser (WebView, Chromium-based)
- Responsive: single column on mobile, side-by-side on desktop
- Calculator inputs: large touch targets
- Charts: touch-friendly, no hover-dependent interactions

### 5.4 Dark Theme

- Default dark theme (Torn.com and TornPDA are dark)
- Optional light toggle
- Colors: Torn's green (#7ca900) as accent, dark backgrounds (#1a1a2e or similar)

---

## 6. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Load time | < 2s on mobile |
| Bundle size | < 500KB (excluding chart library) |
| Browser support | Chrome 90+, Safari 14+, TornPDA WebView |
| Accessibility | Basic WCAG 2.1 AA (contrast, labels, keyboard nav) |
| SEO | Not needed (faction tool, not public marketing) |
| Analytics | Optional: simple page view counter (no tracking) |
| Uptime | Best effort (Coolify-hosted, same as other tools) |
| Offline | Calculator should work offline after first load (service worker optional, not required) |

---

## 7. Out of Scope (v1)

- User accounts or login
- Server-side data storage
- Historical stat tracking (TornStats already does this)
- Faction-wide analytics or dashboards
- War simulation or war-related tools (separate project: tm-war-room)
- Bazaar/market price live feeds
- Crime calculator
- Travel trading calculator
- Multi-language support (English only for v1)
- Push notifications or alerts

---

## 8. Future Possibilities (v2+)

- **Faction leaderboard:** show all members' daily gains (requires API key from each member or faction API)
- **Optimal training schedule:** given energy sources, generate a daily schedule
- **Training diary:** log sessions and compare against projections
- **Compare with faction average:** "you're training X% faster/slower than faction average"
- **Ranked War mode:** switch to war prep recommendations
- **Share config:** export calculator state as URL params for sharing setups

---

## 9. Market Prices Reference

These are approximate and fluctuate. The calculator should either:
- (a) Use hardcoded defaults with an "update prices" manual override, or
- (b) Pull from Torn API market endpoint if feasible client-side

| Item | Approx Price (March 2026) | API Item ID |
|------|--------------------------|-------------|
| Xanax | $839,000 | 206 |
| FHC (Full Happy Cake) | $12,500,000 | -- |
| Stat Enhancer | $450,000,000 | 586 |
| Energy Drink (can) | ~$2,100,000 per can | 261 |
| Ecstasy | ~$200,000 | 196 |
| LSD | ~$150,000 | 195 |
| Erotic DVD | ~$4,000,000 | 167 |

---

## 10. References

- [Torn Training Guide (Forum)](https://www.torn.com/forums.php?p=threads&f=61&t=16270385) — source of gym formula
- [Gym & Stats Training Like a Pro 2026](https://www.torn.com/forums.php?p=threads&f=61&t=16142480) — gym progression
- [Euph's Defense v Dexterity Guide](https://www.torn.com/forums.php?p=threads&f=61&t=16198751) — build comparison
- [Stat Enhancer Guide](https://www.torn.com/forums.php?p=threads&f=61&t=16544360) — SE math
- [Handsome Guide to Stat Gains from Books](https://www.torn.com/forums.php?p=threads&f=61&t=15983493) — books
- [Torn API v2 Documentation](https://www.torn.com/swagger/index.html) — API reference
- [TornStats](https://www.tornstats.com/) — community stat tracking tool
