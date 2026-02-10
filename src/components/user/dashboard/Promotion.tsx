"use client";
import Link from "next/link";
import Image from "next/image";
import { MdOutlineArrowRight } from "react-icons/md";
import { getPromoIndexCustomer } from "@/services/General";
import { useEffect, useState } from "react";
import { PromoItem } from "@/types/general";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
export default function PromotionSection() {
  const [data, setData] = useState<PromoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const perpage = 8;

  const getPromo = async (currentPage: number) => {
    try {
      setLoading(true);
      const response = await getPromoIndexCustomer(currentPage, perpage);

      setData(response.data.data ?? []);

      setTotalPage(response.data.meta?.last_page ?? 1);
    } catch (err) {
      console.error("Failed to fetch promo:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPromo(page);
  }, [page]);
  return (
    <div className=" flex flex-col gap-5 w-full p-5 text-white text-base xl:text-lg">
      <LoadingOverlay show={loading} />
      <div className=" justify-between items-center flex font-bold">
        <p>Promo Eksklusif</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 ">
        {data.map((item) => (
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
      {data.length > 0 ? (
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          {/* PREV */}
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={` h-8 w-8 xl:h-12 xl:w-12 text-xs xl:text-sm text-primary flex justify-center items-center rounded-full border-2 border-primary font-semibold transition
        ${
          page === 1
            ? " text-primary/30 border-primary/30 cursor-not-allowed"
            : "border border-primary hover:border-primary"
        }
      `}
          >
            <FaArrowLeft />
          </button>

          {/* PAGE NUMBERS */}
          {Array.from({ length: totalPage }).map((_, index) => {
            const pageNumber = index + 1;
            const isActive = page === pageNumber;

            return (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={` h-8 w-8 xl:h-12 xl:w-12 text-xs xl:text-sm text-primary flex justify-center items-center rounded-full border-2 border-primary font-semibold transition
            ${
              isActive
                ? "bg-primary text-secondary"
                : "bg-input border border-input-border hover:border-primary"
            }
          `}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* NEXT */}
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPage))}
            disabled={page === totalPage}
            className={`h-8 w-8 xl:h-12 xl:w-12 text-xs xl:text-sm text-primary flex justify-center items-center rounded-full border-2 border-primary font-semibold transition
        ${
          page === totalPage
            ? " text-primary/30 border-primary/30 cursor-not-allowed"
            : "border border-primary hover:border-primary"
        }
      `}
          >
            <FaArrowRight />
          </button>
        </div>
      ) : (
        <p className="text-center ">Tidak ada Promosi tersedia</p>
      )}
    </div>
  );
}
