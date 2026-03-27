# TM Training Guide & Calculator

A gym training guide and interactive calculator for [Torn.com](https://www.torn.com/) players — built for **The Masters** faction.

**Live:** [train.tri.ovh](https://train.tri.ovh)

## What is this?

A web tool that helps Torn players optimize their gym training. Enter your stats (or load them via API key) and get:

- **Personalized gain calculations** — how much stat you gain per energy point, per day, per month
- **FHC sell vs use analysis** — spoiler: selling and buying Xanax is ~25x better
- **Stat Enhancer math** — are SEs worth it at your stat level?
- **Happy contribution breakdown** — when happy jumping matters and when it doesn't
- **Gym progression guide** — all 33 gyms with per-stat gains and unlock requirements
- **Energy source comparison** — ranked by cost efficiency with charts
- **Company perks overview** — which job gives the best training bonuses
- **Personalized recommendations** — actionable advice based on your situation

## Features

- **Torn API integration** — optional, client-side only. Enter your API key (Limited access) to auto-fill stats. Key never leaves your browser.
- **Dark & light mode** — toggle in the header
- **Mobile-friendly** — works in TornPDA's browser
- **Tabbed navigation** — jump between sections without scrolling forever
- **All data verified** — gym gains, unlock requirements, prices, and mechanics checked against [Torn Wiki](https://wiki.torn.com) and the Torn API

## Screenshots

The guide includes interactive charts, gym tables with per-stat gains, energy cost comparisons, and a recommendation engine that adapts to your stats.

## Tech Stack

- **Next.js 15** (App Router, static export)
- **TypeScript**
- **Tailwind CSS v4**
- **Chart.js** via react-chartjs-2
- **Vitest** for unit tests
- Deployed on **Coolify** (Docker + nginx)

## Development

```bash
# Install
npm install

# Dev server
npm run dev

# Run tests
npm test

# Build (static export to /out/)
node node_modules/next/dist/bin/next build
```

## Data Sources

All game data is verified against:
- [Torn Wiki](https://wiki.torn.com) — gym gains, unlock requirements, merits, books, education
- [Torn API v2](https://www.torn.com/swagger/index.html) — battle stats, bars, gym, market prices, company perks
- Community-verified formulas from [Torn Forums](https://www.torn.com/forums.php)

Market prices are approximate defaults and may fluctuate.

## Contributing

Found incorrect data? Open an issue or PR. All game mechanics claims should be verifiable against the Torn Wiki or API.

## Credits

Built by [bombel](https://www.torn.com/profiles.php?XID=2362436) for [The Masters](https://www.torn.com/factions.php?step=profile&ID=11559) faction — Member Council initiative.

## License

MIT
