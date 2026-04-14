import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
const ACCESS_TOKEN_COOKIE = process.env.ACCESS_TOKEN_COOKIE_NAME || 'hr_access_token';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated', data: null },
        { status: 401 }
      );
    }

    const res = await fetch(`${API_BASE_URL}/api/v1/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await res.json();

    if (!data.success) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json({
      success: true,
      message: 'Session active',
      data: {
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        avatar: data.data.avatar,
        role: data.data.role || null,
      },
    });
  } catch (error) {
    console.error('BFF session error:', error);
    return NextResponse.json(
      { success: false, message: 'Session check failed', data: null },
      { status: 500 }
    );
  }
}
