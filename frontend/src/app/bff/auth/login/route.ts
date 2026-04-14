import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
const ACCESS_TOKEN_COOKIE = process.env.ACCESS_TOKEN_COOKIE_NAME || 'hr_access_token';
const REFRESH_TOKEN_COOKIE = process.env.REFRESH_TOKEN_COOKIE_NAME || 'hr_refresh_token';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!data.success) {
      return NextResponse.json(data, { status: res.status });
    }

    const { accessToken, refreshToken } = data.data;

    // Decode JWT to get user info, then fetch profile
    let sessionUser = null;
    try {
      const profileRes = await fetch(`${API_BASE_URL}/api/v1/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const profileData = await profileRes.json();
      if (profileData.success) {
        sessionUser = {
          id: profileData.data.id,
          name: profileData.data.name,
          email: profileData.data.email,
          avatar: profileData.data.avatar,
          role: profileData.data.role || null,
        };
      }
    } catch {
      // If profile fetch fails, decode minimal info from JWT
      try {
        const secret = new TextEncoder().encode(process.env.COOKIE_SECRET || 'fallback');
        const { payload } = await jwtVerify(accessToken, secret).catch(() => ({ payload: { sub: 0 } }));
        sessionUser = { id: payload.sub, name: null, email: body.email, avatar: null, role: null };
      } catch {
        sessionUser = { id: 0, name: null, email: body.email, avatar: null, role: null };
      }
    }

    const response = NextResponse.json({
      success: true,
      message: data.message,
      data: sessionUser,
    });

    // Set httpOnly cookies
    response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });

    response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('BFF login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', data: null },
      { status: 500 }
    );
  }
}
