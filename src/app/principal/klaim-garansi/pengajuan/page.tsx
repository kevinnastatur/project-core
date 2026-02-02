"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import StatusBadge from "@/components/common/StatusBadge";
import Pagination from "@/components/ui/Pagination";
import { CiSearch } from "react-icons/ci";
import { FiDownload } from "react-icons/fi";
import {
  MdOutlineArrowDropDown,
  MdOutlineArrowDropUp,
  MdOutlineRemoveRedEye,
} from "react-icons/md";

type ConfirmationRequest = {
  id: string;
  claimId: string;
  warrantyId: string;
  fullName: string;
  plateNumber: string;
  odometerKm: number;
};

const MOCK_REQUESTS: ConfirmationRequest[] = Array.from({ length: 10 }, (_, index) => {
  const sequence = index + 1;
  const padded = sequence.toString().padStart(3, "0");
  const names = [
    "Esther Howard",
    "Wade Warren",
    "Darlene Robertson",
    "Jenny Wilson",
    "Savannah Nguyen",
  ];
  const plates = [
    "B 2022 DUN",
    "D 1827 UNU",
    "B 2025 DUN",
    "B 2201 DNA",
    "F 9090 DUN",
  ];

  return {
    id: `REQ-${padded}`,
    claimId: `CW-1239${(820 + sequence).toString().padStart(3, "0")}`,
    warrantyId: `DTW-1239128${sequence.toString().padStart(3, "0")}`,
    fullName: names[index % names.length],
    plateNumber: plates[index % plates.length],
    odometerKm: 68312 + sequence * 3,
  };
});

const SortIcon = () => (
  <span className="flex flex-col leading-none text-lg text-text-secondary">
    <MdOutlineArrowDropUp className="-mb-2" />
    <MdOutlineArrowDropDown className="-mt-2" />
  </span>
);

export default function PrincipalKlaimGaransiPengajuanPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<10 | 20 | 30>(10);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredRequests = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return MOCK_REQUESTS;

    return MOCK_REQUESTS.filter((request) =>
      request.warrantyId.toLowerCase().includes(keyword)
    );
  }, [searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / perPage));
  const startIndex = (page - 1) * perPage;
  const visibleRequests = filteredRequests.slice(startIndex, startIndex + perPage);
  const showingCount = filteredRequests.length === 0 ? 0 : visibleRequests.length;

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleSearch = () => {
    setPage(1);
    setSearchTerm(searchInput);
  };

  const getPagination = useCallback(
    (currentPage: number, pageTotal: number): (number | "...")[] => {
      if (pageTotal <= 5) {
        return Array.from({ length: pageTotal }, (_, idx) => idx + 1);
      }

      const pages: (number | "...")[] = [1];

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(pageTotal - 1, currentPage + 1);

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i += 1) {
        pages.push(i);
      }

      if (end < pageTotal - 1) {
        pages.push("...");
      }

      pages.push(pageTotal);
      return pages;
    },
    []
  );

  const toggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    const currentIds = visibleRequests.map((request) => request.id);
    setSelectedIds((prev) =>
      checked
        ? Array.from(new Set([...prev, ...currentIds]))
        : prev.filter((id) => !currentIds.includes(id))
    );
  };

  const allVisibleSelected =
    visibleRequests.length > 0 &&
    visibleRequests.every((request) => selectedIds.includes(request.id));

  return (
    <div className="w-full flex flex-col gap-5 p-5 text-sm xl:text-base min-h-screen bg-background">
      <div className="text-text-secondary text-sm flex items-center gap-2">
        <span>Klaim Garansi</span>
        <span>/</span>
        <span className="text-primary">Pengajuan Klaim Garansi</span>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-white text-lg xl:text-xl font-bold">
          Permintaan Klaim Garansi Ban
        </h1>
        <p className="text-text-secondary text-sm">
          Menampilkan keseluruhan permintaan klaim garansi ban yang memerlukan
          konfirmasi stok
        </p>
      </div>

      <div className="box-container flex flex-col gap-5">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:max-w-80">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Cari Berdasarkan ID Warranty"
              className="bg-input text-white border border-input-border rounded-lg w-full pl-4 pr-12 py-3 placeholder:text-input-placeholder"
            />
            <button
              type="button"
              onClick={handleSearch}
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
                    checked={allVisibleSelected}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
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
              {visibleRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-text-secondary">
                    Data tidak ditemukan
                  </td>
                </tr>
              ) : (
                visibleRequests.map((request) => {
                  const isChecked = selectedIds.includes(request.id);

                  return (
                    <tr
                      key={request.id}
                      className="border-b border-input last:border-0 bg-default-color-dark hover:bg-secondary/30"
                    >
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-primary bg-input border-input-border"
                          checked={isChecked}
                          onChange={() => toggleRow(request.id)}
                        />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-text-secondary">
                        {request.claimId}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-text-secondary">
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
                        <StatusBadge
                          label="Konfirmasi Stok"
                          variant="scheduled"
                          showIcon={false}
                        />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <Link
                          href={`/principal/klaim-garansi/pengajuan/${request.id}`}
                          className="flex items-center gap-2 justify-end text-primary font-semibold hover:opacity-80"
                        >
                          Lihat Detail
                          <MdOutlineRemoveRedEye />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          perPage={perPage}
          setPage={setPage}
          setPerPage={setPerPage}
          getPagination={getPagination}
          pagination={{ per_page: showingCount, total: filteredRequests.length }}
          label="data Request Pengajuan"
        />
      </div>
    </div>
  );
}
