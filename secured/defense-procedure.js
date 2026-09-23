// =====================================================================
//  GEGENMASSNAHME 3.3 – STORED PROCEDURE
//  ***TODO: von dir zu implementieren***
// =====================================================================
//  Idee: Die SQL-Logik liegt fertig und vorkompiliert in der Datenbank
//  (siehe db/schema.sql -> Prozedur "sp_login"). Die Applikation ruft
//  sie nur noch mit Parametern auf und baut selbst kein SQL mehr
//  dynamisch zusammen.
//
//  Die Prozedur ist bereits angelegt:
//     CALL sp_login(<username>, <password>)
//
//  Aufgabe:
//    Rufe sp_login parametrisiert auf und gib die gefundenen Zeilen
//    zurück. Achtung: Bei CALL liefert mysql2 ein verschachteltes
//    Ergebnis-Array zurück – das erste Element sind die eigentlichen
//    Zeilen (rows[0]).
//
//  Für das Fachgespräch: Erkläre, warum die Struktur der Query hier
//  gar nicht mehr manipulierbar ist und welchen Vorteil das gegenüber
//  dynamischem SQL hat.
// =====================================================================

export async function loginWithStoredProcedure(pool, username, password) {
  // TODO: Stored Procedure parametrisiert aufrufen.
  //
  //   const [result] = await pool.execute('CALL sp_login(?, ?)', [username, password]);
  //   return result[0]; // erste Ergebnismenge = die Zeilen

  throw new Error('defense-procedure.js: noch nicht implementiert (TODO 3.3)');
}
