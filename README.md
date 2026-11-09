# Abfahrtstafel

Beispielprojekt für den Online-Kurs **„Claude Code in der Praxis“**. Eine Fallblatt-Anzeige eines fiktiven Bahnhofs. Alle Züge, Orte und Daten sind erfunden.

Frontend mit Vite und React, Backend mit Express 5, alles in TypeScript. Die Daten liegen lokal im Repo, ein API-Key ist nicht nötig.

## Vorbereitung

Voraussetzungen: Node.js ≥ 22, Git, [Claude Code](https://docs.claude.com/claude-code) und ein aktueller Browser.

```sh
git clone https://github.com/sspringer82/cc-abfahrtstafel.git
cd cc-abfahrtstafel
npm ci
npm run check-setup
```

`check-setup` prüft die Umgebung, legt eine `.env` an und kopiert Kursmaterial in den Nachbarordner `../cc-abfahrtstafel-doku`.

## Befehle

| Befehl | Zweck |
| --- | --- |
| `npm run dev` | API (Port 3001) und Tafel (http://localhost:5173) starten |
| `npm run stop` | hängengebliebene Server beenden, vor allem unter Windows |
| `npm run verify` | Typecheck, Lint und Tests mit knapper Ausgabe |
| `npm test` | nur die Tests |
| `npm run test:lang` | spielt den Betriebstag durch, dauert etwa eine Minute |

Im Startstand sind einzelne Tests rot. Das ist Absicht.

## Aufbau

| Pfad | Inhalt |
| --- | --- |
| `shared/` | Fachlogik und gemeinsame Typen |
| `server/` | Express-API: `/api/health`, `/api/abfahrten` |
| `src/` | React-Frontend mit Fallblatt-Anzeige |
| `data/` | Abfahrten, Ankünfte und Umstiegszeiten |
| `fixtures/` | Referenzwerte für die Tests |
| `test/` | langsame Tests |
| `scripts/` | Hilfsskripte |

## Kurs-Stände

Wer den Anschluss verliert, springt mit `git checkout <tag>` zu einem Stand. Eigene Änderungen vorher sichern: `git stash -u`.

| Tag | Stand |
| --- | --- |
| `teil1-start` | Ausgangslage für Teil 1 |
| `teil1-1-agent` | Teil 1 nach dem Block „Der Agent“ |
| `teil1-2-kontext` | Teil 1 nach dem Block „Kontext“ |
| `teil1-3-pruefung` | Teil 1 nach dem Block „Prüfung“ |
| `teil1-4-auftrag` | Teil 1 nach dem Block „Auftrag“ |
| `teil1-5-kontrolle` | Teil 1 nach dem Block „Kontrolle“ |
| `teil1-ende` | Endstand von Teil 1 |
