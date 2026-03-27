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
  test('formats hundreds of millions', () => {
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
