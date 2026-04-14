import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
const ACCESS_TOKEN_COOKIE = process.env.ACCESS_TOKEN_COOKIE_NAME || 'hr_access_token';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const endpoint = body._endpoint as string;

    if (!endpoint) {
      return NextResponse.json(
        { success: false, message: 'Missing _endpoint', data: null },
        { status: 400 }
      );
    }

    const { _endpoint, ...payload } = body;

    const res = await fetch(`${API_BASE_URL}/api/v1/auth/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('BFF auth action error:', error);
    return NextResponse.json(
      { success: false, message: 'Request failed', data: null },
      { status: 500 }
    );
  }
}
