"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getWarrantyClaimIndex = async (
  page: number,
  perpage: number,
  search: string,
  status?: string
) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const params = new URLSearchParams({
    page: String(page),
    perpage: String(perpage),
  });

  if (search) {
    params.append("search", search);
  }

  if (status !== undefined && status !== "") {
    params.append("status", status);
  }

  const res = await fetch(
    `${BASE_URL}/claim-warranty/principal/index?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get warranty claims");
  }

  return res.json();
};

export const getWarrantyClaimDetail = async (id: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const res = await fetch(
    `${BASE_URL}/claim-warranty/principal/detail/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get warranty claim detail");
  }

  return res.json();
};

export const getWarrantyClaimStats = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const res = await fetch(`${BASE_URL}/claim-warranty/principal/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to get warranty claim stats");
  }

  return res.json();
};

export const updateWarrantyClaimStatus = async (
  id: string,
  data: { note_principal_submission: string; status: string }
) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const formData = new FormData();
  formData.append("note_principal_submission", data.note_principal_submission);
  formData.append("status", data.status);

  const res = await fetch(
    `${BASE_URL}/claim-warranty/principal/update/${id}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update warranty claim status");
  }

  return res.json();
};

export const getRequestBanIndex = async (
  page: number,
  perpage: number,
  search: string,
  status?: string
) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const params = new URLSearchParams({
    page: String(page),
    perpage: String(perpage),
  });

  if (search) {
    params.append("search", search);
  }

  if (status !== undefined && status !== "") {
    params.append("status", status);
  }

  const res = await fetch(
    `${BASE_URL}/request-ban/principal/index?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get request ban data");
  }

  return res.json();
};

export const getRequestBanDetail = async (id: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const res = await fetch(
    `${BASE_URL}/request-ban/principal/detail/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get request ban detail");
  }

  return res.json();
};
