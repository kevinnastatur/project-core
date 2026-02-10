"use client";

import { FaPlus } from "react-icons/fa";
import { MdOutlineArrowDropDown } from "react-icons/md";
import CardHistoryWarranty from "./ui/CardHistory";
import Link from "next/link";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import Pagination from "@/components/ui/Pagination";
import useHistoryTireHooks from "@/hooks/user/HistoryTireHooks";

export default function HistoryTireWarranty() {
  const {
    open,
    setOpen,
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
    STATUS_OPTIONS,
  } = useHistoryTireHooks();

  return (
    <>
      <LoadingOverlay show={loading} />
      <div className="flex flex-col gap-5 w-full p-5 text-white min-h-125">
        <div className="relative flex flex-col md:flex-row md:justify-between md:items-center gap-5 font-bold text-sm xl:text-base">
          <p>Riwayat Pendaftaran Garansi</p>

          <div ref={wrapperRef} className="relative">
            <button
              onClick={() => setOpen((p) => !p)}
              className="bg-primary px-5 py-3 text-secondary rounded-lg flex items-center gap-1"
            >
              <p>Urutkan Berdasarkan Status</p>
              <MdOutlineArrowDropDown
                className={`transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-60 bg-primary text-secondary rounded-lg shadow-lg z-50">
                {STATUS_OPTIONS.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setStatus(item.value);
                      setPage(1);
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 font-bold">
          <Link
            href="/dashboard/tire-warranty/registration?step=1"
            className="bg-input border-2 border-input-border cursor-pointer border-dotted hover:border-primary transition-all duration-300 rounded-lg flex flex-col gap-2 p-5 justify-center items-center text-primary text-lg xl:text-xl h-75 md:h-75 xl:h-80 2xl:h-75"
          >
            <FaPlus />
            <p>Daftarkan Garansi Ban</p>
          </Link>

          {data.map((item) => {
            const href =
              item.status === 0 || item.status === 3 || item.status === 2
                ? `/dashboard/tire-warranty/detail/${item.id}?warranty_code=${item.warranty_code}`
                : `/dashboard/tire-warranty/edit/${item.id}?warranty_code=${item.warranty_code}`;

            return (
              <CardHistoryWarranty
                key={item.id}
                warranty_id={item.warranty_code}
                car_number={item.plate_number}
                activate_date={item.warranty_date}
                buy_date={item.purchase_date}
                status={item.status}
                detailHref={href}
              />
            );
          })}
        </div>

        <Pagination
          page={page}
          totalPages={totalPage}
          perPage={perpage}
          setPage={setPage}
          setPerPage={setPerPage}
          getPagination={getPagination}
          pagination={pagenation}
          label="Riwayat Pendaftaran Garansi"
        />
      </div>
    </>
  );
}
