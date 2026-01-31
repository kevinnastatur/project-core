"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export type WarrantyItem = {
  id: number;
  user_id: number;
  warranty_code: string;
  brand: string;
  model: string;
  plate_number: string;
  odometer: string;
  store_name: string;
  purchase_date: string;
  invoice_number: string;
  status: number;
  created_at: string;
};

export const getWarrantyMasterDataIndex = async (
  page: number,
  perpage: number,
  status: number | "",
  search: string
) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const res = await fetch(
    `${BASE_URL}/warranty/principal/master-data?page=${page}&perpage=${perpage}&status=${status}&search=${search}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get warranties");
  }

  return res.json();
};

export const getWarrantyMasterDataStats = async (period: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const res = await fetch(
    `${BASE_URL}/warranty/principal/stats?period=${period}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get warranties");
  }

  return res.json();
};

export const getWarrantyDetailPrincipal = async (id: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const res = await fetch(`${BASE_URL}/warranty/principal/detail/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to get warranty detail");
  }

  return res.json();
};

export const UpdateWarrantyRegisterPrincipal = async (
  id: number,
  formData: FormData
) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) throw new Error("Unauthorized: token not found");

    const res = await fetch(`${BASE_URL}/warranty/principal/update/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to update warranty: ${errorText}`);
    }

    return res.json();
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
