"use client";

import { getWarrantyMasterDataStats } from "@/services/admin/WarrantyRegistration";
import { useEffect, useState } from "react";
import {
  MdOutlineArrowDropDown,
  MdOutlineArrowDropUp,
  MdOutlineArrowRight,
} from "react-icons/md";
import Link from "next/link";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { TbChartInfographic } from "react-icons/tb";

export default function OverviewData() {
  const [loading, setLoading] = useState(false);

  const [range, setRange] = useState<"today" | "last_7_days" | "last_30_days">(
    "last_30_days"
  );

  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await getWarrantyMasterDataStats(range);
        setStats(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, [range]);

  return (
    <>
      <LoadingOverlay show={loading} />
      <div className=" w-full flex flex-col gap-5 p-5 text-sm xl:text-base ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* left */}
          <div className="box-container ">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                {" "}
                <div className="bg-primary p-2 w-fit rounded-lg">
                  <TbChartInfographic />
                </div>
                <select
                  className="text-input-fill font-bold"
                  value={range}
                  onChange={(e) => setRange(e.target.value as any)}
                >
                  <option value="today">Hari ini</option>
                  <option value="last_7_days">7 Hari Terakhir</option>
                  <option value="last_30_days">30 Hari Terakhir</option>
                </select>
              </div>
              <p className="text-sm xl:text-base text-input-placeholder font-bold">
                Total Permintaan Registrasi Garansi
              </p>
              <div className="text-white font-bold text-xl xl:text-2xl flex gap-2 items-center">
                <p>{stats?.total ?? 0}</p>
                {stats?.percentage_change >= 0 && (
                  <div className=" bg-[#00DF80] py-1 px-3 rounded-full text-xs xl:text-sm flex items-center">
                    <MdOutlineArrowDropUp />
                    {stats?.percentage_change || 0}%
                  </div>
                )}
                {stats?.percentage_change < 0 && (
                  <div className="bg-[#DF3400] py-1 px-3 rounded-full text-xs xl:text-sm flex items-center text-white">
                    <MdOutlineArrowDropDown />
                    {Math.abs(stats.percentage_change)}%
                  </div>
                )}
              </div>
              <Link
                href={"/admin/dashboard/register-leads"}
                className="flex items-center px-5 py-3 text-primary
        rounded-lg text-xs xl:text-sm bg-[#333333] w-fit font-medium"
              >
                {" "}
                <p>Lihat Semua Permintaan</p>
                <MdOutlineArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>{" "}
    </>
  );
}
