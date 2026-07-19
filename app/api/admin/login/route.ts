/**
 * Admin Login API
 * POST /api/admin/login — Verify admin credentials and set a session cookie
 *
 * Body: { username, password }
 */

import { NextRequest, NextResponse } from 'next/server';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'scrapwala';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'scrapwala@123';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body as { username: string; password: string };

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required', success: false },
        { status: 400 },
      );
    }

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid credentials', success: false },
        { status: 401 },
      );
    }

    // Create a simple session token (hash of credentials + timestamp)
    const token = Buffer.from(`${ADMIN_USERNAME}:${Date.now()}`).toString('base64');

    const response = NextResponse.json({ success: true });

    // Set httpOnly cookie — expires in 24 hours
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    console.log('[Admin Login] Successful login');
    return response;
  } catch (err) {
    console.error('[Admin Login] API error:', err);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 },
    );
  }
}
