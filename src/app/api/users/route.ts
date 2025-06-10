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

export async function GET() {
  const db = await dbPromise;
  return NextResponse.json(db.data.users);
}

export async function POST(req: NextRequest) {
  const db = await dbPromise;
  const body = await req.json();
  const newUser: UserData = {
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