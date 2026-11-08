import { useEffect, useRef, useState } from 'react';
import type { VerspaetungsFarbe } from './anzeige.ts';

const ALPHABET = ' ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ0123456789:+-.';
const SCHRITT_MS = 40;

function naechstesZeichen(aktuell: string, ziel: string): string {
  if (!ALPHABET.includes(ziel) || !ALPHABET.includes(aktuell)) return ziel;
  return ALPHABET[(ALPHABET.indexOf(aktuell) + 1) % ALPHABET.length];
}

function Blatt({ zeichen }: { zeichen: string }) {
  const [aktuell, setAktuell] = useState(' ');
  const vorher = useRef(' ');

  useEffect(() => {
    if (aktuell === zeichen) return;
    const klappen = setTimeout(() => {
      vorher.current = aktuell;
      setAktuell(naechstesZeichen(aktuell, zeichen));
    }, SCHRITT_MS);
    return () => clearTimeout(klappen);
  }, [aktuell, zeichen]);

  return (
    <span className="blatt">
      <span className="blatt-oben">{aktuell}</span>
      <span className="blatt-unten">{aktuell}</span>
      <span key={aktuell} className="blatt-klappe">
        {/* eslint-disable-next-line react-hooks/refs -- nur Anzeige des vorigen Zeichens */}
        {vorher.current}
      </span>
    </span>
  );
}

interface FallblattProps {
  text: string;
  laenge: number;
  blinkt?: boolean;
  farbe?: VerspaetungsFarbe;
}

export function Fallblatt({ text, laenge, blinkt = false, farbe }: FallblattProps) {
  const zeichen = text.toUpperCase().padEnd(laenge).slice(0, laenge).split('');
  const klassen = ['fallblatt', blinkt && 'blinkt', farbe].filter(Boolean).join(' ');
  return (
    <span className={klassen} aria-label={text}>
      {zeichen.map((z, i) => (
        <Blatt key={i} zeichen={z} />
      ))}
    </span>
  );
}
