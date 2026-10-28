// =====================================================================
//  GEGENMASSNAHME 3.2 – PREPARED STATEMENT / PARAMETRISIERUNG
// =====================================================================
//  Ziel: Benutzereingaben dürfen nicht als SQL-Code ausgeführt werden.
//  Die Werte werden strikt von der SQL-Struktur getrennt:
//  Die Query enthält Platzhalter (?), die Werte werden separat übergeben.
//
//  In mysql2 wird dafür pool.execute(sql, params) verwendet. Anders als
//  pool.query() bereitet execute() ein echtes Prepared Statement vor.
//
//  Umsetzung: Login-Abfrage mit zwei Platzhaltern (username, password).
//  Rückgabe:  Gefundene Zeilen (id, username, role, email).
//
//  Voraussetzung: Datenbank und Testdaten sind eingerichtet.
//  Fachgespräch: Erkläre den Unterschied zwischen query() und execute()
//  und warum ' OR '1'='1' hier wirkungslos ist.
// =====================================================================

export async function loginWithPreparedStatement(pool, username, password) {

  const [rows] = await pool.execute(
    'SELECT id, username, role, email FROM users WHERE username = ? AND password = ?',
    [username, password]
  );
  return rows;
  
}
