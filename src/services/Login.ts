// src/services/Login.ts
import { setCookie } from "nookies";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const postUserLogin = async (data: {
  email: string;
  password: string;
  cf_turnstile_token: string;
}) => {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("cf_turnstile_token", data.cf_turnstile_token);

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    body: formData,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result?.message || "Login gagal");
  }

  const { token, role } = result;

  if (!token) {
    throw new Error("Token not found");
  }

  setCookie(null, "access_token", token, {
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  setCookie(null, "role", role, {
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return {
    success: true,
    token,
    role,
  };
};
