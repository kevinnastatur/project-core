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
  DetailBannerPrincipal,
  UpdateBannerPrincipal,
} from "@/services/admin/General";
import { showErrorToast, showSuccessToast } from "@/helper/toastHelper";
import { BannerItemDetail } from "@/types/general";
import ButtonDelete from "@/components/ui/button/ButtonDelete";

export default function EditBanner() {
  const router = useRouter();
  const pathname = usePathname();
  const bannerId = Number(pathname.split("/").pop());

  const [bannerName, setBannerName] = useState("");
  const [bannerLink, setBannerLink] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<1 | 0 | null>(null);

  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);

  const [desktopPreview, setDesktopPreview] = useState<string | null>(null);
  const [mobilePreview, setMobilePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const STATUS_OPTIONS = [
    { value: 1, label: "Aktif" },
    { value: 0, label: "Tidak Aktif" },
  ] as const;

  /* ================= FETCH DETAIL ================= */
  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await DetailBannerPrincipal(bannerId);
      const data: BannerItemDetail = res.data;

      setBannerName(data.heading);
      setBannerLink(data.url);
      setSelectedStatus(data.status as 1 | 0);

      setDesktopPreview(data.image_desktop);
      setMobilePreview(data.image_mobile);
    } catch (error) {
      console.error(error);
      showErrorToast("Error", "Gagal mengambil detail banner");
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
      formData.append("status", String(selectedStatus));
      if (desktopFile) {
        formData.append("image_desktop", desktopFile);
      }
      if (mobileFile) {
        formData.append("image_mobile", mobileFile);
      }

      const res = await UpdateBannerPrincipal(formData, bannerId);

      if (res.success === true) {
        showSuccessToast(
          "Banner Diupdate",
          "Anda berhasil melakukan update banner."
        );
        fetchDetail();
        setTimeout(() => {
          router.push("/admin/dashboard/banner/view");
        }, 2000);
      } else {
        throw new Error("Update gagal");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Error", "Gagal memperbarui banner");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await DeleteBannerPrincipal(bannerId);

      if (res.success === true) {
        showErrorToast(
          "Banner Telah Dihapus",
          "Anda telah melakukan penghapusan banner."
        );
        setTimeout(() => {
          router.push("/admin/dashboard/banner/view");
        }, 2000);
      } else {
        throw new Error("Update gagal");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Error", "Gagal memperbarui banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full p-5 text-white min-h-125 mb-20">
      <LoadingOverlay show={loading} />
      <div className="flex items-center justify-between">
        <ActionLinkPrev
          href="/admin/dashboard/banner/view"
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
          name="banner_name"
          label="Heading Banner"
          value={bannerName}
          onChange={(e) => setBannerName(e.target.value)}
          required
        />

        <GeneralInput
          name="banner_link"
          label="Link Banner"
          value={bannerLink}
          onChange={(e) => setBannerLink(e.target.value)}
          required
        />

        <FileInput
          name="banner-desktop"
          label="Banner Desktop"
          description="Kosongkan jika tidak ingin mengubah"
          preview={desktopPreview}
          editlabel="Banner Desktop"
          onChange={(files) => setDesktopFile(files?.[0] || null)}
        />

        <FileInput
          name="banner-mobile"
          label="Banner Mobile"
          description="Kosongkan jika tidak ingin mengubah"
          preview={mobilePreview}
          editlabel="Banner Mobile"
          onChange={(files) => setMobileFile(files?.[0] || null)}
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
