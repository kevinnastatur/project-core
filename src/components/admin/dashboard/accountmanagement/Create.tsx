"use client";
import ActionLinkPrev from "@/components/ui/button/ActionLinkPrev";
import GeneralInput from "@/components/ui/GeneralInput";
import { useEffect, useState } from "react";
import ButtonAdd from "@/components/ui/button/ButtonAdd";
import { showErrorToast, showSuccessToast } from "@/helper/toastHelper";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { useRouter } from "next/navigation";
import DropdownInput from "@/components/ui/DropdownInput";
import EmailInput from "@/components/ui/EmailInput";
import PhoneInput from "@/components/ui/PhoneInput";
import PasswordInput from "@/components/ui/PasswordInput";
import ConfirmPasswordInput from "@/components/ui/ConfirmPasswordInput";
import Swal from "sweetalert2";
import { CreateAccountPrincipal } from "@/services/admin/Account";
import { getStore } from "@/services/Warranty";
import { StoreItem } from "@/types/general";
import { CiSearch } from "react-icons/ci";

export default function CreateAccount() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<1 | 0 | null>(null);
  const STATUS_OPTIONS = [
    { value: 1, label: "Aktif" },
    { value: 0, label: "Tidak Aktif" },
  ] as const;

  const [role, setRole] = useState("");
  const [storeId, setStoreId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isValid = password && password === confirmPassword;
  const isPasswordMatch = password.length > 0 && password === confirmPassword;
  const [data, setData] = useState<StoreItem[]>([]);
  const [storeID, setStoreID] = useState("");
  const [storeName, setStoreName] = useState("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        const response = await getStore();
        setData(response.data ?? []);
      } catch (err) {
        console.error("Failed to fetch store:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, []);

  const filteredStore = data.filter((item) =>
    item.store_id.toLowerCase().includes(search.toLowerCase())
  );

  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (!isPasswordMatch) {
      Swal.fire({
        title: "Error",
        text: "Password dan konfirmasi password tidak sama",
        icon: "error",
      });
      return;
    }

    if (!role || !name || !email || !password || !phone) {
      showErrorToast(
        "Error",
        "Semua field wajib diisi, pastikan semua field terisi dengan benar"
      );
      return;
    }

    if (selectedStatus === null) {
      showErrorToast("Error", "Status akun wajib dipilih");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("role", role);
      {
        role === "shop" && formData.append("store_id", storeID);
      }
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("password_confirmation", password);
      formData.append("is_active", String(selectedStatus));

      const response = await CreateAccountPrincipal(formData);

      if (response.message === "User created successfully") {
        showSuccessToast("Akun Ditambahkan", `Anda berhasil menambahkan akun.`);
        setRole("");
        setStoreId("");
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");

        setSelectedStatus(null);
        setTimeout(() => {
          router.push("/admin/dashboard/account-management/view");
        }, 2000);
      } else {
        const emailError = response?.data?.email?.[0];

        if (emailError) {
          showErrorToast(
            "Email Tidak Valid",
            "Email sudah terdaftar, silakan gunakan email lain."
          );
          return;
        }

        showErrorToast(
          "Periksa Jaringan Internet Anda",
          "Perubahan Status Registrasi Gagal! Sepertinya jaringan Anda bermasalah, Periksa kembali jaringan anda lalu submit kembali."
        );
      }
    } catch (error: any) {
      console.error(error);
      showErrorToast(
        "Periksa Jaringan Internet Anda",
        "Perubahan Status Registrasi Gagal! Sepertinya jaringan Anda bermasalah, Periksa kembali jaringan anda lalu submit kembali."
      );
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {" "}
      <div className="flex flex-col gap-5 w-full p-5 text-white min-h-125 mb-20 ">
        <LoadingOverlay show={loading} />
        <ActionLinkPrev
          href="/admin/dashboard/account-management/view"
          label="Kembali"
          className="w-fit font-bold"
        />
        <p className="font-bold">Informasi Akun</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  w-full gap-5  items-center box-container">
          <DropdownInput
            label="Pilih Role"
            name="role"
            value={role}
            placeholder="Pilih Role"
            options={[
              { label: "Principal", value: "principal" },
              { label: "Dunlop Shop", value: "shop" },
              { label: "Distributor", value: "distributor" },
            ]}
            onChange={(e) => setRole(e.target.value)}
            required
          />
          {role === "shop" && (
            <div className="flex flex-col gap-2 w-full font-bold text-sm xl:text-base relative">
              <label>
                Pilih Toko <span className="text-red-500">*</span>
              </label>

              {/* SELECT BOX */}
              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex justify-between items-center bg-secondary border border-input-border rounded-lg px-5 py-3 text-left"
              >
                <span>{storeName || "Pilih ID Toko Pembelian"}</span>
                <span className="text-xs">
                  {" "}
                  <CiSearch />
                </span>
              </button>

              {/* DROPDOWN */}
              {open && (
                <div className="absolute top-full mt-2 w-full bg-secondary border border-input-border rounded-lg z-20">
                  {/* SEARCH INSIDE OPTION */}
                  <div className="p-3 border-b border-input-border">
                    <input
                      type="text"
                      placeholder="Cari ID Toko..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full  border border-input-border rounded-lg px-3 py-2 outline-none text-sm"
                    />
                  </div>

                  {/* OPTION LIST */}
                  <div className="max-h-60 overflow-y-auto">
                    {filteredStore.length > 0 ? (
                      filteredStore.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setStoreID(item.id);
                            setStoreName(item.store_name);
                            setOpen(false);
                            setSearch("");
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-primary/20 transition"
                        >
                          <p className="font-semibold">{item.store_id}</p>
                          <p className="text-xs text-white/60">
                            {item.store_name} — {item.city}
                          </p>
                        </button>
                      ))
                    ) : (
                      <p className="px-4 py-3 text-white/50">
                        Toko tidak ditemukan
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <GeneralInput
            name="name"
            label="Nama Lengkap"
            value={name}
            placeholder="Masukan Nama Lengkap"
            maxLength={256}
            required
            reddot
            onChange={(e) => setName(e.target.value)}
          />

          <EmailInput
            name="email"
            label="Email"
            value={email}
            placeholder="Masukan Email"
            maxLength={256}
            required
            reddot
            onChange={(e) => setEmail(e.target.value)}
          />
          <PhoneInput
            label="Nomor Telepon"
            name="phone"
            value={phone}
            placeholder="Masukan Nomor Telepon"
            maxLength={14}
            required
            reddot
            onChange={(value) => setPhone(value)}
          />
        </div>
        <p className="font-bold">Kata Sandi & Status Akun</p>
        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-5  items-start box-container">
          {" "}
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
        </div>
        <div className="flex flex-col gap-1">
          <label>
            Status Akun <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-5 flex-1">
            {STATUS_OPTIONS.map((item) => (
              <label
                key={item.value}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedStatus === item.value}
                  onChange={() => setSelectedStatus(item.value)}
                  className="
          w-3 h-3
          appearance-none
          rounded-full
          border-2 border-primary
          checked:bg-primary
          checked:border-primary
          transition
        "
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </div>
        <ButtonAdd
          disabled={!isValid}
          label="Tambahkan Akun"
          onClick={handleSubmit}
        />
      </div>{" "}
    </>
  );
}
function setData(arg0: any) {
  throw new Error("Function not implemented.");
}
