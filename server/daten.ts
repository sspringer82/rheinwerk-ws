import { readFileSync } from 'node:fs';
import { z } from 'zod';
import type { Abfahrt, AnschlussDaten } from '../shared/types.ts';

const abfahrtSchema = z.object({
  zug: z.string(),
  ziel: z.string(),
  via: z.array(z.string()),
  plan: z.string().regex(/^\d\d:\d\d$/),
  gleis: z.string(),
  gleisNeu: z.string().optional(),
  verspaetung: z.number().int().min(0),
});

const ankunftSchema = z.object({
  zug: z.string(),
  von: z.string(),
  plan: z.string().regex(/^\d\d:\d\d$/),
  gleis: z.string(),
  verspaetung: z.number().int().min(0),
});

const umstiegszeitenSchema = z.object({
  bahnsteige: z.array(z.array(z.string())),
  minuten: z.object({
    gleichesGleis: z.number().int().min(0),
    gleicherBahnsteig: z.number().int().min(0),
    andererBahnsteig: z.number().int().min(0),
  }),
});

const leseJson = (datei: string): unknown =>
  JSON.parse(readFileSync(new URL(`../data/${datei}`, import.meta.url), 'utf8'));

export function ladeAbfahrten(): Abfahrt[] {
  return z.array(abfahrtSchema).parse(leseJson('abfahrten.json'));
}

export function ladeAnschlussDaten(): AnschlussDaten {
  return {
    ankuenfte: z.array(ankunftSchema).parse(leseJson('ankuenfte.json')),
    umstiegszeiten: umstiegszeitenSchema.parse(leseJson('umstiegszeiten.json')),
  };
}
