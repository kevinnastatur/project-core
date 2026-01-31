"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ActionLinkPrev from "@/components/ui/button/ActionLinkPrev";
import GeneralInput from "@/components/ui/GeneralInput";
import FileInput from "@/components/ui/FileImageInput";
import ButtonAdd from "@/components/ui/button/ButtonAdd";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import {
  DeleteBannerPrincipal,
  DeletePromoPrincipal,
  DetailPromoPrincipal,
  UpdatePromoPrincipal,
} from "@/services/admin/General";
import { showErrorToast, showSuccessToast } from "@/helper/toastHelper";
import { BannerItemDetail } from "@/types/general";
import ButtonDelete from "@/components/ui/button/ButtonDelete";

export default function EditPromo() {
  const router = useRouter();
  const pathname = usePathname();
  const bannerId = Number(pathname.split("/").pop());

  const [bannerName, setBannerName] = useState("");
  const [bannerLink, setBannerLink] = useState("");
  const [periode, setPeriode] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<1 | 0 | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [desktopPreview, setDesktopPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const STATUS_OPTIONS = [
    { value: 1, label: "Aktif" },
    { value: 0, label: "Tidak Aktif" },
  ] as const;

  /* ================= FETCH DETAIL ================= */
  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await DetailPromoPrincipal(bannerId);
      const data: BannerItemDetail = res.data;
      setBannerName(data.heading);
      setBannerLink(data.url);
      setPeriode(data.periode);
      setSelectedStatus(data.status as 1 | 0);

      setDesktopPreview(data.image);
    } catch (error) {
      console.error(error);
      showErrorToast("Error", "Gagal mengambil detail promo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bannerId) fetchDetail();
  }, [bannerId]);

  const handleSubmit = async () => {
    if (!bannerName || !bannerLink || selectedStatus === null) {
      showErrorToast("Error", "Field wajib belum lengkap");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("heading", bannerName);
      formData.append("url", bannerLink);
      formData.append("periode", periode);
      formData.append("status", String(selectedStatus));
      if (image) {
        formData.append("image", image);
      }

      const res = await UpdatePromoPrincipal(formData, bannerId);

      if (res.success === true) {
        showSuccessToast(
          "Promo Diupdate",
          "Anda berhasil melakukan update promo."
        );
        fetchDetail();
        setTimeout(() => {
          router.push("/admin/dashboard/promo/view");
        }, 2000);
      } else {
        throw new Error("Update gagal");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Error", "Gagal memperbarui promo");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await DeletePromoPrincipal(bannerId);

      if (res.success === true) {
        showErrorToast(
          "Promo Telah Dihapus",
          "Anda telah melakukan penghapusan promo."
        );
        setTimeout(() => {
          router.push("/admin/dashboard/promo/view");
        }, 2000);
      } else {
        throw new Error("Update gagal");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Error", "Gagal memperbarui promo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full p-5 text-white min-h-125 mb-20">
      <LoadingOverlay show={loading} />
      <div className="flex items-center justify-between">
        <ActionLinkPrev
          href="/admin/dashboard/promo/view"
          label="Kembali"
          className="w-fit font-bold"
        />
        <div>
          <ButtonDelete label="Hapus Banner" onClick={handleDelete} />
        </div>
      </div>

      <p className="font-bold">Edit Banner</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 box-container">
        <GeneralInput
          name="promo_name"
          label="Heading Banner"
          placeholder="Masukan Heading Promo Anda"
          maxLength={256}
          value={bannerName}
          reddot
          onChange={(e) => setBannerName(e.target.value)}
          required
        />

        <GeneralInput
          name="periode"
          label="Periode Promo"
          value={periode}
          placeholder="Masukan Periode Promo"
          maxLength={256}
          required
          reddot
          onChange={(e) => setPeriode(e.target.value)}
        />

        <GeneralInput
          name="promo_link"
          label="Link Banner"
          placeholder="Masukan Link Redirect Promo"
          maxLength={512}
          value={bannerLink}
          reddot
          onChange={(e) => setBannerLink(e.target.value)}
          required
        />

        <FileInput
          name="banner-desktop"
          label="Banner Desktop"
          description="Kosongkan jika tidak ingin mengubah"
          preview={desktopPreview}
          editlabel="Banner Desktop"
          onChange={(files) => setImage(files?.[0] || null)}
        />

        <div className="flex flex-col gap-1">
          <label>Status Banner *</label>
          <div className="flex gap-5">
            {STATUS_OPTIONS.map((item) => (
              <label key={item.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={selectedStatus === item.value}
                  onChange={() => setSelectedStatus(item.value)}
                />
                {item.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <ButtonAdd label="Update Banner" onClick={handleSubmit} />
    </div>
  );
}
