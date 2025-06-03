import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { JSONFilePreset } from 'lowdb/node';

// Define the type for a response
interface ResponseData {
  id: string;
  name: string;
  phone: string;
  email: string;
  occupation: string;
  createdAt: string;
}

// DB setup
const dbFile = join(process.cwd(), 'responses.json');
const dbPromise = JSONFilePreset<{ responses: ResponseData[] }>(dbFile, { responses: [] });

export async function GET() {
  const db = await dbPromise;
  return NextResponse.json(db.data.responses);
}

export async function POST(req: NextRequest) {
  const db = await dbPromise;
  const body = await req.json();
  const newResponse: ResponseData = {
    id: Math.random().toString(36).slice(2),
    name: body.name,
    phone: body.phone,
    email: body.email,
    occupation: body.occupation,
    createdAt: new Date().toISOString(),
  };
  db.data.responses.push(newResponse);
  await db.write();
  return NextResponse.json(newResponse, { status: 201 });
} 