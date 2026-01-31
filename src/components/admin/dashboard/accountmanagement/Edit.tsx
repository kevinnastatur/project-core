"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ActionLinkPrev from "@/components/ui/button/ActionLinkPrev";
import GeneralInput from "@/components/ui/GeneralInput";
import ButtonAdd from "@/components/ui/button/ButtonAdd";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { showErrorToast, showSuccessToast } from "@/helper/toastHelper";
import { AccountItemDetail, StoreItem } from "@/types/general";
import ButtonDelete from "@/components/ui/button/ButtonDelete";
import {
  DeleteAccountPrincipal,
  DetailAccountPrincipal,
  UpdateAccountPrincipal,
} from "@/services/admin/Account";
import DropdownInput from "@/components/ui/DropdownInput";
import EmailInput from "@/components/ui/EmailInput";
import PhoneInput from "@/components/ui/PhoneInput";
import PasswordInput from "@/components/ui/PasswordInput";
import ConfirmPasswordInput from "@/components/ui/ConfirmPasswordInput";
import { getStore } from "@/services/Warranty";
import { CiSearch } from "react-icons/ci";

export default function EditAccount() {
  const router = useRouter();
  const pathname = usePathname();
  const promoId = Number(pathname.split("/").pop());
  const [selectedStatus, setSelectedStatus] = useState<1 | 0 | null>(null);
  const [role, setRole] = useState("");
  const [data, setData] = useState<StoreItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState<AccountItemDetail | null>(
    null
  );
  const [storeID, setStoreID] = useState("");
  const [storeName, setStoreName] = useState("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const STATUS_OPTIONS = [
    { value: 1, label: "Aktif" },
    { value: 0, label: "Tidak Aktif" },
  ] as const;

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await DetailAccountPrincipal(promoId);

      const data: AccountItemDetail = res.data;

      setOriginalData(data);

      setRole(data.roles[0].name);
      if (data.roles[0].name === "shop") {
        setStoreID(data.stores[0].id);
      }
      setName(data.name);
      setEmail(data.email);
      setPhone(data.phone);
      setSelectedStatus(data.is_active as 1 | 0);
    } catch (error) {
      console.error(error);
      showErrorToast("Error", "Gagal mengambil detail account");
    } finally {
      setLoading(false);
    }
  };

  // nampilin store yang sudah pernah di simpan dari ID ke StoreName
  useEffect(() => {
    if (!storeID || data.length === 0) return;

    const selectedStore = data.find((item) => item.id === storeID);

    if (selectedStore) {
      setStoreName(selectedStore.store_name);
    }
  }, [storeID, data]);

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

  useEffect(() => {
    if (promoId) fetchDetail();
  }, [promoId]);

  const handleSubmit = async () => {
    if (!originalData) return;

    if (selectedStatus === null) {
      showErrorToast("Error", "Status akun wajib dipilih");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      // role
      if (role !== originalData.role) {
        formData.append("role", role);
      }

      // store_id (khusus dunlop-shop)
      if (role === "shop" && storeID !== originalData.store_id) {
        formData.append("store_id", storeID);
      }

      // name
      if (name !== originalData.name) {
        formData.append("name", name);
      }

      // email
      if (email !== originalData.email) {
        formData.append("email", email);
      }

      // phone
      if (phone !== originalData.phone) {
        formData.append("phone", phone);
      }

      // password (hanya jika diisi)
      if (password) {
        formData.append("password", password);
        formData.append("password_confirmation", password);
      }

      // status
      if (selectedStatus !== originalData.is_active) {
        formData.append("is_active", String(selectedStatus));
      }

      // 🚫 Tidak ada perubahan
      if ([...formData.keys()].length === 0) {
        showErrorToast("Info", "Tidak ada perubahan data");
        setLoading(false);
        return;
      }
      const res = await UpdateAccountPrincipal(formData, promoId);

      if (res.message === "User updated successfully") {
        showSuccessToast(
          "Account Diupdate",
          "Anda berhasil melakukan update account."
        );

        fetchDetail();
        setTimeout(() => {
          router.push("/admin/dashboard/account-management/view");
        }, 2000);
      } else {
        throw new Error("Update gagal");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Error", "Gagal memperbarui account");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await DeleteAccountPrincipal(promoId);

      if (res.message === "User deleted successfully") {
        showErrorToast(
          "Account Telah Dihapus",
          "Anda telah melakukan penghapusan account."
        );
        setTimeout(() => {
          router.push("/admin/dashboard/account-management/view");
        }, 2000);
      } else {
        throw new Error("Update gagal");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Error", "Gagal menghapus account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full p-5 text-white min-h-125 mb-20">
      <LoadingOverlay show={loading} />
      <div className="flex items-center justify-between">
        <ActionLinkPrev
          href="/admin/dashboard/account-management/view"
          label="Kembali"
          className="w-fit font-bold"
        />
        {role !== "customer" && (
          <div>
            <ButtonDelete label="Hapus Akun" onClick={handleDelete} />
          </div>
        )}
      </div>
      {role !== "customer" && (
        <div className="flex flex-col gap-5">
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
        </div>
      )}

      {role === "customer" && (
        <div className="flex flex-col gap-5">
          <p className="font-bold">Informasi Akun</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  w-full gap-5  items-center box-container">
            <GeneralInput
              name="role"
              label="Pilih Role"
              value={role}
              placeholder=""
              maxLength={256}
              required
              reddot
              disabled
              onChange={(e) => setRole(e.target.value)}
            />

            <GeneralInput
              name="name"
              label="Nama Lengkap"
              value={name}
              placeholder="Masukan Nama Lengkap"
              maxLength={256}
              required
              reddot
              disabled
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
              disabled
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
              disabled
              onChange={(value) => setPhone(value)}
            />
          </div>
          {/* <p className="font-bold">Kata Sandi & Status Akun</p>
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
          </div> */}
        </div>
      )}
      {role !== "customer" && (
        <ButtonAdd label="Update Akun" onClick={handleSubmit} />
      )}
    </div>
  );
}
