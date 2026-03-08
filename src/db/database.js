const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const dbPath = process.env.DB_PATH || './src/db/orders.db';

async function connectDatabase() {
  return open({
    filename: path.resolve(dbPath),
    driver: sqlite3.Database
  });
}

async function initializeDatabase() {
  const db = await connectDatabase();

  await db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS "Order" (
      orderId TEXT PRIMARY KEY,
      value REAL NOT NULL,
      creationDate TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId TEXT NOT NULL,
      productId INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (orderId) REFERENCES "Order"(orderId) ON DELETE CASCADE
    );
  `);

  return db;
}

module.exports = {
  connectDatabase,
  initializeDatabase
};
