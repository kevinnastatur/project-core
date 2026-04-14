import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
const ACCESS_TOKEN_COOKIE = process.env.ACCESS_TOKEN_COOKIE_NAME || 'hr_access_token';

async function proxyRequest(request: NextRequest, method: string) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated', data: null },
      { status: 401 }
    );
  }

  // Extract the path segments after /bff/proxy/
  const url = new URL(request.url);
  const proxyPath = url.pathname.replace('/bff/proxy', '');
  const targetUrl = `${API_BASE_URL}/api/v1${proxyPath}${url.search}`;

  const headers: HeadersInit = {
    Authorization: `Bearer ${accessToken}`,
  };

  let body: string | undefined;
  if (method !== 'GET' && method !== 'DELETE') {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(await request.json());
    } else if (contentType.includes('multipart/form-data')) {
      // For file uploads, pass through the form data
      const formData = await request.formData();
      const fetchBody = new FormData();
      formData.forEach((value, key) => fetchBody.append(key, value));
      // Don't set Content-Type for FormData; fetch will auto-set with boundary
      const res = await fetch(targetUrl, { method, headers: { Authorization: `Bearer ${accessToken}` }, body: fetchBody });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } else {
      headers['Content-Type'] = 'application/json';
      try {
        body = JSON.stringify(await request.json());
      } catch {
        body = undefined;
      }
    }
  }

  try {
    const res = await fetch(targetUrl, { method, headers, body });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('BFF proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Proxy request failed', data: null },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest) {
  return proxyRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request, 'DELETE');
}
