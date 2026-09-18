import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/server/db';
import { UserProfile } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = readDatabase();
    return NextResponse.json({ success: true, count: db.users.length, users: db.users });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, user, userId, updates } = body;
    const db = readDatabase();

    if (action === 'create') {
      const newUser: UserProfile = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        username: user.username,
        email: user.email.toLowerCase(),
        role: user.role || 'user',
        status: user.status || 'active',
        company: user.company || 'Enterprise Workspace',
        createdAt: new Date().toISOString().split('T')[0],
        twoFactorEnabled: false,
      };
      db.users.push(newUser);
      writeDatabase(db);
      return NextResponse.json({ success: true, user: newUser });
    }

    if (action === 'update' && userId) {
      const index = db.users.findIndex((u) => u.id === userId);
      if (index >= 0) {
        db.users[index] = { ...db.users[index], ...updates };
        writeDatabase(db);
        return NextResponse.json({ success: true, user: db.users[index] });
      }
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    if (action === 'delete' && userId) {
      db.users = db.users.filter((u) => u.id !== userId);
      writeDatabase(db);
      return NextResponse.json({ success: true, message: 'User deleted' });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'User operation failed' },
      { status: 500 }
    );
  }
}
