import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sellers = db.prepare('SELECT * FROM sellers').all();
    return NextResponse.json(sellers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}