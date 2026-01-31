"use server";

import { WarrantyRegisterData } from "@/types/warranty";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getWarrantyIndex = async (
  page: number,
  perpage: number,
  status?: number
) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  let query = `?page=${page}&perpage=${perpage}`;
  if (status !== undefined) {
    query += `&status=${status}`;
  }

  const res = await fetch(`${BASE_URL}/warranty/customer/index${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to get warranties");
  }

  return res.json();
};

export const WarrantyRegister = async (data: WarrantyRegisterData) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      throw new Error("Unauthorized: token not found");
    }

    const formData = new FormData();

    formData.append("brand", data.brand);
    formData.append("model", data.model);
    formData.append("plate_number", data.plate_number);
    formData.append("odometer", data.odometer);

    formData.append("store_id", String(data.store_id));
    formData.append("purchase_date", data.purchase_date);
    formData.append("invoice_number", data.invoice_number);

    formData.append("invoice", data.invoice);
    formData.append("image_odometer", data.image_odometer);

    // append tires array
    data.tires.forEach((tire, index) => {
      formData.append(`tires[${index}][tire_type]`, tire.tire_type);
      formData.append(`tires[${index}][tire_size]`, tire.tire_size);
      formData.append(`tires[${index}][barcode]`, tire.barcode);
      formData.append(`tires[${index}][tire_number]`, tire.tire_number);
    });

    const res = await fetch(`${BASE_URL}/warranty/customer/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to register: ${errorText}`);
    }

    return res.json();
  } catch (err) {
    console.error("WarrantyRegister error:", err);
    throw err;
  }
};

export const getWarrantyDetail = async (id: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const res = await fetch(`${BASE_URL}/warranty/customer/detail/${id}`, {
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

export const UpdateWarranty = async (id: number, formData: FormData) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) throw new Error("Unauthorized: token not found");

    const res = await fetch(`${BASE_URL}/warranty/customer/update/${id}`, {
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

export const getStore = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const res = await fetch(`${BASE_URL}/auth/store`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to get store");
  }

  return res.json();
};

export const getBrand = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const res = await fetch(`${BASE_URL}/auth/brand`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to get brand");
  }

  return res.json();
};

export const getType = async (brandId: number) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const res = await fetch(`${BASE_URL}/auth/type/${brandId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to get type");
  }

  return res.json();
};
