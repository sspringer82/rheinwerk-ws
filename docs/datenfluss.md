# Datenfluss: von den Daten auf die Tafel

```
data/abfahrten.json
  → server/daten.ts       einlesen und prüfen (einmal beim Start)
  → server/app.ts         GET /api/abfahrten?zeit=…&anzahl=…[&tag=sonntag]
  → shared/tafel.ts       erwartete Zeit berechnen, auswählen, sortieren
  → src/useTafel.ts       Abfrage pro simulierter Minute, Zeilen im State
  → src/App.tsx           Spalten belegen, Texte aufbereiten
  → src/Fallblatt.tsx     Zeichen für Zeichen anzeigen
```

## 1. Daten laden

Beim Start des Servers ruft `createApp()` einmal `ladeAbfahrten()` auf. Die Funktion liest `data/abfahrten.json` und prüft jeden Eintrag per Zod-Schema. Ein Eintrag enthält `zug`, `ziel`, `via`, `plan` (HH:MM), `gleis`, optional `gleisNeu` und `verspaetung` in Minuten. Die Liste bleibt danach im Speicher des Servers; jede Anfrage arbeitet auf ihr.

## 2. Die Uhr löst die Abfrage aus

Die Tafel läuft auf einer simulierten Uhr (`src/config.ts`). `useTafel` startet bei 23:46 und zählt alle 4 Sekunden eine Minute weiter. Nach 23:59 springt die Uhr zurück auf 23:46.

Beim ersten Rendern und bei jeder neuen Uhrzeit schickt `useTafel` die Anfrage `/api/abfahrten?zeit=<Uhrzeit>&anzahl=10`. Enthält die Tafel-URL `?tag=sonntag`, hängt `useTafel` den Parameter an die Anfrage an und im Kopf der Tafel steht zusätzlich `SONNTAG`. Im Entwicklungsbetrieb leitet der Vite-Server (Port 5173) alle `/api`-Aufrufe an die API auf Port 3001 weiter.

## 3. Der Server wählt die Abfahrten aus

Die Route in `server/app.ts` prüft `zeit`, `anzahl` und das optionale `tag` per Zod. Bei `tag=sonntag` filtert sie die Abfahrtsliste vorab mit `faehrtSonntags()`: Regionalbahnen entfallen, S-Bahnen fahren erst ab 08:00 Uhr (maßgeblich ist `plan`). Dann übergibt sie `zeit` und `anzahl` mit der Abfahrtsliste an `naechsteAbfahrten()` aus `shared/tafel.ts`:

1. Jede Abfahrt bekommt das Feld `erwartet`, also `plan` plus `verspaetung` (aus 05:04 und 3 Minuten wird 05:07). Ohne Verspätung gilt `plan`.
2. Es bleiben die Abfahrten, deren `erwartet` nicht vor der abgefragten Zeit liegt.
3. Die Liste wird nach `erwartet` sortiert.
4. Die ersten `anzahl` Einträge gehen als JSON-Array von `TafelZeile` an den Browser.

## 4. Vom Ergebnis zur Tafelzeile

`useTafel` legt die Antwort im State `zeilen` ab, sofern die Uhrzeit der Anfrage noch die aktuelle ist. `App` rendert immer 10 Zeilen; `Zeile` verteilt die Felder einer Abfahrt auf sechs Spalten. Reicht die Antwort nicht für 10 Zeilen, bleiben die übrigen leer.

| Spalte | Inhalt | Stellen |
| --- | --- | --- |
| Zeit | `plan` | 5 |
| Zug | `zug` | 6 |
| Ziel | `ziel` | 13 |
| Gl | `gleisNeu`, sonst `gleis` | 2 |
| Aktuell | `erwartet`, leer wenn gleich `plan` (`aktuellText`) | 5 |
| In | Minuten bis `erwartet` als `N MIN`, bei 0 `JETZT` (`restText`) | 6 |

Das Feld `via` wird mitgeliefert, aber auf der Tafel nicht angezeigt.

## 5. Vom Text zum Fallblatt

`Fallblatt` wandelt den Text in Großbuchstaben um, bringt ihn auf die Spaltenbreite und legt für jedes Zeichen ein `Blatt` an. Jedes Blatt beginnt leer und klappt alle 40 ms ein Zeichen im Alphabet weiter, bis das Zielzeichen erreicht ist. Zeichen außerhalb des Alphabets werden direkt gesetzt. Ändert sich mit der nächsten Uhrzeit ein Wert, klappt das Blatt von seinem aktuellen Zeichen aus zum neuen.
