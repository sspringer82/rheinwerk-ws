import { betriebsMinuten } from './tafel.ts';
import type { Abfahrt, AnschlussDaten, Ankunft, Umstiegszeiten } from './types.ts';
import { addiereMinuten } from './zeit.ts';

export type AnschlussErgebnis = 'schaffst du' | 'knapp' | 'verpasst';

export interface AnschlussPruefung {
  umstieg: number;
  reserve: number;
  ergebnis: AnschlussErgebnis;
}

// Zugnummern kommen mehrfach vor, erst zusammen mit der Planzeit ist ein Zug eindeutig.
export function zugId({ zug, plan }: { zug: string; plan: string }): string {
  return `${zug} ${plan}`;
}

function erwarteteMinuten({ plan, verspaetung }: { plan: string; verspaetung: number }): number {
  return betriebsMinuten(addiereMinuten(plan, verspaetung));
}

function aktuellesGleis({ gleis, gleisNeu }: { gleis: string; gleisNeu?: string }): string {
  return gleisNeu ?? gleis;
}

function umstiegszeit(von: string, nach: string, { bahnsteige, minuten }: Umstiegszeiten): number {
  if (von === nach) return minuten.gleichesGleis;
  const gleicherBahnsteig = bahnsteige.some((gleise) => gleise.includes(von) && gleise.includes(nach));
  return gleicherBahnsteig ? minuten.gleicherBahnsteig : minuten.andererBahnsteig;
}

function bewerte(reserve: number): AnschlussErgebnis {
  if (reserve >= 2) return 'schaffst du';
  return reserve >= 0 ? 'knapp' : 'verpasst';
}

export function pruefeAnschluss(ankunft: Ankunft, abfahrt: Abfahrt, umstiegszeiten: Umstiegszeiten): AnschlussPruefung {
  const umstieg = umstiegszeit(aktuellesGleis(ankunft), aktuellesGleis(abfahrt), umstiegszeiten);
  const reserve = erwarteteMinuten(abfahrt) - erwarteteMinuten(ankunft) - umstieg;
  return { umstieg, reserve, ergebnis: bewerte(reserve) };
}

export function pruefeAuswahl(
  { ankuenfte, umstiegszeiten }: AnschlussDaten,
  abfahrten: Abfahrt[],
  ankunftId: string,
  abfahrtId: string,
): AnschlussPruefung | undefined {
  const ankunft = ankuenfte.find((zug) => zugId(zug) === ankunftId);
  const abfahrt = abfahrten.find((zug) => zugId(zug) === abfahrtId);
  return ankunft && abfahrt && pruefeAnschluss(ankunft, abfahrt, umstiegszeiten);
}
