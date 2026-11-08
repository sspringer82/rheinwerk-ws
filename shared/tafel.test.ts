import { describe, expect, it } from 'vitest';
import { faehrtSonntags } from './tafel.ts';
import type { Abfahrt } from './types.ts';

const abfahrt = (zug: string, plan: string, verspaetung = 0): Abfahrt => ({
  zug,
  ziel: 'Seeburg',
  via: [],
  plan,
  gleis: '1',
  verspaetung,
});

describe('faehrtSonntags', () => {
  it('lässt Regionalbahnen den ganzen Tag ausfallen', () => {
    expect(faehrtSonntags(abfahrt('RB 40', '05:22'))).toBe(false);
    expect(faehrtSonntags(abfahrt('RB 70', '23:56'))).toBe(false);
  });

  it('lässt S-Bahnen erst ab 08:00 fahren', () => {
    expect(faehrtSonntags(abfahrt('S 1', '07:59'))).toBe(false);
    expect(faehrtSonntags(abfahrt('S 1', '08:00'))).toBe(true);
  });

  it('richtet sich bei S-Bahnen nach dem Plan, nicht nach der Verspätung', () => {
    expect(faehrtSonntags(abfahrt('S 2', '07:58', 5))).toBe(false);
  });

  it('lässt alle anderen Züge wie werktags fahren', () => {
    expect(faehrtSonntags(abfahrt('RE 10', '05:08'))).toBe(true);
    expect(faehrtSonntags(abfahrt('FX 500', '05:12'))).toBe(true);
  });
});
