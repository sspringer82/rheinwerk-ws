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

export function naechsteAbfahrten(alle: Abfahrt[], zeit: string, anzahl: number): TafelZeile[] {
  return alle
    .map((abfahrt) => ({ ...abfahrt, erwartet: erwarteteAbfahrt(abfahrt) }))
    .filter((zeile) => istFrueherOderGleich(zeit, zeile.erwartet))
    .sort((a, b) => (a.erwartet < b.erwartet ? -1 : a.erwartet > b.erwartet ? 1 : 0))
    .slice(0, anzahl);
}
