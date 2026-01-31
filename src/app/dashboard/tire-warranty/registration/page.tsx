import { Suspense } from "react";
import RegistrationTireWarranty from "@/components/user/dashboard/tire-warranty/Registration";

export default function TireWarrantyRegistrationPage() {
  return (
    <main>
      <Suspense fallback={<div />}>
        <RegistrationTireWarranty />
      </Suspense>
    </main>
  );
}
