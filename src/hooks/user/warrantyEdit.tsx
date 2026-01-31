"use client";
import { showErrorToast, showSuccessToast } from "@/helper/toastHelper";
import { useState } from "react";
import {
  getBrand,
  getStore,
  getType,
  UpdateWarranty,
} from "@/services/Warranty";
import { WarrantyItemDetail } from "@/types/warranty";
import useUserWarrantyHook from "@/hooks/user/warrantyDetail";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { StoreItem } from "@/types/general";
export default function useWarrantyDetailHook() {
  const router = useRouter();
  const { loading, data, setData, isEditable } = useUserWarrantyHook();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingStore, setLoadingStore] = useState(false);

  const FIELD_ALIAS: Record<string, string> = {
    brand: "Merek Kendaraan",
    model: "Model Kendaraan",
    plate_number: "Nomor Polisi",
    odometer: "Odometer",
    store: "Toko Pembelian",
    store_id: "ID Toko Pembelian",
    purchase_date: "Tanggal Pembelian",
    invoice_number: "Nomor Invoice",
    invoice: "File Invoice",
    image_odometer: "Foto Odometer",

    "tire_warranties.tire_type": "Tipe Ban",
    "tire_warranties.tire_size": "Ukuran Ban",
    "tire_warranties.barcode": "Barcode Ban",
    "tire_warranties.tire_number": "Nomor DOT Ban",
  };

  const getFieldAlias = (field: string) => {
    const normalized = field.replace(/\[\d+\]/g, "");

    return FIELD_ALIAS[normalized] ?? field;
  };

  useEffect(() => {
    if (data?.editable_fields === null) {
      router.replace("/dashboard/tire-warranty/status");
    }
  }, [isEditable, router]);

  const [dataStore, setDataStore] = useState<StoreItem[]>([]);
  const [dataEdit, setDataEdit] = useState<Partial<WarrantyItemDetail>>({});
  const [openPreview, setOpenPreview] = useState(false);
  const [odometerFile, setOdometerFile] = useState<File | null>(null);
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);

  const imageSrc =
    data?.image_odometer instanceof File
      ? URL.createObjectURL(data.image_odometer)
      : data?.image_odometer ?? "/assets/none-image.jpg";

  const handleTireChange = (
    index: number,
    field: "tire_type" | "tire_size" | "barcode" | "tire_number",
    value: string
  ) => {
    setData((prev) => {
      if (!prev || !prev.tire_warranties) return prev;

      const updatedTires = [...prev.tire_warranties];
      updatedTires[index] = {
        ...updatedTires[index],
        [field]: value,
      };

      return { ...prev, tire_warranties: updatedTires };
    });

    setDataEdit((prev) => {
      const updatedTires = prev.tire_warranties
        ? [...prev.tire_warranties]
        : [];

      const currentTire = data?.tire_warranties?.[index];

      updatedTires[index] = {
        ...updatedTires[index],
        [field]: value,
        id: currentTire!.id,
      };

      return { ...prev, tire_warranties: updatedTires };
    });
  };

  const handleSubmit = async () => {
    if (!data) return;

    try {
      setLoadingSubmit(true);

      const formData = new FormData();

      Object.entries(dataEdit).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key !== "tire_warranties") {
            formData.append(key, value as any);
          }
        }
      });

      if (odometerFile) {
        formData.append("image_odometer", odometerFile);
      }

      if (invoiceFile) {
        formData.append("invoice", invoiceFile);
      } else if (data.invoice) {
        console.warn(
          "Invoice tidak diubah, pastikan server menerima field ini"
        );
      }

      if (dataEdit.tire_warranties?.length) {
        dataEdit.tire_warranties.forEach((tire, index) => {
          if (!tire?.id) return;

          formData.append(`tire_warranties[${index}][id]`, String(tire.id));

          if (tire.tire_type !== undefined) {
            formData.append(
              `tire_warranties[${index}][tire_type]`,
              tire.tire_type
            );
          }

          if (tire.tire_size !== undefined) {
            formData.append(
              `tire_warranties[${index}][tire_size]`,
              tire.tire_size
            );
          }

          if (tire.barcode !== undefined) {
            formData.append(`tire_warranties[${index}][barcode]`, tire.barcode);
          }

          if (tire.tire_number !== undefined) {
            formData.append(
              `tire_warranties[${index}][tire_number]`,
              tire.tire_number
            );
          }
        });
      }

      const response = await UpdateWarranty(data.id, formData);

      if (response.success === true) {
        showSuccessToast(
          "Perubahan Status Registrasi Berhasil",
          `Status registrasi berhasil diubah!`
        );

        setTimeout(() => {
          router.push("/dashboard/tire-warranty/status");
        }, 2000);
      } else {
        showErrorToast(
          "Periksa Jaringan Internet Anda",
          "Perubahan Status Registrasi Gagal! Sepertinya jaringan Anda bermasalah, Periksa kembali jaringan anda lalu submit kembali."
        );
      }
    } catch (err) {
      console.error("❌ Update warranty gagal:", err);
      alert("Gagal submit data, coba lagi.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const [storeID, setStoreID] = useState("");
  const [storeName, setStoreName] = useState("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoadingStore(true);
        const response = await getStore();
        setDataStore(response.data ?? []);
      } catch (err) {
        console.error("Failed to fetch store:", err);
        setDataStore([]);
      } finally {
        setLoadingStore(false);
      }
    };

    fetchStore();
  }, []);

  const filteredStore = Array.isArray(dataStore)
    ? dataStore.filter((item) =>
        item?.store_id?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const [brandId, setBrandId] = useState<number | null>(null);
  const [brandOptions, setBrandOptions] = useState<any[]>([]);
  const [typeOptions, setTypeOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await getBrand();
        const sort = response.data.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
        setBrandOptions(sort);
      } catch (err) {
        console.error("Failed to get brand:", err);
      }
    };

    fetchBrand();
  }, []);

  useEffect(() => {
    if (!brandId) return;

    const fetchType = async () => {
      try {
        const response = await getType(brandId);
        const sort = response.data.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
        setTypeOptions(sort);
      } catch (err) {
        console.error("Failed to get type:", err);
      }
    };

    fetchType();
  }, [brandId]);

  return {
    loading,
    loadingSubmit,
    data,
    dataEdit,
    getFieldAlias,
    isEditable,
    setDataEdit,
    setOdometerFile,
    setOpenPreview,
    imageSrc,
    openPreview,
    handleTireChange,
    handleSubmit,
    setInvoiceFile,
    search,
    setSearch,
    open,
    setOpen,
    storeID,
    setStoreID,
    storeName,
    setStoreName,
    filteredStore,
    brandId,
    setBrandId,
    brandOptions,
    setBrandOptions,
    typeOptions,
    setTypeOptions,
  };
}
