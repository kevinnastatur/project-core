"use client";
import { useState } from "react";
import Image from "next/image";
import Button from "../ui/button/Button";
import { UserResetPassword } from "@/services/Auth";
import { toast } from "sonner";
import Swal from "sweetalert2";
import LoadingOverlay from "../ui/LoadingOverlay";
import PasswordInput from "../ui/PasswordInput";
import ConfirmPasswordInput from "../ui/ConfirmPasswordInput";
import { useRouter, useSearchParams } from "next/navigation";

// BasePath for assets (must match next.config.ts)
// const BASE_PATH = "/id/warranty";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isValid = password && password === confirmPassword;

  const isPasswordMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordMatch) {
      Swal.fire({
        title: "Error",
        text: "Password dan konfirmasi password tidak sama",
        icon: "error",
      });
      return;
    }

    setLoading(true);

    try {
      await UserResetPassword({
        email: email || "",
        password: password || "",
        password_confirmation: confirmPassword || "",
        token: token || "",
      });

      toast.success("Password berhasil diatur ulang");
      setTimeout(() => {
        router.push("/auth/reset-password/sucess-change-password");
      }, 2000);
    } catch (error: any) {
      toast.error("Password gagal diatur ulang");
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
              src="/assets/logo-default.svg"
              alt="dunlop-logo"
              width={9999}
              height={9999}
              className="w-full h-full object-cover rounded-2xl  "
            />
          </div>
          <h1 className="font-bold text-xl lg:text-2xl xl:text-3xl ">
            Atur Ulang Kata Sandi Anda
          </h1>
          <p className="font-medium text-sm lg:text-base mb-5">
            Masukkan kata sandi baru Anda di bawah ini, pastikan kata sandi
            tersebut tidak sama dengan kata sandi sebelumnya
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
            <PasswordInput
              label="Kata Sandi"
              name="password"
              placeholder="Kata sandi setidaknya 8 karakter"
              value={password}
              required
              showStrength
              onChange={(e) => setPassword(e.target.value)}
            />
            <ConfirmPasswordInput
              placeholder="Kata sandi setidaknya 8 karakter"
              value={password}
              confirmValue={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button disabled={!isValid} label="Atur ulang kata sandi" />
          </form>
        </div>
      </div>
      <div className="w-full lg:w-[50%] lg:h-screen p-3 hidden lg:block">
        <div className="  w-full h-full   rounded-2xl">
          <Image
            src="/assets/auth/images2.png"
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
