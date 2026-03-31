import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Select the giveaway along with the show title and seller username
    const giveaways = db.prepare(`
      SELECT 
        gs.id, 
        gs.end_time, 
        gs.is_continuous, 
        s.title as show_title, 
        sel.username as seller_name
      FROM GiveawayState gs
      JOIN Shows s ON gs.show_id = s.id
      JOIN Sellers sel ON s.seller_id = sel.id
      WHERE gs.end_time > datetime('now') -- Only show active ones
      ORDER BY gs.end_time ASC
    `).all();

    return NextResponse.json(giveaways);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}