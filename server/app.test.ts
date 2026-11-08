import request from 'supertest';
import { describe, expect, it } from 'vitest';
import type { TafelZeile } from '../shared/types.ts';
import { createApp } from './app.ts';

const app = createApp();

const tafel = async (zeit: string, anzahl = 10): Promise<TafelZeile[]> => {
  const antwort = await request(app).get('/api/abfahrten').query({ zeit, anzahl });
  expect(antwort.status).toBe(200);
  return antwort.body;
};

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
