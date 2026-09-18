import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/server/db';
import { UserProfile } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, company } = body;

    if (!username || !email) {
      return NextResponse.json(
        { success: false, message: 'Username and email are required' },
        { status: 400 }
      );
    }

    const db = readDatabase();
    const cleanEmail = email.trim().toLowerCase();

    const existing = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists.' },
        { status: 400 }
      );
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      username: username.trim(),
      email: cleanEmail,
      role: 'user',
      status: 'active',
      company: company || 'Enterprise Client',
      createdAt: new Date().toISOString().split('T')[0],
      twoFactorEnabled: false,
      themePreference: 'dark',
    };

    db.users.push(newUser);
    writeDatabase(db);

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
