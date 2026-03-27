'use client';

interface HeaderProps {
  playerName?: string;
  playerLevel?: number;
  factionName?: string;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Header({ playerName, playerLevel, factionName, isDark, onToggleTheme }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-bg-secondary/95 backdrop-blur border-b border-torn-green/20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-torn-green truncate">TM Training Guide</h1>
          <p className="text-xs sm:text-sm text-text-secondary">The Masters — Member Council</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-bg-card hover:bg-torn-green/20 transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          {playerName && (
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-text-primary">{playerName} <span className="text-text-secondary">Lv.{playerLevel}</span></p>
              {factionName && <p className="text-xs text-torn-green">{factionName}</p>}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
