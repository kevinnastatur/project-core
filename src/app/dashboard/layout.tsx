// src/app/dashboard/layout.tsx
"use client";
import BannerCTA from "@/components/ui/cta";
import ToastProvider from "@/components/ui/toast/ToastProvider";
import Footer from "@/components/user/Footer";
import Navbar from "@/components/user/Navbar";
import NavbarMobile from "@/components/user/NavbarMobile";
import { ReactNode, Suspense } from "react";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useUserStore } from "@/stores/useUserStore";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { fetchUser, user } = useUserStore();

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);
  return (
    <div className="h-full  min-h-screen">
      {/* Navbar Desktop */}
      <div className="sticky top-0 z-50 ">
        <Suspense fallback={<div />}>
          <Navbar />
        </Suspense>
      </div>

      {/* Main Content */}
      <main className=" w-full 2xl:max-w-480 mx-auto pb-0 ">
        <ToastProvider />
        <Toaster position="top-right" richColors />
        {children}
      </main>
      <div className="pb-30 lg:pb-5">
        <BannerCTA />
        <Footer />
      </div>

      {/* Navbar Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <NavbarMobile />
      </div>
    </div>
  );
}
