'use client';

import { GYMS } from '@/lib/constants';

const FIRST_EIGHT_GYMS = GYMS.slice(0, 8);

function DotsDisplay({ dots }: { dots: number }) {
  const full = Math.floor(dots);
  const half = dots % 1 >= 0.5;
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <span key={i} className="text-torn-green text-xs">●</span>
      ))}
      {half && <span className="text-torn-green/50 text-xs">◐</span>}
      <span className="ml-1 text-text-secondary text-xs">({dots})</span>
    </span>
  );
}

export function Section01_GettingStarted() {
  return (
    <section id="getting-started" className="space-y-6">
      <h2 className="text-2xl font-bold text-text-primary border-b border-gray-700 pb-3">
        Getting Started (Levels 1–15)
      </h2>

      {/* Intro */}
      <div className="space-y-3 text-text-primary leading-relaxed">
        <p>
          Torn has four battle stats: <strong className="text-torn-green">Strength (STR)</strong>,{' '}
          <strong className="text-torn-green">Defense (DEF)</strong>,{' '}
          <strong className="text-torn-green">Speed (SPD)</strong>, and{' '}
          <strong className="text-torn-green">Dexterity (DEX)</strong>. These determine how well you
          fight. You grow them by spending energy in the gym.
        </p>
        <p>
          Your energy regenerates at <strong>5 energy every 15 minutes</strong>, up to a maximum of{' '}
          <strong>150 energy</strong>. That means you fill up completely in about 7.5 hours. Don&apos;t
          let it sit capped — that&apos;s free gains rotting away.
        </p>
        <p>
          As your stats grow, you unlock better gyms. Better gyms have more{' '}
          <strong className="text-warning">dots</strong> — and more dots means more gains per
          energy. The difference between gyms is not trivial.
        </p>
      </div>

      {/* Gym Progression Table */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Gym Progression (First 8 Gyms)</h3>
        <div className="overflow-x-auto rounded-xl border border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-secondary border-b border-gray-700">
                <th className="text-left px-4 py-3 text-text-secondary font-medium">#</th>
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Gym</th>
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Dots</th>
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Unlock Requirement</th>
              </tr>
            </thead>
            <tbody>
              {FIRST_EIGHT_GYMS.map((gym, index) => (
                <tr
                  key={gym.id}
                  className={`border-b border-gray-800 ${index % 2 === 0 ? 'bg-bg-card' : 'bg-bg-secondary'} hover:bg-bg-secondary/80 transition-colors`}
                >
                  <td className="px-4 py-3 text-text-secondary">{gym.id}</td>
                  <td className="px-4 py-3 font-medium text-text-primary">{gym.name}</td>
                  <td className="px-4 py-3">
                    <DotsDisplay dots={gym.dots} />
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{gym.unlock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-text-secondary mt-2">
          More gyms unlock after Hank&apos;s — including <strong className="text-torn-green">Mr. Isoyamas</strong> (10 dots) at 250K total stats.
        </p>
      </div>

      {/* Early Advice */}
      <div className="bg-bg-card border border-torn-green/30 rounded-xl p-5 space-y-3">
        <h3 className="text-lg font-semibold text-torn-green">Early Game Advice</h3>
        <p className="text-text-primary">
          <strong>Train all 4 stats equally until you understand the game. Don&apos;t specialize yet.</strong>
        </p>
        <p className="text-text-secondary text-sm">
          Specializing too early locks you into a build that may not fit your playstyle. Once you
          hit around 250K total stats and unlock Mr. Isoyamas, you&apos;ll have enough game knowledge
          to decide whether to go offensive (STR/SPD), defensive (DEF/DEX), or balanced.
        </p>
        <p className="text-text-secondary text-sm">
          In the meantime: use your energy, don&apos;t let it cap, and keep upgrading gyms as you
          hit the unlock thresholds.
        </p>
      </div>

      {/* Mr. Isoyamas milestone callout */}
      <div className="bg-bg-secondary border border-warning/30 rounded-xl p-4 flex gap-3 items-start">
        <span className="text-warning text-xl mt-0.5">★</span>
        <div>
          <p className="font-semibold text-warning">First Real Milestone: Mr. Isoyamas</p>
          <p className="text-sm text-text-secondary mt-1">
            Reach <strong className="text-text-primary">250,000 total stats</strong> to unlock Mr. Isoyamas (10 dots).
            This is the standard &quot;you&apos;re past the tutorial&quot; threshold. At this point, start
            thinking seriously about specialization and energy sources beyond natural regen.
          </p>
        </div>
      </div>

      {/* TL;DR */}
      <div className="bg-bg-secondary border border-gray-600 rounded-xl p-5">
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">TL;DR</p>
        <ul className="space-y-2">
          {[
            'Spend energy in the gym to grow your battle stats (STR, DEF, SPD, DEX)',
            'Better gyms unlock as your stats grow — more dots = more gains per energy',
            'Train all 4 stats equally until 250K total, then consider specializing',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
              <span className="text-torn-green mt-0.5 shrink-0">▸</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
