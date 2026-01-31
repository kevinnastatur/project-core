"use client";

import { create } from "zustand";

interface SidebarState {
  show: boolean;
  initialized: boolean;
  toggle: () => void;
  setShow: (value: boolean) => void;
  initFromDevice: () => void;
  closeOnMobileRouteChange: () => void;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  show: true,
  initialized: false,

  toggle: () => {
    const next = !get().show;
    localStorage.setItem("sidebar-show", String(next));
    set({ show: next });
  },

  setShow: (value) => {
    localStorage.setItem("sidebar-show", String(value));
    set({ show: value });
  },

  initFromDevice: () => {
    if (get().initialized) return;

    const saved = localStorage.getItem("sidebar-show");

    if (saved !== null) {
      set({
        show: saved === "true",
        initialized: true,
      });
      return;
    }

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    set({
      show: isDesktop,
      initialized: true,
    });

    localStorage.setItem("sidebar-show", String(isDesktop));
  },

  closeOnMobileRouteChange: () => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    if (!isDesktop) {
      set({ show: false });
      localStorage.setItem("sidebar-show", "false");
    }
  },
}));
