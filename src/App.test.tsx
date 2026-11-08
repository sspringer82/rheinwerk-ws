import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './App.tsx';
import { istSonntag } from './anzeige.ts';
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
