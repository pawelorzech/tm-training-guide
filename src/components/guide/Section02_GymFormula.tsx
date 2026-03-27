'use client';

import type { CalculatorState, CalculatorResults } from '@/types/calculator';
import { StatInputPanel } from '@/components/calculator/StatInputPanel';
import { ResultsPanel } from '@/components/calculator/ResultsPanel';

interface Section02Props {
  state: CalculatorState;
  results: CalculatorResults;
  onUpdate: <K extends keyof CalculatorState>(key: K, value: CalculatorState[K]) => void;
  apiPopulated: boolean;
}

export function Section02_GymFormula({ state, results, onUpdate, apiPopulated }: Section02Props) {
  return (
    <section id="gym-formula" className="space-y-6">
      <h2 className="text-2xl font-bold text-text-primary border-b border-gray-700 pb-3">
        The Gym Formula — Demystified
      </h2>

      {/* Intro */}
      <p className="text-text-primary leading-relaxed">
        Every gym session boils down to one formula. Understanding it tells you exactly where your
        gains come from — and where they don&apos;t. No guessing, no superstition.
      </p>

      {/* Formula Block */}
      <div className="bg-bg-card border border-gray-700 rounded-xl p-5 overflow-x-auto">
        <p className="text-xs text-text-secondary uppercase tracking-wider mb-3 font-medium">The Formula</p>
        <pre className="text-sm leading-loose font-mono whitespace-pre-wrap break-words">
          <span className="text-text-secondary">Gain = (</span>
          <span className="text-blue-400 font-semibold">Gym_Dots</span>
          <span className="text-text-secondary"> × 4) × (0.00019106 × </span>
          <span className="text-torn-green font-semibold">Current_Stat</span>
          <span className="text-text-secondary">{'\n'}         + 0.00226263 × </span>
          <span className="text-yellow-400 font-semibold">Happy</span>
          <span className="text-text-secondary"> + 0.55)</span>
          <span className="text-text-secondary">{'\n'}       × (1 + </span>
          <span className="text-purple-400 font-semibold">Steadfast + Education</span>
          <span className="text-text-secondary">) / 150 × Energy</span>
        </pre>
      </div>

      {/* Variable Explanations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">What each piece means</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gym Dots */}
          <div className="bg-bg-card border border-blue-500/30 rounded-xl p-4">
            <p className="font-semibold text-blue-400 mb-2">Gym_Dots</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              The quality rating of your current gym. Ranges from 2 dots (Premier Fitness) to 39 dots
              (Balboas Gym). This multiplies your entire gain linearly — switching from a 10-dot to a
              20-dot gym literally doubles your output. Always train in the best gym you can access.
            </p>
          </div>

          {/* Current Stat */}
          <div className="bg-bg-card border border-torn-green/30 rounded-xl p-4">
            <p className="font-semibold text-torn-green mb-2">Current_Stat</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              The stat you&apos;re currently training (STR, DEF, SPD, or DEX). At low levels this barely
              registers. At high levels (100M+) it absolutely dominates everything else in the formula.
              The bigger your stat, the more it snowballs — large numbers grow faster in absolute terms.
            </p>
          </div>

          {/* Happy */}
          <div className="bg-bg-card border border-yellow-400/30 rounded-xl p-4">
            <p className="font-semibold text-yellow-400 mb-2">Happy</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Your current happiness value. It adds a flat additive bonus inside the formula. At low
              stats, happy can represent a significant chunk of your gains. At high stats, it becomes
              a rounding error. This is why happy jumping (taking Ecstasy to double happy before
              training) matters early and becomes irrelevant later.
            </p>
          </div>

          {/* Steadfast + Education */}
          <div className="bg-bg-card border border-purple-400/30 rounded-xl p-4">
            <p className="font-semibold text-purple-400 mb-2">Steadfast + Education</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Percentage multipliers that stack additively. Steadfast is a Torn perk (up to +20%).
              Education courses can add up to +15%. These multiply your entire gain — a +35% total
              bonus means every session gives you 35% more stats. Worth maxing out whenever possible.
            </p>
          </div>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="space-y-5">
        <h3 className="text-xl font-semibold text-text-primary">Plug in YOUR numbers below</h3>
        <p className="text-text-secondary text-sm">
          Enter your current stats to see exactly how much you gain per energy point — and what your
          daily/monthly/yearly projections look like.
        </p>

        <div className="bg-bg-card border border-gray-700 rounded-xl p-5">
          <StatInputPanel state={state} onUpdate={onUpdate} apiPopulated={apiPopulated} />
        </div>

        <div className="bg-bg-card border border-gray-700 rounded-xl p-5">
          <ResultsPanel results={results} state={state} />
        </div>
      </div>

      {/* Critical Insight Callout */}
      <div className="bg-bg-secondary border-l-4 border-torn-green rounded-r-xl p-5 space-y-2">
        <p className="font-bold text-torn-green text-base">The Critical Insight</p>
        <p className="text-text-primary text-sm leading-relaxed">
          At high stat values, <strong>Current_Stat completely dominates the formula</strong>. Once you
          hit 500M+ stats, the stat component (0.00019106 × stat) is so large that happy, steadfast,
          and education become relatively tiny multipliers on top of it.
        </p>
        <p className="text-text-secondary text-sm">
          This is why your happy contribution percentage (shown in results above) collapses to near
          zero at high stats — and why big players stop worrying about happy jumping. Your stat is
          basically the whole formula at that point.
        </p>
      </div>

      {/* TL;DR */}
      <div className="bg-bg-secondary border border-gray-600 rounded-xl p-5">
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">TL;DR</p>
        <ul className="space-y-2">
          {[
            'Higher gym dots = proportionally higher gains — always train in the best gym available',
            'At 500M+ stats, your stat value is 99.9%+ of the formula — everything else is noise',
            'Happy, Steadfast, and Education are multipliers on top of your base gain',
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
