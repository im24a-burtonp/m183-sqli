// Befüllt die Datenbank mit den Daten aus seed.json.
// Erfüllt Bonus 4.3.3: Die SQLi-Daten stammen aus einer JSON-Datei.
//
// Aufruf:  npm run seed

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createPool } from './pool.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function seed() {
  const raw = await readFile(join(__dirname, 'seed.json'), 'utf-8');
  const data = JSON.parse(raw);

  const pool = createPool();

  try {
    // Bestehende Daten entfernen, damit der Seed wiederholbar ist.
    await pool.query('DELETE FROM secrets');
    await pool.query('DELETE FROM users');

    // Parametrisierte Inserts (Best Practice – auch beim Seeding).
    for (const u of data.users) {
      await pool.execute(
        'INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)',
        [u.username, u.password, u.role, u.email],
      );
    }

    for (const s of data.secrets) {
      await pool.execute(
        'INSERT INTO secrets (owner, label, content) VALUES (?, ?, ?)',
        [s.owner, s.label, s.content],
      );
    }

    console.log(
      `Seed erfolgreich: ${data.users.length} Benutzer, ${data.secrets.length} Secrets.`,
    );
  } finally {
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('Seed fehlgeschlagen:', err.message);
  process.exit(1);
});
