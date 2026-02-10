"use client";

import GeneralInput from "@/components/ui/GeneralInput";
import Image from "next/image";
import {
  TireItem,
  useWarrantyStore,
} from "@/stores/useWarrantyRegistrationStore";
import ActionLinkPrevGrey from "@/components/ui/button/ActionLinkPrevGrey";
import BarcodeScanInput from "@/components/ui/BarcodeScanInput";
import ButtonSubmit from "@/components/ui/button/ButtonSubmit";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { WarrantyRegister } from "@/services/Warranty";
import { showErrorToast, showSuccessToast } from "@/helper/toastHelper";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import SubmitOverlay from "./Pop-up";
import SearchableDropdown from "@/components/ui/SearchableDropdown";

export default function WarrantyRegistrationStep3() {
  const router = useRouter();
  const { tires, addTire, updateTire, removeTire, resetForm } =
    useWarrantyStore();
  const state = useWarrantyStore();

  const [loading, setLoading] = useState(false);

  const [showSubmitOverlay, setShowSubmitOverlay] = useState(false);

  const handleSubmit = async () => {
    const showErrorAndRedirect = (message: string) => {
      toast.error(message);
      setTimeout(() => {
        window.location.href = "/dashboard/tire-warranty/registration?step=1";
      }, 3000);
    };

    if (!state.odometerImage || !(state.odometerImage instanceof File)) {
      showErrorAndRedirect("Upload foto odometer terlebih dahulu");
      return;
    }

    if (!state.invoice || !(state.invoice instanceof File)) {
      showErrorAndRedirect("Upload invoice terlebih dahulu");
      return;
    }
    try {
      setShowSubmitOverlay(false);
      setLoading(true);
      const tires = state.tires.map((t) => ({
        tire_type: t.tirestype,
        tire_size: t.tiresize,
        barcode: t.tirebarcode,
        tire_number: t.tiredotnumber,
      }));

      const payload = {
        brand: state.brand,
        model: state.type,
        plate_number: state.carNumber,
        odometer: state.odometer,
        store_id: state.store_id,
        purchase_date: state.purchaseDate,
        invoice_number: state.invoiceNumber,
        invoice: state.invoice as File,
        image_odometer: state.odometerImage as File,
        tires: tires,
      };
      //@ts-ignore
      const response = await WarrantyRegister(payload);
      if (response.success === true) {
        setTimeout(() => {
          showSuccessToast(
            "Pendaftaran Garansi Ban Berhasil",
            `Tim Dunlop akan melakukan verifikasi dokumen Anda. Kami akan memberitahu anda segera.`
          );
          router.push("/dashboard/tire-warranty/status");
        }, 3000);
        resetForm();
        setLoading(false);
        localStorage.setItem("tire-warranty-form", "");
        return;
      }
    } catch (err) {
      console.error("Error registering warranty:", err);
      showErrorToast(
        "Periksa Jaringan Internet Anda",
        "Perubahan Status Registrasi Gagal! Sepertinya jaringan Anda bermasalah, Periksa kembali jaringan anda lalu submit kembali."
      );
      setShowSubmitOverlay(false);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    tires.length >= 0 &&
    tires.every(
      (tire) =>
        tire.tirestype.trim() !== "" &&
        tire.tiresize.trim() !== "" &&
        tire.tirebarcode.trim() !== "" &&
        tire.tiredotnumber.trim() !== ""
    );

  const isTireComplete = (tire: TireItem) => {
    return (
      tire.tirestype.trim() !== "" &&
      tire.tiresize.trim() !== "" &&
      tire.tirebarcode.trim() !== "" &&
      tire.tiredotnumber.trim() !== ""
    );
  };

  return (
    <>
      <LoadingOverlay show={loading} />
      <SubmitOverlay show={showSubmitOverlay} />
      <div className="flex flex-col gap-5 font-bold text-sm xl:text-base relative">
        <div className="flex flex-col gap-3 w-full h-full">
          <p>Informasi Ban</p>

          <div className="flex flex-col w-full gap-5 p-5 bg-secondary rounded-lg border border-input-border">
            {/* ===== BANNER ===== */}
            <div className="flex flex-col lg:flex-row items-center gap-5 justify-between">
              <div className="w-full h-40 flex relative bg-secondary rounded-lg">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/warranty/tyre-barcode.png`}
                  alt="barcode"
                  width={9999}
                  height={9999}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/70 to-transparent/25 rounded-lg" />
                <div className="absolute bottom-5 left-5 z-10">
                  <p className="text-lg">Tire Barcode</p>
                  <p className="text-xs text-input-placeholder w-[60%]">
                    Temukan Barcode Pada Salah Satu Sisi Ban Lalu Scan Untuk
                    Mendaftarkan Ban
                  </p>
                </div>
              </div>

              <div className="w-full h-40 flex relative bg-secondary rounded-lg">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/warranty/tyre-dot.png`}
                  alt="dot"
                  width={9999}
                  height={9999}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/70 to-transparent/25 rounded-lg" />
                <div className="absolute bottom-5 left-5 z-10">
                  <p className="text-lg">Tire DOT Number</p>
                  <p className="text-xs text-input-placeholder w-[60%]">
                    Temukan Tire DOT Number Pada Salah Satu Sisi Ban Lalu Scan
                    Untuk Mendaftarkan Ban
                  </p>
                </div>
              </div>
            </div>

            {/* ===== INFO ===== */}
            <div className="bg-input-border p-5 rounded-lg text-center text-primary">
              Minimal 2 Ban dan Maksimal 5 Ban untuk pendaftaran garansi.
            </div>

            {/* ===== TIRES FORM ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {tires.map((tire, index) => {
                const isDisabled =
                  index !== 0 && !isTireComplete(tires[index - 1]);

                return (
                  <div key={index}>
                    <p>Data Ban {index + 1}</p>

                    <div className="flex flex-col gap-5 mt-5 border border-input-border rounded-lg p-5">
                      <SearchableDropdown
                        label="Tipe Ban"
                        name="tirestype"
                        value={tire.tirestype}
                        disabled={isDisabled}
                        options={[
                          {
                            label: "BLUE RESPONSE TG",
                            value: "BLUE RESPONSE TG",
                          },
                        ]}
                        onChange={(val) => updateTire(index, "tirestype", val)}
                      />

                      <SearchableDropdown
                        name="tiresize"
                        label="Ukuran Ban"
                        value={tire.tiresize}
                        disabled={isDisabled}
                        placeholder="Masukkan Ukuran Ban"
                        options={[
                          { label: "185/55R15", value: "185/55R15" },
                          { label: "185/55R16", value: "185/55R16" },
                          { label: "185/65R15", value: "185/65R15" },

                          { label: "195/45R16", value: "195/45R16" },
                          { label: "195/50R16", value: "195/50R16" },
                          { label: "195/55R16", value: "195/55R16" },
                          { label: "195/60R16", value: "195/60R16" },
                          { label: "195/65R15", value: "195/65R15" },

                          { label: "205/45R17", value: "205/45R17" },
                          { label: "205/50R17", value: "205/50R17" },
                          { label: "205/55R16", value: "205/55R16" },
                          { label: "205/55R17", value: "205/55R17" },
                          { label: "205/60R16", value: "205/60R16" },
                          { label: "205/65R15", value: "205/65R15" },
                          { label: "205/65R16", value: "205/65R16" },
                          { label: "205/70R15", value: "205/70R15" },

                          { label: "215/45R17", value: "215/45R17" },
                          { label: "215/50R17", value: "215/50R17" },
                          { label: "215/55R17", value: "215/55R17" },
                          { label: "215/60R17", value: "215/60R17" },
                          { label: "215/65R16", value: "215/65R16" },
                          { label: "215/70R15", value: "215/70R15" },

                          { label: "225/40R18", value: "225/40R18" },
                          { label: "225/45R18", value: "225/45R18" },
                          { label: "225/50R17", value: "225/50R17" },
                          { label: "225/50R18", value: "225/50R18" },
                          { label: "225/55R17", value: "225/55R17" },
                          { label: "225/55R18", value: "225/55R18" },
                          { label: "225/60R18", value: "225/60R18" },

                          { label: "235/45R18", value: "235/45R18" },
                          { label: "235/50R18", value: "235/50R18" },
                          { label: "235/55R18", value: "235/55R18" },
                          { label: "235/55R19", value: "235/55R19" },
                          { label: "235/60R18", value: "235/60R18" },
                        ]}
                        onChange={(val) => updateTire(index, "tiresize", val)}
                        required
                      />

                      <BarcodeScanInput
                        name="tirebarcode"
                        label="Kode Barcode Ban"
                        required
                        disabled={isDisabled}
                        value={tire.tirebarcode}
                        onChange={(value) =>
                          updateTire(index, "tirebarcode", value ?? "")
                        }
                      />

                      <GeneralInput
                        name="tiredotnumber"
                        label="DOT Tire Number"
                        value={tire.tiredotnumber}
                        disabled={isDisabled}
                        placeholder="Masukkan DOT Tire Number"
                        maxLength={8}
                        required
                        reddot
                        onChange={(e) =>
                          updateTire(index, "tiredotnumber", e.target.value)
                        }
                        className="uppercase"
                      />

                      {tires.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeTire(index)}
                          className="text-red-500 text-sm self-end"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {tires.length < 5 && (
              <button
                type="button"
                onClick={addTire}
                className="border border-dashed border-primary text-primary rounded-lg py-3 mt-5 hover:bg-primary/10 transition"
              >
                + Tambah Data Ban
              </button>
            )}
          </div>
        </div>

        {/* ===== ACTIONS ===== */}
        <div className="flex flex-col-reverse md:flex-row gap-5">
          <ActionLinkPrevGrey
            href="/dashboard/tire-warranty/registration?step=2"
            label="Kembali"
            className="w-full flex justify-center"
          />
          <ButtonSubmit
            label="Submit Pendaftaran Garansi"
            disabled={!isFormValid}
            onClick={() => setShowSubmitOverlay(true)}
          />
          <SubmitOverlay show={showSubmitOverlay} onClick={handleSubmit} />
        </div>
      </div>
    </>
  );
}
