import { NextRequest, NextResponse } from 'next/server';

// Admin password - in production this should be stored in env/database
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    if (password === ADMIN_PASSWORD) {
      // Generate a simple session token (in production use JWT or proper session)
      const token = Buffer.from(`madaq-admin-${Date.now()}`).toString('base64');
      return NextResponse.json({
        success: true,
        data: { token, authenticated: true },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Incorrect password' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}
