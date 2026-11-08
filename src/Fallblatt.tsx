import { useEffect, useRef, useState } from 'react';

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

export function Fallblatt({ text, laenge }: { text: string; laenge: number }) {
  const zeichen = text.toUpperCase().padEnd(laenge).slice(0, laenge).split('');
  return (
    <span className="fallblatt" aria-label={text}>
      {zeichen.map((z, i) => (
        <Blatt key={i} zeichen={z} />
      ))}
    </span>
  );
}
