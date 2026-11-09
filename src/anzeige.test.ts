import { describe, expect, it } from 'vitest';
import { restMinuten, restText } from './anzeige.ts';

describe('Spalte In', () => {
  it('rechnet innerhalb einer Stunde und über den Stundenwechsel', () => {
    expect(restText('10:00', '10:07')).toBe('7 MIN');
    expect(restText('09:58', '10:03')).toBe('5 MIN');
  });

  it('zeigt JETZT, wenn der Zug in dieser Minute fährt', () => {
    expect(restText('10:00', '10:00')).toBe('JETZT');
  });

  it('zählt RE 79 (23:58 + 5 min) um 23:59 über Mitternacht', () => {
    expect(restText('23:59', '00:03')).toBe('4 MIN');
  });

  it('zählt auch nach Mitternacht weiter bis zur Abfahrt', () => {
    expect(restMinuten('00:01', '00:03')).toBe(2);
    expect(restText('00:03', '00:03')).toBe('JETZT');
  });

  it('rechnet Abfahrten bis zum Ende des Betriebstags über Mitternacht', () => {
    expect(restMinuten('23:50', '01:00')).toBe(70);
  });
});
