import mysql from 'mysql2/promise';

export const config = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS ?? '',
  database: process.env.DB_NAME || 'biblioteca',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4_unicode_ci',
  dateStrings: true,
};

export const pool = mysql.createPool(config);

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function verificarConexion() {
  const [rows] = await pool.query('SELECT VERSION() AS version, DATABASE() AS db');
  return rows[0];
}
