"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { MdOutlineArrowLeft } from "react-icons/md";
import { IoCheckmarkCircle, IoAlertCircle } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";

// ============ TYPES ============
type ClaimStatus = "verifikasi_stok" | "dijadwalkan" | "selesai" | "rejected";

type ProgressStep = 1 | 2 | 3;

interface ClaimDetail {
  id: string;
  claimId: string;
  warrantyId: string;
  claimStore: string;
  claimDate: string;
  claimTime: string;
  currentOdometer: string;
  status: ClaimStatus;
  progressStep: ProgressStep;
  rejectionReason?: string;
  notes?: string[];
}

interface UserInfo {
  fullName: string;
  phone: string;
  vehicleType: string;
  plateNumber: string;
  initialOdometer: string;
  purchaseStore: string;
  purchaseDate: string;
}

interface TireInfo {
  status: "active" | "claimed" | "rejected";
  warrantyEndDate: string;
  claimedDate?: string;
  tireType: string;
  tireSize: string;
  barcodeCode: string;
  dotNumber: string;
  newBarcodeCode?: string;
  newDotNumber?: string;
}

// ============ MOCK DATA ============
const MOCK_CLAIMS: Record<string, ClaimDetail> = {
  // Step 1: Verifikasi Stok
  "1": {
    id: "1",
    claimId: "CW-123912821",
    warrantyId: "DTW-1239128001",
    claimStore: "MPN Kharisma",
    claimDate: "3 April 2026",
    claimTime: "09:00",
    currentOdometer: "68312",
    status: "verifikasi_stok",
    progressStep: 1,
    notes: [],
  },
  // Step 2: Dijadwalkan
  "3": {
    id: "3",
    claimId: "CW-123912821",
    warrantyId: "DTW-1239128001",
    claimStore: "MPN Kharisma",
    claimDate: "3 April 2026",
    claimTime: "09:00",
    currentOdometer: "68312",
    status: "dijadwalkan",
    progressStep: 2,
    notes: [],
  },
  // Step 3: Selesai
  "4": {
    id: "4",
    claimId: "CW-123912821",
    warrantyId: "DTW-1239128001",
    claimStore: "MPN Kharisma",
    claimDate: "3 April 2026",
    claimTime: "09:00",
    currentOdometer: "68312",
    status: "selesai",
    progressStep: 3,
    notes: [
      "Kendaraan: Innova Zenix Q (Sesuai)",
      "Plat Nomor: B 2025 DUN (Sesuai)",
      "Ban: SP Sportmaxx 050 (Sesuai)",
      "Kode Barcode Sesuai",
      "DOT Tire Number Sesuai",
    ],
  },
  // Rejected state
  "2": {
    id: "2",
    claimId: "CW-123912821",
    warrantyId: "DTW-1239128001",
    claimStore: "MPN Kharisma",
    claimDate: "3 April 2026",
    claimTime: "09:00",
    currentOdometer: "68312",
    status: "rejected",
    progressStep: 1,
    rejectionReason: "Anda Tidak Memenuhi Syarat Administrasi untuk melakukan klaim garansi.",
  },
};

const MOCK_USER_INFO: UserInfo = {
  fullName: "Esther Howard",
  phone: "+62 8121455663437",
  vehicleType: "Innova Zenix Q",
  plateNumber: "B 2025 DUN",
  initialOdometer: "68312",
  purchaseStore: "MPN Kharisma",
  purchaseDate: "1 Januari 2026",
};

const MOCK_TIRE_INFO: Record<ClaimStatus, TireInfo> = {
  verifikasi_stok: {
    status: "active",
    warrantyEndDate: "1 Januari 2027",
    tireType: "SP Sport Maxx 050",
    tireSize: "205/65 R16",
    barcodeCode: "3420048103",
    dotNumber: "DOT 45664",
  },
  dijadwalkan: {
    status: "active",
    warrantyEndDate: "1 Januari 2027",
    tireType: "SP Sport Maxx 050",
    tireSize: "205/65 R16",
    barcodeCode: "3420048103",
    dotNumber: "DOT 45664",
  },
  selesai: {
    status: "claimed",
    warrantyEndDate: "1 Januari 2027",
    claimedDate: "3 April 2026",
    tireType: "SP Sport Maxx 050",
    tireSize: "205/65 R16",
    barcodeCode: "3420048103",
    dotNumber: "DOT 45664",
    newBarcodeCode: "3420048104",
    newDotNumber: "DOT 45665",
  },
  rejected: {
    status: "rejected",
    warrantyEndDate: "1 Januari 2027",
    tireType: "SP Sport Maxx 050",
    tireSize: "205/65 R16",
    barcodeCode: "3420048103",
    dotNumber: "DOT 45664",
  },
};

