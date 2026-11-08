import type { TafelZeile } from '../shared/types.ts';
import { aktuellText, restText } from './anzeige.ts';
import { ANZEIGE_ZEILEN, BAHNHOF } from './config.ts';
import { Fallblatt } from './Fallblatt.tsx';
import { useTafel } from './useTafel.ts';

function Zeile({ zeile, zeit }: { zeile?: TafelZeile; zeit: string }) {
  return (
    <div className="zeile" role="row">
      <Fallblatt text={zeile?.plan ?? ''} laenge={5} />
      <Fallblatt text={zeile?.zug ?? ''} laenge={6} />
      <Fallblatt text={zeile?.ziel ?? ''} laenge={13} />
      <Fallblatt text={zeile?.gleisNeu ?? zeile?.gleis ?? ''} laenge={2} />
      <Fallblatt text={zeile ? aktuellText(zeile.plan, zeile.erwartet) : ''} laenge={5} />
      <Fallblatt text={zeile ? restText(zeit, zeile.erwartet) : ''} laenge={6} />
    </div>
  );
}

export function App() {
  const { zeit, zeilen } = useTafel();

  return (
    <main className="tafel">
      <header className="kopf">
        <h1>{BAHNHOF}</h1>
        <p>Abfahrt</p>
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
    </main>
  );
}
