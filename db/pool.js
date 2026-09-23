// Zentraler Verbindungs-Helper für alle Server.
//
// WICHTIG: Der Parameter `multipleStatements` entscheidet mit über die
// Angreifbarkeit. Der verwundbare Server aktiviert ihn (ermöglicht
// "stacked queries" für den Integritäts-Angriff), der sichere Server
// lässt ihn auf dem sicheren Default (false).

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export function createPool({ multipleStatements = false } = {}) {
  return mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'm183',
    password: process.env.DB_PASSWORD || 'm183secret',
    database: process.env.DB_NAME || 'm183_sqli',
    waitForConnections: true,
    connectionLimit: 10,
    multipleStatements,
  });
}
