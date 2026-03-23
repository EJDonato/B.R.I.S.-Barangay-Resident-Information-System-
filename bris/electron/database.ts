import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

const dbPath = path.join(app.getPath('userData'), 'bris.db');
const db = new Database(dbPath);

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS residents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      birthday TEXT,
      address TEXT,
      telephone TEXT,
      is_voter INTEGER DEFAULT 0,
      occupation TEXT,
      image_url TEXT
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resident_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      transaction_date TEXT NOT NULL,
      purpose TEXT,
      FOREIGN KEY (resident_id) REFERENCES residents (id) ON DELETE CASCADE
    );
  `);
}

export function getAllResidents() {
  const residents = db.prepare('SELECT * FROM residents').all();
  return residents.map((r: any) => ({
    ...r,
    isVoter: Boolean(r.is_voter),
    imageUrl: r.image_url,
    transactions: db.prepare('SELECT * FROM transactions WHERE resident_id = ?').all(r.id).map((t: any) => ({
      ...t,
      date: t.transaction_date
    }))
  }));
}

export function searchResidents(query: string) {
  const residents = db.prepare('SELECT * FROM residents WHERE name LIKE ?').all(`%${query}%`);
  return residents.map((r: any) => ({
    ...r,
    isVoter: Boolean(r.is_voter),
    imageUrl: r.image_url,
    transactions: db.prepare('SELECT * FROM transactions WHERE resident_id = ?').all(r.id).map((t: any) => ({
      ...t,
      date: t.transaction_date
    }))
  }));
}

export function addResident(resident: any) {
  const info = db.prepare(`
    INSERT INTO residents (name, birthday, address, telephone, is_voter, occupation, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    resident.name,
    resident.birthday,
    resident.address,
    resident.telephone,
    resident.isVoter ? 1 : 0,
    resident.occupation,
    resident.imageUrl
  );
  return info.lastInsertRowid;
}

export function addTransaction(transaction: any) {
  const info = db.prepare(`
    INSERT INTO transactions (resident_id, type, transaction_date, purpose)
    VALUES (?, ?, ?, ?)
  `).run(
    transaction.residentId,
    transaction.type,
    transaction.date,
    transaction.purpose
  );
  return info.lastInsertRowid;
}

export default db;
