/**
 * Admin Login API
 * POST /api/admin/login — Verify admin credentials and set a session cookie
 *
 * Body: { username, password }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('Admin Login');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: NextRequest) {
  try {
    // Fail closed: if credentials aren't configured, deny all logins
    const adminUsername = process.env.ADMIN_USERNAME || ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD || ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      logger.error('Admin credentials not configured in environment variables');
      return NextResponse.json(
        { error: 'Admin login is not configured', success: false },
        { status: 503 },
      );
    }

    const body = await request.json();
    const { username, password } = body as { username: string; password: string };

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required', success: false },
        { status: 400 },
      );
    }

    if (username !== adminUsername || password !== adminPassword) {
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
