"use client";

import { useEffect, useRef, useState } from "react";
import { WarrantyItem, WarrantyStatus } from "@/types/warranty";
import { getWarrantyIndex } from "@/services/Warranty";

const STATUS_OPTIONS: { label: string; value: WarrantyStatus | null }[] = [
  { label: "Semua", value: null },
  { label: "Proses Verifikasi", value: 0 },
  { label: "Perbaikan", value: 1 },
  { label: "Ditolak", value: 2 },
  { label: "Garansi Aktif", value: 3 },
];

export default function useHistoryTireHooks() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<WarrantyStatus | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<WarrantyItem[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [pagenation, setPagenation] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [perpage, setPerPage] = useState<10 | 20 | 30>(10);
  const [activeTires, setActiveTires] = useState("0");
  useEffect(() => {
    const getWarranty = async () => {
      try {
        setLoading(true);

        const response =
          status === null
            ? await getWarrantyIndex(page, perpage)
            : await getWarrantyIndex(page, perpage, status);
        const items = response.data?.data ?? [];

        setData(items);

        setTotalPage(response.data?.last_page ?? 1);

        const active = items.filter((item: any) => item.status === 3);
        setActiveTires(active.length.toString());

        setPagenation(response.data);
      } catch (err) {
        console.error("Failed to fetch warranty:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    getWarranty();
  }, [status, page, perpage]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPagination = (
    current: number,
    total: number
  ): (number | "...")[] => {
    const pages: (number | "...")[] = [];

    if (total <= 3) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (current > 3) {
      pages.push("...");
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 2) {
      pages.push("...");
    }

    pages.push(total);

    return pages;
  };
  return {
    open,
    setOpen,
    status,
    setStatus,
    wrapperRef,
    data,
    totalPage,
    pagenation,
    page,
    setPage,
    loading,
    perpage,
    setPerPage,
    getPagination,
    activeTires,
    STATUS_OPTIONS,
  };
}
