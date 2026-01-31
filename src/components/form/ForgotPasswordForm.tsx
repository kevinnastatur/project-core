"use client";
import { useState } from "react";
import Image from "next/image";
import EmailInput from "../ui/EmailInput";
import Button from "../ui/button/Button";
import { UserForgotPassword } from "@/services/Auth";
import { toast } from "sonner";
import LoadingOverlay from "../ui/LoadingOverlay";
import { useRouter } from "next/navigation";

// BasePath for assets (must match next.config.ts)
const BASE_PATH = "/id/warranty";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      await UserForgotPassword({
        email: email.trim(),
      });

      toast.success("Email berhasil dikirim, silakan cek email Anda");
      setEmail("");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error: any) {
      toast.error("Email tidak ditemukan");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="flex flex-col py-10 lg:py-0 gap-5 justify-center lg:flex-row lg:justify-between w-full h-full min-h-screen  2xl:w-480 mx-auto ">
      <LoadingOverlay show={loading} />
      <div className="w-full lg:w-[50%] lg:h-screen h-full flex flex-col justify-center items-center ">
        <div className="flex flex-col gap-3 w-full px-5 lg:p-0 lg:w-[85%] xl:lg:w-[65%] justify-center text-white ">
          <div className=" w-35 xl:w-45 h-full rounded-2xl">
            <Image
              src={`${BASE_PATH}/assets/logo-default.svg`}
              alt="dunlop-logo"
              width={9999}
              height={9999}
              className="w-full h-full object-cover rounded-2xl  "
            />
          </div>
          <h1 className="font-bold text-xl lg:text-2xl xl:text-3xl ">
            Lupa Kata Sandi
          </h1>
          <p className="font-medium text-sm lg:text-base mb-5">
            Silahkan masukkan email Anda untuk mengatur ulang kata sandi Anda.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
            <EmailInput
              label="Email"
              name="email"
              value={email}
              placeholder="example@email.com"
              maxLength={256}
              required
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button label="Kirim Email" />
          </form>
        </div>
      </div>
      <div className="w-full lg:w-[50%] lg:h-screen p-3 hidden lg:block">
        <div className="  w-full h-full   rounded-2xl">
          <Image
            src={`${BASE_PATH}/assets/auth/images2.png`}
            alt="Register Image"
            width={9999}
            height={9999}
            className="w-full h-full object-cover rounded-2xl bg-white "
          />
        </div>
      </div>
    </main>
  );
}
