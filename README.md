# M183 – SQL-Injection: verwundbare vs. sichere Applikation

Projektarbeit zum Thema **SQL-Injection (SQLi)**. Die gleiche kleine
3-Schichten-Applikation existiert in zwei Varianten:

1. **`vulnerable/`** – absichtlich angreifbar
2. **`secured/`** – mit programmiertechnischen Gegenmassnahmen abgesichert

Die Arbeit ist an der **CIA-Triad** ausgerichtet (Vertraulichkeit,
Verfügbarkeit, Integrität).

## Architektur (3 Schichten)

| Schicht | Umsetzung |
| --- | --- |
| Präsentation | Angriffsskripte in `attacks/` (bzw. Postman) |
| Logik | Node-Server in `vulnerable/` und `secured/` |
| Daten | MySQL, Schema in `db/schema.sql`, Daten aus `db/seed.json` |

## Voraussetzungen

- Node.js ≥ 18
- Docker (für die MySQL-Instanz)

## Einrichtung

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Konfiguration anlegen
cp .env.example .env

# 3. Datenbank starten (legt das Schema automatisch an)
docker compose up -d

# 4. Testdaten laden (aus db/seed.json)
npm run seed
```

## Server starten

```bash
npm run start:vulnerable   # http://127.0.0.1:3000
npm run start:secured      # http://127.0.0.1:3001
```

## Angriffe ausführen

Jeweils gegen den laufenden **verwundbaren** Server:

```bash
npm run attack:confidentiality   # 2.1 – umgesetzt
npm run attack:availability      # 2.2 – umgesetzt
npm run attack:integrity         # 2.3 – umgesetzt
```

Gegen den **sicheren** Server dieselben Payloads erneut ausführen
(`TARGET_URL=http://127.0.0.1:3001 npm run attack:confidentiality`):
Die Angriffe dürfen dann nicht mehr funktionieren.

## Angriffe & Gegenmassnahmen (CIA-Zuordnung)

| CIA-Ziel | Angriff (`attacks/`) | Gegenmassnahme (`secured/`) |
| --- | --- | --- |
| Vertraulichkeit | Login-Bypass + UNION-Read | Escaping + Input Validation (3.1) |
| Verfügbarkeit | SLEEP / Absturz über `/search` | try/catch + Parametrisierung (3.2) |
| Integrität | Stacked `UPDATE` über `/profile` | Prepared Statement / Stored Procedure (3.3) |

Die zentrale Ursache aller Angriffe ist die **String-Verkettung** von
Eingaben in den SQL-Text. Die Gegenmassnahmen trennen Werte konsequent
von der SQL-Struktur.

## Testergebnisse

Die Angriffe wurden gegen beide Server ausgeführt. Vor den Tests wurden die
Testdaten mit `npm run seed` zurückgesetzt.

| Angriff | Verwundbarer Server `:3000` | Sicherer Server `:3001` |
| --- | --- | --- |
| Vertraulichkeit | Login-Bypass erfolgreich; UNION-Injection las die Tabelle `secrets` aus. | Login-Bypass wurde abgelehnt; die UNION-Suche lieferte keine Secrets. |
| Verfügbarkeit | Der Payload `%' AND SLEEP(5) --` verzögerte die Anfrage auf ca. 19,8 Sekunden. | Die Anfrage dauerte ca. 63 ms; keine künstliche Verzögerung. |
| Integrität | Der Stacked-Query-Payload setzte Marcos Rolle von `user` auf `admin`. | Marcos Rolle blieb `user`; das eingeschleuste zweite `UPDATE` wurde nicht ausgeführt. |

### Testbefehle

```bash
docker compose up -d
npm run seed
npm run start:vulnerable
```

Die Angriffsskripte wurden anschliessend in einem zweiten Terminal ausgeführt:

```bash
npm run attack:confidentiality
npm run attack:availability
npm run attack:integrity
```

Für den sicheren Server wurde `APP_PORT=3001` gesetzt und dieselben
Angriffsskripte mit `TARGET_URL=http://127.0.0.1:3001` ausgeführt.

## Projektstruktur

```
m183-sqli/
├── db/
│   ├── schema.sql            # Tabellen + Stored Procedure sp_login
│   ├── seed.json             # Testdaten (Bonus 4.3.3)
│   ├── seed.js               # Loader: JSON -> DB
│   └── pool.js               # Verbindungs-Helper
├── vulnerable/
│   └── server.js             # unsicherer Server
├── secured/
│   ├── server.js             # sicherer Server
│   ├── defense-escaping.js   # 3.1
│   ├── defense-prepared.js   # 3.2
│   └── defense-procedure.js  # 3.3
├── attacks/
│   ├── attack-confidentiality.js  # 2.1
│   ├── attack-availability.js     # 2.2
│   └── attack-integrity.js        # 2.3
├── docker-compose.yml
└── README.md
```

## Offene Aufgaben

Die Umsetzung und die Testergebnisse sind in `TODO.md` dokumentiert.

## Sicherheitshinweis

Der `vulnerable/`-Server ist bewusst unsicher und dient ausschliesslich
Ausbildungszwecken. Er darf niemals öffentlich oder produktiv betrieben
werden.
