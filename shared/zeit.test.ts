import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { addiereMinuten, istFrueherOderGleich, zweistellig } from './zeit.ts';

interface Referenz {
  plan: string;
  verspaetung: number;
  erwartet: string;
}

const referenz: Referenz[] = JSON.parse(readFileSync('fixtures/referenz-zeiten.json', 'utf8'));

describe('addiereMinuten', () => {
  it.each(referenz)('$plan + $verspaetung min = $erwartet', ({ plan, verspaetung, erwartet }) => {
    expect(addiereMinuten(plan, verspaetung)).toBe(erwartet);
  });
});

describe('Hilfsfunktionen', () => {
  it('füllt einstellige Zahlen auf', () => {
    expect(zweistellig(7)).toBe('07');
    expect(zweistellig(23)).toBe('23');
  });

  it('vergleicht Uhrzeiten', () => {
    expect(istFrueherOderGleich('09:15', '10:00')).toBe(true);
    expect(istFrueherOderGleich('10:00', '10:00')).toBe(true);
    expect(istFrueherOderGleich('10:01', '10:00')).toBe(false);
  });
});
