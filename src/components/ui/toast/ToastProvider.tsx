"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "8px",
          padding: "12px 16px",
          fontSize: "14px",
        },
      }}
    />
  );
}
