"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import StatusBadge from "@/components/common/StatusBadge";
import Pagination from "@/components/ui/Pagination";
import { CiSearch } from "react-icons/ci";
import { FiDownload } from "react-icons/fi";
import {
  MdOutlineArrowDropDown,
  MdOutlineArrowDropUp,
  MdOutlineRemoveRedEye,
} from "react-icons/md";

type ClaimStatus =
  | "Menunggu Verifikasi"
  | "Dijadwalkan"
  | "Klaim Selesai"
  | "Verifikasi Principal"
  | "Dibatalkan Otomatis";

type ClaimRequest = {
  id: string;
  claimId: string;
  warrantyId: string;
  fullName: string;
  plateNumber: string;
  odometerKm: number;
  status: ClaimStatus;
};

const MOCK_REQUESTS: ClaimRequest[] = [
  {
    id: "REQ-001",
    claimId: "CW-123912821",
    warrantyId: "DTW-1239128001",
    fullName: "Esther Howard",
    plateNumber: "B 2022 DUN",
    odometerKm: 68312,
    status: "Dijadwalkan",
  },
  {
    id: "REQ-002",
    claimId: "CW-123912821",
    warrantyId: "DTW-1239128001",
    fullName: "Esther Howard",
    plateNumber: "B 2022 DUN",
    odometerKm: 68312,
    status: "Klaim Selesai",
  },
  {
    id: "REQ-003",
    claimId: "CW-123912821",
    warrantyId: "DTW-1239128001",
    fullName: "Esther Howard",
    plateNumber: "B 2022 DUN",
    odometerKm: 68312,
    status: "Dibatalkan Otomatis",
  },
  {
    id: "REQ-004",
    claimId: "CW-123912821",
    warrantyId: "DTW-1239128001",
    fullName: "Esther Howard",
    plateNumber: "B 2022 DUN",
    odometerKm: 68312,
    status: "Verifikasi Principal",
  },
  {
    id: "REQ-005",
    claimId: "CW-123912821",
    warrantyId: "DTW-1239128001",
    fullName: "Esther Howard",
    plateNumber: "B 2022 DUN",
    odometerKm: 68312,
    status: "Menunggu Verifikasi",
  },
  {
    id: "REQ-006",
    claimId: "CW-123912821",
    warrantyId: "DTW-1239128001",
    fullName: "Esther Howard",
    plateNumber: "B 2022 DUN",
    odometerKm: 68312,
    status: "Dijadwalkan",
  },
  {
    id: "REQ-007",
    claimId: "CW-123912821",
    warrantyId: "DTW-1239128001",
    fullName: "Esther Howard",
    plateNumber: "B 2022 DUN",
    odometerKm: 68312,
    status: "Dijadwalkan",
  },
  {
    id: "REQ-008",
    claimId: "CW-123912821",
    warrantyId: "DTW-1239128001",
    fullName: "Esther Howard",
    plateNumber: "B 2022 DUN",
    odometerKm: 68312,
    status: "Klaim Selesai",
  },
  {
    id: "REQ-009",
    claimId: "CW-123912821",
    warrantyId: "DTW-1239128001",
    fullName: "Esther Howard",
    plateNumber: "B 2022 DUN",
    odometerKm: 68312,
    status: "Klaim Selesai",
  },
  {
    id: "REQ-010",
    claimId: "CW-123912821",
    warrantyId: "DTW-1239128001",
    fullName: "Esther Howard",
    plateNumber: "B 2022 DUN",
    odometerKm: 68312,
    status: "Verifikasi Principal",
  },
  {
    id: "REQ-011",
    claimId: "CW-123912821",
    warrantyId: "DTW-1239128001",
    fullName: "Esther Howard",
    plateNumber: "B 2022 DUN",
    odometerKm: 68312,
    status: "Verifikasi Principal",
  },
  {
    id: "REQ-012",
    claimId: "CW-123912821",
    warrantyId: "DTW-1239128001",
    fullName: "Esther Howard",
    plateNumber: "B 2022 DUN",
    odometerKm: 68312,
    status: "Klaim Selesai",
  },
];

const SUMMARY_CARDS = [
  {
    title: "Total Permintaan Klaim Garansi",
    value: 10,
    delta: -12,
    timeframe: "30 Hari Terakhir",
  },
  {
    title: "Permintaan Belum Terverifikasi",
    value: 25,
    delta: 0,
    timeframe: "30 Hari Terakhir",
  },
  {
    title: "Total Klaim Garansi Selesai",
    value: 25,
    delta: 12,
    timeframe: "30 Hari Terakhir",
  },
  {
    title: "Total Klaim Garansi Diterima",
    value: 8,
    delta: 0,
    timeframe: "Hari Ini",
  },
];

const SortIcon = () => (
  <span className="flex flex-col leading-none text-lg text-text-secondary">
    <MdOutlineArrowDropUp className="-mb-2" />
    <MdOutlineArrowDropDown className="-mt-2" />
  </span>
);

function getBadgeProps(status: ClaimStatus) {
  switch (status) {
    case "Menunggu Verifikasi":
      return { label: status, variant: "adminVerification" as const };
    case "Dijadwalkan":
      return { label: status, variant: "scheduled" as const };
    case "Klaim Selesai":
      return { label: status, variant: "verified" as const };
    case "Verifikasi Principal":
      return { label: status, variant: "adminVerification" as const };
    case "Dibatalkan Otomatis":
    default:
      return { label: status, variant: "rejectedDunlop" as const };
  }
}

