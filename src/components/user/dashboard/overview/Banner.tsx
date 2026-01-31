"use client";

import { getBannerIndexCustomer } from "@/services/General";
import { BannerItemDetail } from "@/types/general";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";

export default function OverviewBanner() {
  const [data, setData] = useState<BannerItemDetail[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getBanner = async () => {
      try {
        setLoading(true);
        const response = await getBannerIndexCustomer();
        setData(response.data ?? []);
      } catch (err) {
        console.error("Failed to fetch banner:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    getBanner();
  }, []);

  useEffect(() => {
    if (data.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % data.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [data.length]);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === data.length - 1 ? 0 : prev + 1));
  };

  if (loading || !data.length) return null;

  const item = data[activeIndex];

  return (
    <div className="relative w-full overflow-hidden rounded-lg p-5">
      <div className="relative w-full aspect-square md:aspect-auto md:h-60 lg:h-80 xl:h-100 rounded-lg">
        <Image
          src={item.image_desktop}
          alt={item.heading}
          fill
          priority
          className="object-cover hidden md:block rounded-lg"
        />
        <Image
          src={item.image_mobile}
          alt={item.heading}
          fill
          priority
          className="object-cover block md:hidden rounded-lg"
        />

        <div className="absolute bottom-0 left-0 w-full h-50 bg-linear-to-t from-black/80 to-transparent rounded-b-lg" />
      </div>

      <div className="absolute inset-0 p-5 flex items-end">
        <div className="flex justify-between items-end w-full p-5">
          <div className="flex flex-col gap-3 font-bold text-white">
            <p className="text-xl md:text-2xl xl:text-3xl">{item.heading}</p>
            <Link
              href={item.url}
              className="bg-primary text-secondary px-5 py-3 rounded-lg text-sm w-fit"
            >
              Lihat Semua
            </Link>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-2 xl:p-3 bg-primary text-secondary rounded-lg"
            >
              <FaCaretLeft />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 xl:p-3 bg-primary text-secondary rounded-lg"
            >
              <FaCaretRight />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 p-5">
        {data.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === activeIndex ? "bg-primary" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
