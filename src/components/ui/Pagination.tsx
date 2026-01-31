"use client";

import { FaCaretLeft, FaCaretRight } from "react-icons/fa";

type PaginationInfo = {
  per_page: number;
  total: number;
};

interface PaginationProps {
  page: number;
  totalPages: number;
  perPage: 10 | 20 | 30;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPerPage: (value: 10 | 20 | 30) => void;
  getPagination: (page: number, totalPages: number) => (number | "...")[];
  pagination?: PaginationInfo;
  label?: string;
}

export default function Pagination({
  page,
  totalPages,
  perPage,
  setPage,
  setPerPage,
  getPagination,
  pagination,
  label = "data",
}: PaginationProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center items-start lg:justify-between gap-4 text-xs xl:text-sm">
      {/* LEFT */}
      <div className="flex justify-center items-center gap-2 ">
        {/* PREV */}
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className={`p-2 xl:p-3 border text-secondary aspect-square rounded-lg flex justify-center items-center bg-primary  ${
            page === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaCaretLeft />
        </button>

        {/* PAGE NUMBERS */}
        {getPagination(page, totalPages).map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-2 text-text-secondary">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 font-bold ${
                page === p ? "text-white" : "text-primary"
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* NEXT */}
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className={`p-2 xl:p-3 border text-secondary aspect-square w-8 xl:w-10 rounded-lg flex justify-center items-center bg-primary ${
            page === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaCaretRight />
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col md:flex-row md:gap-5 md:items-center">
        <div className="flex items-center gap-2">
          <p className="text-text-secondary">Item per halaman:</p>
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value) as 10 | 20 | 30)}
            className="bg-input py-2 text-white"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
        </div>

        <div className="flex items-start md:items-center gap-2">
          <p className="text-text-secondary">Menampilkan:</p>
          <p className="text-white">
            {pagination?.per_page} dari {pagination?.total} {label}
          </p>
        </div>
      </div>
    </div>
  );
}
