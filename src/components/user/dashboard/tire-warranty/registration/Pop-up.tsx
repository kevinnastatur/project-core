"use client";

import { useState } from "react";
import { MdOutlineArrowRight } from "react-icons/md";

type SubmitOverlayProps = {
  show?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export default function SubmitOverlay({
  show = false,
  disabled = false,
  onClick,
}: SubmitOverlayProps) {
  const [agreed, setAgreed] = useState(false);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm font-light">
      <div className="bg-white p-5 rounded-lg flex flex-col gap-3 w-125 max-w-[90%]">
        <p className="text-sm xl:text-base text-secondary font-bold">
          Syarat dan Ketentuan Garansi Dunlop
        </p>

        {/* CONTENT */}
        <div className="text-[#A3A3A3] text-xs xl:text-sm flex flex-col gap-3 overflow-y-auto h-80 pr-2 font-light">
          <p>
            {" "}
            1. **Cakupan**: Garansi ini menjamin perlindungan terhadap cacat
            bahan dan pengerjaan selama 2 tahun sejak tanggal pembelian. Ini
            memastikan bahwa produk Anda memenuhi standar kualitas tertinggi.{" "}
          </p>{" "}
          <p>
            {" "}
            2.**Pengecualian**: Harap dicatat bahwa garansi ini tidak mencakup
            kerusakan yang disebabkan oleh penyalahgunaan, kecelakaan, atau
            keausan alami yang terjadi seiring waktu. Sangat penting untuk
            menangani produk Anda dengan hati-hati untuk menjaga integritasnya.{" "}
          </p>{" "}
          <p>
            {" "}
            3. **Proses Klaim**: Untuk memulai klaim garansi, sangat penting
            untuk menyimpan tanda terima asli Anda sebagai bukti pembelian. Anda
            dapat menghubungi tim layanan pelanggan kami yang berdedikasi, yang
            akan memandu Anda melalui proses dan membantu Anda dengan pertanyaan
            yang mungkin Anda miliki.{" "}
          </p>{" "}
          <p>
            {" "}
            4. **Solusi**: Jika suatu produk dinyatakan cacat, kami akan
            memperbaiki atau menggantinya sesuai kebijakan kami. Kami berusaha
            untuk memastikan kepuasan Anda dan akan mengambil langkah-langkah
            yang diperlukan untuk menyelesaikan masalah dengan cepat.{" "}
          </p>{" "}
          <p>
            {" "}
            5. **Pembatasan**: Garansi ini tidak dapat dipindahtangankan dan
            hanya berlaku untuk pembeli asli. Penting untuk dipahami bahwa hanya
            individu yang membeli produk yang berhak atas manfaat garansi ini.{" "}
          </p>
        </div>

        {/* AGREEMENT */}
        <div className="flex items-start gap-2 text-[#A3A3A3] text-xs xl:text-sm">
          <input
            type="checkbox"
            className="mt-1 cursor-pointer"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <p>
            Dengan mencentang ini, saya menyetujui syarat dan ketentuan Garansi
            Ban Dunlop.
          </p>
        </div>

        {/* ACTION */}
        <button
          type="button"
          disabled={!agreed || disabled}
          onClick={onClick}
          className={`
           bg-primary
        border border-primary
        text-secondary
        font-bold
        py-3 px-5
        rounded-lg
        transition-all
        duration-300
        ease-out
        w-full
        flex items-center justify-center
            ${
              !agreed || disabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer   hover:opacity-90 "
            }
          `}
        >
          Submit Pendaftaran Garansi
          <MdOutlineArrowRight />
        </button>
      </div>
    </div>
  );
}
