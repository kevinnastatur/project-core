"use client";

import { useState, useEffect,Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineArrowLeft, MdOutlineArrowRight, MdOutlineArrowDropDown, MdClose, MdCalendarToday } from "react-icons/md";
import { IoCheckmarkCircle } from "react-icons/io5";
import { getStore } from "@/services/Warranty";
import { getWarrantyClaimDetail, appointmentClaimWarranty } from "@/services/WarrantlyClaim";
import { StoreItem } from "@/types/general";
import { showSuccessToast, showErrorToast } from "@/helper/toastHelper";

// ============ TYPES ============
type StepNumber = 1 | 2;

interface ClaimDetailData {
  id: number;
  user_id: number;
  tire_warranty_id: number;
  store_id: number | null;
  claim_submission_code: string;
  status: number;
  damage_description: string | null;
  appointment_date: string | null;
  odometer_cust_now: string | null;
  note_principal_submission: string | null;
  approved_at: string | null;
  note_principal_stock: string | null;
  stock_verified_at: string | null;
  note_store_inspection: string | null;
  new_tire_barcode: string | null;
  new_tire_dot: string | null;
  tire_warranty: {
    id: number;
    tire_type: string;
    tire_size: string;
    barcode: string;
    tire_number: string;
    is_active: boolean;
    warranty_date: string;
  };
  store: {
    id: number;
    store_id: string;
    store_name: string;
    province: string;
    city: string;
    url: string | null;
  } | null;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
  };
  image_odometer_url: string | null;
  image_damage_main_url: string | null;
  image_damage_side_url: string | null;
  image_dot_code_url: string | null;
  image_damage_angle_url: string | null;
}

