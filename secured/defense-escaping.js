// =====================================================================
//  GEGENMASSNAHME 3.1 – ESCAPING + INPUT VALIDATION  (Referenz)
// =====================================================================
//  Zwei Massnahmen aus der "leichten" Kategorie:
//
//  (1) Input Validation: Eingaben werden gegen ein erwartetes Format
//      geprüft (Whitelist, Typ, Länge), BEVOR sie weiterverarbeitet
//      werden. Was nicht passt, wird abgelehnt.
//
//  (2) Escaping: Sonderzeichen in den Eingaben werden maskiert, damit
//      die DB sie als Daten und nicht als SQL-Code interpretiert.
//      mysql.escape() setzt die Werte korrekt in Anführungszeichen und
//      entschärft u. a. ' und ; .
//
//  Hinweis: Prepared Statements (3.2) sind der robustere Weg. Escaping
//  wird hier bewusst als eigenständige, "leichte" Massnahme gezeigt.
// =====================================================================

import mysql from 'mysql2';

// (1) Input Validation ------------------------------------------------
export function validateCredentials(username, password) {
  if (typeof username !== 'string' || typeof password !== 'string') {
    return false;
  }
  if (username.length < 1 || username.length > 50) return false;
  if (password.length < 1 || password.length > 100) return false;

  // Whitelist: Benutzername darf nur unverfängliche Zeichen enthalten.
  // Damit sind ', ", ;, -- und Leerzeichen von vornherein ausgeschlossen.
  if (!/^[A-Za-z0-9_.-]+$/.test(username)) return false;

  return true;
}

// (2) Escaping --------------------------------------------------------
export async function loginWithEscaping(pool, username, password) {
  // mysql.escape() liefert den Wert inkl. Anführungszeichen und
  // maskierten Sonderzeichen zurück -> daher KEINE eigenen '' im SQL.
  const safeUser = mysql.escape(username);
  const safePass = mysql.escape(password);

  const sql =
    `SELECT id, username, role, email FROM users ` +
    `WHERE username = ${safeUser} AND password = ${safePass}`;

  const [rows] = await pool.query(sql);
  return rows;
}
