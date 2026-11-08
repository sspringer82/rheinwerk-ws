import { readFileSync } from 'node:fs';
import { z } from 'zod';
import type { Abfahrt } from '../shared/types.ts';

const abfahrtSchema = z.object({
  zug: z.string(),
  ziel: z.string(),
  via: z.array(z.string()),
  plan: z.string().regex(/^\d\d:\d\d$/),
  gleis: z.string(),
  gleisNeu: z.string().optional(),
  verspaetung: z.number().int().min(0),
});

export function ladeAbfahrten(): Abfahrt[] {
  const roh = readFileSync(new URL('../data/abfahrten.json', import.meta.url), 'utf8');
  return z.array(abfahrtSchema).parse(JSON.parse(roh));
}
