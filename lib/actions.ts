'use server'
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

/*
SCHEMA:
  CREATE TABLE IF NOT EXISTS Categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Sellers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS Shows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    seller_id INTEGER,
    viewer_count INTEGER,
    notes TEXT,
    date DATETIME,
    url TEXT,
    category_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE SET NULL,
    FOREIGN KEY (seller_id) REFERENCES Sellers(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS GiveawayState (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    show_id INTEGER NOT NULL,
    status TEXT DEFAULT 'IDLE', -- 'IDLE', 'RUNNING', 'PAUSED'
    remaining_ms INTEGER DEFAULT 300000, -- 5 minutes in ms
    end_time DATETIME, -- Only set when RUNNING
    is_continuous BOOLEAN DEFAULT 0,
    FOREIGN KEY (show_id) REFERENCES Shows(id) ON DELETE CASCADE
  );

*/

// --- SELLER ACTIONS ---

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

// --- SHOW ACTIONS ---

export interface Show {
  id: number;
  title: string;
  seller_id: number;
  viewer_count: number;
  notes: string | null;
  date: string; // ISO format
  url: string | null;
  category_id: number | null;
}

export async function getShows(sellerId: number) {
  return db.prepare('SELECT * FROM Shows WHERE seller_id = ?').all(sellerId) as Show[];
}

export async function addShow(title: string, sellerId: number, categoryId: number, viewerCount = 0, notes: string | null = null, url: string | null = null) {
  const stmt = db.prepare('INSERT INTO Shows (title, seller_id, viewer_count, notes, date, url, category_id) VALUES (?, ?, ?, ?, (SELECT CURRENT_DATE), ?, ?)');
  const info = stmt.run(title, sellerId, viewerCount, notes, url, categoryId);
  revalidatePath('/');
  return info;
}

export async function deleteShow(id: number) {
  const stmt = db.prepare('DELETE FROM Shows WHERE id = ?');
  const info = stmt.run(id);
  revalidatePath('/');
  return info;
}

// export async function updateShow(id: number, data: { title?: string, category_id?: number, notes?: string }) {
//   const keys = Object.keys(data).map(k => `${k} = ?`).join(', ');
//   const values = Object.values(data);
  
//   db.prepare(`UPDATE Shows SET ${keys} WHERE id = ?`).run(...values, id);
//   revalidatePath('/');
// }

export async function updateShow(id: number, data: { title?: string, category_id?: number, notes?: string }) {
  // 1. Define exactly what columns we trust
  const allowedColumns = ['title', 'category_id', 'notes'];
  
  const updates: string[] = [];
  const values: any[] = [];

  // 2. Only add to our query if the key is explicitly in our allowlist
  for (const [key, value] of Object.entries(data)) {
    if (allowedColumns.includes(key) && value !== undefined) {
      updates.push(`${key} = ?`);
      values.push(value);
    }
  }

  // 3. If they sent junk data with no valid keys, abort
  if (updates.length === 0) return;

  // 4. Safely execute
  db.prepare(`UPDATE Shows SET ${updates.join(', ')} WHERE id = ?`).run(...values, id);
  revalidatePath('/');
}

// --- GIVEAWAY ACTIONS ---
export interface Giveaway {
  id: number;
  show_id: number;
  status: 'IDLE' | 'RUNNING' | 'PAUSED';
  remaining_ms: number;
  end_time: string | null; // ISO format
  is_continuous: boolean;
  show_title?: string; // Joined from Shows
  seller_name?: string; // Joined from Sellers
  category_id?: number; // Joined from Shows
  category_name?: string; // Joined from Categories
  viewer_count?: number; // Joined from Shows
  notes?: string | null; // Joined from Shows
  url?: string | null; // Joined from Shows
}

export async function getFullGiveawayList() {
  // Joins everything so we can filter by Category/Seller/Show in one go
  return db.prepare(`
    SELECT 
      gs.*, 
      s.title as show_title, 
      sel.username as seller_name,
      c.id as category_id,
      c.name as category_name,
      s.viewer_count as viewer_count,
      s.notes as notes,
      s.url as url
    FROM GiveawayState gs
    JOIN Shows s ON gs.show_id = s.id
    JOIN Sellers sel ON s.seller_id = sel.id
    LEFT JOIN Categories c ON s.category_id = c.id
  `).all() as Giveaway[];
}

export async function getFilteredGiveaways(filters: {
  sellerName?: string,
  categoryId?: number | string,
  minViewers?: number,
  maxViewers?: number
}) {
  let query = `
    SELECT 
      gs.*, 
      s.title as show_title, 
      sel.username as seller_name,
      c.id as category_id,
      c.name as category_name,
      s.viewer_count as viewer_count,
      s.notes as notes,
      s.url as url
    FROM GiveawayState gs
    JOIN Shows s ON gs.show_id = s.id
    JOIN Sellers sel ON s.seller_id = sel.id
    LEFT JOIN Categories c ON s.category_id = c.id
    WHERE 1=1
  `;

  const params: any[] = [];

  if (filters.sellerName) {
    query += ` AND sel.username = ?`;
    params.push(filters.sellerName);
  }

  if (filters.categoryId) {
    query += ` AND c.id = ?`;
    params.push(Number(filters.categoryId));
  }

  if (filters.minViewers !== undefined && filters.minViewers !== null) {
    query += ` AND s.viewer_count >= ?`;
    params.push(filters.minViewers);
  }

  if (filters.maxViewers !== undefined && filters.maxViewers !== null) {
    query += ` AND s.viewer_count <= ?`;
    params.push(filters.maxViewers);
  }

  query += ` ORDER BY gs.remaining_ms ASC`;

  return db.prepare(query).all(...params) as Giveaway[];
}

export async function addGiveaway(showId: number, isContinuous = false) {
  db.prepare("INSERT INTO GiveawayState (show_id, status, remaining_ms, is_continuous) VALUES (?, 'IDLE', 300000, ?)").run(showId, isContinuous ? 1 : 0);
  revalidatePath('/'); // This forces the server to re-fetch data
}

export async function deleteGiveaway(id: number) {
  db.prepare('DELETE FROM GiveawayState WHERE id = ?').run(id);
  revalidatePath('/');
}

// export async function updateGiveaway(id: number, data: any) {
//   // Simple dynamic updater for status, end_time, etc.
//   const keys = Object.keys(data).map(k => `${k} = ?`).join(', ');
//   db.prepare(`UPDATE GiveawayState SET ${keys} WHERE id = ?`).run(...Object.values(data), id);
//   revalidatePath('/');
// }

export async function updateGiveaway(id: number, data: any) {
  // 1. Define trusted columns for GiveawayState
  const allowedColumns = ['status', 'remaining_ms', 'end_time', 'is_continuous'];
  
  const updates: string[] = [];
  const values: any[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (allowedColumns.includes(key) && value !== undefined) {
      updates.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (updates.length === 0) return;

  db.prepare(`UPDATE GiveawayState SET ${updates.join(', ')} WHERE id = ?`).run(...values, id);
  revalidatePath('/');
}