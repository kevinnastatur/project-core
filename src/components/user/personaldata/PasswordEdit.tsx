"use client";
import ActionLinkPrevGrey from "@/components/ui/button/ActionLinkPrevGrey";
import ButtonSubmit from "@/components/ui/button/ButtonSubmit";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import PasswordInput from "@/components/ui/PasswordInput";
import { showErrorToast, showSuccessToast } from "@/helper/toastHelper";
import { UserEditPassword } from "@/services/Auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PasswordEdit() {
  const router = useRouter();

  const [current_password, setCurrent_Password] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPassword_Confirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const disable = !current_password && !password && !password_confirmation;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await UserEditPassword({
        current_password: current_password,
        password: password,
        password_confirmation: password_confirmation,
      });
      if (
        res.message === "Password changed successfully. Please log in again."
      ) {
        showSuccessToast(
          "Password Diupdate",
          "Anda berhasil melakukan update password. Silahkan login kembali."
        );
        setTimeout(() => router.push("/auth/login"), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      if (message === "Current password is incorrect") {
        showErrorToast("Error", "Kata sandi lama salah");
      } else {
        showErrorToast("Error", "Gagal memperbarui kata sandi");
        setTimeout(() => window.location.reload(), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full p-5 text-white min-h-125 ">
      <LoadingOverlay show={loading} />
      <div className="text-primary  bg-secondary p-5 rounded-lg text-sm xl:text-base flex items-center justify-center font-bold">
        <p>
          Lakukan pergantian kata sandi setidaknya 2 bulan sekali untuk
          mengamankan akun Anda.
        </p>
      </div>
      <p className="font-bold">Pengaturan Kata Sandi</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  w-full gap-5  items-start box-container">
        <PasswordInput
          label="Kata Sandi Lama"
          name="current_password"
          placeholder="Masukan Kata Sandi Lama Anda"
          value={current_password}
          required
          showStrength
          onChange={(e) => setCurrent_Password(e.target.value)}
        />
        <PasswordInput
          label="Kata Sandi Baru"
          name="password"
          placeholder="Kata sandi setidaknya 8 karakter"
          value={password}
          required
          showStrength
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordInput
          label="Ulangi Kata Sandi Baru"
          name="password"
          placeholder="Kata sandi setidaknya 8 karakter"
          value={password_confirmation}
          required
          showStrength
          onChange={(e) => setPassword_Confirmation(e.target.value)}
        />
      </div>
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-3  w-full  items-center">
        <ActionLinkPrevGrey href="/dashboard/overview" label="Batalkan" />
        <ButtonSubmit
          label="Simpan Perubahan"
          onClick={handleSubmit}
          disabled={disable}
          className="text-sm xl:text-base border-none "
        />
      </div>
    </div>
  );
}
