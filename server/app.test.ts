import request from 'supertest';
import { describe, expect, it } from 'vitest';
import type { TafelZeile } from '../shared/types.ts';
import { createApp } from './app.ts';

const app = createApp({ bahnhofName: 'Teststadt', fahrplanToken: 'test-geheimnis' });

const tafel = async (zeit: string, anzahl = 10): Promise<TafelZeile[]> => {
  const antwort = await request(app).get('/api/abfahrten').query({ zeit, anzahl });
  expect(antwort.status).toBe(200);
  return antwort.body;
};

describe('GET /api/health', () => {
  it('liefert den Bahnhofsnamen und meldet einen gesetzten Token', async () => {
    const antwort = await request(app).get('/api/health');
    expect(antwort.status).toBe(200);
    expect(antwort.body).toMatchObject({ bahnhof: 'Teststadt', tokenGesetzt: true });
  });

  it('meldet einen fehlenden Token', async () => {
    const antwort = await request(createApp({ bahnhofName: 'Teststadt' })).get('/api/health');
    expect(antwort.body.tokenGesetzt).toBe(false);
  });

  it('gibt den Token selbst nie heraus', async () => {
    const antwort = await request(app).get('/api/health');
    expect(antwort.text).not.toContain('test-geheimnis');
  });
});

describe('GET /api/abfahrten', () => {
  it('liefert höchstens die gewünschte Anzahl', async () => {
    expect(await tafel('12:00', 4)).toHaveLength(4);
  });

  it('zeigt die nächste Abfahrt zuerst', async () => {
    const zeilen = await tafel('12:00');
    const zeiten = zeilen.map((z) => z.erwartet);
    expect(zeiten).toEqual([...zeiten].sort());
  });

  it('zeigt keine bereits abgefahrenen Züge', async () => {
    const zeilen = await tafel('12:00');
    expect(zeilen.every((z) => z.erwartet >= '12:00')).toBe(true);
  });

  it('behält den letzten Zug nach 23:58 auf der Tafel, solange er verspätet ist', async () => {
    const zeilen = await tafel('23:59');
    expect(zeilen.map((z) => z.zug)).toContain('RE 79');
  });

  it('lehnt eine ungültige Zeit ab', async () => {
    const antwort = await request(app).get('/api/abfahrten').query({ zeit: 'bald' });
    expect(antwort.status).toBe(400);
  });
});

describe('GET /api/abfahrten mit tag=sonntag', () => {
  const sonntag = async (zeit: string): Promise<TafelZeile[]> => {
    const antwort = await request(app).get('/api/abfahrten').query({ zeit, anzahl: 30, tag: 'sonntag' });
    expect(antwort.status).toBe(200);
    return antwort.body;
  };

  it('zeigt keine Regionalbahnen', async () => {
    const zeilen = await sonntag('05:00');
    expect(zeilen.filter((z) => z.zug.startsWith('RB '))).toEqual([]);
  });

  it('zeigt S-Bahnen erst ab 08:00', async () => {
    const sBahnen = (await sonntag('05:00')).filter((z) => z.zug.startsWith('S '));
    expect(sBahnen.length).toBeGreaterThan(0);
    expect(sBahnen.every((z) => z.plan >= '08:00')).toBe(true);
  });

  it('lässt alle anderen Züge wie werktags fahren', async () => {
    const andere = (zeilen: TafelZeile[]) => zeilen.filter((z) => /^(RE|FX) /.test(z.zug)).slice(0, 8);
    expect(andere(await sonntag('05:00'))).toEqual(andere(await tafel('05:00', 30)));
  });

  it('zeigt ohne Parameter weiter den Werktagsfahrplan', async () => {
    const zuege = (await tafel('05:00', 30)).map((z) => z.zug);
    expect(zuege).toContain('RB 40');
    expect(zuege).toContain('S 1');
  });

  it('lehnt einen unbekannten Tag ab', async () => {
    const antwort = await request(app).get('/api/abfahrten').query({ zeit: '12:00', tag: 'montag' });
    expect(antwort.status).toBe(400);
  });
});
