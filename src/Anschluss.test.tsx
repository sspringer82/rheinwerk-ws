import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { AnschlussDaten, TafelZeile } from '../shared/types.ts';
import { Anschluss } from './Anschluss.tsx';

const daten: AnschlussDaten = {
  ankuenfte: [
    { zug: 'RE 112', von: 'Lindental', plan: '07:55', gleis: '5', verspaetung: 0 },
    { zug: 'RE 112', von: 'Eichstede', plan: '23:49', gleis: '6', verspaetung: 1 },
  ],
  umstiegszeiten: { bahnsteige: [], minuten: { gleichesGleis: 2, gleicherBahnsteig: 3, andererBahnsteig: 6 } },
};

const zeile: TafelZeile = {
  zug: 'RE 79',
  ziel: 'Seeburg',
  via: [],
  plan: '23:58',
  gleis: '5',
  verspaetung: 5,
  erwartet: '00:03',
};

describe('Anschluss-Auswahl', () => {
  it('bietet Ankünfte und die Abfahrten der Tafel über Zug und Planzeit an', () => {
    const html = renderToStaticMarkup(<Anschluss daten={daten} zeilen={[zeile]} />);
    expect(html).toContain('value="RE 112 07:55"');
    expect(html).toContain('value="RE 112 23:49"');
    expect(html).toContain('value="RE 79 23:58"');
  });

  it('kommt ohne geladene Daten aus', () => {
    expect(renderToStaticMarkup(<Anschluss zeilen={[]} />)).toContain('<select');
  });
});
