"use client";
import { getWarrantyMasterDataIndex } from "@/services/admin/WarrantyRegistration";
import { useEffect, useMemo, useState } from "react";
import { BiSortAlt2 } from "react-icons/bi";
import { WarrantyItemDetail } from "@/types/warranty";
import { showSuccessToast } from "@/helper/toastHelper";

type SortKey =
  | "warranty_code"
  | "brand"
  | "store_name"
  | "model"
  | "plate_number"
  | "odometer"
  | "purchase_date"
  | null;

type SortOrder = "asc" | "desc" | null;

export default function useRegisterLeadsHook() {
  const [data, setData] = useState<WarrantyItemDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status] = useState<number | "">(0);
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [perPage, setPerPage] = useState<number>(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pagenation, setPagenation] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getWarrantyMasterDataIndex(
        page,
        perPage,
        status,
        search
      );
      setPagenation(res.data ?? []);
      setData(res.data.data ?? []);
      setTotal(res.data.total);
      setTotalPages(res.data.last_page ?? 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, status, perPage]);

  const handleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortOrder("asc");
      return;
    }

    if (sortOrder === "asc") {
      setSortOrder("desc");
    } else if (sortOrder === "desc") {
      setSortKey(null);
      setSortOrder(null);
    } else {
      setSortOrder("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey || !sortOrder) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (!aVal || !bVal) return 0;

      if (sortKey === "odometer") {
        return sortOrder === "asc"
          ? Number(aVal) - Number(bVal)
          : Number(bVal) - Number(aVal);
      }

      if (sortKey === "purchase_date") {
        return sortOrder === "asc"
          ? new Date(aVal).getTime() - new Date(bVal).getTime()
          : new Date(bVal).getTime() - new Date(aVal).getTime();
      }

      return sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sortKey, sortOrder]);

  const renderSortIcon = (key: SortKey) => (
    <BiSortAlt2
      className={sortKey === key ? "text-primary" : "text-input-border"}
    />
  );

  const getPagination = (current: number, total: number) => {
    const pages: (number | string)[] = [];

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

  const handleExport = () => {
    setLoading(true);

    window.open("/api/export/register-data", "_self");

    showSuccessToast(
      "Export Started",
      "File sedang diproses dan akan terunduh otomatis"
    );

    setTimeout(() => {
      setLoading(false);
    }, 1200);
  };
  return {
    loading,
    search,
    setPage,
    setSearch,
    sortedData,
    page,
    perPage,
    setPerPage,
    total,
    totalPages,
    getPagination,
    handleSort,
    renderSortIcon,
    sortKey,
    pagenation,
    searchInput,
    setSearchInput,
    handleExport,
  };
}
