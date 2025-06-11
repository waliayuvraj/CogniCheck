// API route for /api/users/[id] (PUT, can add GET, DELETE)
import type { User } from '../../../types/user';
import { dbPromise } from '../../../lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  const db = await dbPromise;
  // Extract the id from the URL
  const id = req.nextUrl.pathname.split('/').pop();
  const body = await req.json();
  const idx = db.data.users.findIndex(u => u.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  db.data.users[idx] = { ...db.data.users[idx], ...body };
  await db.write();
  return NextResponse.json(db.data.users[idx]);
} 