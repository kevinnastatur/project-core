"use client";
import Link from "next/link";
import Image from "next/image";
import { MdOutlineArrowRight } from "react-icons/md";
import { getPromoIndexCustomer } from "@/services/General";
import { useEffect, useState } from "react";
import { PromoItem } from "@/types/general";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
export default function OverviewPromo() {
  const [data, setData] = useState<PromoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const page = 1;
  const perpage = 4;
  useEffect(() => {
    const getPromo = async () => {
      try {
        setLoading(true);
        const response = await getPromoIndexCustomer(page, perpage);
        setData(response.data.data ?? []);
      } catch (err) {
        console.error("Failed to fetch promo:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    getPromo();
  }, []);
  return (
    <div className=" flex flex-col gap-5 w-full p-5 text-white text-base xl:text-lg">
      <LoadingOverlay show={loading} />
      <div className=" justify-between items-center flex font-bold">
        <p>Promo Eksklusif</p>
        <Link
          href={"/dashboard/promotion"}
          className="bg-primary px-5 py-3 text-secondary rounded-lg text-base xl:text-sm flex items-center gap-1"
        >
          <p>Lihat Semua Promo</p>
          <MdOutlineArrowRight className="text-lg xl:text-xl " />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 ">
        {data.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="border-2 border-input-border hover:border-primary transition-all duration-300 rounded-lg p-5 flex flex-col justify-between font-bold bg-input"
          >
            <div className="flex flex-col gap-5">
              <Image
                src={item.image}
                alt={item.heading}
                width={9999}
                height={9999}
                className="w-full h-50 md:h-45 lg:h-25 xl:h-40 2xl:h-60 object-cover rounded-lg"
              />

              {/* Teks */}
              <div className="flex flex-col gap-1 flex-1">
                <p className="text-[#a3a3a3] text-sm xl:text-base line-clamp-2">
                  {item.periode}
                </p>
                <p className="text-sm xl:text-base font-semibold line-clamp-2">
                  {item.heading}
                </p>
              </div>
            </div>

            {/* Button */}
            <Link
              href={item.url}
              className="bg-primary px-5 py-3 text-secondary rounded-lg text-base xl:text-sm flex items-center gap-1 justify-center mt-3"
            >
              <p>Lihat Promo</p>
              <MdOutlineArrowRight className="text-lg xl:text-xl" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
