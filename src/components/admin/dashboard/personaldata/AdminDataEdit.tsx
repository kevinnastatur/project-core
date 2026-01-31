"use client";
import ActionLinkPrevGrey from "@/components/ui/button/ActionLinkPrevGrey";
import ButtonSubmit from "@/components/ui/button/ButtonSubmit";
import EmailInput from "@/components/ui/EmailInput";
import GeneralInput from "@/components/ui/GeneralInput";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import PhoneInput from "@/components/ui/PhoneInput";
import { showErrorToast, showSuccessToast } from "@/helper/toastHelper";
import { getUser, UserEditProfile } from "@/services/Auth";
import { UserTypes } from "@/types/auth";
import { useEffect, useState } from "react";

export default function AdminDataEdit() {
  const [user, setUser] = useState<UserTypes | null>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const disable = !name && !email && !phone;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUser();

      setUser(res.data);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, [user]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await UserEditProfile({
        name: name || user?.name,
        email: email || user?.email,
        phone: phone || user?.phone,
      });

      if (res.message === "Profile updated successfully") {
        showSuccessToast(
          "Account Diupdate",
          "Anda berhasil melakukan update account."
        );

        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error: any) {
      showErrorToast("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full p-5 text-white min-h-125 ">
      <LoadingOverlay show={loading} />
      <div className="text-primary  bg-secondary p-5 rounded-lg text-sm xl:text-base flex items-center justify-center font-bold">
        <p>
          Klik ‘Simpan Perubahan’ apabila terdapat perubahan pada data diri
          Anda.
        </p>
      </div>
      <p className="font-bold">Informasi Akun</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  w-full gap-5  items-center box-container">
        <GeneralInput
          name="name"
          label="Nama Lengkap"
          value={name}
          placeholder={user?.name}
          maxLength={256}
          required
          reddot
          onChange={(e) => setName(e.target.value)}
        />

        <EmailInput
          name="email"
          label="Email"
          value={email}
          placeholder={user?.email}
          maxLength={256}
          required
          reddot
          onChange={(e) => setEmail(e.target.value)}
        />
        <PhoneInput
          label="Nomor Telepon"
          name="phone"
          value={phone}
          placeholder={user?.phone}
          maxLength={14}
          required
          reddot
          onChange={(value) => setPhone(value)}
        />
      </div>
      <div className=" grid grid-cols-2 gap-3  w-full  items-center">
        <ActionLinkPrevGrey href="/admin/dashboard/overview" label="Batalkan" />
        <ButtonSubmit
          label="Simpan Perubahan"
          onClick={handleSubmit}
          disabled={disable}
        />
      </div>
    </div>
  );
}
