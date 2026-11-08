import { useEffect, useState } from 'react';
import type { TafelZeile } from '../shared/types.ts';
import { addiereMinuten } from '../shared/zeit.ts';
import { ANZEIGE_ZEILEN, ENDE_ZEIT, START_ZEIT, TAKT_MS } from './config.ts';

async function holeAbfahrten(zeit: string): Promise<TafelZeile[]> {
  const antwort = await fetch(`/api/abfahrten?zeit=${zeit}&anzahl=${ANZEIGE_ZEILEN}`);
  if (!antwort.ok) throw new Error(`API antwortet mit ${antwort.status}`);
  return antwort.json();
}

export function useTafel() {
  const [zeit, setZeit] = useState(START_ZEIT);
  const [zeilen, setZeilen] = useState<TafelZeile[]>([]);

  useEffect(() => {
    const takt = setInterval(() => {
      setZeit((aktuell) => (aktuell === ENDE_ZEIT ? START_ZEIT : addiereMinuten(aktuell, 1)));
    }, TAKT_MS);
    return () => clearInterval(takt);
  }, []);

  useEffect(() => {
    let aktiv = true;
    holeAbfahrten(zeit)
      .then((neu) => {
        if (aktiv) setZeilen(neu);
      })
      .catch((fehler) => console.error(fehler));
    return () => {
      aktiv = false;
    };
  }, [zeit]);

  return { zeit, zeilen };
}