// ============ STEPPER COMPONENT ============
function Stepper({ currentStep }: { currentStep: StepNumber }) {
  const steps = [
    { number: 1, label: "Appointment Klaim Garansi" },
    { number: 2, label: "Konfirmasi Klaim" },
  ];

  return (
    <div className="flex items-center justify-center w-full max-w-xl mx-auto py-8">
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
                mt-2 text-xs xl:text-sm text-center whitespace-nowrap
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
                w-32 xl:w-48 h-0.5 mx-4 mt-[-24px]
                ${currentStep > step.number ? "bg-primary" : "bg-input-border"}
              `}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ============ DROPDOWN COMPONENT ============
function Dropdown({
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled,
}: {
  label: string;
  placeholder: string;
  options: { id: string; name: string }[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((o) => o.id === value);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(!open)}
          className={`
            w-full bg-input border border-input-border rounded-lg p-3 text-left flex items-center justify-between
            ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary cursor-pointer"}
          `}
        >
          <span className={selectedOption ? "text-white" : "text-white/50"}>
            {selectedOption?.name || placeholder}
          </span>
          <MdOutlineArrowDropDown
            className={`text-xl text-white transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-input border border-input-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-white hover:bg-primary hover:text-secondary transition"
              >
                {option.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
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

// ============ MAP PLACEHOLDER COMPONENT ============
function MapPlaceholder({ selectedShop }: { selectedShop: StoreItem | null }) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <h3 className="text-white font-bold text-lg">Lokasi Dunlop Shop</h3>
      <div className="bg-[#2a2a2a] border border-input-border rounded-lg flex-1 min-h-80 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3a3a3a] to-[#2a2a2a] opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-8 gap-1 opacity-20">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="w-8 h-8 border border-white/10 rounded-sm" />
            ))}
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="bg-red-500 p-3 rounded-full shadow-lg">
            <FaMapMarkerAlt className="text-white text-2xl" />
          </div>
          {selectedShop ? (
            <div className="bg-white text-secondary px-4 py-2 rounded-lg shadow-lg text-center max-w-xs">
              <p className="font-bold text-sm">{selectedShop.store_name}</p>
              <p className="text-xs text-gray-600">{selectedShop.city}, {selectedShop.province}</p>
            </div>
          ) : (
            <p className="text-white/50 text-sm">Pilih lokasi Dunlop Shop</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ SUCCESS NOTIFICATION COMPONENT ============
function SuccessNotification({ onClose }: { onClose: () => void }) {
  return (
    <div
      data-testid="success-notification"
      className="fixed top-20 right-5 z-50 bg-white rounded-lg shadow-lg p-4 max-w-md flex items-start gap-3"
    >
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-[#00DF80] flex items-center justify-center">
          <IoCheckmarkCircle className="text-white text-xl" />
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-secondary font-bold text-base">
          Penjadwalan Klaim Garansi Berhasil
        </h3>
        <p className="text-secondary/70 text-sm mt-1">
          Jadwal kunjungan Anda telah dikonfirmasi. Silakan datang ke lokasi Dunlop Shop yang telah dipilih sesuai jadwal.
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="flex-shrink-0 text-secondary/50 hover:text-secondary transition"
      >
        <MdClose className="text-xl" />
      </button>
    </div>
  );
}

// ============ STEP 1: APPOINTMENT KLAIM GARANSI ============
function Step1Appointment({
  stores,
  provinces,
  selectedProvince,
  selectedCity,
  selectedShopId,
  appointmentDate,
  onProvinceChange,
  onCityChange,
  onShopChange,
  onDateChange,
}: {
  stores: StoreItem[];
  provinces: string[];
  selectedProvince: string;
  selectedCity: string;
  selectedShopId: string;
  appointmentDate: string;
  onProvinceChange: (province: string) => void;
  onCityChange: (city: string) => void;
  onShopChange: (id: string) => void;
  onDateChange: (date: string) => void;
}) {
  // Derive cities from selected province
  const cities = [...new Set(
    stores
      .filter((s) => s.province === selectedProvince)
      .map((s) => s.city)
  )];

  // Filter shops by selected city
  const filteredShops = stores.filter(
    (s) => s.province === selectedProvince && s.city === selectedCity
  );

  const currentShop = stores.find((s) => String(s.id) === selectedShopId) || null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Left Column - Form */}
      <div className="flex flex-col gap-6">
        {/* Location Selection Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold text-lg">Pengajuan Klaim Ban Dunlop</h3>
          <div className="bg-input border border-input-border rounded-lg p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Dropdown
                label="Provinsi"
                placeholder="Pilih Provinsi"
                options={provinces.map((p) => ({ id: p, name: p }))}
                value={selectedProvince}
                onChange={(val) => {
                  onProvinceChange(val);
                  onCityChange("");
                  onShopChange("");
                }}
              />
              <Dropdown
                label="Kota/Kabupaten"
                placeholder="Pilih Kota/Kabupaten"
                options={cities.map((c) => ({ id: c, name: c }))}
                value={selectedCity}
                onChange={(val) => {
                  onCityChange(val);
                  onShopChange("");
                }}
                disabled={!selectedProvince}
              />
            </div>
            <div className="mt-5">
              <Dropdown
                label="Cari Lokasi Dunlop Shop"
                placeholder="Pilih Lokasi Dunlop Shop"
                options={filteredShops.map((s) => ({ id: String(s.id), name: s.store_name }))}
                value={selectedShopId}
                onChange={onShopChange}
                disabled={!selectedCity}
              />
            </div>

            {/* Selected Shop Info */}
            {currentShop && (
              <div className="mt-5 p-4 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-primary text-lg mt-1" />
                  <div>
                    <p className="text-white font-semibold">{currentShop.store_name}</p>
                    <p className="text-white/70 text-sm">{currentShop.city}, {currentShop.province}</p>
                    {currentShop.url && (
                      <a href={currentShop.url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm mt-1 block">
                        Lihat di Maps
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Date Selection Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold text-lg">Atur Jadwal Pengajuan Klaim Garansi</h3>
          <div className="bg-input border border-input-border rounded-lg p-5">
            <div className="flex flex-col gap-2">
              <label className="text-primary text-sm font-medium">
                Masukkan Tanggal <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  data-testid="appointment-date-input"
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="w-full bg-input border border-input-border rounded-lg p-3 text-white outline-none hover:border-primary focus:border-primary"
                />
                <MdCalendarToday className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Map */}
      <MapPlaceholder selectedShop={currentShop} />
    </div>
  );
}

// ============ STEP 2: KONFIRMASI KLAIM ============
function Step2Konfirmasi({
  claimDetail,
  selectedShop,
  appointmentDate,
}: {
  claimDetail: ClaimDetailData | null;
  selectedShop: StoreItem | null;
  appointmentDate: string;
}) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Informasi Klaim Garansi */}
      <div className="flex flex-col gap-4">
        <h3 className="text-white font-bold text-lg">Informasi Klaim Garansi</h3>
        <div className="bg-input border border-input-border rounded-lg p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <DisabledInput label="ID Klaim Garansi" value={claimDetail?.claim_submission_code || "-"} />
            <DisabledInput label="ID Warranty" value={claimDetail?.tire_warranty?.barcode || "-"} />
            <DisabledInput label="Tanggal Klaim" value={claimDetail?.approved_at ? formatDate(claimDetail.approved_at) : "-"} />
            <DisabledInput label="Odometer Saat Ini" value={claimDetail?.odometer_cust_now || "-"} unit="km" />
          </div>
        </div>
      </div>

      {/* Informasi Dunlop Shop */}
      <div className="flex flex-col gap-4">
        <h3 className="text-white font-bold text-lg">Informasi Dunlop Shop</h3>
        <div className="bg-input border border-input-border rounded-lg p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <DisabledInput label="Nama Dunlop Shop" value={selectedShop?.store_name || "-"} />
            <DisabledInput label="Kota" value={selectedShop?.city || "-"} />
          </div>
          <div className="mt-5">
            <DisabledInput label="Provinsi" value={selectedShop?.province || "-"} />
          </div>
        </div>
      </div>

      {/* Jadwal Kunjungan — from Step 1 local state, NOT from API */}
      <div className="flex flex-col gap-4">
        <h3 className="text-white font-bold text-lg">Jadwal Kunjungan</h3>
        <div className="bg-input border border-input-border rounded-lg p-5">
          <DisabledInput label="Tanggal Kunjungan" value={formatDate(appointmentDate)} />
        </div>
      </div>

      {/* Informasi Pengguna */}
      <div className="flex flex-col gap-4">
        <h3 className="text-white font-bold text-lg">Informasi Pengguna</h3>
        <div className="bg-input border border-input-border rounded-lg p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <DisabledInput label="Nama Lengkap" value={claimDetail?.user?.name || "-"} />
            <DisabledInput label="Nomor Telepon" value={claimDetail?.user?.phone || "-"} />
            <DisabledInput label="Tipe Ban" value={claimDetail?.tire_warranty?.tire_type || "-"} />
            <DisabledInput label="Ukuran Ban" value={claimDetail?.tire_warranty?.tire_size || "-"} />
            <DisabledInput label="Odometer Saat Ini" value={claimDetail?.odometer_cust_now || "-"} unit="km" />
            <DisabledInput label="Toko Klaim" value={selectedShop?.store_name || "-"} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN PAGE COMPONENT ============
function JadwalKlaimGaransi() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const claimId = searchParams.get("claimId");

  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedShopId, setSelectedShopId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // API data
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [claimDetail, setClaimDetail] = useState<ClaimDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  // Derived: unique provinces from stores
  const provinces = [...new Set(stores.map((s) => s.province).filter(Boolean))];

  // Derived: currently selected shop object
  const currentShopData = stores.find((s) => String(s.id) === selectedShopId) || null;

  // Fetch stores on mount
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await getStore();
        setStores(res.data ?? []);
      } catch (err) {
        console.error("Failed to fetch stores:", err);
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  // Fetch claim detail when moving to Step 2
  useEffect(() => {
    if (currentStep === 2 && claimId) {
      const fetchDetail = async () => {
        try {
          const res = await getWarrantyClaimDetail(claimId);
          if (res.success && res.data) {
            setClaimDetail(res.data);
          }
        } catch (err) {
          console.error("Failed to fetch claim detail:", err);
          showErrorToast("Gagal memuat detail klaim", "Silakan coba lagi.");
        }
      };

      fetchDetail();
    }
  }, [currentStep, claimId]);

  // Redirect if no claimId
  useEffect(() => {
    if (!claimId) {
      router.push("/dashboard/klaim-garansi");
    }
  }, [claimId, router]);

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!claimId || !selectedShopId || !appointmentDate) return;

      setSubmitting(true);
      try {
        const res = await appointmentClaimWarranty(Number(claimId), {
          store_id: selectedShopId,
          appointment_date: appointmentDate,
        });

        if (res.success) {
          setCurrentStep(2);
        } else {
          showErrorToast("Gagal mengajukan jadwal", res.message || "Silakan coba lagi.");
        }
      } catch (err) {
        console.error("Appointment submission failed:", err);
        showErrorToast("Gagal mengajukan jadwal", "Terjadi kesalahan. Silakan coba lagi.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = () => {
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    router.push("/dashboard/klaim-garansi");
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        router.push("/dashboard/klaim-garansi");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, router]);

  const canProceed = () => {
    if (currentStep === 1) {
      return selectedProvince && selectedCity && selectedShopId && appointmentDate && !submitting;
    }
    return true;
  };

  if (!claimId) return null;

  return (
    <div
      data-testid="jadwal-klaim-page"
      className="flex flex-col gap-5 w-full p-5 text-white min-h-125"
    >
      {/* Success Notification */}
      {showSuccess && <SuccessNotification onClose={handleCloseSuccess} />}

      {/* Breadcrumb */}
      <div className="text-sm text-white/70">
        <span>Klaim Garansi</span>
        <span className="mx-2">/</span>
        <span className="text-primary">Daftar Klaim Garansi Ban</span>
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

      {/* Title */}
      <h1 className="text-xl xl:text-2xl font-bold">
        Pengajuan Klaim Garansi Ban Dunlop
      </h1>

      {/* Stepper */}
      <Stepper currentStep={currentStep} />

      {/* Loading State */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center py-20">
          <p className="text-white/50">Memuat data...</p>
        </div>
      ) : (
        <>
          {/* Step Content */}
          <div className="flex-1">
            {currentStep === 1 && (
              <Step1Appointment
                stores={stores}
                provinces={provinces}
                selectedProvince={selectedProvince}
                selectedCity={selectedCity}
                selectedShopId={selectedShopId}
                appointmentDate={appointmentDate}
                onProvinceChange={setSelectedProvince}
                onCityChange={setSelectedCity}
                onShopChange={setSelectedShopId}
                onDateChange={setAppointmentDate}
              />
            )}
            {currentStep === 2 && (
              <Step2Konfirmasi
                claimDetail={claimDetail}
                selectedShop={currentShopData}
                appointmentDate={appointmentDate}
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <button
                data-testid="prev-step-btn"
                type="button"
                onClick={handlePrev}
                className="bg-[#333333] px-8 py-3 text-primary rounded-lg text-sm font-bold flex items-center gap-1 hover:opacity-90 transition"
              >
                <MdOutlineArrowLeft />
                <span>Kembali</span>
              </button>
            )}
            <button
              data-testid="next-step-btn"
              type="button"
              onClick={currentStep === 2 ? handleSubmit : handleNext}
              disabled={!canProceed()}
              className={`
                flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-1
                transition
                ${
                  canProceed()
                    ? "bg-primary text-secondary hover:opacity-90"
                    : "bg-primary/50 text-secondary/50 cursor-not-allowed"
                }
              `}
            >
              {submitting ? (
                <span>Mengirim...</span>
              ) : (
                <>
                  <span>{currentStep === 2 ? "Ajukan Penjadwalan" : "Lanjutkan"}</span>
                  <MdOutlineArrowRight />
                </>
              )}
            </button>
          </div>
        </>
      )}

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

export default function JadwalKlaimGaransiPage() {
return (
  <Suspense fallback={<div>Loading...</div>}>
    <JadwalKlaimGaransi />
  </Suspense>
);
}
