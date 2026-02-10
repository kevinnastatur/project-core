// src/app/api/export/master-data/route.ts
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/warranty/principal/master-data-export`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok || !res.body) {
    return new Response("Failed to export", { status: 500 });
  }

  return new Response(res.body, {
    headers: {
      "Content-Type":
        res.headers.get("content-type") || "application/octet-stream",
      "Content-Disposition":
        res.headers.get("content-disposition") ||
        'attachment; filename="master-data"',
    },
  });
}
