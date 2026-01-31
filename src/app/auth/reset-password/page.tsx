import { Suspense } from "react";
import ResetPasswordForm from "@/components/form/ResetPasswordForm";

export default function AuthResetPasswordPage() {
  return (
    <main>
      <Suspense fallback={<div />}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
