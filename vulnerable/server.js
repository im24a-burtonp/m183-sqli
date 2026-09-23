// =====================================================================
//  VERWUNDBARER SERVER  (Teil 1 – vulnerable)
// =====================================================================
//  ACHTUNG: Dieser Server ist ABSICHTLICH unsicher programmiert. Er
//  dient ausschliesslich Demonstrationszwecken im Modul M183 und darf
//  niemals produktiv eingesetzt werden.
//
//  Die zentrale Schwachstelle ist überall dieselbe: Benutzereingaben
//  werden per String-Verkettung direkt in den SQL-Text eingebaut,
//  statt sie als Parameter zu übergeben. Zusätzlich ist
//  `multipleStatements: true` gesetzt, damit "stacked queries" möglich
//  sind (Integritäts-Angriff).
// =====================================================================

import http from 'node:http';
import { createPool } from '../db/pool.js';

const pool = createPool({ multipleStatements: true });
const PORT = Number(process.env.APP_PORT) || 3000;

// Kleiner Helfer: JSON-Body einer Anfrage einlesen.
function readJsonBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload, null, 2));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // -----------------------------------------------------------------
  //  POST /login   – Angriffsfläche Vertraulichkeit (2.1)
  //  Erwartet JSON: { "username": "...", "password": "..." }
  //  Verwundbar u. a. gegen:  ' OR '1'='1' --
  // -----------------------------------------------------------------
  if (req.method === 'POST' && url.pathname === '/login') {
    const { username = '', password = '' } = await readJsonBody(req);

    // UNSICHER: Eingaben direkt in den SQL-String verkettet.
    const sql =
      `SELECT id, username, role, email FROM users ` +
      `WHERE username = '${username}' AND password = '${password}'`;
    console.log('[vulnerable] Login-SQL:', sql);

    const [rows] = await pool.query(sql);
    if (rows.length > 0) {
      return sendJson(res, 200, { ok: true, message: 'Login erfolgreich', users: rows });
    }
    return sendJson(res, 401, { ok: false, message: 'Login fehlgeschlagen' });
  }

  // -----------------------------------------------------------------
  //  GET /search?term=...  – Angriffsflächen Vertraulichkeit (UNION)
  //                          und Verfügbarkeit (2.2)
  //  Kein try/catch: Ein durch Injection erzeugter SQL-Syntaxfehler
  //  wird zu einer unbehandelten Ausnahme -> der Node-Prozess stürzt
  //  ab (DoS). Ebenso möglich: '%' OR SLEEP(5) -- zum Blockieren.
  // -----------------------------------------------------------------
  if (req.method === 'GET' && url.pathname === '/search') {
    const term = url.searchParams.get('term') ?? '';

    // UNSICHER: Eingabe direkt verkettet, keine Fehlerbehandlung.
    const sql =
      `SELECT id, username, email FROM users WHERE username LIKE '%${term}%'`;
    console.log('[vulnerable] Search-SQL:', sql);

    const [rows] = await pool.query(sql);
    return sendJson(res, 200, { ok: true, results: rows });
  }

  // -----------------------------------------------------------------
  //  POST /profile/update  – Angriffsfläche Integrität (2.3)
  //  Erwartet JSON: { "username": "...", "newEmail": "..." }
  //  Durch multipleStatements sind stacked queries möglich, z. B.:
  //    newEmail = "x@x.ch'; UPDATE users SET role='admin' WHERE username='marco'; -- "
  // -----------------------------------------------------------------
  if (req.method === 'POST' && url.pathname === '/profile/update') {
    const { username = '', newEmail = '' } = await readJsonBody(req);

    // UNSICHER: Eingaben verkettet + mehrere Statements erlaubt.
    const sql =
      `UPDATE users SET email = '${newEmail}' WHERE username = '${username}'`;
    console.log('[vulnerable] Update-SQL:', sql);

    await pool.query(sql);
    return sendJson(res, 200, { ok: true, message: 'Profil aktualisiert' });
  }

  sendJson(res, 404, { ok: false, message: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`[vulnerable] Server läuft auf http://127.0.0.1:${PORT}`);
});
