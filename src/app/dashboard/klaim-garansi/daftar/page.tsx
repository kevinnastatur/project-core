"use client";

import { useState } from "react";
import { FaCheckCircle, FaPlus } from "react-icons/fa";
import { MdOutlineArrowLeft, MdOutlineArrowRight, MdOutlineArrowDropDown } from "react-icons/md";
import { IoAlertCircle, IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";

// ============ TYPES ============
type StepNumber = 1 | 2 | 3;

interface WarrantyCard {
  id: string;
  warrantyId: string;
  plateNumber: string;
  warrantyEndDate: string | null;
  status: "active" | "verification" | "expired" | "claimed";
  claimedDate?: string;
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

interface TireSelection {
  id: string;
  warrantyId: string;
  status: "active" | "claimed";
  warrantyEndDate: string;
  claimedDate?: string;
  expanded: boolean;
}

// ============ MOCK DATA ============
const MOCK_WARRANTIES: WarrantyCard[] = [
  {
    id: "1",
    warrantyId: "DTW-1239128001",
    plateNumber: "B 2025 DUN",
    warrantyEndDate: "1 Januari 2027",
    status: "active",
  },
  {
    id: "2",
    warrantyId: "DTW-1239128001",
    plateNumber: "B 2025 DUN",
    warrantyEndDate: null,
    status: "verification",
  },
  {
    id: "3",
    warrantyId: "DTW-1239128001",
    plateNumber: "B 2025 DUN",
    warrantyEndDate: null,
    status: "verification",
  },
];

const MOCK_USER_INFO: UserInfo = {
  fullName: "Esther Howard",
  phone: "+62 8121455663437",
  vehicleType: "Innova Zenix Q",
  plateNumber: "B 2025 DUN",
  initialOdometer: "68312",
  purchaseStore: "MPN Kharisma",
  purchaseDate: "1 Januari 2026",
};

const MOCK_TIRES: TireSelection[] = [
  {
    id: "t1",
    warrantyId: "DTW-1239128001",
    status: "active",
    warrantyEndDate: "1 Januari 2027",
    expanded: false,
  },
  {
    id: "t2",
    warrantyId: "DTW-1239128001",
    status: "claimed",
    warrantyEndDate: "1 Januari 2027",
    claimedDate: "3 April 2026",
    expanded: false,
  },
  {
    id: "t3",
    warrantyId: "DTW-1239128001",
    status: "active",
    warrantyEndDate: "1 Januari 2027",
    expanded: false,
  },
  {
    id: "t4",
    warrantyId: "DTW-1239128001",
    status: "active",
    warrantyEndDate: "1 Januari 2027",
    expanded: false,
  },
];

const BASE_PATH = "/id/warranty";

// ============ STEPPER COMPONENT ============
function Stepper({ currentStep }: { currentStep: StepNumber }) {
  const steps = [
    { number: 1, label: "Data Garansi Ban" },
    { number: 2, label: "Konfirmasi Data Garansi" },
    { number: 3, label: "Unggah Data Klaim" },
  ];

  return (
    <div className="flex items-center justify-center w-full max-w-2xl mx-auto py-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          {/* Step Circle */}
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

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={`
                w-24 xl:w-32 h-0.5 mx-2 mt-[-24px]
                ${currentStep > step.number ? "bg-primary" : "bg-input-border"}
              `}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ============ STEP 1: PILIH BAN ============
function Step1PilihBan({
  selectedWarranty,
  onSelect,
}: {
  selectedWarranty: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-white font-bold text-lg xl:text-xl">
        Pilih Ban Yang Ingin Di Dervice
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {MOCK_WARRANTIES.map((warranty) => (
          <div
            key={warranty.id}
            data-testid={`warranty-card-${warranty.id}`}
            className={`
              bg-input border rounded-lg p-5 flex flex-col gap-3
              transition-all duration-300
              ${
                selectedWarranty === warranty.id
                  ? "border-primary"
                  : "border-input-border hover:border-primary"
              }
            `}
            style={{
              backgroundImage: "url('/assets/overview/images.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Status Badge */}
            <div className="flex items-start">
              {warranty.status === "active" ? (
                <span className="bg-[#00DF80] text-secondary px-3 py-1.5 rounded-full text-xs font-medium">
                  Garansi Aktif
                </span>
              ) : (
                <span className="bg-input-border text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
                  Proses Verifikasi
                  <IoAlertCircle className="text-sm" />
                </span>
              )}
            </div>

            {/* Warranty Details */}
            <div className="flex gap-5 mt-2">
              <div className="flex flex-col gap-1">
                <p className="text-primary text-sm font-medium">ID Warranty</p>
                <p className="text-white font-semibold">{warranty.warrantyId}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-primary text-sm font-medium">Masa Garansi</p>
                <p className="text-white font-semibold">
                  {warranty.warrantyEndDate
                    ? `Aktif s/d ${warranty.warrantyEndDate}`
                    : "-"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-primary text-sm font-medium">Plat Nomor</p>
              <p className="text-white font-semibold">{warranty.plateNumber}</p>
            </div>

            {/* Select Button */}
            {warranty.status === "active" && (
              <button
                data-testid={`select-warranty-btn-${warranty.id}`}
                type="button"
                onClick={() => onSelect(warranty.id)}
                className={`
                  mt-auto px-5 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-1
                  transition hover:opacity-90
                  ${
                    selectedWarranty === warranty.id
                      ? "bg-[#00DF80] text-secondary"
                      : "bg-primary text-secondary"
                  }
                `}
              >
                {selectedWarranty === warranty.id ? (
                  <>
                    <FaCheckCircle />
                    <span>Terpilih</span>
                  </>
                ) : (
                  <>
                    <span>Pilih Ban</span>
                    <MdOutlineArrowRight />
                  </>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ STEP 2: KONFIRMASI DATA ============
function Step2KonfirmasiData({
  selectedTires,
  onToggleTire,
}: {
  selectedTires: string[];
  onToggleTire: (id: string) => void;
}) {
  const [expandedTires, setExpandedTires] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedTires((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {/* User Information Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-white font-bold text-lg xl:text-xl">
          Informasi Pengguna
        </h2>

        <div className="bg-input border border-input-border rounded-lg p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {/* Row 1 */}
            <div className="flex flex-col gap-2">
              <label className="text-primary text-sm font-medium">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <div className="bg-color-input-disabled text-[#a3a3a3] p-3 rounded-lg font-medium">
                {MOCK_USER_INFO.fullName}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-primary text-sm font-medium">
                Nomor Telepon <span className="text-red-500">*</span>
              </label>
              <div className="bg-color-input-disabled text-[#a3a3a3] p-3 rounded-lg font-medium">
                {MOCK_USER_INFO.phone}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-primary text-sm font-medium">
                Tipe Kendaraan <span className="text-red-500">*</span>
              </label>
              <div className="bg-color-input-disabled text-[#a3a3a3] p-3 rounded-lg font-medium">
                {MOCK_USER_INFO.vehicleType}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-primary text-sm font-medium">
                Plat Nomor Kendaraan <span className="text-red-500">*</span>
              </label>
              <div className="bg-color-input-disabled text-[#a3a3a3] p-3 rounded-lg font-medium">
                {MOCK_USER_INFO.plateNumber}
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col gap-2">
              <label className="text-primary text-sm font-medium">
                Odometer Awal Kendaraan <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center bg-color-input-disabled text-[#a3a3a3] rounded-lg overflow-hidden">
                <span className="flex-1 p-3 font-medium">
                  {MOCK_USER_INFO.initialOdometer}
                </span>
                <span className="px-3 font-medium">km</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-primary text-sm font-medium">
                Toko Pembelian <span className="text-red-500">*</span>
              </label>
              <div className="bg-color-input-disabled text-[#a3a3a3] p-3 rounded-lg font-medium">
                {MOCK_USER_INFO.purchaseStore}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-primary text-sm font-medium">
                Tanggal Pembelian <span className="text-red-500">*</span>
              </label>
              <div className="bg-color-input-disabled text-[#a3a3a3] p-3 rounded-lg font-medium flex items-center">
                <span className="flex-1">{MOCK_USER_INFO.purchaseDate}</span>
                <span className="text-lg">📅</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tire Selection Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-white font-bold text-lg xl:text-xl">Pilih Ban</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MOCK_TIRES.map((tire) => (
            <div
              key={tire.id}
              data-testid={`tire-card-${tire.id}`}
              className={`
                bg-input border rounded-lg p-5 flex flex-col gap-3
                ${
                  selectedTires.includes(tire.id)
                    ? "border-primary"
                    : "border-input-border"
                }
              `}
            >
              {/* Status Header */}
              <div className="flex items-start gap-2">
                {tire.status === "active" ? (
                  <>
                    <IoCheckmarkCircle className="text-[#00DF80] text-xl mt-0.5" />
                    <div>
                      <p className="text-white font-semibold">
                        Status Garansi Ban Aktif
                      </p>
                      <p className="text-white text-sm">
                        Garansi Ban aktif sampai dengan:{" "}
                        <span className="font-bold text-primary">
                          {tire.warrantyEndDate}
                        </span>
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <IoAlertCircle className="text-red-500 text-xl mt-0.5" />
                    <div>
                      <p className="text-white font-semibold">
                        Garansi Habis! Anda Sudah Melakukan Claim Garansi Ban
                      </p>
                      <p className="text-white text-sm">
                        Anda sudah melakukan Klaim Garansi ban Anda di:{" "}
                        <span className="font-bold text-primary">
                          {tire.claimedDate}
                        </span>
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Expandable Detail */}
              <button
                type="button"
                onClick={() => toggleExpand(tire.id)}
                className="flex items-center justify-between text-white text-sm py-2 border-t border-input-border"
              >
                <span>Lihat Detail Ban</span>
                <MdOutlineArrowDropDown
                  className={`text-xl transition-transform ${
                    expandedTires.includes(tire.id) ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Select Button */}
              {tire.status === "active" ? (
                <button
                  data-testid={`select-tire-btn-${tire.id}`}
                  type="button"
                  onClick={() => onToggleTire(tire.id)}
                  className={`
                    w-full py-3 rounded-lg text-sm font-bold
                    transition hover:opacity-90
                    ${
                      selectedTires.includes(tire.id)
                        ? "bg-[#00DF80] text-secondary"
                        : "bg-primary text-secondary"
                    }
                  `}
                >
                  {selectedTires.includes(tire.id) ? "Terpilih" : "Pilih Ban"}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full py-3 rounded-lg text-sm font-bold bg-[#333333] text-[#666666] cursor-not-allowed"
                >
                  Tidak Dapat Memilih Ban
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ STEP 3: UNGGAH DATA KLAIM ============
function Step3UploadData({
  odometerValue,
  onOdometerChange,
  uploadedImages,
  onImageUpload,
  onImageRemove,
}: {
  odometerValue: string;
  onOdometerChange: (val: string) => void;
  uploadedImages: Record<string, File | null>;
  onImageUpload: (key: string, file: File) => void;
  onImageRemove: (key: string) => void;
}) {
  const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(key, file);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Odometer Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-white font-bold text-lg xl:text-xl">
          Odometer Kendaraan <span className="text-red-500">*</span>
        </h2>

        {/* Odometer Input */}
        <div className="flex items-center bg-input border border-input-border rounded-lg overflow-hidden max-w-md">
          <input
            data-testid="odometer-input"
            type="text"
            inputMode="numeric"
            value={odometerValue}
            onChange={(e) => onOdometerChange(e.target.value.replace(/\D/g, ""))}
            placeholder="Masukan Odometer Saat Ini"
            className="flex-1 bg-transparent py-3 px-5 text-white font-medium outline-none"
          />
          <span className="px-5 text-white font-medium">km</span>
        </div>

        {/* Example Images */}
        <div className="bg-input border border-input-border rounded-lg p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Recommended */}
            <div className="flex flex-col gap-3">
              <div className="relative">
                <div className="absolute top-2 left-2 bg-[#00DF80] rounded-full p-1">
                  <IoCheckmarkCircle className="text-white text-lg" />
                </div>
                <div className="bg-[#333333] rounded-lg h-40 flex items-center justify-center overflow-hidden">
                  <Image
                    src={`${BASE_PATH}/assets/odometer-good.png`}
                    alt="Odometer yang direkomendasikan"
                    width={200}
                    height={150}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="text-center text-white/50 text-sm p-4 absolute">
                    <p>12.2 km</p>
                    <p>24°C ENTER A/B 000096 km</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-white font-bold">
                  Foto Odometer Yang Direkomendasikan
                </p>
                <p className="text-white/70 text-sm">
                  Odometer harus terlihat jelas dan mudah terbaca.
                </p>
              </div>
            </div>

            {/* Not Recommended */}
            <div className="flex flex-col gap-3">
              <div className="relative">
                <div className="absolute top-2 left-2 bg-red-500 rounded-full p-1">
                  <IoCloseCircle className="text-white text-lg" />
                </div>
                <div className="bg-[#333333] rounded-lg h-40 flex items-center justify-center overflow-hidden">
                  <Image
                    src={`${BASE_PATH}/assets/odometer-bad.png`}
                    alt="Odometer yang tidak direkomendasikan"
                    width={200}
                    height={150}
                    className="object-cover w-full h-full opacity-50"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="text-center text-white/30 text-sm p-4 blur-sm absolute">
                    <p>12.2 km</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-white font-bold">
                  Foto Odometer Yang Tidak Direkomendasikan
                </p>
                <p className="text-white/70 text-sm">
                  Odometer tidak terlihat jelas dan sulit terbaca.
                </p>
              </div>
            </div>
          </div>

          <p className="text-primary text-sm mt-4">
            Harap dicatat bahwa gambar menunjukkan pembacaan odometer, bukan nilai untuk Trip A atau Trip B.
          </p>

          {/* Odometer Upload */}
          <div className="mt-5">
            <UploadArea
              id="odometer-image"
              label="Upload Gambar Odometer Kendaraan Anda"
              description="Upload Gambar dalam format .PNG/.JPG"
              required
              file={uploadedImages["odometer"]}
              onChange={(e) => handleFileChange("odometer", e)}
              onRemove={() => onImageRemove("odometer")}
            />
          </div>
        </div>
      </div>

      {/* Bukti Kerusakan Ban Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-white font-bold text-lg xl:text-xl">
          Bukti Kerusakan Ban
        </h2>

        <div className="bg-input border border-input-border rounded-lg p-5">
          {/* Example Images Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <ExampleImage title="Foto Outside Ban" />
            <ExampleImage title="Foto DOT Ban" />
            <ExampleImage title="Foto Kerusakan Ban" />
            <ExampleImage title="Foto Kerusakan Ban dengan Angle Berbeda" />
          </div>

          <p className="text-primary text-sm mb-5">
            Harap pastikan bahwa foto diambil di area yang terang untuk hasil terbaik.
          </p>

          {/* Upload Areas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <UploadArea
              id="outside-ban"
              label="Upload Gambar Outside Ban"
              description="Upload Gambar dalam format .PNG/.JPG"
              required
              file={uploadedImages["outside"]}
              onChange={(e) => handleFileChange("outside", e)}
              onRemove={() => onImageRemove("outside")}
            />
            <UploadArea
              id="dot-ban"
              label="Upload Gambar (DOT) Pada Ban Anda"
              description="Upload Gambar dalam format .PNG/.JPG"
              required
              file={uploadedImages["dot"]}
              onChange={(e) => handleFileChange("dot", e)}
              onRemove={() => onImageRemove("dot")}
            />
            <UploadArea
              id="kerusakan-ban"
              label="Upload Gambar Kerusakan Ban Anda"
              description="Upload Gambar dalam format .PNG/.JPG"
              required
              file={uploadedImages["kerusakan"]}
              onChange={(e) => handleFileChange("kerusakan", e)}
              onRemove={() => onImageRemove("kerusakan")}
            />
            <UploadArea
              id="kerusakan-angle"
              label="Upload Gambar Kerusakan Ban Anda Dengan Angle Berbeda"
              description="Upload Gambar dalam format .PNG/.JPG"
              required
              file={uploadedImages["angle"]}
              onChange={(e) => handleFileChange("angle", e)}
              onRemove={() => onImageRemove("angle")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ UPLOAD AREA COMPONENT ============
function UploadArea({
  id,
  label,
  description,
  required,
  file,
  onChange,
  onRemove,
}: {
  id: string;
  label: string;
  description: string;
  required?: boolean;
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <input
        id={id}
        type="file"
        accept=".png,.jpg,.jpeg"
        onChange={onChange}
        className="hidden"
      />
      <label
        htmlFor={id}
        data-testid={`upload-area-${id}`}
        className={`
          bg-input p-5 rounded-lg border-2 border-dashed min-h-32
          flex flex-col items-center justify-center gap-2 cursor-pointer
          transition hover:border-primary
          ${file ? "border-primary" : "border-input-border"}
        `}
      >
        {file ? (
          <div className="relative flex flex-col items-center gap-2">
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="h-20 w-20 object-cover rounded-lg"
            />
            <p className="text-white text-xs truncate max-w-32">{file.name}</p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onRemove();
              }}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full text-xs"
            >
              ✕
            </button>
          </div>
        ) : (
          <>
            <p className="text-primary text-sm text-center flex items-center gap-2">
              {label} <FaPlus className="text-xs" />
            </p>
            <p className="text-white/70 text-xs text-center">
              {description}{" "}
              {required && <span className="text-red-500">(Required)</span>}
            </p>
          </>
        )}
      </label>
    </div>
  );
}

// ============ EXAMPLE IMAGE COMPONENT ============
function ExampleImage({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="bg-[#333333] rounded-lg h-28 flex items-center justify-center">
        <div className="text-white/30 text-xs text-center p-2">
          [Contoh Gambar]
        </div>
      </div>
      <p className="text-white text-sm font-medium">{title}</p>
    </div>
  );
}

// ============ MAIN PAGE COMPONENT ============
export default function DaftarKlaimGaransiPage() {
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [selectedWarranty, setSelectedWarranty] = useState<string | null>(null);
  const [selectedTires, setSelectedTires] = useState<string[]>([]);
  const [odometerValue, setOdometerValue] = useState("");
  const [uploadedImages, setUploadedImages] = useState<Record<string, File | null>>({
    odometer: null,
    outside: null,
    dot: null,
    kerusakan: null,
    angle: null,
  });

  const handleWarrantySelect = (id: string) => {
    setSelectedWarranty(id);
  };

  const handleTireToggle = (id: string) => {
    setSelectedTires((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleImageUpload = (key: string, file: File) => {
    setUploadedImages((prev) => ({ ...prev, [key]: file }));
  };

  const handleImageRemove = (key: string) => {
    setUploadedImages((prev) => ({ ...prev, [key]: null }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as StepNumber);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as StepNumber);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedWarranty !== null;
      case 2:
        return selectedTires.length > 0;
      case 3:
        return odometerValue.length > 0;
      default:
        return false;
    }
  };

  return (
    <div data-testid="daftar-klaim-page" className="flex flex-col gap-5 w-full p-5 text-white min-h-125">
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

      {/* Step Content */}
      <div className="flex-1">
        {currentStep === 1 && (
          <Step1PilihBan
            selectedWarranty={selectedWarranty}
            onSelect={handleWarrantySelect}
          />
        )}
        {currentStep === 2 && (
          <Step2KonfirmasiData
            selectedTires={selectedTires}
            onToggleTire={handleTireToggle}
          />
        )}
        {currentStep === 3 && (
          <Step3UploadData
            odometerValue={odometerValue}
            onOdometerChange={setOdometerValue}
            uploadedImages={uploadedImages}
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
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
          onClick={handleNext}
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
          <span>{currentStep === 3 ? "Ajukan Klaim Ban" : "Lanjutkan"}</span>
          <MdOutlineArrowRight />
        </button>
      </div>
    </div>
  );
}
