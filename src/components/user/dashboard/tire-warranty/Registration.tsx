"use client";
import ActionLinkPrev from "@/components/ui/button/ActionLinkPrev";
import ButtonClose from "@/components/ui/button/ButtonClose";
import { useState } from "react";
import "animate.css";
import WarrantyRegistrationStep1 from "./registration/step-1";
import { useRouter, useSearchParams } from "next/navigation";
import WarrantyRegistrationStep2 from "./registration/step-2";
import WarrantyRegistrationStep3 from "./registration/step-3";
import { FaCheck } from "react-icons/fa";

export default function RegistrationTireWarranty() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = searchParams.get("step");
  const [alertTop, setAlertTop] = useState(true);
  const currentStep = Number(searchParams.get("step") ?? 1);
  const getStepStatus = (stepIndex: number, currentStep: number) => {
    const step = stepIndex + 1;

    if (step < currentStep) return "done";
    if (step === currentStep) return "active";
    return "inactive";
  };

  return (
    <div className="flex flex-col gap-5 w-full p-5 text-white min-h-125 ">
      {/* top */}
      <div className="flex flex-col gap-5">
        <ActionLinkPrev
          href="/dashboard/tire-warranty/status"
          label="Kembali"
          className="w-fit font-bold"
        />
        <div className="relative flex flex-col md:flex-row md:justify-between md:items-center gap-5 font-bold text-xl xl:text-2xl">
          <p>Daftar Garansi Ban Dunlop</p>
        </div>
        {alertTop && (
          <div className="text-primary bg-secondary p-5 rounded-lg text-sm xl:text-base flex items-center justify-between animate__animated animate__fadeInDown font-bold">
            <p>
              Udah beli ban baru? Jangan lupa daftarin garansinya ya! Cukup isi
              data-data ini, biar garansimu langsung ON dan siap dipakai.
            </p>
            <ButtonClose onClick={() => setAlertTop(false)} />
          </div>
        )}
        <div className="w-full flex justify-center">
          <div className="w-full md:w-[80%] relative">
            <div className="flex items-start md:items-center justify-between font-bold">
              {["01", "02", "03"].map((step, i) => {
                const status = getStepStatus(i, currentStep);

                return (
                  <div key={i} className="flex flex-col items-center flex-1">
                    {/* Circle */}
                    <div
                      className={`
              flex items-center justify-center p-2 rounded-full z-20
              ${
                status === "active"
                  ? "border-primary border-2 bg-background"
                  : status === "done"
                  ? "border-primary bg-primary"
                  : "border-primary border-2 bg-background"
              }
            `}
                    >
                      <div
                        className={`
                h-8 w-8 flex items-center justify-center rounded-full
                ${
                  status === "active"
                    ? "bg-primary text-secondary"
                    : status === "done"
                    ? "bg-primary text-secondary"
                    : "bg-primary text-secondary"
                }
              `}
                      >
                        {status === "done" ? (
                          <FaCheck className="text-sm" />
                        ) : (
                          step
                        )}
                      </div>
                    </div>

                    {/* Label */}
                    <p
                      className={`
              mt-5 text-sm xl:text-base text-center z-20
              ${
                status === "active"
                  ? "text-white"
                  : status === "done"
                  ? "text-primary"
                  : "text-[#6A6A6A]"
              }
            `}
                    >
                      {i === 0 && "Data Diri & Kendaraan Anda"}
                      {i === 1 && "Data Pembelian"}
                      {i === 2 && "Informasi Ban"}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Line Progress */}
            <div className="flex justify-between items-center -mt-21 md:-mt-17 px-[14%] z-0">
              {[1, 2].map((line) => (
                <div
                  key={line}
                  className={`w-full h-0.5 mx-6 ${
                    currentStep > line ? "bg-primary" : "bg-input-placeholder"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* bottom */}
      <div className="flex flex-col gap-5 mt-24">
        {step === "1" && <WarrantyRegistrationStep1 />}
        {step === "2" && <WarrantyRegistrationStep2 />}
        {step === "3" && <WarrantyRegistrationStep3 />}
      </div>
    </div>
  );
}
