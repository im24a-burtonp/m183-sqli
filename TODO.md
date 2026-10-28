# Offene Aufgaben

Das Fundament steht. Diese Teile sind bewusst offen gelassen, damit der
eigene Beitrag klar erkennbar ist (wichtig fürs Fachgespräch und die
Bewertung). Jede Aufgabe ist zusätzlich als GitHub-Issue erfasst.

## Angriffe

- [x] **2.2 Verfügbarkeit** – `attacks/attack-availability.js`
  Payload gegen `/search` bauen: entweder Zeitverzögerung (`SLEEP`) oder
  gezielter SQL-Syntaxfehler, der den Server abstürzen lässt.

- [x] **2.3 Integrität** – `attacks/attack-integrity.js`
  Stacked-Query-Payload für `/profile/update` bauen, der zusätzlich die
  Rolle eines anderen Benutzers auf `admin` setzt.

## Verteidigung

- [x] **3.2 Prepared Statement** – `secured/defense-prepared.js`
  Login per `pool.execute()` mit Platzhaltern (`?`) umsetzen.

- [x] **3.3 Stored Procedure** – `secured/defense-procedure.js`
  `sp_login` parametrisiert per `CALL sp_login(?, ?)` aufrufen.

## Nachweis / Doku

- [x] Jeden Angriff einmal gegen `vulnerable` (erfolgreich) und einmal
      gegen `secured` (abgewehrt) ausführen und dokumentieren.
- [ ] Optional: Postman-Collection in `postman/` ergänzen.
- [x] Arbeitsaufteilung im Team über Commits/Branches sichtbar halten.
