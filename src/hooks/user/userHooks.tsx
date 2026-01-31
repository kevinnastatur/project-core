"use client";

import { useEffect } from "react";

import { useUserStore } from "@/stores/useUserStore";
import { UserTypes } from "@/types/auth";
import { getUser } from "@/services/Auth";

export default function useUserHook() {
  const { user, setUser } = useUserStore();

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await getUser();
        if (response?.data) {
          setUser(response.data as UserTypes);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    getUserProfile();
  }, [setUser]);

  return { user };
}
