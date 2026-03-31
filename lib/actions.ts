'use server'
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

/*
SCHEMA:
  Categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  Sellers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    notes TEXT
  );

  Shows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    seller_id INTEGER,
    viewer_count INTEGER,
    notes TEXT,
    date DATETIME,
    
  );

  GiveawayState (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    show_id INTEGER,
    end_time DATETIME,
    is_continuous BOOLEAN
  );

*/

export interface Seller {
  id: number;
  username: string;
  notes: string | null;
}

export async function addSeller(username: string, notes: string | null) {
  const stmt = db.prepare('INSERT INTO sellers (username, notes) VALUES (?, ?)');
  const info = stmt.run(username, notes);

  // This tells Next.js: "The data on the Home page just changed, refresh it!"
  revalidatePath('/');

  return info;//.lastInsertRowid;
}

export async function getAllSellers() {
  const stmt = db.prepare('SELECT * FROM sellers');
  return stmt.all() as Seller[];
}

export async function getSellerByUsername(username: string) {
  const stmt = db.prepare('SELECT * FROM sellers WHERE username = ?');
  return stmt.get(username) as Seller | undefined;
}

export async function deleteSellerByUsername(username: string) {
    const stmt = db.prepare('DELETE FROM sellers WHERE username = ?');
    const info = stmt.run(username);
    revalidatePath('/');
    return info;
}