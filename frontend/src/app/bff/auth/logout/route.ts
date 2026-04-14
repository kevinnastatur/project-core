import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
const ACCESS_TOKEN_COOKIE = process.env.ACCESS_TOKEN_COOKIE_NAME || 'hr_access_token';
const REFRESH_TOKEN_COOKIE = process.env.REFRESH_TOKEN_COOKIE_NAME || 'hr_refresh_token';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    if (refreshToken) {
      try {
        await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: refreshToken }),
        });
      } catch {
        // Best-effort logout on Express side
      }
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
      data: null,
    });

    response.cookies.delete(ACCESS_TOKEN_COOKIE);
    response.cookies.delete(REFRESH_TOKEN_COOKIE);

    return response;
  } catch (error) {
    console.error('BFF logout error:', error);
    const response = NextResponse.json(
      { success: true, message: 'Logged out', data: null }
    );
    response.cookies.delete(ACCESS_TOKEN_COOKIE);
    response.cookies.delete(REFRESH_TOKEN_COOKIE);
    return response;
  }
}
