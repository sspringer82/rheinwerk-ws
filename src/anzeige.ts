// Aufbereitung der Werte für die Tafel.

export function istSonntag(suche: string): boolean {
  return new URLSearchParams(suche).get('tag') === 'sonntag';
}

export function restMinuten(zeit: string, erwartet: string): number {
  const jetzt = parseInt(zeit.slice(0, 2)) * 60 + parseInt(zeit.slice(3));
  const dann = parseInt(erwartet.slice(0, 2)) * 60 + parseInt(erwartet.slice(3));
  return dann - jetzt;
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
