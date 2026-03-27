'use client';

interface HeaderProps {
  playerName?: string;
  playerLevel?: number;
  factionName?: string;
}

export function Header({ playerName, playerLevel, factionName }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-bg-secondary/95 backdrop-blur border-b border-torn-green/20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-torn-green">TM Training Guide</h1>
          <p className="text-sm text-text-secondary">The Masters — Member Council</p>
        </div>
        {playerName && (
          <div className="text-right">
            <p className="text-sm font-medium text-text-primary">{playerName} <span className="text-text-secondary">Lv.{playerLevel}</span></p>
            {factionName && <p className="text-xs text-torn-green">{factionName}</p>}
          </div>
        )}
      </div>
    </header>
  );
}
