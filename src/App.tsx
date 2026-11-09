import type { TafelZeile } from '../shared/types.ts';
import { Anschluss } from './Anschluss.tsx';
import { aktuellText, restText, verspaetungsFarbe } from './anzeige.ts';
import { ANZEIGE_ZEILEN } from './config.ts';
import { Fallblatt } from './Fallblatt.tsx';
import { useTafel } from './useTafel.ts';

export function Zeile({ zeile, zeit }: { zeile?: TafelZeile; zeit: string }) {
  return (
    <div className="zeile" role="row">
      <Fallblatt text={zeile?.plan ?? ''} laenge={5} />
      <Fallblatt text={zeile?.zug ?? ''} laenge={6} />
      <Fallblatt text={zeile?.ziel ?? ''} laenge={13} />
      <Fallblatt text={zeile?.gleisNeu ?? zeile?.gleis ?? ''} laenge={2} blinkt={zeile?.gleisNeu !== undefined} />
      <Fallblatt
        text={zeile ? aktuellText(zeile.plan, zeile.erwartet) : ''}
        laenge={5}
        farbe={zeile && verspaetungsFarbe(zeile.verspaetung)}
      />
      <Fallblatt text={zeile ? restText(zeit, zeile.erwartet) : ''} laenge={6} />
    </div>
  );
}

export function App() {
  const { bahnhof, zeit, zeilen, sonntag, anschlussDaten } = useTafel();

  return (
    <main className="tafel">
      <header className="kopf">
        <h1>{bahnhof}</h1>
        <Fallblatt text={zeit} laenge={5} />
        <p>Abfahrt</p>
        {sonntag && <p className="sonntag">SONNTAG</p>}
      </header>
      <div className="zeile spalten" role="row">
        <span>Zeit</span>
        <span>Zug</span>
        <span>Ziel</span>
        <span>Gl</span>
        <span>Aktuell</span>
        <span>In</span>
      </div>
      {Array.from({ length: ANZEIGE_ZEILEN }, (_, i) => (
        <Zeile key={i} zeile={zeilen[i]} zeit={zeit} />
      ))}
      <Anschluss daten={anschlussDaten} zeilen={zeilen} />
    </main>
  );
}
