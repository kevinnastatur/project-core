// src/app/dashboard/layout.tsx
"use client";

import ToastProvider from "@/components/ui/toast/ToastProvider";
import { ReactNode, Suspense } from "react";
import { Toaster } from "sonner";
import TabPersonalData from "@/components/user/personaldata/TabPersonalData";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full">
      <ToastProvider />
      <Toaster position="top-right" richColors />

      <Suspense fallback={null}>
        <TabPersonalData />
      </Suspense>

      {children}
    </div>
  );
}
