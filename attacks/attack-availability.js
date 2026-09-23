// =====================================================================
//  ANGRIFF 2.2 – VERFÜGBARKEIT   ***TODO: von dir zu implementieren***
// =====================================================================
//  Ziel: den Dienst lahmlegen, sodass er nicht mehr antwortet.
//
//  Der verwundbare /search-Endpoint hat KEINE Fehlerbehandlung und
//  verkettet die Eingabe direkt. Zwei mögliche Wege:
//
//   Variante 1 (Blockieren / langsam machen):
//     Nutze eine Zeit-Funktion der DB, damit jede Anfrage künstlich
//     verzögert wird. Stichwort: SLEEP(...). Überlege, wie du das per
//     LIKE-Term einschleust und den Rest der Query auskommentierst.
//
//   Variante 2 (Absturz / DoS):
//     Erzeuge mit deinem Payload einen SQL-SYNTAXFEHLER. Da der Server
//     den Fehler nicht abfängt, entsteht eine unbehandelte Ausnahme und
//     der Node-Prozess beendet sich -> Dienst weg.
//
//  Für das Fachgespräch: Du musst erklären können, WARUM der Prozess
//  abstürzt (Stichwort: unhandled promise rejection in Node).
//
//  Voraussetzung: verwundbarer Server läuft (npm run start:vulnerable).
//  Aufruf:        npm run attack:availability
// =====================================================================

const BASE_URL = process.env.TARGET_URL || 'http://127.0.0.1:3000';

async function run() {
  // TODO: Payload bauen. Beispiel-Gerüst (Payload noch ergänzen):
  const term = ''; // <-- HIER deinen Angriffs-Payload einsetzen

  if (!term) {
    console.log('TODO: In dieser Datei fehlt noch der Angriffs-Payload.');
    console.log('Siehe Kommentar oben (SLEEP-Variante oder Syntaxfehler-Variante).');
    return;
  }

  const start = Date.now();
  const res = await fetch(`${BASE_URL}/search?term=${encodeURIComponent(term)}`);
  const dauer = Date.now() - start;

  console.log(`Antwort nach ${dauer} ms, Status ${res.status}`);
  // TODO: Ergebnis auswerten / beschreiben, was der Angriff bewirkt hat.
}

run().catch((err) => {
  // TODO: Interpretieren – ein Verbindungsfehler hier kann bereits
  // bedeuten, dass der Server abgestürzt ist (Angriff erfolgreich).
  console.error('Anfrage fehlgeschlagen:', err.message);
});
