import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetch(`${API_BASE_URL}/api/v1/auth/request-password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: body.email }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('BFF forgot-password error:', error);
    return NextResponse.json(
      { success: false, message: 'Request failed', data: null },
      { status: 500 }
    );
  }
}
