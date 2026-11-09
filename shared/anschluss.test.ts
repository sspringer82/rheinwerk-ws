import { describe, expect, it } from 'vitest';
import { pruefeAnschluss, pruefeAuswahl, zugId } from './anschluss.ts';
import type { Abfahrt, Ankunft, Umstiegszeiten } from './types.ts';

const umstiegszeiten: Umstiegszeiten = {
  bahnsteige: [
    ['1', '2'],
    ['3', '4'],
    ['5', '6'],
    ['7', '8'],
    ['9', '10'],
    ['11', '12'],
  ],
  minuten: { gleichesGleis: 2, gleicherBahnsteig: 3, andererBahnsteig: 6 },
};

const ankunft = (zug: string, plan: string, verspaetung: number, gleis: string): Ankunft => ({
  zug,
  von: 'Teststadt',
  plan,
  gleis,
  verspaetung,
});

const abfahrt = (zug: string, plan: string, verspaetung: number, gleis: string, gleisNeu?: string): Abfahrt => ({
  zug,
  ziel: 'Teststadt',
  via: [],
  plan,
  gleis,
  verspaetung,
  ...(gleisNeu === undefined ? {} : { gleisNeu }),
});

describe('pruefeAnschluss', () => {
  it.each([
    ['1: Grenze 2, beide verspätet', ankunft('FX 704', '09:29', 10, '3'), abfahrt('S 2', '09:27', 20, '11'), 6, 2, 'schaffst du'],
    ['2: Grenze 1, gleicher Bahnsteig', ankunft('FX 711', '23:44', 7, '2'), abfahrt('FX 519', '23:51', 4, '1'), 3, 1, 'knapp'],
    ['3: Grenze 0, gleiches Gleis', ankunft('RE 141', '16:23', 11, '6'), abfahrt('RE 41', '16:36', 0, '6'), 2, 0, 'knapp'],
    ['4: Grenze -1', ankunft('RE 136', '11:23', 15, '6'), abfahrt('RE 36', '11:36', 3, '6'), 2, -1, 'verpasst'],
    ['5: gleisNeu zählt', ankunft('RE 144', '19:23', 4, '6'), abfahrt('RE 44', '19:36', 0, '6', '7'), 6, 3, 'schaffst du'],
    ['6: über Mitternacht', ankunft('RE 112', '23:49', 1, '6'), abfahrt('RE 79', '23:58', 5, '5'), 3, 10, 'schaffst du'],
  ])('Testfall %s', (_name, an, ab, umstieg, reserve, ergebnis) => {
    expect(pruefeAnschluss(an, ab, umstiegszeiten)).toEqual({ umstieg, reserve, ergebnis });
  });

  it('meldet verpasst, wenn der Anschluss vor der Ankunft abfährt', () => {
    const ergebnis = pruefeAnschluss(ankunft('RE 1', '12:00', 0, '1'), abfahrt('RE 2', '11:50', 0, '1'), umstiegszeiten);
    expect(ergebnis).toEqual({ umstieg: 2, reserve: -12, ergebnis: 'verpasst' });
  });
});

describe('pruefeAuswahl', () => {
  const frueh = ankunft('RE 112', '07:55', 0, '5');
  const spaet = ankunft('RE 112', '23:49', 1, '6');
  const anschluss = abfahrt('RE 79', '23:58', 5, '6');
  const daten = { ankuenfte: [frueh, spaet], umstiegszeiten };

  it('unterscheidet gleiche Zugnummern über die Planzeit', () => {
    expect(pruefeAuswahl(daten, [anschluss], zugId(spaet), zugId(anschluss))?.umstieg).toBe(2);
    expect(pruefeAuswahl(daten, [anschluss], zugId(frueh), zugId(anschluss))?.umstieg).toBe(3);
  });

  it('liefert nichts, solange ein Zug fehlt', () => {
    expect(pruefeAuswahl(daten, [anschluss], '', zugId(anschluss))).toBeUndefined();
    expect(pruefeAuswahl(daten, [], zugId(spaet), zugId(anschluss))).toBeUndefined();
  });
});
