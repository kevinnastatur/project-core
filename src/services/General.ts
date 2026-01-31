"use server";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getPromoIndexCustomer = async (page: number, perpage: number) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const res = await fetch(
    `${BASE_URL}/overview/customer/promo?page=${page}&perpage=${perpage}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get promos");
  }

  return res.json();
};

export const getBannerIndexCustomer = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const res = await fetch(`${BASE_URL}/overview/customer/banner`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to get banners");
  }

  return res.json();
};

// NOTIF
export const getNotifIndexCustomer = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const res = await fetch(`${BASE_URL}/customer/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to get notifications");
  }

  return res.json();
};
