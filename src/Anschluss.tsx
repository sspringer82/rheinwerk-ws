import { useState } from 'react';
import { pruefeAuswahl, zugId } from '../shared/anschluss.ts';
import type { AnschlussDaten, TafelZeile } from '../shared/types.ts';

export function Anschluss({ daten, zeilen }: { daten?: AnschlussDaten; zeilen: TafelZeile[] }) {
  const [ankunftId, setAnkunftId] = useState('');
  const [abfahrtId, setAbfahrtId] = useState('');
  const pruefung = daten && pruefeAuswahl(daten, zeilen, ankunftId, abfahrtId);

  return (
    <section className="anschluss">
      <label>
        Ankunft
        <select value={ankunftId} onChange={(e) => setAnkunftId(e.target.value)}>
          <option value="">wählen</option>
          {daten?.ankuenfte.map((zug) => (
            <option key={zugId(zug)} value={zugId(zug)}>
              {zug.plan} {zug.zug} von {zug.von}
            </option>
          ))}
        </select>
      </label>
      <label>
        Anschluss
        <select value={abfahrtId} onChange={(e) => setAbfahrtId(e.target.value)}>
          <option value="">wählen</option>
          {zeilen.map((zug) => (
            <option key={zugId(zug)} value={zugId(zug)}>
              {zug.plan} {zug.zug} nach {zug.ziel}
            </option>
          ))}
        </select>
      </label>
      {pruefung && (
        <output>
          {pruefung.ergebnis} (Reserve {pruefung.reserve} Min, Umstieg {pruefung.umstieg} Min)
        </output>
      )}
    </section>
  );
}
