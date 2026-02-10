"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { MdOutlineArrowLeft, MdOutlineArrowDropDown } from "react-icons/md";
import { IoCheckmarkCircle, IoAlertCircle } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { CLAIM_STATUS } from "@/constants/claimStatus";

// ============ TYPES ============
type ProgressStep = 0 | 1 | 2 | 3 | 4;

interface ClaimDetail {
  id: string;
  claimId: string;
  warrantyId: string;
  claimStore: string;
  claimDate: string;
  claimTime: string;
  currentOdometer: string;
  status: number;
  rejectionReason?: string;
  notes?: string[];
  warranty?: {
    plate_number?: string;
  };
  note_principal_submission?: string;
  note_principal_stock?: string | string[];
  note_store_inspection?: string | string[];
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
  // Status 0: Pending (Verifikasi Administrasi)
  "0": {
    id: "0",
    claimId: "CW-123912821",
    warrantyId: "DTW-1239128001",
    claimStore: "MPN Kharisma",
    claimDate: "3 April 2026",
    claimTime: "09:00",
    currentOdometer: "68312",
    status: CLAIM_STATUS.PENDING,
    notes: [],
  },
  // Status 1: RejectAdmin (Ditolak Oleh Dunlop)
  "1": {
    id: "1",
    claimId: "CW-123912821",
    warrantyId: "DTW-1239128001",
    claimStore: "MPN Kharisma",
    claimDate: "3 April 2026",
    claimTime: "09:00",
    currentOdometer: "68312",
    status: CLAIM_STATUS.REJECT_ADMIN,
    rejectionReason: "Anda Tidak Memenuhi Syarat Administrasi untuk melakukan klaim garansi.",
  },
  // Status 3: StockReady (Stok Tersedia) - Stepper 1 checked
  "3": {
    id: "3",
    claimId: "CW-123912821",
    warrantyId: "DTW-1239128001",
    claimStore: "MPN Kharisma",
    claimDate: "3 April 2026",
    claimTime: "09:00",
    currentOdometer: "68312",
    status: CLAIM_STATUS.STOCK_READY,
    notes: [],
  },
  // Status 5: ApptReq (Verifikasi Stok) - No steps checked
  "5": {
    id: "5",
    claimId: "CW-123912821",
    warrantyId: "DTW-1239128001",
    claimStore: "MPN Kharisma",
    claimDate: "3 April 2026",
    claimTime: "09:00",
    currentOdometer: "68312",
    status: CLAIM_STATUS.APPT_REQ,
    notes: [],
  },
  // Status 6: Scheduled (Dijadwalkan) - Steps 1-2 checked
  "6": {
    id: "6",
    claimId: "CW-123912821",
    warrantyId: "DTW-1239128001",
    claimStore: "MPN Kharisma",
    claimDate: "3 April 2026",
    claimTime: "09:00",
    currentOdometer: "68312",
    status: CLAIM_STATUS.SCHEDULED,
    notes: [],
  },
  // Status 7: Completed (Klaim Selesai) - All steps checked
  "7": {
    id: "7",
    claimId: "CW-123912821",
    warrantyId: "DTW-1239128001",
    claimStore: "MPN Kharisma",
    claimDate: "3 April 2026",
    claimTime: "09:00",
    currentOdometer: "68312",
    status: CLAIM_STATUS.COMPLETED,
    notes: [
      "Kendaraan: Innova Zenix Q (Sesuai)",
      "Plat Nomor: B 2025 DUN (Sesuai)",
      "Ban: SP Sportmaxx 050 (Sesuai)",
      "Kode Barcode Sesuai",
      "DOT Tire Number Sesuai",
    ],
  },
  // Status 8: RejectStore (Ditolak Oleh Dunlop Shop)
  "8": {
    id: "8",
    claimId: "CW-123912821",
    warrantyId: "DTW-1239128001",
    claimStore: "MPN Kharisma",
    claimDate: "3 April 2026",
    claimTime: "09:00",
    currentOdometer: "68312",
    status: CLAIM_STATUS.REJECT_STORE,
    rejectionReason: "Klaim ditolak oleh Dunlop Shop.",
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

const MOCK_TIRE_INFO: Record<number, TireInfo> = {
  [CLAIM_STATUS.PENDING]: {
    status: "active",
    warrantyEndDate: "1 Januari 2027",
    tireType: "SP Sport Maxx 050",
    tireSize: "205/65 R16",
    barcodeCode: "3420048103",
    dotNumber: "DOT 45664",
  },
  [CLAIM_STATUS.REJECT_ADMIN]: {
    status: "rejected",
    warrantyEndDate: "1 Januari 2027",
    tireType: "SP Sport Maxx 050",
    tireSize: "205/65 R16",
    barcodeCode: "3420048103",
    dotNumber: "DOT 45664",
  },
  [CLAIM_STATUS.STOCK_READY]: {
    status: "active",
    warrantyEndDate: "1 Januari 2027",
    tireType: "SP Sport Maxx 050",
    tireSize: "205/65 R16",
    barcodeCode: "3420048103",
    dotNumber: "DOT 45664",
  },
  [CLAIM_STATUS.APPT_REQ]: {
    status: "active",
    warrantyEndDate: "1 Januari 2027",
    tireType: "SP Sport Maxx 050",
    tireSize: "205/65 R16",
    barcodeCode: "3420048103",
    dotNumber: "DOT 45664",
  },
  [CLAIM_STATUS.SCHEDULED]: {
    status: "active",
    warrantyEndDate: "1 Januari 2027",
    tireType: "SP Sport Maxx 050",
    tireSize: "205/65 R16",
    barcodeCode: "3420048103",
    dotNumber: "DOT 45664",
  },
  [CLAIM_STATUS.COMPLETED]: {
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
  [CLAIM_STATUS.REJECT_STORE]: {
    status: "rejected",
    warrantyEndDate: "1 Januari 2027",
    tireType: "SP Sport Maxx 050",
    tireSize: "205/65 R16",
    barcodeCode: "3420048103",
    dotNumber: "DOT 45664",
  },
};

// ============ PROGRESS STEP HELPER ============
function getProgressStep(status: number): ProgressStep {
  switch (status) {
    case CLAIM_STATUS.APPT_REQ: return 1;      // Step 1 active, none checked
    case CLAIM_STATUS.STOCK_READY: return 2;    // Step 1 checked
    case CLAIM_STATUS.SCHEDULED: return 3;      // Steps 1-2 checked
    case CLAIM_STATUS.COMPLETED: return 4;      // All steps checked
    default: return 0;
  }
}

// ============ PROGRESS STEPPER COMPONENT ============
function ProgressStepper({ currentStep, status }: { currentStep: ProgressStep; status: number }) {
  const steps = [
    { number: 1, label: "Verifikasi Stok" },
    { number: 2, label: "Klaim Garansi Dijadwalkan" },
    { number: 3, label: "Klaim Garansi Selesai" },
  ];

  // Only show stepper for specific statuses
  const showStepperStatuses: number[] = [
    CLAIM_STATUS.STOCK_READY,
    CLAIM_STATUS.APPT_REQ,
    CLAIM_STATUS.SCHEDULED,
    CLAIM_STATUS.COMPLETED,
  ];
  if (!showStepperStatuses.includes(status)) {
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
function StatusBanner({ status }: { status: number }) {
  if (status === CLAIM_STATUS.PENDING) {
    return (
      <div
        data-testid="status-banner-pending"
        className="bg-[#EAB308] text-black p-5 rounded-lg text-sm xl:text-base flex items-center justify-center font-bold"
      >
        Pengajuan klaim Anda saat ini sedang dalam proses verifikasi. Kami menghargai kesabaran Anda saat kami memproses permintaan Anda.
      </div>
    );
  }

  if (status === CLAIM_STATUS.REJECT_ADMIN) {
    return (
      <div
        data-testid="status-banner-rejected"
        className="bg-[#EF4444] text-white p-5 rounded-lg text-sm xl:text-base flex items-center justify-center font-bold"
      >
        Pengajuan klaim garansi ban Anda telah ditolak. Untuk informasi lebih lanjut mengenai alasan penolakan, silahkan hubungi layanan pelanggan kami.
      </div>
    );
  }

  if (status === CLAIM_STATUS.REJECT_STORE) {
    return (
      <div
        data-testid="status-banner-rejected-store"
        className="bg-[#EF4444] text-white p-5 rounded-lg text-sm xl:text-base flex items-center justify-center font-bold"
      >
        Pengajuan klaim garansi ban Anda telah ditolak oleh Dunlop Shop. Untuk informasi lebih lanjut mengenai alasan penolakan, silahkan hubungi layanan pelanggan kami.
      </div>
    );
  }

  return null;
}

// ============ DISABLED INPUT COMPONENT ============
function DisabledInput({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm font-medium">
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

// Format date string to Indonesian "D Month YYYY" (e.g. "1 Januari 2026")
function formatDateToId(dateStr?: string | null) {
  if (!dateStr) return "";
  // If already in human readable form, return as-is
  const monthNames = [
    "Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember",
  ];
  // Try to parse ISO date
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    const day = d.getDate();
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  }
  // Fallback: return original string (already human-friendly)
  return dateStr;
}

// ============ SCROLLABLE CONTAINER WITH HINT ============
function ScrollableImageContainer({ 
  children, 
  testId 
}: { 
  children: React.ReactNode; 
  testId?: string; 
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (scrollRef.current) {
        const { scrollWidth, clientWidth } = scrollRef.current;
        setHasOverflow(scrollWidth > clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    
    return () => window.removeEventListener('resize', checkOverflow);
  }, [children]);

  return (
    <>
      <div 
        ref={scrollRef}
        data-testid={testId}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x scrollbar-yellow-thin"
      >
        {children}
      </div>
      {hasOverflow && (
        <p className="text-yellow-500 text-sm mt-3">
          Scroll/Swipe Untuk Melihat Seluruh Gambar
        </p>
      )}
    </>
  );
}

// ============ WARRANTY STATUS CARD COMPONENT ============
function WarrantyStatusCard({ status, tireInfo }: { status: number; tireInfo: TireInfo }) {
  if (status === CLAIM_STATUS.COMPLETED) {
    return (
      <div
        data-testid="warranty-status-claimed"
        className="flex items-start gap-2 bg-white rounded-lg p-4 mb-5"
      >
        <IoAlertCircle className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-secondary font-semibold">
            Garansi Habis! Anda Sudah Melakukan Claim Garansi Ban
          </p>
          <p className="text-secondary text-sm">
            Anda sudah melakukan Klaim Garansi ban Anda di:{" "}
            <span className="font-bold text-secondary">{tireInfo.claimedDate}</span>
          </p>
        </div>
      </div>
    );
  }

  if (status === CLAIM_STATUS.REJECT_ADMIN || status === CLAIM_STATUS.REJECT_STORE) {
    return (
      <div
        data-testid="warranty-status-rejected"
        className="flex items-start gap-2 bg-white rounded-lg p-4 mb-5"
      >
        <IoAlertCircle className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-secondary font-semibold">
            Klaim Ditolak, Anda Tidak Memenuhi Syarat Untuk Melakukan Klaim Garansi Ban
          </p>
          <p className="text-secondary text-sm">
            Garansi Anda secara otomatis dibatalkan karena tidak mengikuti{" "}
            <span className="text-secondary underline cursor-pointer">Syarat & Ketentuan</span>
          </p>
        </div>
      </div>
    );
  }

  // Active status for stepper statuses
  return (
    <div
      data-testid="warranty-status-active"
      className="flex items-start gap-2 bg-white rounded-lg p-4 mb-5"
    >
      <IoCheckmarkCircle className="text-[#00DF80] text-xl mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-secondary font-semibold">Status Garansi Ban Aktif</p>
        <p className="text-secondary text-sm">
          Garansi Ban aktif sampai dengan:{" "}
          <span className="font-bold text-secondary">{tireInfo.warrantyEndDate}</span>
        </p>
      </div>
    </div>
  );
}

// ============ NOTES SECTION COMPONENT ============
function NotesSection({ claim }: { claim: ClaimDetail }) {
  // Choose source for notes based on status
  let notesSource: string | string[] | undefined;
  if ([0, 1, 2].includes(claim.status)) {
    notesSource = claim.note_principal_submission;
  } else if ([3, 4, 5].includes(claim.status)) {
    notesSource = claim.note_principal_stock;
  } else if ([6, 7, 8].includes(claim.status)) {
    notesSource = claim.note_store_inspection;
  }

  // Fallback to claim.notes array if provided
  const hasNotesArray = Array.isArray(claim.notes) && claim.notes.length > 0;

  return (
    <div className="flex flex-col gap-4 h-full">
      <h2 className="text-white font-bold text-lg">Catatan Klaim Garansi</h2>
      <div
        data-testid="claim-notes"
        className="bg-input border border-input-border rounded-lg p-5 flex-1"
      >
        {/* If rejection reasons exist show them first */}
        {(claim.status === CLAIM_STATUS.REJECT_ADMIN || claim.status === CLAIM_STATUS.REJECT_STORE) && claim.rejectionReason ? (
          <p className="text-white text-sm">{claim.rejectionReason}</p>
        ) : /* If a notesSource string/array is available, render it */ (
          notesSource ? (
            Array.isArray(notesSource) ? (
              <div className="flex flex-col gap-2">
                {notesSource.map((note, idx) => (
                  <p key={idx} className="text-white text-sm">{note}</p>
                ))}
              </div>
            ) : (
              <p className="text-white text-sm">{notesSource}</p>
            )
          ) : hasNotesArray ? (
            <div className="flex flex-col gap-2">
              {claim.notes?.map((note, index) => (
                <p key={index} className="text-white text-sm">{note}</p>
              ))}
            </div>
          ) : (
            <p className="text-white/50 text-sm">Tidak Ada Catatan</p>
          )
        )}
      </div>
    </div>
  );
}

// ============ MAIN PAGE COMPONENT ============
export default function ClaimDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // Get claim data based on ID, default to pending state
  const claim = MOCK_CLAIMS[id] || MOCK_CLAIMS["0"];
  const tireInfo = MOCK_TIRE_INFO[claim.status];
  const [showTireDetails, setShowTireDetails] = useState<boolean>(true);
  // Determine whether to show Klaim Toko (hide for statuses 0,1,2)
  const claimStoreValue = (claim as any)?.store?.store_name || claim.claimStore || '';
  const showClaimStore = ![0, 1, 2].includes(claim.status);

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

      {/* Progress Stepper - For stepper statuses (3, 5, 6, 7) */}
      <ProgressStepper currentStep={getProgressStep(claim.status)} status={claim.status} />

      {/* Status Banner - For banner statuses (0, 1, 8) */}
      <StatusBanner status={claim.status} />

      {/* Main Content - Top Section with 2 Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left Column - Grouped Info (Informasi Klaim + Informasi Pengguna) */}
        <div className="xl:col-span-2 flex flex-col gap-5">
          {/* Informasi Klaim Garansi */}
          <div className="flex flex-col gap-4">
            <h2 className="text-white font-bold text-lg">Informasi Klaim Garansi</h2>
            <div className="bg-input border border-input-border rounded-lg p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                <DisabledInput label="ID Klaim Garansi" value={claim.claimId} />
                <DisabledInput label="ID Warranty" value={claim.warrantyId} />
                {showClaimStore && (
                  <DisabledInput label="Klaim Toko" value={claimStoreValue} />
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
                <DisabledInput label="Tanggal Klaim" value={formatDateToId(claim.claimDate)} />
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
                <DisabledInput label="Plat Nomor Kendaraan" value={claim.warranty?.plate_number || MOCK_USER_INFO.plateNumber} />
                <DisabledInput label="Odometer Awal Kendaraan" value={MOCK_USER_INFO.initialOdometer} unit="km" />
                <DisabledInput label="Toko Pembelian" value={MOCK_USER_INFO.purchaseStore} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                <DisabledInput label="Tanggal Pembelian" value={formatDateToId(MOCK_USER_INFO.purchaseDate)} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Notes (stretched to match left height) */}
        <NotesSection claim={claim} />
      </div>

      {/* Full Width Sections Below */}
      <div className="flex flex-col gap-5">
        {/* Bukti Kerusakan Ban & Bukti Odometer Kendaraan - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Bukti Kerusakan Ban */}
          <div className="flex flex-col gap-4">
            <h2 className="text-white font-bold text-lg">Bukti Kerusakan Ban</h2>
            <div className="bg-input border border-input-border rounded-lg p-5">
              <ScrollableImageContainer>
                <div className="flex gap-4 min-w-full">
                  <ImagePreview title="Foto Kerusakan Tampak Depan" />
                  <ImagePreview title="Foto Kerusakan Tampak Pinggir" />
                </div>
              </ScrollableImageContainer>
            </div>
          </div>

          {/* Bukti Odometer Kendaraan */}
          <div className="flex flex-col gap-4">
            <h2 className="text-white font-bold text-lg">Bukti Odometer Kendaraan</h2>
            <div className="bg-input border border-input-border rounded-lg p-5">
              <ScrollableImageContainer>
                <ImagePreview
                  title="Foto Odometer Awal"
                  placeholder="12.2 km | A/B 000096 km"
                />
                <ImagePreview
                  title="Foto Odometer Pengajuan"
                  placeholder="68312 km | 09:00"
                />
              </ScrollableImageContainer>
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
              <button
                type="button"
                onClick={() => setShowTireDetails((s) => !s)}
                className="flex items-center justify-between text-white text-sm py-2"
              >
                <span>Lihat Detail Ban</span>
                <MdOutlineArrowDropDown className={`text-xl transition-transform ${showTireDetails ? "rotate-180" : ""}`} />
              </button>
              {showTireDetails && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                  <DisabledInput label="Tipe Ban" value={tireInfo.tireType} />
                  <DisabledInput label="Ukuran Ban" value={tireInfo.tireSize} />
                  <DisabledInput label="Kode Barcode Ban" value={tireInfo.barcodeCode} />
                  <DisabledInput label="DOT Tire Number" value={tireInfo.dotNumber} />
                </div>
              )}

              {/* Show new tire info for completed claims */}
              {claim.status === CLAIM_STATUS.COMPLETED && tireInfo.newBarcodeCode && tireInfo.newDotNumber && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-5">
                  <DisabledInput label="Kode Barcode Ban Baru" value={tireInfo.newBarcodeCode} />
                  <DisabledInput label="DOT Tire Number Baru" value={tireInfo.newDotNumber} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}
