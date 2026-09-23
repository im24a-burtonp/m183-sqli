// =====================================================================
//  GEGENMASSNAHME 3.2 – PREPARED STATEMENT / PARAMETRISIERUNG
//  ***TODO: von dir zu implementieren***
// =====================================================================
//  Idee: Werte werden strikt von der SQL-Struktur getrennt. Die Query
//  enthält nur Platzhalter (?), die Werte werden separat übergeben. Die
//  Datenbank behandelt sie garantiert als Daten, nie als Code.
//
//  In mysql2 verwendest du dafür pool.execute(sql, params). Anders als
//  pool.query() bereitet execute() ein echtes Prepared Statement vor.
//
//  Aufgabe:
//    Baue die Login-Abfrage mit zwei Platzhaltern (username, password)
//    und gib die gefundenen Zeilen zurück (id, username, role, email).
//
//  Für das Fachgespräch: Erkläre den Unterschied zwischen query() und
//  execute() und warum ' OR '1'='1' hier wirkungslos ist.
// =====================================================================

export async function loginWithPreparedStatement(pool, username, password) {
  // TODO: Prepared Statement mit Platzhaltern (?) umsetzen.
  //
  //   const [rows] = await pool.execute(
  //     'SELECT ... WHERE username = ? AND password = ?',
  //     [username, password],
  //   );
  //   return rows;

  throw new Error('defense-prepared.js: noch nicht implementiert (TODO 3.2)');
}
