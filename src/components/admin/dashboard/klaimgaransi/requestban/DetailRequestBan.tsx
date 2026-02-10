"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoCalendarOutline } from "react-icons/io5";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { getRequestBanDetail } from "@/services/admin/WarrantyClaim";
import DisableInput from "@/components/ui/disableinput/GeneralInput";
import DisablePhoneInput from "@/components/ui/disableinput/PhoneInput";
import { showErrorToast, showSuccessToast } from "@/helper/toastHelper";

interface TireData {
  tire_type: string;
  tire_size: string;
  barcode: string;
  dot_number: string;
}

interface RequestBanDetailData {
  id: number;
  po_warranty_code: string;
  store_name: string;
  submission_date: string;
  applicant_name: string;
  store_number: string;
  phone_number: string;
  damage_proof_image_1: string;
  damage_proof_image_2: string;
  tire_data_1: TireData;
  tire_data_2: TireData;
  status: string;
  status_label: string;
}

export default function DetailRequestBan() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<RequestBanDetailData | null>(null);

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await getRequestBanDetail(id);
      if (res.success && res.data) {
        setDetail(res.data);
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Error", "Gagal memuat detail request ban");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndSchedule = () => {
    // TODO: Implement verification and scheduling logic
    showSuccessToast("Berhasil", "Verifikasi dan jadwal pengiriman berhasil");
  };

  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return "/placeholder-image.png";
    
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    
    if (path.startsWith("/storage/")) {
      return `${basePath}${path}`;
    }
    
    if (path.startsWith("storage/")) {
      return `${basePath}/${path}`;
    }
    
    return `${basePath}/storage/${path}`;
  };

  if (!detail && !loading) {
    return (
      <div className="w-full flex flex-col gap-5 p-5 text-sm xl:text-base">
        <div className="text-white text-center py-10">
          Data tidak ditemukan
        </div>
      </div>
    );
  }

  return (
    <>
      <LoadingOverlay show={loading} />
      <div className="w-full flex flex-col gap-5 p-5 text-sm xl:text-base">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="bg-primary text-secondary font-bold px-6 py-2 rounded-lg w-fit flex items-center gap-2"
        >
          ← Kembali
        </button>

        {/* Header */}
        <div className="text-white font-bold text-lg xl:text-xl">
          <p>Permintaan Ban Garansi</p>
        </div>

        {/* Alert Banner */}
        <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 flex items-start justify-between gap-4">
          <p className="text-yellow-500 text-sm flex-1">
            Silakan periksa apakah data permohonan Garansi Ban sudah valid dan Ban siap untuk dikirim. Klik tombol 'Verifikasi & Jadwalkan Pengiriman' untuk mengonfirmasi.
          </p>
          <button
            onClick={handleVerifyAndSchedule}
            className="bg-primary text-secondary font-bold px-6 py-2 rounded-lg whitespace-nowrap text-sm"
          >
            Verifikasi & Jadwalkan Pengiriman
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left Column - Data Pengajuan */}
          <div className="box-container flex flex-col gap-5">
            <h3 className="text-white font-bold text-base">Data Pengajuan</h3>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-text-secondary text-sm mb-2 block">
                  Nama Toko
                </label>
                <DisableInput
                  value={detail?.store_name ?? ""}
                  
                />
              </div>

              <div>
                <label className="text-text-secondary text-sm mb-2 block">
                  Tanggal Pengajuan
                </label>
                <div className="relative">
                  <DisableInput
                    value={detail?.submission_date ?? ""}
                  />
                  <IoCalendarOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-input-border text-xl" />
                </div>
              </div>

              <div>
                <label className="text-text-secondary text-sm mb-2 block">
                  Nama Pemohon
                </label>
                <DisableInput
                  value={detail?.applicant_name ?? ""}
                />
              </div>

              <div>
                <label className="text-text-secondary text-sm mb-2 block">
                  Nomor Toko
                </label>
                <DisableInput
                  value={detail?.store_number ?? ""}
                />
              </div>

              <div>
                <label className="text-text-secondary text-sm mb-2 block">
                  Nomor Telepon
                </label>
                <DisablePhoneInput
                  value={detail?.phone_number ?? ""}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Bukti Kerusakan Ban */}
          <div className="box-container flex flex-col gap-5">
            <h3 className="text-white font-bold text-base">Bukti Kerusakan Ban</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-text-secondary text-sm mb-2">Bukti Kerusakan Ban</p>
                <div className="aspect-square rounded-lg overflow-hidden bg-input border border-input-border">
                  <img
                    src={getImageUrl(detail?.damage_proof_image_1)}
                    alt="Bukti Kerusakan Ban 1"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div>
                <p className="text-text-secondary text-sm mb-2">Bukti Kerusakan Ban</p>
                <div className="aspect-square rounded-lg overflow-hidden bg-input border border-input-border">
                  <img
                    src={getImageUrl(detail?.damage_proof_image_2)}
                    alt="Bukti Kerusakan Ban 2"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informasi Ban */}
        <div className="box-container flex flex-col gap-5">
          <h3 className="text-white font-bold text-base">Informasi Ban</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Data Ban 1 */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-semibold text-sm">Data Ban 1</h4>
              
              <div>
                <label className="text-text-secondary text-sm mb-2 block">
                  Tipe Ban <span className="text-red-500">*</span>
                </label>
                <DisableInput
                  value={detail?.tire_data_1?.tire_type ?? ""}
                />
              </div>

              <div>
                <label className="text-text-secondary text-sm mb-2 block">
                  Ukuran Ban <span className="text-red-500">*</span>
                </label>
                <DisableInput
                  value={detail?.tire_data_1?.tire_size ?? ""}
                />
              </div>

              <div>
                <label className="text-text-secondary text-sm mb-2 block">
                  Kode Barcode Ban (Manual Fill) <span className="text-red-500">*</span>
                </label>
                <DisableInput
                  value={detail?.tire_data_1?.barcode ?? ""}
                />
              </div>

              <div>
                <label className="text-text-secondary text-sm mb-2 block">
                  DOT Tire Number <span className="text-red-500">*</span>
                </label>
                <DisableInput
                  value={detail?.tire_data_1?.dot_number ?? ""}
                />
              </div>
            </div>

            {/* Data Ban 2 */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-semibold text-sm">Data Ban 2</h4>
              
              <div>
                <label className="text-text-secondary text-sm mb-2 block">
                  Tipe Ban <span className="text-red-500">*</span>
                </label>
                <DisableInput
                  value={detail?.tire_data_2?.tire_type ?? ""}
                />
              </div>

              <div>
                <label className="text-text-secondary text-sm mb-2 block">
                  Ukuran Ban <span className="text-red-500">*</span>
                </label>
                <DisableInput
                  value={detail?.tire_data_2?.tire_size ?? ""}
                />
              </div>

              <div>
                <label className="text-text-secondary text-sm mb-2 block">
                  Kode Barcode Ban (Manual Fill) <span className="text-red-500">*</span>
                </label>
                <DisableInput
                  value={detail?.tire_data_2?.barcode ?? ""}
                />
              </div>

              <div>
                <label className="text-text-secondary text-sm mb-2 block">
                  DOT Tire Number <span className="text-red-500">*</span>
                </label>
                <DisableInput
                  value={detail?.tire_data_2?.dot_number ?? ""}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
