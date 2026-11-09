import type { Abfahrt, TafelZeile } from './types.ts';
import { addiereMinuten, istFrueherOderGleich } from './zeit.ts';

export function erwarteteAbfahrt(abfahrt: Abfahrt): string {
  return abfahrt.verspaetung > 0 ? addiereMinuten(abfahrt.plan, abfahrt.verspaetung) : abfahrt.plan;
}

export function faehrtSonntags(abfahrt: Abfahrt): boolean {
  const gattung = abfahrt.zug.split(' ')[0];
  if (gattung === 'RB') return false;
  if (gattung === 'S') return istFrueherOderGleich('08:00', abfahrt.plan);
  return true;
}

// Der Betriebstag beginnt um 05:00. Uhrzeiten davor gehören zum Ende desselben
// Betriebstags (nach Mitternacht) und werden deshalb als 24+ Stunden gerechnet,
// sonst würde z. B. ein auf 00:03 verspäteter Zug hinter 23:59 "verschwinden".
const BETRIEBSTAG_BEGINN_STUNDE = 5;

export function betriebsMinuten(hhmm: string): number {
  const [stunden, minuten] = hhmm.split(':').map((t) => parseInt(t, 10));
  const stundenImBetriebstag = stunden < BETRIEBSTAG_BEGINN_STUNDE ? stunden + 24 : stunden;
  return stundenImBetriebstag * 60 + minuten;
}

export function naechsteAbfahrten(alle: Abfahrt[], zeit: string, anzahl: number): TafelZeile[] {
  const jetzt = betriebsMinuten(zeit);
  return alle
    .map((abfahrt) => ({ ...abfahrt, erwartet: erwarteteAbfahrt(abfahrt) }))
    .filter((zeile) => jetzt <= betriebsMinuten(zeile.erwartet))
    .sort((a, b) => betriebsMinuten(a.erwartet) - betriebsMinuten(b.erwartet))
    .slice(0, anzahl);
}
