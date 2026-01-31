"use client";

import { MdOutlineArrowRight } from "react-icons/md";
import EmailInput from "../ui/EmailInput";
import { useState } from "react";
import { UserResendVerification } from "@/services/Auth";
import { toast } from "sonner";

type SubmitOverlayProps = {
  show?: boolean;
};

export default function ResendOverlay({ show = false }: SubmitOverlayProps) {
  const [email, setEmail] = useState("");
  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await UserResendVerification({ email });
      toast.success("Email berhasil dikirim, silakan cek email Anda");
      setEmail("");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      toast.error("Email tidak ditemukan");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm font-light">
      <div className="bg-white p-5 rounded-lg flex flex-col gap-3 w-125 max-w-[90%]">
        <p className="text-sm xl:text-base text-secondary font-bold">
          Kami melihat akun Anda belum terverifikasi. Jangan khawatir, cukup
          klik Submit untuk meminta link baru, lalu cek email Anda. Klik link di
          dalam email tersebut agar Anda bisa kembali menggunakan layanan kami.
        </p>
        <EmailInput
          label="Email"
          name="email"
          value={email}
          placeholder="example@email.com"
          maxLength={256}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="button"
          onClick={handleSubmit}
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
        flex items-center justify-center cursor-pointer   hover:opacity-90
           
          `}
        >
          Kirim Ulang Verifikasi
          <MdOutlineArrowRight />
        </button>
      </div>
    </div>
  );
}
