"use client";

import { CiSearch } from "react-icons/ci";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import Link from "next/link";
import useRegisterLeadsHook from "@/hooks/admin/registerLeadsHooks";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

export default function RegisterLeads() {
  const {
    loading,
    setPage,
    setSearch,
    sortedData,
    page,
    perPage,
    setPerPage,
    totalPages,
    getPagination,
    handleSort,
    renderSortIcon,
    pagenation,
    searchInput,
    setSearchInput,
    handleExport,
  } = useRegisterLeadsHook();

  return (
    <>
      <LoadingOverlay show={loading} />
      <div className=" w-full flex flex-col gap-5 p-5 text-sm xl:text-base ">
        {/* header */}
        <div className="flex flex-col gap-5">
          <div className="text-white font-bold text-lg xl:text-xl">
            <p>Permintaan Registrasi Garansi</p>
            <p className="text-base xl:text-lg text-input-placeholder">
              Menampilkan keseluruhan permintaan Registrasi Garansi
            </p>
          </div>

          {/* Search and Export */}
          <div className="box-container flex flex-col gap-5">
            <div className=" flex flex-col md:flex-row gap-5  justify-between">
              <div className="relative w-full md:w-70">
                <input
                  placeholder="Cari Berdasarkan ID Registrasi"
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
                        onClick={() => handleSort("warranty_code")}
                      >
                        ID Registrasi
                        {renderSortIcon("warranty_code")}
                      </div>
                    </th>

                    <th className="px-5 py-4 cursor-pointer">
                      <div
                        className="flex items-center gap-1 whitespace-nowrap"
                        onClick={() => handleSort("brand")}
                      >
                        Nama Lengkap
                        {renderSortIcon("brand")}
                      </div>
                    </th>

                    <th className="px-5 py-4 cursor-pointer">
                      <div
                        className="flex items-center gap-1 whitespace-nowrap"
                        onClick={() => handleSort("store_name")}
                      >
                        Toko Pembelian
                        {renderSortIcon("store_name")}
                      </div>
                    </th>

                    <th className="px-5 py-4 cursor-pointer">
                      <div
                        className="flex items-center gap-1 whitespace-nowrap"
                        onClick={() => handleSort("model")}
                      >
                        Tipe Kendaraan
                        {renderSortIcon("model")}
                      </div>
                    </th>

                    <th className="px-5 py-4 cursor-pointer">
                      <div
                        className="flex items-center gap-1 whitespace-nowrap"
                        onClick={() => handleSort("plate_number")}
                      >
                        Plat Kendaraan
                        {renderSortIcon("plate_number")}
                      </div>
                    </th>

                    <th className="px-5 py-4 cursor-pointer">
                      <div
                        className="flex items-center gap-1 whitespace-nowrap"
                        onClick={() => handleSort("odometer")}
                      >
                        Odometer
                        {renderSortIcon("odometer")}
                      </div>
                    </th>

                    <th className="px-5 py-4 whitespace-nowrap flex flex0c items-center gap-2">
                      Status
                    </th>

                    {/* <th className="px-5 py-4"></th> */}
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
                item.status === 0
                  ? "bg-default-color-dark text-text-secondary"
                  : "bg-background text-text-secondary"
              }
              hover:bg-opacity-80 transition
            `}
                      >
                        <td className="px-5 py-4">{item.warranty_code}</td>
                        <td className="px-5 py-4">{item.name}</td>
                        <td className="px-5 py-4">{item.store_name}</td>
                        <td className="px-5 py-4">{item.model}</td>
                        <td className="px-5 py-4">{item.plate_number}</td>
                        <td className="px-5 py-4 ">
                          {" "}
                          <span className="text-white">
                            {" "}
                            {item.odometer}
                          </span>{" "}
                          km
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          {item.status === 0 && (
                            <Link
                              href={`/admin/dashboard/register-detail/${item.id}?warranty_code=${item.warranty_code}`}
                              className="bg-[#DFAB00] px-3 py-2 rounded-full font-bold text-secondary"
                            >
                              Verifikasi Sekarang
                            </Link>
                          )}
                          {item.status === 1 && (
                            <span className="bg-[#DFAB00] px-3 py-2 rounded-full font-bold text-secondary">
                              Sedang Dalam Perbaikan
                            </span>
                          )}
                          {item.status === 3 && (
                            <span className="bg-[#00DF80] px-3 py-2 rounded-full font-bold text-secondary">
                              Terverifikasi
                            </span>
                          )}
                          {item.status === 2 && (
                            <span className="bg-[#DF3400] px-3 py-2 rounded-full font-bold text-secondary">
                              Registrasi Ditolak
                            </span>
                          )}
                        </td>

                        {/* <td className="py-3 text-primary font-semibold cursor-pointer whitespace-nowrap pr-5">
                          <Link
                            href={`/admin/dashboard/register-detail/${item.id}?warranty_code=${item.warranty_code}`}
                            className="flex items-center gap-2"
                          >
                            Lihat Detail
                            <MdOutlineRemoveRedEye />
                          </Link>
                        </td> */}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagenation */}
            <div className="flex flex-col lg:flex-row lg:items-center items-start lg:justify-between">
              <div className="flex justify-center items-center gap-2">
                {/* PREV */}
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className={`p-2 xl:p-3 border text-secondary  aspect-square  rounded-lg  justify-center items-center flex bg-primary ${
                    page === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FaCaretLeft />
                </button>

                {/* PAGE NUMBERS */}
                {getPagination(page, totalPages).map((p, i) =>
                  p === "..." ? (
                    <span
                      key={`dots-${i}`}
                      className="px-2 text-text-secondary "
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`text-primary font-bold px-3 ${
                        page === p ? "" : ""
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
                  className={`p-2 xl:p-3 border text-secondary  aspect-square w-8 xl:w-10 rounded-lg  justify-center items-center flex bg-primary  ${
                    page === totalPages ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FaCaretRight />
                </button>
              </div>

              <div className="flex flex-col md:flex-row md:gap-5 md:items-center ">
                <div className="flex items-center ">
                  <p className="text-text-secondary">Item per halaman: </p>
                  <select
                    value={perPage}
                    onChange={(e) =>
                      setPerPage(Number(e.target.value) as 10 | 20 | 30)
                    }
                    className="bg-input py-2 text-white"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                  </select>
                </div>
                <div className="flex items-start md:items-center gap-2 ">
                  <p className="text-text-secondary">Menampilkan: </p>
                  <p className="text-white">
                    {pagenation?.per_page} dari {pagenation?.total} {""}
                    data Master Data Registrasi Garansi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
    </>
  );
}
