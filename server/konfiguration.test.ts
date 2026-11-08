import { describe, expect, it } from 'vitest';
import { konfigurationAus } from './konfiguration.ts';

describe('konfigurationAus', () => {
  it('übernimmt Bahnhofsname und Token', () => {
    expect(konfigurationAus({ BAHNHOF_NAME: 'Teststadt', FAHRPLAN_TOKEN: 'abc' })).toEqual({
      bahnhofName: 'Teststadt',
      fahrplanToken: 'abc',
    });
  });

  it('behandelt einen leeren Token wie einen fehlenden', () => {
    expect(konfigurationAus({ BAHNHOF_NAME: 'Teststadt', FAHRPLAN_TOKEN: '' }).fahrplanToken).toBeUndefined();
  });

  it('bricht ohne Bahnhofsnamen ab', () => {
    expect(() => konfigurationAus({ FAHRPLAN_TOKEN: 'abc' })).toThrow('BAHNHOF_NAME');
  });
});