export default function PrincipalKlaimGaransiMonitoringPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<10 | 20 | 30>(10);
  const [searchInput, setSearchInput] = useState("");

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(MOCK_REQUESTS.length / perPage)),
    [perPage]
  );
  const startIndex = (page - 1) * perPage;
  const visibleRequests = MOCK_REQUESTS.slice(startIndex, startIndex + perPage);

  const getPagination = (currentPage: number, pageTotal: number) => {
    if (pageTotal <= 5) {
      return Array.from({ length: pageTotal }, (_, idx) => idx + 1);
    }

    const pages: (number | "...")[] = [1];
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(pageTotal - 1, currentPage + 1);

    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i += 1) pages.push(i);
    if (end < pageTotal - 1) pages.push("...");

    pages.push(pageTotal);
    return pages;
  };

  return (
    <div className="w-full flex flex-col gap-6 p-5 text-sm xl:text-base min-h-screen bg-background">
      <div className="text-text-secondary text-sm flex items-center gap-2">
        <span>Klaim Garansi</span>
        <span>/</span>
        <span className="text-primary">Monitoring</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {SUMMARY_CARDS.map((card) => {
          const isPositive = card.delta > 0;
          const isNeutral = card.delta === 0;

          return (
            <div
              key={card.title}
              className="bg-[#111] border border-input-border rounded-xl p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between text-text-secondary text-xs xl:text-sm">
                <div className="flex items-center gap-2">
                  <span role="img" aria-label="document">
                    🗂️
                  </span>
                  <span>{card.timeframe}</span>
                </div>
                <span>Hari Ini</span>
              </div>

              <div className="flex items-end justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <p className="text-white text-sm xl:text-base font-semibold">
                    {card.title}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl xl:text-3xl font-bold text-primary">
                      {card.value}
                    </span>
                    <span
                      className={`text-xs xl:text-sm px-2 py-1 rounded-md font-semibold ${
                        isNeutral
                          ? "bg-input text-text-secondary"
                          : isPositive
                          ? "bg-[#00DF80] text-black"
                          : "bg-[#DF3400] text-white"
                      }`}
                    >
                      {isNeutral ? "-" : `${card.delta}%`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-white text-lg xl:text-xl font-bold">Data Klaim Garansi</h1>
        <p className="text-text-secondary text-sm">
          Menampilkan keseluruhan Data Klaim Garansi
        </p>
      </div>

      <div className="box-container flex flex-col gap-5">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:max-w-80">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari Berdasarkan ID Warranty"
              className="bg-input text-white border border-input-border rounded-lg w-full pl-4 pr-12 py-3 placeholder:text-input-placeholder"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-input-border text-xl hover:text-white transition"
            >
              <CiSearch />
            </button>
          </div>

          <button
            type="button"
            className="bg-primary rounded-lg py-3 px-5 text-secondary font-bold flex items-center gap-2 justify-center"
          >
            <FiDownload />
            Export Data
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg w-full text-xs xl:text-sm">
          <table className="table-auto w-full text-left text-white">
            <thead className="bg-[#333333] text-text-secondary">
              <tr>
                <th className="px-5 py-4 w-12">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-primary bg-input border-input-border"
                  />
                </th>
                <th className="px-5 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    ID Klaim Garansi <SortIcon />
                  </div>
                </th>
                <th className="px-5 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    ID Warranty <SortIcon />
                  </div>
                </th>
                <th className="px-5 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    Nama Lengkap <SortIcon />
                  </div>
                </th>
                <th className="px-5 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    Plat Kendaraan <SortIcon />
                  </div>
                </th>
                <th className="px-5 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    Odometer <SortIcon />
                  </div>
                </th>
                <th className="px-5 py-4 whitespace-nowrap">Status</th>
                <th className="px-5 py-4 whitespace-nowrap text-primary text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleRequests.map((request) => {
                const badgeProps = getBadgeProps(request.status);

                return (
                  <tr
                    key={request.id}
                    className="border-b border-input last:border-0 bg-default-color-dark hover:bg-secondary/30"
                  >
                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-primary bg-input border-input-border"
                      />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-text-secondary">
                      {request.claimId}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-primary font-semibold">
                      {request.warrantyId}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-text-secondary">
                      {request.fullName}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-text-secondary">
                      {request.plateNumber}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-text-secondary">
                      <span className="text-white">
                        {request.odometerKm.toLocaleString("id-ID")}
                      </span>{" "}
                      km
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge {...badgeProps} showIcon={badgeProps.variant !== "verified"} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <Link
                        href={request.status === "Menunggu Verifikasi" ? "/principal/klaim-garansi/monitoring/1" : `#`}
                        className="flex items-center gap-2 justify-end text-primary font-semibold hover:opacity-80"
                      >
                        Lihat Detail
                        <MdOutlineRemoveRedEye />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          perPage={perPage}
          setPage={setPage}
          setPerPage={(value) => {
            setPage(1);
            setPerPage(value);
          }}
          getPagination={getPagination}
          pagination={{ per_page: visibleRequests.length, total: MOCK_REQUESTS.length }}
          label="data Klaim Garansi"
        />
      </div>
    </div>
  );
}