// ============ PROGRESS STEPPER COMPONENT ============
function ProgressStepper({ currentStep, status }: { currentStep: ProgressStep; status: ClaimStatus }) {
  const steps = [
    { number: 1, label: "Verifikasi Stok" },
    { number: 2, label: "Klaim Garansi Dijadwalkan" },
    { number: 3, label: "Klaim Garansi Selesai" },
  ];

  // For rejected status, don't show progress stepper
  if (status === "rejected") {
    return null;
  }

  return (
    <div
      data-testid="progress-stepper"
      className="flex items-center justify-center w-full max-w-2xl mx-auto py-6"
    >
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                ${
                  currentStep > step.number
                    ? "bg-primary text-secondary"
                    : currentStep === step.number
                    ? "border-2 border-primary text-primary bg-transparent"
                    : "border-2 border-input-border text-input-border bg-transparent"
                }
              `}
            >
              {currentStep > step.number ? (
                <FaCheckCircle className="text-secondary" />
              ) : (
                `0${step.number}`
              )}
            </div>
            <p
              className={`
                mt-2 text-xs xl:text-sm text-center whitespace-nowrap max-w-24
                ${
                  currentStep >= step.number
                    ? "text-primary font-semibold"
                    : "text-input-border"
                }
              `}
            >
              {step.label}
            </p>
          </div>

          {index < steps.length - 1 && (
            <div
              className={`
                w-20 xl:w-28 h-0.5 mx-2 mt-[-24px]
                ${currentStep > step.number ? "bg-primary" : "bg-input-border"}
              `}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ============ STATUS BANNER COMPONENT ============
function StatusBanner({ status }: { status: ClaimStatus }) {
  if (status === "rejected") {
    return (
      <div
        data-testid="status-banner-rejected"
        className="bg-[#E83D23] text-white p-4 rounded-lg text-sm font-medium"
      >
        Pengajuan klaim garansi ban Anda telah ditolak. Untuk informasi lebih lanjut mengenai alasan penolakan, silakan hubungi layanan pelanggan kami.
      </div>
    );
  }

  return null;
}

// ============ DISABLED INPUT COMPONENT ============
function DisabledInput({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-primary text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </label>
      {unit ? (
        <div className="flex items-center bg-color-input-disabled text-[#a3a3a3] rounded-lg overflow-hidden">
          <span className="flex-1 p-3 font-medium">{value}</span>
          <span className="px-3 font-medium">{unit}</span>
        </div>
      ) : (
        <div className="bg-color-input-disabled text-[#a3a3a3] p-3 rounded-lg font-medium">
          {value}
        </div>
      )}
    </div>
  );
}

// ============ IMAGE PREVIEW COMPONENT ============
function ImagePreview({ title, placeholder }: { title: string; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-2 min-w-48">
      <div className="bg-[#333333] rounded-lg h-40 flex items-center justify-center overflow-hidden border border-input-border">
        {placeholder ? (
          <div className="text-center p-4">
            <div className="text-white/50 text-xs">{placeholder}</div>
          </div>
        ) : (
          <div className="text-white/30 text-xs text-center p-2">
            [Preview Gambar]
          </div>
        )}
      </div>
      <p className="text-white text-sm font-medium">{title}</p>
    </div>
  );
}

// ============ WARRANTY STATUS CARD COMPONENT ============
function WarrantyStatusCard({ status, tireInfo }: { status: ClaimStatus; tireInfo: TireInfo }) {
  if (status === "selesai") {
    return (
      <div
        data-testid="warranty-status-claimed"
        className="flex items-start gap-3 p-4 bg-[#1a1a1a] rounded-lg mb-5"
      >
        <IoAlertCircle className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-white font-semibold">
            Garansi Habis! Anda Sudah Melakukan Claim Garansi Ban
          </p>
          <p className="text-white/70 text-sm">
            Anda sudah melakukan Klaim Garansi ban Anda di:{" "}
            <span className="font-bold text-primary">{tireInfo.claimedDate}</span>
          </p>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div
        data-testid="warranty-status-rejected"
        className="flex items-start gap-3 p-4 bg-[#1a1a1a] rounded-lg mb-5"
      >
        <IoAlertCircle className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-white font-semibold">
            Klaim Ditolak, Anda Tidak Memenuhi Syarat Untuk Melakukan Klaim Garansi Ban
          </p>
          <p className="text-white/70 text-sm">
            Garansi Anda secara otomatis dibatalkan karena tidak mengikuti{" "}
            <span className="text-primary underline cursor-pointer">Syarat & Ketentuan</span>
          </p>
        </div>
      </div>
    );
  }

  // Active status for verifikasi_stok and dijadwalkan
  return (
    <div
      data-testid="warranty-status-active"
      className="flex items-start gap-3 p-4 bg-[#1a1a1a] rounded-lg mb-5"
    >
      <IoCheckmarkCircle className="text-[#00DF80] text-xl mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-white font-semibold">Status Garansi Ban Aktif</p>
        <p className="text-white/70 text-sm">
          Garansi Ban aktif sampai dengan:{" "}
          <span className="font-bold text-primary">{tireInfo.warrantyEndDate}</span>
        </p>
      </div>
    </div>
  );
}

// ============ NOTES SECTION COMPONENT ============
function NotesSection({ claim }: { claim: ClaimDetail }) {
  const hasNotes = claim.notes && claim.notes.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-white font-bold text-lg">Catatan Klaim Garansi</h2>
      <div
        data-testid="claim-notes"
        className="bg-input border border-input-border rounded-lg p-5 min-h-48"
      >
        {claim.status === "rejected" && claim.rejectionReason ? (
          <p className="text-white text-sm">{claim.rejectionReason}</p>
        ) : hasNotes ? (
          <div className="flex flex-col gap-2">
            {claim.notes?.map((note, index) => (
              <p key={index} className="text-white text-sm">
                {note}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-white/50 text-sm">Tidak Ada Catatan</p>
        )}
      </div>
    </div>
  );
}

// ============ MAIN PAGE COMPONENT ============
export default function ClaimDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // Get claim data based on ID, default to verifikasi_stok state
  const claim = MOCK_CLAIMS[id] || MOCK_CLAIMS["1"];
  const tireInfo = MOCK_TIRE_INFO[claim.status];

  return (
    <div
      data-testid="claim-detail-page"
      className="flex flex-col gap-5 w-full p-5 text-white min-h-125"
    >
      {/* Breadcrumb */}
      <div className="text-sm text-white/70">
        <span>Klaim Garansi</span>
        <span className="mx-2">/</span>
        <span className="text-primary">Detail Riwayat Klaim Garansi</span>
      </div>

      {/* Back Button */}
      <Link
        href="/dashboard/klaim-garansi"
        data-testid="back-btn"
        className="bg-primary px-5 py-3 text-secondary rounded-lg text-sm font-bold flex items-center gap-1 w-fit hover:opacity-90 transition"
      >
        <MdOutlineArrowLeft />
        <span>Kembali</span>
      </Link>

      {/* Progress Stepper - Only for non-rejected statuses */}
      <ProgressStepper currentStep={claim.progressStep} status={claim.status} />

      {/* Status Banner - Only for rejected status */}
      <StatusBanner status={claim.status} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left Column - Claim Info */}
        <div className="xl:col-span-2 flex flex-col gap-5">
          {/* Informasi Klaim Garansi */}
          <div className="flex flex-col gap-4">
            <h2 className="text-white font-bold text-lg">Informasi Klaim Garansi</h2>
            <div className="bg-input border border-input-border rounded-lg p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                <DisabledInput label="ID Klaim Garansi" value={claim.claimId} />
                <DisabledInput label="ID Warranty" value={claim.warrantyId} />
                <DisabledInput label="Klaim Toko" value={claim.claimStore} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
                <DisabledInput label="Tanggal Klaim" value={claim.claimDate} />
                <DisabledInput label="Jam" value={claim.claimTime} />
                <DisabledInput label="Odometer Saat Ini" value={claim.currentOdometer} unit="km" />
              </div>
            </div>
          </div>

          {/* Informasi Pengguna */}
          <div className="flex flex-col gap-4">
            <h2 className="text-white font-bold text-lg">Informasi Pengguna</h2>
            <div className="bg-input border border-input-border rounded-lg p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                <DisabledInput label="Nama Lengkap" value={MOCK_USER_INFO.fullName} />
                <DisabledInput label="Nomor Telepon" value={MOCK_USER_INFO.phone} />
                <DisabledInput label="Tipe Kendaraan" value={MOCK_USER_INFO.vehicleType} />
                <DisabledInput label="Plat Nomor Kendaraan" value={MOCK_USER_INFO.plateNumber} />
                <DisabledInput label="Odometer Awal Kendaraan" value={MOCK_USER_INFO.initialOdometer} unit="km" />
                <DisabledInput label="Toko Pembelian" value={MOCK_USER_INFO.purchaseStore} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                <DisabledInput label="Tanggal Pembelian" value={MOCK_USER_INFO.purchaseDate} />
              </div>
            </div>
          </div>

          {/* Bukti Kerusakan Ban */}
          <div className="flex flex-col gap-4">
            <h2 className="text-white font-bold text-lg">Bukti Kerusakan Ban</h2>
            <div className="bg-input border border-input-border rounded-lg p-5">
              <div className="flex gap-4 overflow-x-auto pb-2">
                <ImagePreview title="Foto Kerusakan Tampak Depan" />
                <ImagePreview title="Foto Kerusakan Tampak Pinggir" />
              </div>
              <p className="text-primary text-sm mt-3">
                Scroll/Swipe Untuk Melihat Seluruh Gambar
              </p>
            </div>
          </div>

          {/* Bukti Odometer Kendaraan */}
          <div className="flex flex-col gap-4">
            <h2 className="text-white font-bold text-lg">Bukti Odometer Kendaraan</h2>
            <div className="bg-input border border-input-border rounded-lg p-5">
              <div className="flex gap-4 overflow-x-auto pb-2">
                <ImagePreview
                  title="Foto Odometer Awal"
                  placeholder="12.2 km | A/B 000096 km"
                />
                <ImagePreview
                  title="Foto Odometer Pengajuan"
                  placeholder="68312 km | 09:00"
                />
              </div>
            </div>
          </div>

          {/* Detail Informasi Garansi Ban */}
          <div className="flex flex-col gap-4">
            <h2 className="text-white font-bold text-lg">Detail Informasi Garansi Ban</h2>
            <div className="bg-input border border-input-border rounded-lg p-5">
              {/* Warranty Status Card */}
              <WarrantyStatusCard status={claim.status} tireInfo={tireInfo} />

              {/* Lihat Detail Ban */}
              <div className="border-t border-input-border pt-5">
                <p className="text-white font-medium mb-4">Lihat Detail Ban</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                  <DisabledInput label="Tipe Ban" value={tireInfo.tireType} />
                  <DisabledInput label="Ukuran Ban" value={tireInfo.tireSize} />
                  <DisabledInput label="Kode Barcode Ban" value={tireInfo.barcodeCode} />
                  <DisabledInput label="DOT Tire Number" value={tireInfo.dotNumber} />
                </div>

                {/* Show new tire info for completed claims */}
                {claim.status === "selesai" && tireInfo.newBarcodeCode && tireInfo.newDotNumber && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-5">
                    <DisabledInput label="Kode Barcode Ban Baru" value={tireInfo.newBarcodeCode} />
                    <DisabledInput label="DOT Tire Number Baru" value={tireInfo.newDotNumber} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Notes */}
        <NotesSection claim={claim} />
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-primary rounded-lg p-5 flex items-center justify-between">
        <div>
          <p className="text-secondary font-bold text-lg">Butuh Bantuan?</p>
          <p className="text-secondary/70 text-sm">
            Jika Anda membutuhkan bantuan, silakan hubungi kami.
          </p>
        </div>
        <button
          type="button"
          className="bg-secondary text-primary px-6 py-3 rounded-lg font-bold hover:opacity-90 transition"
        >
          Hubungi Kami
        </button>
      </div>
    </div>
  );
}
