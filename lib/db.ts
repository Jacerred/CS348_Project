import Database from 'better-sqlite3';
import path from 'path';

// Locate the database file
const dbPath = path.join(process.cwd(), 'dev.db');
const db = new Database(dbPath);

// Standard practice: Enable Write-Ahead Logging for better performance
db.pragma('journal_mode = WAL');

export default db;