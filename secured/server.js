// =====================================================================
//  SICHERER SERVER  (Teil 2 – secured)
// =====================================================================
//  Dieselbe Applikation wie der verwundbare Server, aber mit den
//  programmiertechnischen Gegenmassnahmen. Die drei Massnahmen liegen
//  in separaten Dateien:
//     defense-escaping.js   -> 3.1 Escaping + Input Validation
//     defense-prepared.js   -> 3.2 Prepared Statements / Parametrisierung
//     defense-procedure.js  -> 3.3 Stored Procedure
//
//  Zusätzlich zentral abgesichert:
//   - multipleStatements: false  -> stacked queries (Integrität) unmöglich
//   - try/catch um alle DB-Zugriffe -> kein Absturz (Verfügbarkeit)
//   - parametrisierte Queries bei /search und /profile/update
// =====================================================================

import http from 'node:http';
import { createPool } from '../db/pool.js';
import { validateCredentials, loginWithEscaping } from './defense-escaping.js';
import { loginWithPreparedStatement } from './defense-prepared.js';
import { loginWithStoredProcedure } from './defense-procedure.js';

const pool = createPool({ multipleStatements: false });
const PORT = Number(process.env.APP_PORT) || 3001;

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

// Gemeinsame Login-Behandlung für die drei Massnahmen-Varianten.
async function handleLogin(req, res, strategy) {
  const { username = '', password = '' } = await readJsonBody(req);

  // 3.1: Eingaben zuerst validieren.
  if (!validateCredentials(username, password)) {
    return sendJson(res, 400, { ok: false, message: 'Ungültige Eingabe' });
  }

  const rows = await strategy(pool, username, password);
  if (rows.length > 0) {
    return sendJson(res, 200, { ok: true, message: 'Login erfolgreich', user: rows[0] });
  }
  return sendJson(res, 401, { ok: false, message: 'Login fehlgeschlagen' });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  try {
    // Login-Varianten (jeweils eine Gegenmassnahme) -----------------
    if (req.method === 'POST' && url.pathname === '/login/escaping') {
      return await handleLogin(req, res, loginWithEscaping);
    }
    if (req.method === 'POST' && url.pathname === '/login/prepared') {
      return await handleLogin(req, res, loginWithPreparedStatement);
    }
    if (req.method === 'POST' && url.pathname === '/login/procedure') {
      return await handleLogin(req, res, loginWithStoredProcedure);
    }

    // Suche – parametrisiert (Konzept 3.2) --------------------------
    if (req.method === 'GET' && url.pathname === '/search') {
      const term = url.searchParams.get('term') ?? '';
      const [rows] = await pool.execute(
        'SELECT id, username, email FROM users WHERE username LIKE ?',
        [`%${term}%`],
      );
      return sendJson(res, 200, { ok: true, results: rows });
    }

    // Profil-Update – parametrisiert, kein stacked query möglich -----
    if (req.method === 'POST' && url.pathname === '/profile/update') {
      const { username = '', newEmail = '' } = await readJsonBody(req);
      await pool.execute(
        'UPDATE users SET email = ? WHERE username = ?',
        [newEmail, username],
      );
      return sendJson(res, 200, { ok: true, message: 'Profil aktualisiert' });
    }

    sendJson(res, 404, { ok: false, message: 'Not found' });
  } catch (err) {
    // Fehler abfangen -> Server bleibt verfügbar (Gegenmassnahme 2.2).
    console.error('[secured] Fehler:', err.message);
    sendJson(res, 500, { ok: false, message: 'Interner Fehler' });
  }
});

server.listen(PORT, () => {
  console.log(`[secured] Server läuft auf http://127.0.0.1:${PORT}`);
});
