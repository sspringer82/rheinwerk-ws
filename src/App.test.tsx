import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App, Zeile } from './App.tsx';
import { istSonntag, verspaetungsFarbe } from './anzeige.ts';
import { abfahrtenUrl, holeBahnhof } from './useTafel.ts';

const kopfBei = (suche: string): string => {
  vi.stubGlobal('window', { location: { search: suche } });
  return renderToStaticMarkup(<App />).match(/<header.*<\/header>/)?.[0] ?? '';
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Bahnhofsname auf der Tafel', () => {
  it('holt den Namen aus /api/health', async () => {
    const abruf = vi.fn(async () => Response.json({ status: 'ok', bahnhof: 'Teststadt' }));
    vi.stubGlobal('fetch', abruf);
    await expect(holeBahnhof()).resolves.toBe('Teststadt');
    expect(abruf).toHaveBeenCalledWith('/api/health');
  });
});

describe('Spalte Aktuell nach Verspätung färben', () => {
  const zeileMit = (verspaetung: number, erwartet: string): string =>
    renderToStaticMarkup(
      <Zeile
        zeit="10:00"
        zeile={{ zug: 'RE 1', ziel: 'Teststadt', via: [], plan: '10:00', gleis: '1', verspaetung, erwartet }}
      />,
    );

  it('ordnet die Verspätung der Farbe zu', () => {
    expect(verspaetungsFarbe(0)).toBeUndefined();
    expect(verspaetungsFarbe(1)).toBe('gelb');
    expect(verspaetungsFarbe(5)).toBe('gelb');
    expect(verspaetungsFarbe(6)).toBe('rot');
    expect(verspaetungsFarbe(70)).toBe('rot');
  });

  it('färbt bis 5 Minuten gelb', () => {
    expect(zeileMit(5, '10:05')).toContain('class="fallblatt gelb" aria-label="10:05"');
  });

  it('färbt über 5 Minuten rot', () => {
    expect(zeileMit(6, '10:06')).toContain('class="fallblatt rot" aria-label="10:06"');
  });

  it('färbt pünktliche Züge nicht', () => {
    const zeile = zeileMit(0, '10:00');
    expect(zeile).not.toContain('gelb');
    expect(zeile).not.toContain('rot');
  });
});

describe('Sonntag auf der Tafel', () => {
  it('erkennt tag=sonntag in der Tafel-URL', () => {
    expect(istSonntag('?tag=sonntag')).toBe(true);
    expect(istSonntag('?x=1&tag=sonntag')).toBe(true);
    expect(istSonntag('')).toBe(false);
    expect(istSonntag('?tag=montag')).toBe(false);
  });

  it('reicht den Tag an die API weiter', () => {
    expect(abfahrtenUrl('23:46', true)).toContain('tag=sonntag');
    expect(abfahrtenUrl('23:46', false)).not.toContain('tag=');
  });

  it('zeigt SONNTAG rechts oben zusätzlich zu Abfahrt', () => {
    expect(kopfBei('?tag=sonntag')).toMatch(/Abfahrt<\/p><p class="sonntag">SONNTAG<\/p><\/header>$/);
  });

  it('zeigt werktags kein SONNTAG', () => {
    const kopf = kopfBei('');
    expect(kopf).toContain('Abfahrt');
    expect(kopf).not.toContain('SONNTAG');
  });
});
