// Aufbereitung der Werte für die Tafel.

import { betriebsMinuten } from '../shared/tafel.ts';

export function istSonntag(suche: string): boolean {
  return new URLSearchParams(suche).get('tag') === 'sonntag';
}

export function restMinuten(zeit: string, erwartet: string): number {
  return betriebsMinuten(erwartet) - betriebsMinuten(zeit);
}

export function restText(zeit: string, erwartet: string): string {
  const rest = restMinuten(zeit, erwartet);
  if (rest === 0) return 'JETZT';
  return rest + ' MIN';
}

export function aktuellText(plan: string, erwartet: string): string {
  return plan === erwartet ? '' : erwartet;
}

const GELB_BIS_MINUTEN = 5;

export type VerspaetungsFarbe = 'gelb' | 'rot';

export function verspaetungsFarbe(verspaetung: number): VerspaetungsFarbe | undefined {
  if (verspaetung <= 0) return undefined;
  return verspaetung <= GELB_BIS_MINUTEN ? 'gelb' : 'rot';
}
