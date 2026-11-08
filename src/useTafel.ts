import { useEffect, useState } from 'react';
import type { TafelZeile } from '../shared/types.ts';
import { addiereMinuten } from '../shared/zeit.ts';
import { istSonntag } from './anzeige.ts';
import { ANZEIGE_ZEILEN, ENDE_ZEIT, START_ZEIT, TAKT_MS } from './config.ts';

export function abfahrtenUrl(zeit: string, sonntag: boolean): string {
  return `/api/abfahrten?zeit=${zeit}&anzahl=${ANZEIGE_ZEILEN}${sonntag ? '&tag=sonntag' : ''}`;
}

async function holeAbfahrten(zeit: string, sonntag: boolean): Promise<TafelZeile[]> {
  const antwort = await fetch(abfahrtenUrl(zeit, sonntag));
  if (!antwort.ok) throw new Error(`API antwortet mit ${antwort.status}`);
  return antwort.json();
}

export function useTafel() {
  const sonntag = istSonntag(window.location.search);
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
    holeAbfahrten(zeit, sonntag)
      .then((neu) => {
        if (aktiv) setZeilen(neu);
      })
      .catch((fehler) => console.error(fehler));
    return () => {
      aktiv = false;
    };
  }, [zeit, sonntag]);

  return { zeit, zeilen, sonntag };
}
