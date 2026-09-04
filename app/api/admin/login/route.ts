/**
 * Admin Login API
 * POST /api/admin/login — Verify admin credentials and set a session cookie
 *
 * Body: { username, password }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('Admin Login');

export async function POST(request: NextRequest) {
  try {
    // Read credentials dynamically per request with safe fallback defaults
    const expectedUsername = process.env.ADMIN_USERNAME || 'scrapwala';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'scrapwala@123';

    const body = await request.json();
    const { username, password } = body as { username: string; password: string };

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required', success: false },
        { status: 400 },
      );
    }

    if (username !== expectedUsername || password !== expectedPassword) {
      logger.warn('Failed login attempt');
      return NextResponse.json(
        { error: 'Invalid credentials', success: false },
        { status: 401 },
      );
    }

    // Create a session token using crypto-random UUID (not forgeable)
    const token = crypto.randomUUID();

    const response = NextResponse.json({ success: true });

    // Set httpOnly cookie — expires in 24 hours
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    logger.info('Successful login');
    return response;
  } catch (err) {
    logger.error('API error', err);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 },
    );
  }
}
