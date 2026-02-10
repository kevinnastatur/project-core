"use client";

import ActionLinkPrev from "@/components/ui/button/ActionLinkPrev";
import { getWarrantyClaimDetail, updateWarrantyClaimStatus } from "@/services/admin/WarrantyClaim";
import { WarrantyClaimDetail } from "@/types/warrantyClaim";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import ButtonSubmit from "@/components/ui/button/ButtonSubmit";
import DisableGeneralInput from "@/components/ui/disableinput/GeneralInput";
import DisableDateInput from "@/components/ui/disableinput/DateInput";
import DisableOdometerInput from "@/components/ui/disableinput/OdometerInput";
import DisablePhoneInput from "@/components/ui/disableinput/PhoneInput";
import { showErrorToast, showSuccessToast } from "@/helper/toastHelper";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { CLAIM_STATUS } from "@/constants/claimStatus";

export default function DetailPengajuan() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [data, setData] = useState<WarrantyClaimDetail | null>(null);
  const [note, setNote] = useState("");
  const [openPreview, setOpenPreview] = useState<string | null>(null);

  // STATUS CONSTANTS
  const STATUS_OPTIONS = [
    { label: "Menunggu Persetujuan", value: CLAIM_STATUS.PENDING },
    { label: "Tolak Pengajuan", value: CLAIM_STATUS.REJECT_ADMIN },
    { label: "Terima Pengajuan", value: CLAIM_STATUS.APPROVE_ADMIN },
  ];

  const STATUS_APPT_REQ_OPTIONS = [
    { label: "Konfirmasi Stok", value: CLAIM_STATUS.APPT_REQ },
    { label: "Stok Tidak Tersedia", value: CLAIM_STATUS.STOCK_EMPTY },
    { label: "Stok Tersedia", value: CLAIM_STATUS.STOCK_READY },
  ];

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await getWarrantyClaimDetail(id);
        setData(response.data ?? null);
        
        // Set default selected status for APPT_REQ
        if (response.data?.status === CLAIM_STATUS.APPT_REQ) {
          setSelectedStatus(CLAIM_STATUS.APPT_REQ);
        }
      } catch (err) {
        console.error(err);
        setData(null);
        showErrorToast("Error", "Gagal memuat detail klaim garansi");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleSubmit = async () => {
    if (!data || !selectedStatus) {
      showErrorToast("Error", "Pilih status terlebih dahulu");
      return;
    }

    if (!note.trim()) {
      showErrorToast("Error", "Keterangan wajib diisi");
      return;
    }

    try {
      setLoading(true);
      await updateWarrantyClaimStatus(id, {
        note_principal_submission: note,
        status: selectedStatus.toString(),
      });

      showSuccessToast(
        "Perubahan Status Klaim Berhasil",
        `Status Klaim Garansi dengan ID ${data?.claim_submission_code} telah berhasil di-update.`
      );

      setTimeout(() => {
        router.push("/admin/dashboard/klaim-garansi/pengajuan");
      }, 2000);
    } catch (error) {
      console.error(error);
      showErrorToast(
        "Periksa Jaringan Internet Anda",
        "Perubahan Status Klaim Gagal! Sepertinya jaringan Anda bermasalah, periksa kembali jaringan Anda lalu submit kembali."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case CLAIM_STATUS.PENDING:
        return (
          <div className="bg-white border border-input-border rounded-lg p-4 flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-gray-900">Status Garansi Ban Aktif</p>
              <p className="text-xs text-gray-600">
                Garansi Ban aktif sampai dengan: <span className="font-semibold italic">{data?.warranty_expired_date ?? "1 Januari 2027"}</span>
              </p>
            </div>
          </div>
        );
      case CLAIM_STATUS.SCHEDULED:
        return (
          <div className="bg-white border border-input-border rounded-lg p-4 flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-gray-900">Status Garansi Ban Aktif</p>
              <p className="text-xs text-gray-600">
                Garansi Ban aktif sampai dengan: <span className="font-semibold italic">{data?.warranty_expired_date ?? "1 Januari 2027"}</span>
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getAlertMessage = () => {
    // Show badge based on current data status
    if (data?.status === CLAIM_STATUS.APPROVE_ADMIN) {
      return (
        <div className="bg-[#10B981] text-gray-800 p-5 rounded-lg text-sm xl:text-base flex items-center justify-center font-bold">
          <p>
            Pengajuan Klaim Berhasil Diterima, Selanjutnya Akan Dikirimkan Ke Customer untuk proses Appointment.
          </p>
        </div>
      );
    }
    if (data?.status === CLAIM_STATUS.STOCK_READY) {
      return (
        <div className="bg-[#10B981] text-gray-800 p-5 rounded-lg text-sm xl:text-base flex items-center justify-center font-bold">
          <p>
            Stok ter-konfirmasi. Claim Garansi ini akan dilanjutkan ke Customer dan Dunlop Shop.
          </p>
        </div>
      );
    }
    if (data?.status === CLAIM_STATUS.APPT_REQ) {
      return (
        <div className="bg-[#FCD34D] text-gray-800 p-5 rounded-lg text-sm xl:text-base flex items-center justify-center font-bold">
          <p>
            Menunggu Verifikasi Stok. Silakan konfirmasi ketersediaan stok untuk melanjutkan proses klaim garansi.
          </p>
        </div>
      );
    }
    if (data?.status === CLAIM_STATUS.REJECT_ADMIN) {
      return (
        <div className="bg-[#EF4444] text-white p-5 rounded-lg text-sm xl:text-base flex items-center justify-center font-bold">
          <p>Claim Garansi dengan ID ini Ditolak.</p>
        </div>
      );
    }
    if (data?.status === CLAIM_STATUS.STOCK_EMPTY) {
      return (
        <div className="bg-[#EF4444] text-white p-5 rounded-lg text-sm xl:text-base flex items-center justify-center font-bold">
          <p>Stock tidak tersedia di Toko. Claim Garansi ini akan dilanjutkan ke Customer.</p>
        </div>
      );
    }
    return null;
  };

  const shouldShowPendingActions = Number(data?.status) === CLAIM_STATUS.PENDING;
  const shouldShowApptReqActions = Number(data?.status) === CLAIM_STATUS.APPT_REQ;

  const getImageUrl = (path: string | null | undefined): string => {
    // Always return none-image for now to avoid errors
    // TODO: Configure next.config.js with proper image domains
    return "/assets/none-image.jpg";
    
    /* Original implementation - uncomment when image domains are configured
    if (!path) return "/assets/none-image.jpg";
    
    try {
      // If path already starts with http/https, return as is
      if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
      }
      
      // If path starts with /, it's absolute path
      if (path.startsWith("/")) {
        return `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;
      }
      
      // Otherwise, it's relative path
      return `${process.env.NEXT_PUBLIC_BASE_URL}/${path}`;
    } catch (error) {
      console.error("Error constructing image URL:", error);
      return "/assets/none-image.jpg";
    }
    */
  };

  return (
    <>
      <LoadingOverlay show={loading} />
      <div className="flex flex-col gap-5 w-full p-5 text-white min-h-125 mb-20">
        <ActionLinkPrev
          href="/admin/dashboard/klaim-garansi/pengajuan"
          label="Kembali"
          className="w-fit font-bold"
        />

        {getAlertMessage()}

        {/* Informasi Klaim Garansi */}
        <div className="flex flex-col gap-3 font-bold text-sm xl:text-base">
          <p>Informasi Klaim Garansi</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-5 box-container">
            <div className="flex flex-col gap-2">
              <label>ID Klaim Garansi <span className="text-red-500">*</span></label>
              <DisableGeneralInput value={data?.claim_submission_code ?? ""} />
            </div>
            <div className="flex flex-col gap-2">
              <label>ID Warranty <span className="text-red-500">*</span></label>
              <DisableGeneralInput value={data?.warranty_code ?? ""} />
            </div>
            <div className="flex flex-col gap-2">
              <label>Tanggal Klaim <span className="text-red-500">*</span></label>
              <DisableDateInput value={data?.claim_date ?? ""} />
            </div>
            <div className="flex flex-col gap-2">
              <label>Odometer Saat Ini <span className="text-red-500">*</span></label>
              <DisableOdometerInput value={data?.odometer_cust_now ?? ""} />
            </div>
          </div>
        </div>

        {/* Informasi Pengguna */}
        <div className="flex flex-col gap-3 font-bold text-sm xl:text-base">
          <p>Informasi Pengguna</p>
          <div className="box-container flex flex-col gap-5">
            {/* Row 1: 4 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-5">
              <div className="flex flex-col gap-2">
                <label>Nama Lengkap <span className="text-red-500">*</span></label>
                <DisableGeneralInput value={data?.name ?? ""} />
              </div>
              <div className="flex flex-col gap-2">
                <label>Nomor Telepon <span className="text-red-500">*</span></label>
                <DisablePhoneInput value={data?.phone ?? ""} />
              </div>
              <div className="flex flex-col gap-2">
                <label>Tipe Kendaraan <span className="text-red-500">*</span></label>
                <DisableGeneralInput value={data?.model ?? ""} />
              </div>
              <div className="flex flex-col gap-2">
                <label>Plat Nomor Kendaraan <span className="text-red-500">*</span></label>
                <DisableGeneralInput value={data?.plate_number ?? ""} />
              </div>
            </div>

            {/* Row 2: 3 fields aligned with row 1 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-5">
              <div className="flex flex-col gap-2">
                <label>Odometer Awal Kendaraan <span className="text-red-500">*</span></label>
                <DisableOdometerInput value={data?.odometer_beginning ?? ""} />
              </div>
              <div className="flex flex-col gap-2">
                <label>Toko Pembelian <span className="text-red-500">*</span></label>
                <DisableGeneralInput value={data?.store_name ?? ""} />
              </div>
              <div className="flex flex-col gap-2">
                <label>Tanggal Pembelian <span className="text-red-500">*</span></label>
                <DisableDateInput value={data?.purchase_date ?? ""} />
              </div>
            </div>
          </div>
        </div>

        {/* Bukti Kerusakan Ban & Bukti Odometer - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Bukti Kerusakan Ban */}
          <div className="flex flex-col gap-3 font-bold text-sm xl:text-base">
            <p>Bukti Kerusakan Ban</p>
            <div className="box-container flex gap-5">
              <div className="flex flex-col gap-2">
                <label>Foto Kerusakan Tampak Depan</label>
                <div
                  className="cursor-pointer"
                  onClick={() => setOpenPreview(data?.image_damage_main ?? "")}
                >
                  <Image
                    src={getImageUrl(data?.image_damage_main)}
                    alt="Damage Main"
                    width={9999}
                    height={9999}
                    className="w-full h-60 xl:h-80 object-contain bg-secondary rounded-lg"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>Foto Kerusakan Tampak Pinggir</label>
                <div
                  className="cursor-pointer"
                  onClick={() => setOpenPreview(data?.image_damage_side ?? "")}
                >
                  <Image
                    src={getImageUrl(data?.image_damage_side)}
                    alt="Damage Side"
                    width={9999}
                    height={9999}
                    className="w-full h-60 xl:h-80 object-contain bg-secondary rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bukti Odometer Kendaraan */}
          <div className="flex flex-col gap-3 font-bold text-sm xl:text-base">
            <p>Bukti Odometer Kendaraan</p>
            <div className="box-container flex gap-5">
              <div className="flex flex-col gap-2">
                <label>Foto Odometer Awal</label>
                <div
                  className="cursor-pointer"
                  onClick={() => setOpenPreview(data?.image_odometer_beginning ?? "")}
                >
                  <Image
                    src={getImageUrl(data?.image_odometer_beginning)}
                    alt="Odometer Beginning"
                    width={9999}
                    height={9999}
                    className="w-full h-60 xl:h-80 object-contain bg-secondary rounded-lg"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>Foto Odometer Pengajuan</label>
                <div
                  className="cursor-pointer"
                  onClick={() => setOpenPreview(data?.image_odometer_now ?? "")}
                >
                  <Image
                    src={getImageUrl(data?.image_odometer_now)}
                    alt="Odometer Now"
                    width={9999}
                    height={9999}
                    className="w-full h-60 xl:h-80 object-contain bg-secondary rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informasi Ban */}
        <div className="flex flex-col gap-3 font-bold text-sm xl:text-base">
          <p>Informasi Ban</p>
          <div className="box-container flex flex-col gap-5">
            {/* Data Ban Status */}
            <div className="flex flex-col gap-2">
              <label>Data Ban</label>
              <div className="bg-secondary border border-input-border rounded-lg p-5">
                {getStatusBadge(data?.status ?? 0)}
                  {/* Tire Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-4">
                  <div className="flex flex-col gap-2">
                    <label>Tipe Ban <span className="text-red-500">*</span></label>
                    <DisableGeneralInput value={data?.tire_type ?? ""} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label>Ukuran Ban <span className="text-red-500">*</span></label>
                    <DisableGeneralInput value={data?.tire_size ?? ""} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label>Kode Barcode Ban <span className="text-red-500">*</span></label>
                    <DisableGeneralInput value={data?.tire_barcode ?? ""} />
                  </div>
                </div>
                  {/* DOT Tire Number */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="flex flex-col gap-2">
                    <label>DOT Tire Number <span className="text-red-500">*</span></label>
                    <DisableGeneralInput value={data?.tire_number ?? ""} />
                  </div>
                </div>
            </div>
            </div>

            {/* Conditional fields for rejected status */}
            {selectedStatus === CLAIM_STATUS.REJECT_ADMIN && (
              <>
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label>Kode Barcode Ban Baru</label>
                    <DisableGeneralInput value="" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label>DOT Tire Number Baru</label>
                    <DisableGeneralInput value="" />
                  </div>
                </div> */}
              </>
            )}
          </div>
        </div>

        {shouldShowPendingActions && (
          <div className="flex flex-col lg:flex-row gap-5 w-full items-stretch">
            {/* Keterangan */}
            <div className="flex flex-col gap-3 font-bold text-sm xl:text-base w-full lg:flex-1">
              <p>Masukan Keterangan Klaim Garansi</p>
              <div className="box-container flex flex-col gap-3 p-5 flex-1">
                <p>Keterangan Klaim Garansi</p>
                <textarea
                  required
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Masukan Catatan/Keterangan Klaim Garansi"
                  className="border-input-border border rounded-lg p-3 flex-1 resize-none bg-secondary text-white"
                  rows={6}
                />
              </div>
            </div>
            {/* Konfirmasi */}
            <div className="flex flex-col gap-3 font-bold text-sm xl:text-base w-full lg:w-[35%]">
              <p>Konfirmasi Pengajuan</p>
              <div className="box-container flex flex-col gap-3 p-5 flex-1">
                {STATUS_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={selectedStatus === option.value}
                      onChange={() => setSelectedStatus(option.value)}
                      className="w-5 h-5 appearance-none rounded-full border-2 border-primary checked:bg-primary checked:border-primary transition"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              <ButtonSubmit label="Update Pengajuan" onClick={handleSubmit} />
            </div>
          </div>
        )}

        {shouldShowApptReqActions && (
          <div className="flex flex-col lg:flex-row gap-5 w-full items-stretch">
            {/* Keterangan */}
            <div className="flex flex-col gap-3 font-bold text-sm xl:text-base w-full lg:flex-1">
              <p>Masukan Keterangan Klaim Garansi</p>
              <div className="box-container flex flex-col gap-3 p-5 flex-1">
                <p>Keterangan Klaim Garansi</p>
                <textarea
                  required
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Masukan Catatan/Keterangan Klaim Garansi"
                  className="border-input-border border rounded-lg p-3 flex-1 resize-none bg-secondary text-white"
                  rows={6}
                />
              </div>
            </div>
            {/* Konfirmasi */}
            <div className="flex flex-col gap-3 font-bold text-sm xl:text-base w-full lg:w-[35%]">
              <p>Konfirmasi Stok</p>
              <div className="box-container flex flex-col gap-3 p-5 flex-1">
                {STATUS_APPT_REQ_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={selectedStatus === option.value}
                      onChange={() => setSelectedStatus(option.value)}
                      className="w-5 h-5 appearance-none rounded-full border-2 border-primary checked:bg-primary checked:border-primary transition"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              <ButtonSubmit label="Update Appointment" onClick={handleSubmit} />
            </div>
          </div>
        )}

        {/* Image Preview Modal */}
        {openPreview && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
            onClick={() => setOpenPreview(null)}
          >
            <div
              className="relative w-full h-screen p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpenPreview(null)}
                className="absolute top-5 right-5 text-white text-xl font-bold z-10"
              >
                ✕
              </button>
              <Image
                src={getImageUrl(openPreview)}
                alt="Preview"
                width={9999}
                height={9999}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
