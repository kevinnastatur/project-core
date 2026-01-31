"use client";
import ActionLinkPrev from "@/components/ui/button/ActionLinkPrev";
import GeneralInput from "@/components/ui/GeneralInput";
import FileInput from "@/components/ui/FileImageInput";
import { useState } from "react";
import ButtonAdd from "@/components/ui/button/ButtonAdd";
import { CreateBannerPrincipal } from "@/services/admin/General";
import { showErrorToast, showSuccessToast } from "@/helper/toastHelper";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { useRouter } from "next/navigation";

export default function CreateBanner() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<1 | 0 | null>(null);
  const STATUS_OPTIONS = [
    { value: 1, label: "Aktif" },
    { value: 0, label: "Tidak Aktif" },
  ] as const;

  const [bannerName, setBannerName] = useState("");
  const [bannerLink, setBannerLink] = useState("");
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (!bannerName || !bannerLink || !desktopFile || !mobileFile) {
      showErrorToast(
        "Error",
        "Semua field wajib diisi, pastikan semua field terisi dengan benar"
      );
      return;
    }

    if (selectedStatus === null) {
      showErrorToast("Error", "Status banner wajib dipilih");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("heading", bannerName);
      formData.append("url", bannerLink);
      formData.append("image_desktop", desktopFile);
      formData.append("image_mobile", mobileFile);
      formData.append("status", String(selectedStatus));

      const response = await CreateBannerPrincipal(formData);

      if (response.success === true) {
        showSuccessToast(
          "Banner Ditambahkan",
          `Anda berhasil melakukan upload banner.`
        );
        setBannerName("");
        setBannerLink("");
        setDesktopFile(null);
        setMobileFile(null);
        setSelectedStatus(null);
        setTimeout(() => {
          router.push("/admin/dashboard/banner/view");
        }, 2000);
      } else {
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
          href="/admin/dashboard/banner/view"
          label="Kembali"
          className="w-fit font-bold"
        />
        <p className="font-bold">Tambah Banner Baru</p>
        <div className="grid grid-cols-1 lg:grid-cols-2  w-full gap-5  items-center box-container">
          <GeneralInput
            name="banner_name"
            label="Heading Banner"
            value={bannerName}
            placeholder="Masukan Heading Banner Anda"
            maxLength={256}
            required
            reddot
            onChange={(e) => setBannerName(e.target.value)}
          />
          <GeneralInput
            name="banner_link"
            label="Link Banner"
            value={bannerLink}
            placeholder="Masukan Link Redirect Banner"
            maxLength={512}
            required
            reddot
            onChange={(e) => setBannerLink(e.target.value)}
          />
          <FileInput
            name="banner-desktop"
            label="Upload Banner Desktop"
            description="Upload gambar dalam format .PNG/.JPG"
            required
            multiple={false}
            onChange={(files) => setDesktopFile(files?.[0] || null)}
          />
          <FileInput
            name="banner-mobile"
            label="Upload Banner Desktop"
            description="Upload gambar dalam format .PNG/.JPG"
            required
            multiple={false}
            onChange={(files) => setMobileFile(files?.[0] || null)}
          />
          <div className="flex flex-col gap-1">
            <label>
              Status Banner <span className="text-red-500">*</span>
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
        <ButtonAdd label="Tambahkan Banner" onClick={handleSubmit} />
      </div>{" "}
    </>
  );
}
