// API route for /api/users (GET, POST)
import { dbPromise } from '../../../lib/db';
import { NextRequest, NextResponse } from 'next/server';
import type { User } from '../../../types/user';

export async function GET() {
  const db = await dbPromise;
  return NextResponse.json(db.data.users);
}

export async function POST(req: NextRequest) {
  const db = await dbPromise;
  const body = await req.json();
  const newUser: User = {
    id: Math.random().toString(36).slice(2),
    name: body.name,
    sex: body.sex,
    month: body.month,
    day: body.day,
    year: body.year,
    countryCode: body.countryCode,
    phone: body.phone,
    createdAt: new Date().toISOString(),
  };
  db.data.users.push(newUser);
  await db.write();
  return NextResponse.json(newUser, { status: 201 });
}

// Handle PUT /api/users/[id] for updating a user
export async function PUT(req: NextRequest) {
  const db = await dbPromise;
  const url = req.nextUrl.pathname;
  const match = url.match(/\/api\/users\/(.+)$/);
  if (!match) {
    return NextResponse.json({ error: 'User ID not found in URL' }, { status: 400 });
  }
  const id = match[1];
  const body = await req.json();
  const idx = db.data.users.findIndex(u => u.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  // Update user fields
  db.data.users[idx] = { ...db.data.users[idx], ...body };
  await db.write();
  return NextResponse.json(db.data.users[idx]);
} 