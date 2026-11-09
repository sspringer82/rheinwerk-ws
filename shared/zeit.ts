// Zeitrechnung der Anzeigetafel.
// Stammt noch aus der ersten Version der Tafel und ist seitdem mitgewachsen.

export function zweistellig(n: number): string {
  return n < 10 ? '0' + n : '' + n;
}

export function addiereMinuten(hhmm: string, minuten: number): string {
  const teile = hhmm.split(':');
  let stunden = parseInt(teile[0], 10);
  let min = parseInt(teile[1], 10) + minuten;
  while (min >= 60) {
    min -= 60;
    stunden++;
  }
  // Der Betriebstag läuft über Mitternacht: nach 23:59 beginnt wieder bei 00:00.
  stunden %= 24;
  return zweistellig(stunden) + ':' + zweistellig(min);
}

// HH:MM lässt sich als Text vergleichen, das reicht für die Tafel.
export function istFrueherOderGleich(a: string, b: string): boolean {
  return a <= b;
}
