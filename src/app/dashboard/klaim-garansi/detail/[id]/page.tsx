"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { MdOutlineArrowLeft, MdOutlineArrowDropDown } from "react-icons/md";
import { IoCheckmarkCircle, IoAlertCircle } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { getWarrantyClaimDetail } from "@/services/WarrantlyClaim"
import { CLAIM_STATUS } from "@/constants/claimStatus";

// ============ TYPES ============
type ProgressStep = 0 | 1 | 2 | 3 | 4;

interface ClaimDetail {
  id: number;
  claim_submission_code: string;
  tire_warranty_id: string;
  claimStore?: string;
  claimDate?: string;
  claimTime?: string;
  created_at?: string;
  odometer_cust_now: string;
  status: number;
  rejectionReason?: string;
  notes?: string[];
  note_principal_submission?: string;
  note_principal_stock?: string | string[];
  note_store_inspection?: string | string[];
  image_odometer_url?: string;
  image_damage_main_url?: string;
  image_damage_side_url?: string;
  image_dot_code_url?: string;
  image_damage_angle_url?: string;
  warranty?: {
    model?: string;
    odometer?: string;
    store_name?: string;
    purchase_date?: string;
    plate_number?: string;
  };
  store?: {
    store_name?: string;
  };
}

interface UserInfo {
  id: number;
  user_id: number;
  warranty_code: string;
  brand?: string;
  model?: string;
  odometer?: string;
  plate_number?: string;
  purchase_date?: string;
  store_name?: string;
  name: string;
  phone: string;
}

interface TireInfo {
  is_active: boolean;
  warranty_date: string;
  claimedDate?: string;
  tire_type: string;
  tire_size: string;
  barcode: string;
  tire_number: string;
  newBarcodeCode: string;
  newDotNumber: string;
}


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
function ImagePreview({
  title,
  imageUrl,
  placeholder,
}: {
  title: string;
  imageUrl?: string | null;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2 min-w-48">
      <div className="bg-[#333333] rounded-lg h-40 flex items-center justify-center overflow-hidden border border-input-border">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-white/50 text-xs text-center p-4">
            {placeholder ?? "[Preview Gambar]"}
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
  const monthNames = [
    "Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember",
  ];
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    const day = d.getDate();
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  }
  return dateStr;
}


