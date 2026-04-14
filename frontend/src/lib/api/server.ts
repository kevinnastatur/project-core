import { cookies } from 'next/headers';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
const ACCESS_TOKEN_COOKIE = process.env.ACCESS_TOKEN_COOKIE_NAME || 'hr_access_token';

// Server-side fetch helper — calls Express directly with auth cookie
export async function serverFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE_URL}/api/v1${path}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(errorData.message || `HTTP ${res.status}`);
  }

  return res.json();
}
