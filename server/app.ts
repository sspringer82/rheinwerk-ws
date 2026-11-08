import express from 'express';
import { z } from 'zod';
import { faehrtSonntags, naechsteAbfahrten } from '../shared/tafel.ts';
import { ladeAbfahrten } from './daten.ts';

const abfrageSchema = z.object({
  zeit: z.string().regex(/^\d\d:\d\d$/),
  anzahl: z.coerce.number().int().min(1).max(30).default(10),
  tag: z.literal('sonntag').optional(),
});

export function createApp() {
  const app = express();
  const abfahrten = ladeAbfahrten();

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', abfahrten: abfahrten.length });
  });

  app.get('/api/abfahrten', (req, res) => {
    const abfrage = abfrageSchema.safeParse(req.query);
    if (!abfrage.success) {
      res.status(400).json({ fehler: 'Parameter zeit (HH:MM) fehlt oder zeit, anzahl oder tag ist ungültig' });
      return;
    }
    const { zeit, anzahl, tag } = abfrage.data;
    const fahrplan = tag === 'sonntag' ? abfahrten.filter(faehrtSonntags) : abfahrten;
    res.json(naechsteAbfahrten(fahrplan, zeit, anzahl));
  });

  return app;
}
