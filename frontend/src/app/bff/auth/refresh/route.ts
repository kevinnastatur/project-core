import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
const ACCESS_TOKEN_COOKIE = process.env.ACCESS_TOKEN_COOKIE_NAME || 'hr_access_token';
const REFRESH_TOKEN_COOKIE = process.env.REFRESH_TOKEN_COOKIE_NAME || 'hr_refresh_token';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: 'No refresh token', data: null },
        { status: 401 }
      );
    }

    const res = await fetch(`${API_BASE_URL}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();

    if (!data.success) {
      const response = NextResponse.json(data, { status: res.status });
      response.cookies.delete(ACCESS_TOKEN_COOKIE);
      response.cookies.delete(REFRESH_TOKEN_COOKIE);
      return response;
    }

    const { accessToken } = data.data;

    const response = NextResponse.json({
      success: true,
      message: 'Token refreshed',
      data: null,
    });

    response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('BFF refresh error:', error);
    return NextResponse.json(
      { success: false, message: 'Token refresh failed', data: null },
      { status: 500 }
    );
  }
}
