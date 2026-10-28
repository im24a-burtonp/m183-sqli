// =====================================================================
//  GEGENMASSNAHME 3.3 – STORED PROCEDURE
// =====================================================================
//  Ziel: Die SQL-Logik liegt in der Datenbank und wird nicht dynamisch
//  in der Applikation zusammengesetzt.
//
//  Umsetzung: Die Prozedur "sp_login" wird parametrisiert aufgerufen
//  (siehe db/schema.sql):
//     CALL sp_login(?, ?)
//
//  Rückgabe: Die gefundenen Zeilen. Bei CALL liefert mysql2 ein
//  verschachteltes Ergebnis-Array zurück; das erste Element enthält
//  die eigentlichen Zeilen (result[0]).
//
//  Voraussetzung: Datenbank und Prozedur sind eingerichtet.
//  Fachgespräch: Erkläre, warum die Query-Struktur hier nicht durch
//  Benutzereingaben manipulierbar ist und welchen Vorteil das gegenüber
//  dynamischem SQL hat.
// =====================================================================

export async function loginWithStoredProcedure(pool, username, password) {

  const [result] = await pool.execute('CALL sp_login(?, ?)', [username, password]);
  return result[0];

}
