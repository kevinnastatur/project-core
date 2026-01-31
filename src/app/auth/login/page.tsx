"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LoginForm from "@/components/form/LoginForm";
import NotRegisteredComponents from "@/components/user/auth/not-registered";

function Content() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  return (
    <main>
      {status === "not-registered" ? (
        <NotRegisteredComponents />
      ) : (
        <LoginForm />
      )}
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <Content />
    </Suspense>
  );
}
