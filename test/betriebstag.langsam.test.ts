// Spielt den Betriebstag im Anzeigetakt Minute für Minute durch.
// Dauert bewusst ungefähr eine Minute. Aufruf: npm run test:lang
import { setTimeout as warte } from 'node:timers/promises';
import { expect, it } from 'vitest';
import { ladeAbfahrten } from '../server/daten.ts';
import { naechsteAbfahrten } from '../shared/tafel.ts';
import { addiereMinuten } from '../shared/zeit.ts';

const TAKT_MS = 50;

it('zeigt von 05:00 bis 23:59 jederzeit Abfahrten', async () => {
  const abfahrten = ladeAbfahrten();
  let zeit = '05:00';
  let schritte = 0;

  while (true) {
    const zeilen = naechsteAbfahrten(abfahrten, zeit, 10);
    expect(zeilen.length, `leere Tafel um ${zeit}`).toBeGreaterThan(0);
    expect(zeilen.length).toBeLessThanOrEqual(10);
    if (zeit === '23:59') break;
    zeit = addiereMinuten(zeit, 1);
    schritte++;
    await warte(TAKT_MS);
  }

  expect(schritte).toBe(19 * 60 - 1);
});
