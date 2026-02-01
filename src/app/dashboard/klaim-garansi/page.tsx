"use client";

import { useState, useRef, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { MdOutlineArrowDropDown, MdOutlineArrowRight } from "react-icons/md";
import StatusBadge from "@/components/common/StatusBadge";

// ============ TYPES ============
type ClaimStatus =
  | "scheduled"
  | "verified"
  | "outOfStock"
  | "adminVerification"
  | "rejectedDunlop"
  | "rejectedShop";

interface ClaimItem {
  id: string;
  claimId: string;
  plateNumber: string;
  scheduledDate: string | null;
  status: ClaimStatus;
}

// ============ STATUS CONFIG ============
const STATUS_CONFIG: Record<
  ClaimStatus,
  {
    label: string;
    badgeVariant: ClaimStatus;
    buttonLabel: string;
    tooltip: string;
  }
> = {
  scheduled: {
    label: "Dijadwalkan",
    badgeVariant: "scheduled",
    buttonLabel: "Lihat Detail",
    tooltip: "Klaim telah dijadwalkan",
  },
  verified: {
    label: "Terverifikasi",
    badgeVariant: "verified",
    buttonLabel: "Ajukan Penjadwalan",
    tooltip: "Klaim telah terverifikasi",
  },
  outOfStock: {
    label: "Stok Tidak Tersedia",
    badgeVariant: "outOfStock",
    buttonLabel: "Ajukan Penjadwalan Ulang",
    tooltip: "Stok produk tidak tersedia",
  },
  adminVerification: {
    label: "Verifikasi Administrasi",
    badgeVariant: "adminVerification",
    buttonLabel: "Lihat Detail",
    tooltip: "Sedang dalam verifikasi administrasi",
  },
  rejectedDunlop: {
    label: "Ditolak Oleh Dunlop",
    badgeVariant: "rejectedDunlop",
    buttonLabel: "Klaim Ditolak",
    tooltip: "Klaim ditolak oleh Dunlop",
  },
  rejectedShop: {
    label: "Ditolak Oleh Dunlop Shop",
    badgeVariant: "rejectedShop",
    buttonLabel: "Klaim Ditolak",
    tooltip: "Klaim ditolak oleh Dunlop Shop",
  },
};

// ============ MOCK DATA ============
const MOCK_CLAIMS: ClaimItem[] = [
  {
    id: "1",
    claimId: "CW-123912821",
    plateNumber: "B 2025 DUN",
    scheduledDate: "3 April 2026, 14:00",
    status: "scheduled",
  },
  {
    id: "2",
    claimId: "CW-123912821",
    plateNumber: "B 2025 DUN",
    scheduledDate: "3 April 2026, 14:00",
    status: "verified",
  },
  {
    id: "3",
    claimId: "CW-123912821",
    plateNumber: "B 2025 DUN",
    scheduledDate: null,
    status: "outOfStock",
  },
  {
    id: "4",
    claimId: "CW-123912821",
    plateNumber: "B 2025 DUN",
    scheduledDate: null,
    status: "adminVerification",
  },
  {
    id: "5",
    claimId: "CW-123912821",
    plateNumber: "B 2025 DUN",
    scheduledDate: null,
    status: "rejectedDunlop",
  },
  {
    id: "6",
    claimId: "CW-123912821",
    plateNumber: "B 2025 DUN",
    scheduledDate: "3 April 2026, 14:00",
    status: "rejectedShop",
  },
];

// ============ CLAIM CARD COMPONENT ============
function ClaimCard({ claim }: { claim: ClaimItem }) {
  const config = STATUS_CONFIG[claim.status];

  return (
    <div
      data-testid={`claim-card-${claim.id}`}
      className="bg-input border border-input-border hover:border-primary transition-all duration-300 rounded-lg flex flex-col gap-2 p-5 text-primary min-h-75 md:h-75 xl:h-80 2xl:h-75"
      style={{
        backgroundImage: "url('/assets/overview/images.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Status Badge */}
      <StatusBadge
        label={config.label}
        variant={config.badgeVariant}
        tooltip={config.tooltip}
      />

      {/* Details */}
      <div className="flex gap-3 w-full items-start mt-3">
        {/* Left Column */}
        <div className="flex flex-col gap-3 w-1/2">
          <div className="flex flex-col gap-1">
            <p className="text-sm xl:text-base font-medium text-primary">
              ID Klaim Garansi
            </p>
            <p className="text-base xl:text-lg text-white font-semibold">
              {claim.claimId}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm xl:text-base font-medium text-primary">
              Plat Nomor
            </p>
            <p className="text-base xl:text-lg text-white font-semibold">
              {claim.plateNumber}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3 w-1/2">
          <div className="flex flex-col gap-1">
            <p className="text-sm xl:text-base font-medium text-primary">
              Jadwal Kedatangan
            </p>
            <p className="text-base xl:text-lg text-white font-semibold">
              {claim.scheduledDate || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        data-testid={`claim-action-btn-${claim.id}`}
        type="button"
        className="bg-primary px-5 py-3 text-secondary rounded-lg text-sm xl:text-base flex items-center gap-1 w-fit mt-auto hover:opacity-90 transition font-semibold"
      >
        <span>{config.buttonLabel}</span>
        <MdOutlineArrowRight />
      </button>
    </div>
  );
}

// ============ MAIN PAGE COMPONENT ============
export default function KlaimGaransiPage() {
  const [open, setOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<ClaimStatus | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter claims based on selected status
  const filteredClaims = filterStatus
    ? MOCK_CLAIMS.filter((c) => c.status === filterStatus)
    : MOCK_CLAIMS;

  return (
    <div
      data-testid="klaim-garansi-page"
      className="flex flex-col gap-5 w-full p-5 text-white min-h-125"
    >
      {/* Header */}
      <div className="relative flex flex-col md:flex-row md:justify-between md:items-center gap-5 font-bold text-sm xl:text-base">
        <p data-testid="page-title">Riwayat Klaim Garansi</p>

        {/* Filter Dropdown */}
        <div ref={wrapperRef} className="relative">
          <button
            data-testid="filter-dropdown-btn"
            onClick={() => setOpen((p) => !p)}
            className="bg-primary px-5 py-3 text-secondary rounded-lg flex items-center gap-1"
          >
            <p>Urutkan Berdasarkan Status</p>
            <MdOutlineArrowDropDown
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div
              data-testid="filter-dropdown-menu"
              className="absolute right-0 mt-2 w-60 bg-primary text-secondary rounded-lg shadow-lg z-50"
            >
              <button
                data-testid="filter-option-all"
                onClick={() => {
                  setFilterStatus(null);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-t-lg"
              >
                Semua Status
              </button>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  data-testid={`filter-option-${key}`}
                  onClick={() => {
                    setFilterStatus(key as ClaimStatus);
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 last:rounded-b-lg"
                >
                  {config.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Claims Grid */}
      <div
        data-testid="claims-grid"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 font-bold"
      >
        {/* CTA Card - Add New Claim */}
        <div
          data-testid="add-claim-card"
          className="bg-input border-2 border-input-border cursor-pointer border-dashed hover:border-primary transition-all duration-300 rounded-lg flex flex-col gap-2 p-5 justify-center items-center text-primary text-lg xl:text-xl h-75 md:h-75 xl:h-80 2xl:h-75"
        >
          <FaPlus />
          <p>Klaim Garansi Ban Anda</p>
        </div>

        {/* Claim Cards */}
        {filteredClaims.map((claim) => (
          <ClaimCard key={claim.id} claim={claim} />
        ))}
      </div>
    </div>
  );
}
