import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { JSONFilePreset } from 'lowdb/node';

// Define the type for a user
interface UserData {
  id: string;
  name: string;
  sex: string;
  month: string;
  day: string;
  year: string;
  countryCode: string;
  phone: string;
  createdAt: string;
}

// DB setup
const dbFile = join(process.cwd(), 'users.json');
const dbPromise = JSONFilePreset<{ users: UserData[] }>(dbFile, { users: [] });

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const db = await dbPromise;
  const id = params.id;
  const body = await req.json();
  const idx = db.data.users.findIndex(u => u.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  db.data.users[idx] = { ...db.data.users[idx], ...body };
  await db.write();
  return NextResponse.json(db.data.users[idx]);
} 