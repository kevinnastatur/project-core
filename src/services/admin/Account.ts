"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getAccountStats = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const res = await fetch(`${BASE_URL}/account/principal/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to get account stats");
  }

  return res.json();
};

export const getAccountIndex = async (
  page: number,
  perpage: number,
  search: string,
  is_active?: 0 | 1
) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const params = new URLSearchParams({
    page: String(page),
    perpage: String(perpage),
    search,
  });

  if (is_active !== undefined) {
    params.append("is_active", String(is_active));
  }

  const res = await fetch(
    `${BASE_URL}/account/principal/index?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get account");
  }

  return res.json();
};
export const DetailAccountPrincipal = async (id: number) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const res = await fetch(`${BASE_URL}/account/principal/detail/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to get account");
  }

  return res.json();
};
export const CreateAccountPrincipal = async (formData: FormData) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) throw new Error("Unauthorized");

  const res = await fetch(`${BASE_URL}/account/principal/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
    cache: "no-store",
  });

  const result = await res.json();

  if (!res.ok) {
    return result;
  }

  return result;
};

export const UpdateAccountPrincipal = async (
  formData: FormData,
  id: number
) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) throw new Error("Unauthorized: token not found");

    const res = await fetch(`${BASE_URL}/account/principal/update/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to update account: ${errorText}`);
    }

    return res.json();
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
export const DeleteAccountPrincipal = async (id: number) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) throw new Error("Unauthorized: token not found");

    const res = await fetch(`${BASE_URL}/account/principal/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to delete account: ${errorText}`);
    }

    return res.json();
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
