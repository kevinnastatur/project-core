import { create } from "zustand";
import { UserTypes } from "@/types/auth";
import { getUser } from "@/services/Auth";

interface UserState {
  user: UserTypes | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  setUser: (user: UserTypes) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),

  fetchUser: async () => {
    try {
      const res = await getUser();
      if (res?.data) {
        set({ user: res.data, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    } catch {
      set({ user: null, loading: false });
    }
  },
}));