// ============ WARRANTY STATUS CARD COMPONENT ============
function WarrantyStatusCard({ status, tireInfo }: { status: number; tireInfo: TireInfo | null }) {
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
            <span className="font-bold text-secondary">{tireInfo?.warranty_date}</span>
          </p>
        </div>
      </div>
    );
  }

  if (tireInfo && !tireInfo.is_active) {
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

  // Active status for verifikasi_stok and dijadwalkan
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
          <span className="font-bold text-secondary">{tireInfo?.warranty_date}</span>
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
        {(claim.status === CLAIM_STATUS.REJECT_ADMIN || claim.status === CLAIM_STATUS.REJECT_STORE) && (claim.rejectionReason) ? (
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

// ============ MAIN PAGE COMPONENT ============
export default function ClaimDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [dataClaim, setDataClaim] = useState<ClaimDetail>({
    id: 0,
    claim_submission_code: '',
    tire_warranty_id: '',
    claimStore: '',
    claimDate: '',
    claimTime: '',
    odometer_cust_now: '',
    status: 0,
  });
  const [dataUser, setDataUser] = useState<UserInfo | null>(null);
  const [dataTire, setDataTire] = useState<TireInfo | null>(null);
  const [showTireDetails, setShowTireDetails] = useState<boolean>(true);
  // Determine whether to show Klaim Toko (hide for statuses 0,1,2)
  const claimStoreValue = dataClaim?.store?.store_name || dataClaim?.warranty?.store_name || dataClaim?.claimStore || '';
  const showClaimStore = ![0, 1, 2].includes(dataClaim?.status ?? -1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getWarrantyClaimDetail(id);
        if (res.success && res.data) {
          setDataUser(res.data.user ?? []);
          setDataClaim(res.data ?? []);
          setDataTire(res.data.tire_warranty ?? []);
        }
      } catch (error) {
        console.error(error);
        // setData([]);
      } finally {
      }
    };

    fetchData();
  }, [id]);

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
      <ProgressStepper currentStep={getProgressStep(dataClaim?.status)} status={dataClaim?.status} />

      {/* Status Banner - For banner statuses (0, 1, 8) */}
      <StatusBanner status={dataClaim?.status} />

      {/* Main Content - Top Section with 2 Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left Column - Grouped Info (Informasi Klaim + Informasi Pengguna) */}
        <div className="xl:col-span-2 flex flex-col gap-5">
          {/* Informasi Klaim Garansi */}
          <div className="flex flex-col gap-4">
            <h2 className="text-white font-bold text-lg">Informasi Klaim Garansi</h2>
            <div className="bg-input border border-input-border rounded-lg p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                <DisabledInput label="ID Klaim Garansi" value={dataClaim?.claim_submission_code} />
                <DisabledInput label="ID Warranty" value={dataClaim?.tire_warranty_id} />
                {showClaimStore && (
                  <DisabledInput label="Klaim Toko" value={claimStoreValue} />
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
                <DisabledInput label="Tanggal Klaim" value={formatDateToId(dataClaim?.created_at || dataClaim?.claimDate || '')} />
                <DisabledInput label="Odometer Saat Ini" value={dataClaim?.odometer_cust_now || ''} unit="km" />
              </div>
            </div>
          </div>

          {/* Informasi Pengguna */}
          <div className="flex flex-col gap-4">
            <h2 className="text-white font-bold text-lg">Informasi Pengguna</h2>
            <div className="bg-input border border-input-border rounded-lg p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                <DisabledInput label="Nama Lengkap" value={dataUser?.name || ''} />
                <DisabledInput label="Nomor Telepon" value={dataUser?.phone || ''} />
                <DisabledInput label="Tipe Kendaraan" value={dataClaim?.warranty?.model || dataUser?.model || ''} />
                <DisabledInput label="Plat Nomor Kendaraan" value={dataClaim?.warranty?.plate_number || dataUser?.plate_number || ''} />
                <DisabledInput label="Odometer Awal Kendaraan" value={dataClaim?.warranty?.odometer || dataUser?.odometer || ''} unit="km" />
                <DisabledInput label="Toko Pembelian" value={dataClaim?.warranty?.store_name || dataUser?.store_name || ''} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                <DisabledInput label="Tanggal Pembelian" value={formatDateToId(dataClaim?.warranty?.purchase_date || dataUser?.purchase_date || '')} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Notes (stretched to match left height) */}
        <NotesSection claim={dataClaim} />
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
                  <ImagePreview title="Foto Kerusakan Ban" imageUrl={dataClaim?.image_damage_main_url} />
                  <ImagePreview title="Foto Outside Ban" imageUrl={dataClaim?.image_damage_side_url} />
                  <ImagePreview title="Foto DOT Ban" imageUrl={dataClaim?.image_dot_code_url} />
                  <ImagePreview title="Foto Kerusakan Angle Berbeda" imageUrl={dataClaim?.image_damage_angle_url} />
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
                  imageUrl={dataClaim?.image_odometer_url}
                />
                <ImagePreview
                  title="Foto Odometer Pengajuan"
                  imageUrl={dataClaim?.image_odometer_url}
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
            <WarrantyStatusCard status={dataClaim?.status} tireInfo={dataTire} />

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
                  <DisabledInput label="Tipe Ban" value={dataTire?.tire_type || ''} />
                  <DisabledInput label="Ukuran Ban" value={dataTire?.tire_size || ''} />
                  <DisabledInput label="Kode Barcode Ban" value={dataTire?.barcode || ''} />
                  <DisabledInput label="DOT Tire Number" value={dataTire?.tire_number || ''} />
                </div>
              )}

              {/* Show new tire info for completed claims */}
              {dataClaim?.status === CLAIM_STATUS.COMPLETED && dataTire?.newBarcodeCode && dataTire?.newDotNumber && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-5">
                  <DisabledInput label="Kode Barcode Ban Baru" value={dataTire?.newBarcodeCode} />
                  <DisabledInput label="DOT Tire Number Baru" value={dataTire?.newDotNumber} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}
