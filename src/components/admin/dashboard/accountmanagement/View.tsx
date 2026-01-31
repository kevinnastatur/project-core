"use client";

import { useEffect, useMemo, useState } from "react";
import { BiSortAlt2 } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import Link from "next/link";
import { WarrantyItemDetail } from "@/types/warranty";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { getAccountIndex, getAccountStats } from "@/services/admin/Account";
import Pagination from "@/components/ui/Pagination";
import ButtonAdd from "@/components/ui/button/ButtonAdd";
import { useRouter } from "next/navigation";
import { showSuccessToast } from "@/helper/toastHelper";

type SortKey = "name" | "email" | "role" | null;

type SortOrder = "asc" | "desc" | null;

type Status = 0 | 1;

export default function AccountManagement() {
  const router = useRouter();
  const [data, setData] = useState<WarrantyItemDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [is_active, setIs_Active] = useState<Status | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [perPage, setPerPage] = useState<10 | 20 | 30>(10);
  const [totalPages, setTotalPages] = useState(1);
  const [pagenation, setPagenation] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAccountIndex(
        page,
        perPage,
        search,
        is_active ?? undefined
      );

      const rawData = res.data?.data ?? [];

      const filteredData = rawData.filter(
        (item: any) => Array.isArray(item.roles) && item.roles.length > 0
      );

      setPagenation(res.data ?? []);
      setData(filteredData);
      setTotalPages(res.data?.last_page ?? 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, is_active, perPage]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAccountStats();
        setStats(res);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

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

      if (aVal == null || bVal == null) return 0;

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

  const statsComponents = [
    {
      title: "Total Pengguna Dunlop Warranty",
      value: stats?.customerCount ?? 0,
    },
    {
      title: "Total Akun Principal",
      value: stats?.principalCount ?? 0,
    },
    {
      title: "Total Akun Dunlop Shop",
      value: stats?.shopCount ?? 0,
    },
    {
      title: "Total Akun Distributor",
      value: stats?.distributorCount ?? 0,
    },
  ];

  const handleAdd = () => {
    router.push("/admin/dashboard/account-management/create");
  };

  const handleExport = () => {
    setLoading(true);

    window.open("/api/export/user-data", "_self");

    showSuccessToast(
      "Export Started",
      "File sedang diproses dan akan terunduh otomatis"
    );

    setTimeout(() => {
      setLoading(false);
    }, 1200);
  };

  return (
    <>
      <LoadingOverlay show={loading} />
      <div className=" w-full flex flex-col gap-5 p-5 text-sm xl:text-base ">
        {/* stats */}
        <div className="grid grid-cols-2  lg:grid-cols-4 gap-5">
          {statsComponents.map((stat, index) => (
            <div key={index} className="box-container">
              <div className="flex flex-col gap-3">
                <div className="flex-wrap flex gap-3  items-center justify-between">
                  {" "}
                  <div className="bg-primary p-2 w-fit rounded-lg">
                    <FaRegUser />
                  </div>
                  <p className="text-input-fill font-bold capitalize">
                    {" "}
                    Semua Periode
                  </p>
                </div>
                <p className="text-sm xl:text-base text-input-placeholder font-bold">
                  {stat.title}
                </p>
                <div className="text-white font-bold text-xl xl:text-2xl flex gap-2 items-center">
                  <p> {stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* header */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="text-white font-bold text-lg xl:text-xl">
              <p>Manajemen Akun</p>
              <p className="text-base xl:text-lg text-input-placeholder">
                Menampilkan keseluruhan Akun yang terdaftar
              </p>
            </div>
            <div>
              <ButtonAdd label="Tambah Akun Baru" onClick={handleAdd} />
            </div>
          </div>

          {/* Search and Export */}
          <div className="box-container flex flex-col gap-5">
            <div className=" flex flex-col md:flex-row gap-5  justify-between">
              <div className="relative w-full md:w-70">
                <input
                  placeholder="Cari Berdasarkan Nama"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setPage(1);
                      setSearch(searchInput);
                    }
                  }}
                  className="bg-input py-3 pl-3 pr-10 rounded-lg border border-input-border text-white w-full"
                />

                <button
                  type="button"
                  onClick={() => {
                    setPage(1);
                    setSearch(searchInput);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-input-border text-xl hover:text-white transition"
                >
                  <CiSearch />
                </button>
              </div>
              <button
                onClick={handleExport}
                className="bg-primary rounded-lg py-3 px-5 text-secondary font-bold flex justify-center items-center gap-2 cursor-pointer"
              >
                <FiDownload />
                Export Data
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg w-full text-xs xl:text-sm">
              <table className="table-auto text-left text-white w-full">
                <thead className="bg-[#333333] text-sm">
                  <tr>
                    <th className="px-5 py-4 cursor-pointer">
                      <div
                        className="flex items-center gap-1 whitespace-nowrap"
                        onClick={() => handleSort("name")}
                      >
                        Nama Lengkap
                        {renderSortIcon("name")}
                      </div>
                    </th>

                    <th className="px-5 py-4 cursor-pointer">
                      <div
                        className="flex items-center gap-1 whitespace-nowrap"
                        onClick={() => handleSort("email")}
                      >
                        Email
                        {renderSortIcon("email")}
                      </div>
                    </th>

                    <th className="px-5 py-4 cursor-pointer">
                      <div
                        className="flex items-center gap-1 whitespace-nowrap"
                        onClick={() => handleSort("role")}
                      >
                        Role
                        {renderSortIcon("role")}
                      </div>
                    </th>

                    <th className="px-5 py-4 whitespace-nowrap flex flex0c items-center gap-2">
                      {/* Logo SVG */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M12.9999 7.99971H6.3215M3.9642 7.99971H2.99988M3.9642 7.99971C3.9642 7.67074 4.08835 7.35524 4.30934 7.12262C4.53033 6.89 4.83006 6.75932 5.14258 6.75932C5.45511 6.75932 5.75483 6.89 5.97582 7.12262C6.19681 7.35524 6.32096 7.67074 6.32096 7.99971C6.32096 8.32869 6.19681 8.64419 5.97582 8.87681C5.75483 9.10943 5.45511 9.24011 5.14258 9.24011C4.83006 9.24011 4.53033 9.10943 4.30934 8.87681C4.08835 8.64419 3.9642 8.32869 3.9642 7.99971ZM12.9999 11.759H9.89285M9.89285 11.759C9.89285 12.0881 9.7684 12.4039 9.54736 12.6366C9.32632 12.8693 9.02653 13 8.71393 13C8.40141 13 8.10168 12.8687 7.88069 12.6361C7.6597 12.4035 7.53555 12.088 7.53555 11.759M9.89285 11.759C9.89285 11.43 9.7684 11.1147 9.54736 10.882C9.32632 10.6493 9.02653 10.5186 8.71393 10.5186C8.40141 10.5186 8.10168 10.6493 7.88069 10.8819C7.6597 11.1146 7.53555 11.4301 7.53555 11.759M7.53555 11.759H2.99988M12.9999 4.2404H11.3215M8.9642 4.2404H2.99988M8.9642 4.2404C8.9642 3.91142 9.08835 3.59592 9.30934 3.3633C9.53033 3.13068 9.83005 3 10.1426 3C10.2973 3 10.4506 3.03208 10.5935 3.09442C10.7365 3.15676 10.8664 3.24812 10.9758 3.3633C11.0852 3.47849 11.172 3.61523 11.2313 3.76572C11.2905 3.91621 11.321 4.07751 11.321 4.2404C11.321 4.40329 11.2905 4.56459 11.2313 4.71508C11.172 4.86557 11.0852 5.00231 10.9758 5.11749C10.8664 5.23267 10.7365 5.32404 10.5935 5.38638C10.4506 5.44871 10.2973 5.4808 10.1426 5.4808C9.83005 5.4808 9.53033 5.35011 9.30934 5.11749C9.08835 4.88487 8.9642 4.56937 8.9642 4.2404Z"
                          stroke="#A3A3A3"
                          stroke-miterlimit="10"
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Text */}
                      Status
                      {/* Select dropdown */}
                      <select
                        value={is_active === null ? "" : is_active}
                        onChange={(e) => {
                          const value = e.target.value;

                          if (value === "") {
                            setIs_Active(null);
                          } else if (value === "0") {
                            setIs_Active(0);
                          } else {
                            setIs_Active(1);
                          }
                        }}
                        className="ml-2 bg-input py-1 px-2 text-white rounded border border-input-border"
                      >
                        <option value="">Semua</option>
                        <option value="0">Tidak Aktif</option>
                        <option value="1">Aktif</option>
                      </select>
                    </th>

                    <th className="px-5 py-4"></th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-6">
                        Loading...
                      </td>
                    </tr>
                  ) : sortedData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-6">
                        Data tidak ditemukan
                      </td>
                    </tr>
                  ) : (
                    sortedData.map((item) => (
                      <tr
                        key={item.id}
                        className={`
              ${
                item.is_active === 0
                  ? "bg-default-color-dark text-text-secondary"
                  : "bg-background text-text-secondary"
              }
              hover:bg-opacity-80 transition
            `}
                      >
                        <td className="px-5 py-4">{item?.name ?? "-"}</td>
                        <td className="px-5 py-4">{item?.email ?? "-"}</td>
                        <td className="px-5 py-4 capitalize">
                          {item?.roles[0].name ?? "-"}
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          {item?.is_active === 0 && (
                            <span className="bg-[#DF3400] px-3 py-2 rounded-full font-bold text-secondary">
                              Tidak Aktif
                            </span>
                          )}
                          {item?.is_active === 1 && (
                            <span className="bg-[#00DF80] px-3 py-2 rounded-full font-bold text-secondary">
                              Aktif
                            </span>
                          )}
                        </td>

                        <td className="py-3 text-primary font-semibold cursor-pointer whitespace-nowrap pr-5">
                          <Link
                            href={`/admin/dashboard/account-management/edit/${item.id}`}
                            className="flex items-center gap-2"
                          >
                            Lihat Detail
                            <MdOutlineRemoveRedEye />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagenation */}
            <Pagination
              page={page}
              totalPages={totalPages}
              perPage={perPage}
              setPage={setPage}
              setPerPage={setPerPage}
              getPagination={getPagination}
              pagination={pagenation}
              label="data Manajement Akun"
            />
          </div>
        </div>
      </div>{" "}
    </>
  );
}
