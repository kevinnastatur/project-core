// src/app/admin/dashboard/layout.tsx
"use client";

import { Suspense, useEffect } from "react";
import AdminLeftNavbar from "@/components/admin/LeftNavbar";
import AdminNavbar from "@/components/admin/Navbar";
import ToastProvider from "@/components/ui/toast/ToastProvider";
import Footer from "@/components/user/Footer";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { useSidebarStore } from "@/stores/useSidebarStore";
import { usePathname } from "next/navigation";
import TabPersonalDataAdmin from "@/components/admin/dashboard/personaldata/TabPersonalDataAdmin";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const initFromDevice = useSidebarStore((s) => s.initFromDevice);
  const closeOnMobileRouteChange = useSidebarStore(
    (s) => s.closeOnMobileRouteChange
  );

  const pathname = usePathname();

  useEffect(() => {
    initFromDevice();
  }, [initFromDevice]);

  useEffect(() => {
    closeOnMobileRouteChange();
  }, [pathname, closeOnMobileRouteChange]);
  return (
    <div className="h-full  min-h-screen">
      {/* Main Content */}
      <main className=" w-full 2xl:max-w-480 mx-auto pb-0 font-medium min-h-screen h-full">
        <Toaster position="top-right" richColors />
        <ToastProvider />
        <div className="flex items-start">
          <div
            className="w-full lg:w-fit
                fixed lg:sticky
                top-0 left-0
                z-50"
          >
            <AdminLeftNavbar />
          </div>

          <div className="w-full flex flex-col justify-between relative min-h-screen">
            <div className="flex flex-col">
              <div className="sticky top-0 z-30 ">
                <Suspense fallback={<div />}>
                  <AdminNavbar />
                  <TabPersonalDataAdmin />
                </Suspense>
              </div>

              {children}
            </div>

            <div className="md:py-10 flex justify-center w-full  ">
              <Footer />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
