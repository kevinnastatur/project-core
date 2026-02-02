"use client";
import { useState } from "react";
import GeneralInput from "../ui/GeneralInput";
import Image from "next/image";
import EmailInput from "../ui/EmailInput";
import Button from "../ui/button/Button";
import PhoneInput from "../ui/PhoneInput";
import PasswordInput from "../ui/PasswordInput";
import ConfirmPasswordInput from "../ui/ConfirmPasswordInput";
import Link from "next/link";
import { UserRegister } from "@/services/Auth";
import { toast } from "sonner";
import Swal from "sweetalert2";
import LoadingOverlay from "../ui/LoadingOverlay";
import { useRouter } from "next/navigation";

// BasePath for assets (must match next.config.ts)
// const BASE_PATH = "/id/warranty";

export default function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+62");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
      await UserRegister({
        name: fullName.trim(),
        email: email.trim(),
        password,
        phone,
      });

      toast.success("Registrasi berhasil, silakan cek email untuk verifikasi");

      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error: any) {
      toast.error("Email sudah terdaftar. Silakan gunakan email lain.");
      setTimeout(() => {
        window.location.reload();
      }, 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay show={loading} />
      <main className="flex flex-col py-10 lg:py-5 gap-5 justify-center lg:flex-row lg:justify-between w-full h-full min-h-screen  2xl:w-480 mx-auto ">
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
            <h1 className="font-bold text-xl lg:text-2xl xl:text-3xl mb-5">
              Daftar Akun DUNLOP
            </h1>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 w-full"
            >
              <GeneralInput
                label="Nama Lengkap"
                name="fullName"
                value={fullName}
                placeholder="Masukkan nama lengkap anda"
                maxLength={256}
                required
                onChange={(e) => setFullName(e.target.value)}
              />
              <EmailInput
                label="Email"
                name="email"
                value={email}
                placeholder="example@email.com"
                maxLength={256}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <PhoneInput
                label="Nomor Telepon"
                name="phone"
                value={phone}
                placeholder="Masukan nomor telepon anda"
                maxLength={14}
                required
                onChange={(value) => setPhone(value)}
              />
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

              <Button disabled={!isValid} label="Daftar Akun" />
            </form>
            <div className="text-center mt-5">
              Sudah memiliki akun?{" "}
              <Link href={"/auth/login"}>
                <b>Masuk</b>
              </Link>{" "}
            </div>
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
    </>
  );
}
