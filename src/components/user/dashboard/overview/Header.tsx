"use client";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import userHooks from "@/hooks/user/userHooks";
import useHistoryTireHooks from "@/hooks/user/HistoryTireHooks";

export default function OverviewHeader() {
  const { data, activeTires } = useHistoryTireHooks();
  const { user } = userHooks();

  return (
    <div className=" flex flex-col px-5 gap-5 h-full">
      {/* Label */}
      {data?.length === 0 && (
        <div className=" flex flex-col lg:flex-row gap-5 bg-primary text-secondary p-5 rounded-lg font-medium lg:font-bold items-center text-sm xl:text-base">
          <p className="w-full text-center lg:text-start ">
            Halo, {user?.name}! Selamat datang di keluarga Dunlop. Akunmu sudah
            berhasil dibuat, nih! Yuk, amankan garansi banmu sekarang. Cuma
            butuh beberapa step kok biar garansimu langsung aktif dan aman.
            Jangan sampai kelupaan ya!
          </p>
          <Link
            href={"/dashboard/tire-warranty/status"}
            className=" w-fit  lg:w-[40%] xl:w-[30%] text-primary rounded-lg bg-secondary flex items-center text-center gap-2 px-5 justify-center py-3 cursor-pointer "
          >
            Daftarkan Garansi Banmu Di Sini!
          </Link>
        </div>
      )}
      {/* Service */}
      <div className=" grid grid-cols-1 lg:grid-cols-3  items-center gap-5">
        {/* garansi */}
        <div
          className=" border border-input-border rounded-lg p-5  justify-between flex flex-col gap-2 text-lg xl:text-xl transition-all duration-300
  hover:border-primary  cursor-pointer h-full"
          style={{
            backgroundImage: "url('/assets/overview/images.png')",
            backgroundSize: "cover",
          }}
        >
          <div className="flex flex-col ">
            <p className="font-medium text-input-placeholder text-sm xl:text-base">
              Ban Terdaftar Garansi
            </p>
            {data?.length === 0 && (
              <p className="text-white font-semibold">Belum ada ban</p>
            )}
            {data?.length > 0 && (
              <p className="text-white font-semibold">
                {activeTires} Garansi Aktif
              </p>
            )}
          </div>
          {data?.length === 0 && (
            <Link
              href={"/dashboard/tire-warranty/status"}
              className="mt-5 flex items-center gap-2 text-primary font-semibold text-sm xl:text-sm bg-input-border px-5 py-3 rounded-lg w-fit"
            >
              <p>Daftarkan Ban</p>
              <FaPlus className=" text-sm" />
            </Link>
          )}
          {data?.length > 0 && (
            <Link
              href={"/dashboard/tire-warranty/status"}
              className="mt-5 flex items-center gap-2 text-primary font-semibold text-sm xl:text-sm bg-input-border px-5 py-3 rounded-lg w-fit"
            >
              <p>Lihat Garansi</p>
            </Link>
          )}
        </div>
        {/* service */}
        <div
          className=" border border-input-border rounded-lg p-5  justify-between flex flex-col gap-2 text-lg xl:text-xl transition-all duration-300
  hover:border-primary  cursor-pointer h-full"
          style={{
            backgroundImage: "url('/assets/overview/images.png')",
            backgroundSize: "cover",
          }}
        >
          <div className="flex flex-col ">
            <p className="font-medium text-input-placeholder text-sm xl:text-base">
              Service Berkala (Coming Soon)
            </p>
            <p className="text-white font-semibold">
              Belum Ada Pengajuan Service
            </p>
          </div>

          <button
            disabled
            className="mt-5 flex items-center gap-2 font-semibold text-sm xl:text-sm bg-[#5E5E5E] px-5 py-3 rounded-lg w-fit cursor-not-allowed text-[#A3A3A3]"
          >
            <p>Coming Soon</p>
          </button>
        </div>
        {/* klaim */}
        <div
          className=" border border-input-border rounded-lg p-5  justify-between flex flex-col gap-2 text-lg xl:text-xl transition-all duration-300
  hover:border-primary  cursor-pointer h-full"
          style={{
            backgroundImage: "url('/assets/overview/images.png')",
            backgroundSize: "cover",
          }}
        >
          <div className="flex flex-col ">
            <p className="font-medium text-input-placeholder text-sm xl:text-base">
              Panduan Klaim Garansi (Coming Soon)
            </p>
            <p className="text-white font-semibold">
              Belum Ada Pengajuan Klaim Garansi
            </p>
          </div>

          <button
            disabled
            className="mt-5 flex items-center gap-2 font-semibold text-sm xl:text-sm bg-[#5E5E5E] px-5 py-3 rounded-lg w-fit cursor-not-allowed text-[#A3A3A3]"
          >
            <p>Coming Soon</p>
          </button>
        </div>
      </div>
    </div>
  );
}
