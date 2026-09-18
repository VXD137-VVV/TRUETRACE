import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/server/db';
import { UserProfile } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, role = 'user' } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = readDatabase();

    // Check for admin login
    if (role === 'admin') {
      if (cleanEmail === 'admin@truetrace.io' || cleanEmail === 'admin@example.com') {
        const adminUser = db.users.find((u) => u.role === 'admin') || db.users[0];
        return NextResponse.json({ success: true, user: adminUser, role: 'admin' });
      }

      const foundAdmin = db.users.find((u) => u.email.toLowerCase() === cleanEmail && u.role === 'admin');
      if (foundAdmin) {
        if (foundAdmin.status === 'suspended') {
          return NextResponse.json({ success: false, message: 'Admin account suspended' }, { status: 403 });
        }
        return NextResponse.json({ success: true, user: foundAdmin, role: 'admin' });
      }

      return NextResponse.json(
        { success: false, message: 'Unauthorized. Account does not have admin privileges.' },
        { status: 401 }
      );
    }

    // Normal User Login
    let found = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      // Auto-register clean user session
      const namePart = cleanEmail.split('@')[0];
      const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      found = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        username: capitalized,
        email: cleanEmail,
        role: 'user',
        status: 'active',
        company: 'Standard Workspace',
        createdAt: new Date().toISOString().split('T')[0],
        twoFactorEnabled: false,
        themePreference: 'dark',
      };
      db.users.push(found);
      writeDatabase(db);
    }

    if (found.status === 'suspended') {
      return NextResponse.json({ success: false, message: 'Account is suspended' }, { status: 403 });
    }

    return NextResponse.json({ success: true, user: found, role: found.role });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Login failed' },
      { status: 500 }
    );
  }
}
