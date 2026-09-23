// =====================================================================
//  ANGRIFF 2.3 – INTEGRITÄT   ***TODO: von dir zu implementieren***
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
  // TODO: Payload bauen.
  const username = 'felix';        // dein eigener, unverdächtiger Account
  const newEmail = '';             // <-- HIER den stacked-query-Payload einsetzen

  if (!newEmail) {
    console.log('TODO: In dieser Datei fehlt noch der Angriffs-Payload (newEmail).');
    return;
  }

  const res = await fetch(`${BASE_URL}/profile/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, newEmail }),
  });
  const data = await res.json();
  console.log('Server-Antwort:', data);
  // TODO: Danach nachweisen, dass marcos Rolle jetzt 'admin' ist.
}

run().catch((err) => {
  console.error('Angriff fehlgeschlagen:', err.message);
});
