'use client';

import { GYMS } from '@/lib/constants';
import { formatStatShort } from '@/lib/format';

interface Section04Props {
  currentStat: number;
  gymDots: number;
}

function getCurrentGym(gymDots: number) {
  return GYMS.find((g) => g.dots === gymDots) ?? null;
}

function getNextGym(currentStat: number, gymDots: number) {
  const currentIdx = GYMS.findIndex((g) => g.dots === gymDots);
  if (currentIdx === -1 || currentIdx === GYMS.length - 1) return null;
  return GYMS[currentIdx + 1];
}

function canUnlock(gym: (typeof GYMS)[number], currentStat: number): boolean {
  if (gym.unlockType === 'none') return true;
  // Simplified: compare currentStat against unlock value for all types
  return currentStat >= gym.unlockValue;
}

export function Section04_GymProgression({ currentStat, gymDots }: Section04Props) {
  const currentGym = getCurrentGym(gymDots);
  const nextGym = getNextGym(currentStat, gymDots);

  return (
    <section id="gym-progression" className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary">
          Gym Progression — Which Gym, When
        </h2>
        <p className="text-text-secondary mt-1">
          Every dot counts. Higher dots = more stat per energy, proportionally.
        </p>
      </div>

      {/* Current status banner */}
      {currentGym && (
        <div className="bg-bg-card border border-torn-green/40 rounded-lg p-4">
          <p className="text-text-primary">
            You&apos;re in{' '}
            <span className="text-torn-green font-bold">{currentGym.name}</span>{' '}
            <span className="text-text-secondary">({currentGym.dots} dots)</span>.{' '}
            {nextGym ? (
              <>
                Next unlock:{' '}
                <span className="text-yellow-400 font-bold">{nextGym.name}</span>{' '}
                <span className="text-text-secondary">({nextGym.dots} dots)</span>{' '}
                at{' '}
                <span className="text-text-primary font-semibold">{nextGym.unlock}</span>.
              </>
            ) : (
              <span className="text-torn-green font-semibold">
                You&apos;re in the best gym. Max gains unlocked.
              </span>
            )}
          </p>
        </div>
      )}

      {/* SSL note */}
      <div className="border border-text-secondary/30 rounded-lg p-4 bg-bg-card">
        <p className="text-text-primary font-bold text-sm mb-1">
          Don&apos;t bother with SSL
        </p>
        <p className="text-text-secondary text-sm">
          Sports Science Lab bans you after 150 Xanax + Ecstasy uses. Since Xanax is the best
          energy source in the game, limiting it for SSL access is never worth it. Train at Balboas
          or other endgame gyms instead — no restrictions, better long-term results.
        </p>
      </div>

      {/* Gym table */}
      <div className="overflow-x-auto rounded-lg border border-text-secondary/20">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-secondary border-b border-text-secondary/20">
              <th className="text-left px-4 py-3 text-text-secondary font-semibold">Gym</th>
              <th className="text-center px-4 py-3 text-text-secondary font-semibold">Dots</th>
              <th className="text-left px-4 py-3 text-text-secondary font-semibold">
                Unlock Requirement
              </th>
            </tr>
          </thead>
          <tbody>
            {GYMS.map((gym) => {
              const isCurrent = gym.dots === gymDots;
              const isNext = nextGym && gym.id === nextGym.id;
              const isUnlocked = canUnlock(gym, currentStat);

              let rowClass = 'border-b border-text-secondary/10 transition-colors';
              if (isCurrent) {
                rowClass += ' bg-torn-green/10';
              } else if (isNext) {
                rowClass += ' bg-yellow-500/10';
              } else {
                rowClass += ' hover:bg-bg-secondary/50';
              }

              return (
                <tr key={gym.id} className={rowClass}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${
                          isCurrent
                            ? 'text-torn-green'
                            : isNext
                              ? 'text-yellow-400'
                              : isUnlocked
                                ? 'text-text-primary'
                                : 'text-text-secondary'
                        }`}
                      >
                        {gym.name}
                      </span>
                      {isCurrent && (
                        <span className="text-xs bg-torn-green/20 text-torn-green px-2 py-0.5 rounded-full font-semibold">
                          Current
                        </span>
                      )}
                      {isNext && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-semibold">
                          Next
                        </span>
                      )}
                      {'sslRestriction' in gym && gym.sslRestriction && (
                        <span className="text-xs bg-danger/20 text-danger px-2 py-0.5 rounded-full font-semibold">
                          SSL
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`font-bold ${
                        isCurrent ? 'text-torn-green' : isNext ? 'text-yellow-400' : 'text-text-primary'
                      }`}
                    >
                      {gym.dots}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {gym.unlock}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Key insight */}
      <div className="bg-bg-card border border-text-secondary/20 rounded-lg p-4">
        <p className="text-text-primary font-semibold">Key insight</p>
        <p className="text-text-secondary text-sm mt-1">
          Balboas (39 dots) = 2x the dots of George&apos;s (20) = 2x the gains per energy spent.
          Dots scale linearly. Every gym upgrade is a direct multiplier on your efficiency.
        </p>
        {currentStat > 0 && gymDots > 0 && (
          <p className="text-torn-green text-sm font-semibold mt-2">
            At your current stat ({formatStatShort(currentStat)}), you&apos;re getting{' '}
            {gymDots} dots. Upgrading to Balboas would give you{' '}
            {((39 / gymDots) * 100 - 100).toFixed(0)}% more stat per energy.
          </p>
        )}
      </div>

      {/* TL;DR */}
      <div className="bg-bg-secondary rounded-lg p-4 border-l-4 border-torn-green">
        <p className="text-torn-green font-bold text-sm uppercase tracking-wide mb-2">TL;DR</p>
        <ul className="space-y-1 text-sm text-text-secondary">
          <li>
            <span className="text-text-primary font-semibold">More dots = proportionally more gains per energy.</span>{' '}
            No diminishing returns — it&apos;s pure math.
          </li>
          <li>
            <span className="text-text-primary font-semibold">Rush George&apos;s</span> (50M any stat),{' '}
            then grind to <span className="text-text-primary font-semibold">Balboas</span> (1B total stats).
          </li>
          <li>
            <span className="text-text-primary font-semibold">
              Skip SSL — unlimited Xanax at other gyms beats restricted SSL access.
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
