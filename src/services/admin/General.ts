"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// BANNER
export const getBannerIndex = async (
  page: number,
  perpage: number,
  search: string,
  status?: 0 | 1
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

  if (status !== undefined) {
    params.append("status", String(status));
  }

  const res = await fetch(
    `${BASE_URL}/banner/principal/index?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get banners");
  }

  return res.json();
};

export const DetailBannerPrincipal = async (id: number) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const res = await fetch(`${BASE_URL}/banner/principal/detail/${id}`, {
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
export const CreateBannerPrincipal = async (formData: FormData) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) throw new Error("Unauthorized: token not found");

    const res = await fetch(`${BASE_URL}/banner/principal/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to create banner: ${errorText}`);
    }

    return res.json();
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
export const UpdateBannerPrincipal = async (formData: FormData, id: number) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) throw new Error("Unauthorized: token not found");

    const res = await fetch(`${BASE_URL}/banner/principal/update/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to create banner: ${errorText}`);
    }

    return res.json();
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
export const DeleteBannerPrincipal = async (id: number) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) throw new Error("Unauthorized: token not found");

    const res = await fetch(`${BASE_URL}/banner/principal/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to create banner: ${errorText}`);
    }

    return res.json();
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

// PROMO

export const getPromoIndex = async (
  page: number,
  perpage: number,
  search: string,
  status?: 0 | 1
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

  if (status !== undefined) {
    params.append("status", String(status));
  }

  const res = await fetch(
    `${BASE_URL}/promo/principal/index?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get promo");
  }

  return res.json();
};
export const DetailPromoPrincipal = async (id: number) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const res = await fetch(`${BASE_URL}/promo/principal/detail/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to get promo");
  }

  return res.json();
};
export const CreatePromoPrincipal = async (formData: FormData) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) throw new Error("Unauthorized: token not found");

    const res = await fetch(`${BASE_URL}/promo/principal/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to create promo: ${errorText}`);
    }

    return res.json();
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
export const UpdatePromoPrincipal = async (formData: FormData, id: number) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) throw new Error("Unauthorized: token not found");

    const res = await fetch(`${BASE_URL}/promo/principal/update/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to create promo: ${errorText}`);
    }

    return res.json();
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
export const DeletePromoPrincipal = async (id: number) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) throw new Error("Unauthorized: token not found");

    const res = await fetch(`${BASE_URL}/promo/principal/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to create promo: ${errorText}`);
    }

    return res.json();
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

// NOTIF
export const getNotifIndex = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const res = await fetch(`${BASE_URL}/principal/notifications`, {
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

export const updateNotif = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) throw new Error("Unauthorized: token not found");

    const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(` Failed to update notification: `);
    }

    return res.json();
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
