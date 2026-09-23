#!/usr/bin/env bash
# Legt die offenen Aufgaben als GitHub-Issues an.
#
# Voraussetzung: GitHub CLI installiert und angemeldet:
#     gh auth login
#
# Aufruf (im Repo-Verzeichnis):
#     bash scripts/create-issues.sh

set -euo pipefail

REPO="im24a-burtonp/m183-sqli"

gh issue create --repo "$REPO" \
  --title "2.2 Verfügbarkeit: Angriff implementieren (attack-availability.js)" \
  --label "attack" \
  --body "Payload gegen /search bauen: entweder Zeitverzögerung (SLEEP) oder ein SQL-Syntaxfehler, der den nicht abgefangenen Server abstürzen lässt (DoS). Ergebnis kurz dokumentieren."

gh issue create --repo "$REPO" \
  --title "2.3 Integrität: Angriff implementieren (attack-integrity.js)" \
  --label "attack" \
  --body "Stacked-Query-Payload für /profile/update bauen, der zusätzlich die Rolle eines Benutzers (z. B. marco) auf admin setzt. Vorher/nachher nachweisen."

gh issue create --repo "$REPO" \
  --title "3.2 Prepared Statement implementieren (defense-prepared.js)" \
  --label "defense" \
  --body "Login mit pool.execute() und Platzhaltern (?) umsetzen. Danach den Vertraulichkeits-Angriff gegen /login/prepared testen – er muss scheitern."

gh issue create --repo "$REPO" \
  --title "3.3 Stored Procedure anbinden (defense-procedure.js)" \
  --label "defense" \
  --body "sp_login parametrisiert per CALL sp_login(?, ?) aufrufen (rows[0] beachten). Danach gegen /login/procedure testen."

gh issue create --repo "$REPO" \
  --title "Nachweis: alle Angriffe gegen vulnerable UND secured dokumentieren" \
  --label "docs" \
  --body "Jeden Angriff einmal gegen den verwundbaren Server (erfolgreich) und einmal gegen den sicheren Server (abgewehrt) ausführen und die Ergebnisse festhalten."

echo "Alle Issues wurden angelegt."
