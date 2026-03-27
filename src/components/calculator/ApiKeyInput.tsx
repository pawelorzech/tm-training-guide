'use client';

import { useState } from 'react';

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onLoad: () => void;
  onClear: () => void;
  loading: boolean;
  error: string | null;
  playerName?: string;
}

export function ApiKeyInput({
  apiKey,
  onApiKeyChange,
  onLoad,
  onClear,
  loading,
  error,
  playerName,
}: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false);

  const isLoaded = !!playerName;

  return (
    <div className="bg-bg-card border border-gray-700 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-text-primary font-semibold text-sm">Load My Stats from Torn API</h3>
        {isLoaded && (
          <div className="flex items-center gap-2 text-torn-green text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{playerName}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="Enter your Torn API key"
            disabled={loading || isLoaded}
            className="w-full bg-bg-secondary border border-gray-600 rounded-md px-3 py-2 pr-10
              text-text-primary placeholder-gray-500 text-sm
              focus:outline-none focus:border-torn-green focus:ring-1 focus:ring-torn-green
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={() => setShowKey((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
            tabIndex={-1}
            aria-label={showKey ? 'Hide API key' : 'Show API key'}
          >
            {showKey ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        {!isLoaded ? (
          <button
            onClick={onLoad}
            disabled={loading || !apiKey.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-torn-green text-white rounded-md text-sm font-medium
              hover:opacity-90 transition-opacity
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading...
              </>
            ) : (
              'Load My Stats'
            )}
          </button>
        ) : (
          <button
            onClick={onClear}
            className="px-4 py-2 bg-bg-secondary border border-gray-600 text-text-secondary rounded-md text-sm font-medium
              hover:border-gray-500 hover:text-text-primary transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {error && (
        <p className="text-danger text-sm flex items-center gap-1.5">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}

      <p className="text-xs text-text-secondary">
        Your API key stays in your browser. We never store or transmit it.
      </p>
    </div>
  );
}
