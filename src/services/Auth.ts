//src/services/Auth.ts
"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  const res = await fetch(`${BASE_URL}/auth/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/auth/login");
  }

  return res.json();
};

export const UserRegister = async (data: {
  name: string;
  email: string;
  password: string;
  phone: string;
}) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("phone", data.phone);

  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to register");
  }

  return res.json();
};

export const UserForgotPassword = async (data: { email: string }) => {
  const formData = new FormData();

  formData.append("email", data.email);

  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to forgot password");
  }

  return res.json();
};

export const UserResetPassword = async (data: {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}) => {
  const formData = new FormData();

  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("password_confirmation", data.password_confirmation);
  formData.append("token", data.token);

  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to reset password");
  }

  return res.json();
};

type UserEditProfilePayload = {
  name?: string;
  email?: string;
  phone?: string;
};

export const UserEditProfile = async (data: {
  name?: string;
  email?: string;
  phone?: string;
}) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.email) formData.append("email", data.email);
  if (data.phone) formData.append("phone", data.phone);

  const res = await fetch(`${BASE_URL}/auth/user/profile`, {
    method: "PUT",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let errorMessage = "Gagal memperbarui profile";

    try {
      const errorData = await res.json();
      errorMessage = parseApiError(errorData);
    } catch {}

    throw new Error(errorMessage);
  }

  return res.json();
};

export const UserEditPassword = async (data: {
  current_password?: string;
  password?: string;
  password_confirmation?: string;
}) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const formData = new FormData();
  if (data.current_password)
    formData.append("current_password", data.current_password);
  if (data.password) formData.append("password", data.password);
  if (data.password_confirmation)
    formData.append("password_confirmation", data.password_confirmation);

  const res = await fetch(`${BASE_URL}/auth/user/change-password`, {
    method: "PUT",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result?.message || "Gagal memperbarui password gagal");
  }

  return res.json();
};

export const UserResendVerification = async (data: { email: string }) => {
  const formData = new FormData();

  formData.append("email", data.email);

  const res = await fetch(`${BASE_URL}/auth/resend-verification`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to resend verification");
  }

  return res.json();
};
