# Spec: „Schaffe ich meinen Anschluss?“

Auf der Tafel wählt man einen ankommenden Zug und einen Anschlusszug und sieht, ob der Umstieg klappt.

## Regeln

- **Auswahl:** Der ankommende Zug kommt aus `data/ankuenfte.json`, der Anschlusszug aus den Abfahrten auf der Tafel.
- **Identität:** Ein Zug ist eindeutig über `zug` und `plan`, denn Zugnummern kommen mehrfach vor (RE 112 um 07:55 und 23:49).
- **Zeiten:** Maßgeblich ist bei beiden Zügen die erwartete Zeit, also `plan` plus `verspaetung`.
- **Gleis:** Maßgeblich ist das aktuelle Gleis, also `gleisNeu`, sonst `gleis`. Ankünfte haben bisher kein `gleisNeu`.
- **Umstiegszeit** aus `data/umstiegszeiten.json`: `gleichesGleis` (2), `gleicherBahnsteig` (3), sonst `andererBahnsteig` (6).
- **Reserve** in Minuten: erwartete Abfahrt - erwartete Ankunft - Umstiegszeit. Die Uhr der Tafel spielt keine Rolle.
- **Mitternacht:** Differenzen laufen über `betriebsMinuten()`, nie über HH:MM-Text oder Kalenderminuten.

## Ergebnis

- Reserve ab 2: „schaffst du“
- Reserve 0 oder 1: „knapp“
- Reserve unter 0: „verpasst“, auch wenn der Anschluss vor der Ankunft abfährt

## Testfälle

| # | Ankunft | Anschluss | Umstieg | Reserve | Ergebnis | Prüft |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | FX 704, 09:29 +10 = 09:39, Gl 3 | S 2, 09:27 +20 = 09:47, Gl 11 | 6 | 2 | schaffst du | Grenze 2, beide verspätet |
| 2 | FX 711, 23:44 +7 = 23:51, Gl 2 | FX 519, 23:51 +4 = 23:55, Gl 1 | 3 | 1 | knapp | Grenze 1, gleicher Bahnsteig |
| 3 | RE 141, 16:23 +11 = 16:34, Gl 6 | RE 41, 16:36 +0 = 16:36, Gl 6 | 2 | 0 | knapp | Grenze 0, gleiches Gleis |
| 4 | RE 136, 11:23 +15 = 11:38, Gl 6 | RE 36, 11:36 +3 = 11:39, Gl 6 | 2 | -1 | verpasst | Grenze -1 |
| 5 | RE 144, 19:23 +4 = 19:27, Gl 6 | RE 44, 19:36 +0 = 19:36, Gl 6, neu Gl 7 | 6 | 3 | schaffst du | `gleisNeu` zählt (mit Gl 6: Umstieg 2, Reserve 7) |
| 6 | RE 112, 23:49 +1 = 23:50, Gl 6 | RE 79, 23:58 +5 = 00:03, Gl 5 | 3 | 10 | schaffst du | über Mitternacht |

## Nicht enthalten

Sonntagsfilter für Ankünfte, Ausblenden bereits angekommener Züge, Vorschläge für alternative Anschlüsse.

## Done

- Die Logik liegt testbar in `shared/anschluss.ts`, die sechs Testfälle stehen in `shared/anschluss.test.ts`.
- `npm run verify` ist grün.
