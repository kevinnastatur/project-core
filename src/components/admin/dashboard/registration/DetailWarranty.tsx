"use client";

import ActionLinkPrev from "@/components/ui/button/ActionLinkPrev";
import Link from "next/link";
import {
  getWarrantyDetailPrincipal,
  UpdateWarrantyRegisterPrincipal,
} from "@/services/admin/WarrantyRegistration";
import { WarrantyItemDetail } from "@/types/warranty";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import ButtonSubmit from "@/components/ui/button/ButtonSubmit";
import DisableGeneralInput from "@/components/ui/disableinput/GeneralInput";
import DisableDateInput from "@/components/ui/disableinput/DateInput";
import DisableOdometerInput from "@/components/ui/disableinput/OdometerInput";
import DisablePhoneInput from "@/components/ui/disableinput/PhoneInput";
import { showErrorToast, showSuccessToast } from "@/helper/toastHelper";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

type TireWarrantyField = {
  value: string;
  active: boolean;
};

type TireWarrantyForm = {
  tire_type: TireWarrantyField;
  tire_size: TireWarrantyField;
  barcode: TireWarrantyField;
  tire_number: TireWarrantyField;
};

type WarrantyForm = {
  brand: TireWarrantyField;
  model: TireWarrantyField;
  plate_number: TireWarrantyField;
  odometer: TireWarrantyField;
  store: TireWarrantyField;
  purchase_date: TireWarrantyField;
  invoice_number: TireWarrantyField;
  invoice: TireWarrantyField;
  image_odometer: TireWarrantyField;
  tire_warranties: TireWarrantyForm[];
};

export default function AdminDetailWarranty() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [data, setData] = useState<WarrantyItemDetail | null>(null);
  const [reason, setReason] = useState("");
  const [openPreview, setOpenPreview] = useState(false);
  const STATUS_OPTIONS = [
    "Menunggu Konfirmasi",
    "Ajukan Perbaikan Customer",
    "Tolak Permintaan Registrasi",
    "Terima Permintaan Registrasi",
  ];

  type TireWarrantyForm = {
    tire_type: { value: string; active: boolean };
    tire_size: { value: string; active: boolean };
    barcode: { value: string; active: boolean };
    tire_number: { value: string; active: boolean };
  };

  const imageSrc =
    typeof data?.image_odometer === "string"
      ? data.image_odometer
      : "/assets/none-image.jpg";

  const invoiceSrc = typeof data?.invoice === "string" ? data.invoice : "";

  const createInitialForm = (data?: WarrantyItemDetail): WarrantyForm => ({
    brand: { value: data?.brand ?? "", active: false },
    model: { value: data?.model ?? "", active: false },
    plate_number: { value: data?.plate_number ?? "", active: false },
    odometer: { value: data?.odometer ?? "", active: false },
    store: { value: data?.store?.store_name ?? "", active: false },
    purchase_date: { value: data?.purchase_date ?? "", active: false },
    invoice_number: { value: data?.invoice_number ?? "", active: false },
    invoice: { value: invoiceSrc ?? "", active: false },
    image_odometer: { value: imageSrc ?? "", active: false },

    tire_warranties:
      data?.tire_warranties?.map(
        (tire): TireWarrantyForm => ({
          tire_type: { value: tire?.tire_type ?? "", active: false },
          tire_size: { value: tire?.tire_size ?? "", active: false },
          barcode: { value: tire?.barcode ?? "", active: false },
          tire_number: { value: tire?.tire_number ?? "", active: false },
        })
      ) ?? [],
  });

  const [form, setForm] = useState(() => createInitialForm());

  useEffect(() => {
    if (!data) return;
    setForm(createInitialForm(data));
  }, [data]);

  const toggleField = (key: keyof WarrantyForm, checked: boolean) => {
    setForm((prev) => {
      const field = prev[key];

      if (Array.isArray(field)) {
        return {
          ...prev,
          [key]: field.map((item) =>
            Object.keys(item).reduce((acc, k) => {
              acc[k as keyof TireWarrantyForm] = {
                ...item[k as keyof TireWarrantyForm],
                active: checked,
                value: checked ? item[k as keyof TireWarrantyForm].value : "",
              };
              return acc;
            }, {} as TireWarrantyForm)
          ),
        };
      }

      return {
        ...prev,
        [key]: {
          ...field,
          active: checked,
          value: checked ? field.value : "",
        },
      };
    });
  };

  const toggleTireField = (
    index: number,
    key: keyof TireWarrantyForm,
    checked: boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      tire_warranties: prev.tire_warranties.map((tire, i) =>
        i === index
          ? {
              ...tire,
              [key]: {
                ...tire[key],
                active: checked,
                value: checked ? tire[key].value : "",
              },
            }
          : tire
      ),
    }));
  };

  useEffect(() => {
    if (!id) return;

    const fetchWarrantyDetail = async () => {
      try {
        setLoading(true);
        const response = await getWarrantyDetailPrincipal(id);
        setData(response.data ?? null);
      } catch (err) {
        console.error(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWarrantyDetail();
  }, [id]);

  const handleSubmit = async () => {
    if (!data) return;

    const formData = new FormData();
    formData.append("id", String(data.id));

    const requiresReason =
      selectedStatus === "Ajukan Perbaikan Customer" ||
      selectedStatus === "Tolak Permintaan Registrasi";

    if (requiresReason) {
      if (!reason.trim()) {
        showErrorToast("Error", "Keterangan (reason) wajib diisi");
        return;
      }

      formData.append("reason", reason);

      if (selectedStatus === "Ajukan Perbaikan Customer") {
        formData.append("status", "1");
      } else if (selectedStatus === "Tolak Permintaan Registrasi") {
        formData.append("status", "2");
      }

      const editableFields: string[] = [];

      Object.entries(form).forEach(([key, field]) => {
        if (key === "tire_warranties") return;
        const typedField = field as TireWarrantyField;
        if (typedField.active) {
          editableFields.push(key);
          formData.append(key, typedField.value);
        }
      });

      form.tire_warranties.forEach((tire, index) => {
        Object.entries(tire).forEach(([key, field]) => {
          const typedField = field as TireWarrantyField;
          if (typedField.active) {
            const fieldName = `tire_warranties[${index}].${key}`;
            editableFields.push(fieldName);
            formData.append(fieldName, typedField.value);
          }
        });
      });

      editableFields.forEach((field) =>
        formData.append("editable_fields[]", field)
      );
    } else {
      switch (selectedStatus) {
        case "Menunggu Konfirmasi":
          formData.append("status", "0");
          break;
        case "Terima Permintaan Registrasi":
          formData.append("status", "3");
          break;
        default:
          console.warn("Status tidak dikenali:", selectedStatus);
      }
    }

    try {
      await UpdateWarrantyRegisterPrincipal(data.id, formData);
      setTimeout(() => {
        router.push("/admin/dashboard/master-data");
      }, 2000);
      showSuccessToast(
        "Perubahan Status Registrasi Berhasil",
        `Status Registrasi Garansi dengan ID ${data?.warranty_code} telah berhasil di-update.`
      );
    } catch (error) {
      console.error(error);
      showErrorToast(
        "Periksa Jaringan Internet Anda",
        "Perubahan Status Registrasi Gagal! Sepertinya jaringan Anda bermasalah, periksa kembali jaringan Anda lalu submit kembali."
      );
    }
  };

  return (
    <>
      {" "}
      <LoadingOverlay show={loading} />
      <div className="flex flex-col gap-5 w-full p-5 text-white min-h-125 mb-20 ">
        <ActionLinkPrev
          href="/admin/dashboard/master-data"
          label="Kembali"
          className="w-fit font-bold"
        />
        {selectedStatus === "Ajukan Perbaikan Customer" && (
          <div className="text-primary bg-secondary p-5 rounded-lg text-sm xl:text-base flex items-center justify-center font-bold">
            <p>Pilih Field untuk diajukan ke customer untuk perbaikan.</p>
          </div>
        )}
        {/* Informasi Pengguna */}
        <div className="flex flex-col lg:flex-row gap-5 w-full items-stretch ">
          {/* left */}
          <div className="mt-5 flex flex-col gap-3 font-bold text-sm xl:text-base w-full">
            <p>Informasi Pengguna</p>
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 w-full gap-5 md:justify-between items-center box-container">
              {/* name */}
              <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
                <label>
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <DisableGeneralInput value={data?.user.name ?? ""} />
              </div>
              {/* phone */}
              <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
                <label>
                  Nomor Telepon <span className="text-red-500">*</span>
                </label>
                <DisablePhoneInput value={data?.user.phone ?? ""} />
              </div>
              {/* Brand Kendaraan */}
              <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
                <div className="flex items-center justify-between">
                  <label>
                    Brand Kendaraan <span className="text-red-500">*</span>
                  </label>
                  {selectedStatus === "Ajukan Perbaikan Customer" && (
                    <input
                      type="checkbox"
                      checked={form.brand.active}
                      onChange={(e) => {
                        const checked = e.target.checked;

                        setForm((prev) => ({
                          ...prev,
                          brand: {
                            ...prev.brand,
                            active: checked,
                            value: checked ? prev.brand.value : "",
                          },
                        }));
                      }}
                    />
                  )}
                </div>
                <DisableGeneralInput value={data?.brand ?? ""} />
              </div>
              {/* Tipe Kendaraan */}
              <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
                <div className="flex items-center justify-between">
                  <label>
                    Tipe Kendaraan <span className="text-red-500">*</span>
                  </label>

                  {selectedStatus === "Ajukan Perbaikan Customer" && (
                    <input
                      type="checkbox"
                      checked={form.model.active}
                      onChange={(e) => {
                        const checked = e.target.checked;

                        setForm((prev) => ({
                          ...prev,
                          model: {
                            ...prev.model,
                            active: checked,
                            value: checked ? prev.model.value : "",
                          },
                        }));
                      }}
                    />
                  )}
                </div>
                <DisableGeneralInput value={data?.model ?? ""} />
              </div>
              {/* Plat Nomor Kendaraan */}
              <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
                <div className="flex items-center justify-between">
                  <label>
                    Plat Nomor Kendaraan <span className="text-red-500">*</span>
                  </label>

                  {selectedStatus === "Ajukan Perbaikan Customer" && (
                    <input
                      type="checkbox"
                      checked={form.plate_number.active}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setForm((prev) => ({
                          ...prev,
                          plate_number: {
                            ...prev.plate_number,
                            active: checked,
                            value: checked ? prev.plate_number.value : "",
                          },
                        }));
                      }}
                    />
                  )}
                </div>

                <DisableGeneralInput value={data?.plate_number ?? ""} />
              </div>

              {/* Odometer Awal Kendaraan */}
              <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
                <div className="flex items-center justify-between">
                  <label>
                    Odometer Awal Kendaraan{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  {selectedStatus === "Ajukan Perbaikan Customer" && (
                    <input
                      type="checkbox"
                      checked={form.odometer.active}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setForm((prev) => ({
                          ...prev,
                          odometer: {
                            ...prev.odometer,
                            active: checked,
                            value: checked ? prev.odometer.value : "",
                          },
                        }));
                      }}
                    />
                  )}
                </div>

                <DisableOdometerInput value={data?.odometer ?? ""} />
              </div>

              {/* Toko Pembelian */}
              <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
                <div className="flex items-center justify-between">
                  <label>
                    Toko Pembelian <span className="text-red-500">*</span>
                  </label>

                  {selectedStatus === "Ajukan Perbaikan Customer" && (
                    <input
                      type="checkbox"
                      checked={form.store.active}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setForm((prev) => ({
                          ...prev,
                          store: {
                            ...prev.store,
                            active: checked,
                            value: checked ? prev.store.value : "",
                          },
                        }));
                      }}
                    />
                  )}
                </div>

                <DisableGeneralInput value={data?.store.store_name ?? ""} />
              </div>

              {/* Tanggal Pembelian */}
              <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
                <div className="flex items-center justify-between">
                  <label>
                    Tanggal Pembelian <span className="text-red-500">*</span>
                  </label>

                  {selectedStatus === "Ajukan Perbaikan Customer" && (
                    <input
                      type="checkbox"
                      checked={form.purchase_date.active}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setForm((prev) => ({
                          ...prev,
                          purchase_date: {
                            ...prev.purchase_date,
                            active: checked,
                            value: checked ? prev.purchase_date.value : "",
                          },
                        }));
                      }}
                    />
                  )}
                </div>

                <DisableDateInput value={data?.purchase_date ?? ""} />
              </div>

              {/* Nomor Invoice */}
              <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
                <div className="flex items-center justify-between">
                  <label>
                    Nomor Invoice <span className="text-red-500">*</span>
                  </label>

                  {selectedStatus === "Ajukan Perbaikan Customer" && (
                    <input
                      type="checkbox"
                      checked={form.invoice_number.active}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setForm((prev) => ({
                          ...prev,
                          invoice_number: {
                            ...prev.invoice_number,
                            active: checked,
                            value: checked ? prev.invoice_number.value : "",
                          },
                        }));
                      }}
                    />
                  )}
                </div>

                <DisableGeneralInput value={data?.invoice_number ?? ""} />
              </div>

              {/* Invoice */}
              <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
                <div className="flex items-center justify-between">
                  <label>
                    Invoice <span className="text-red-500">*</span>
                  </label>

                  {selectedStatus === "Ajukan Perbaikan Customer" && (
                    <input
                      type="checkbox"
                      checked={form.invoice.active}
                      onChange={(e) => {
                        const checked = e.target.checked;

                        setForm((prev) => ({
                          ...prev,
                          invoice: {
                            ...prev.invoice,
                            active: checked,
                            value: checked ? prev.invoice.value : "",
                          },
                        }));
                      }}
                    />
                  )}
                </div>

                {data?.invoice ? (
                  <Link
                    target="_blank"
                    href={invoiceSrc}
                    className="text-primary font-medium"
                  >
                    Lihat Invoice
                  </Link>
                ) : (
                  <span className="text-gray-400 font-medium">-</span>
                )}
              </div>
            </div>
          </div>
          {/* right */}
          <div className="mt-5 flex flex-col gap-3 font-bold text-sm xl:text-base w-full h-full min-w-50 lg:w-[35%] xl:w-[50%] ">
            <div className="flex items-center justify-between">
              <label>Foto Odometer Kendaraan</label>

              {selectedStatus === "Ajukan Perbaikan Customer" && (
                <input
                  type="checkbox"
                  checked={form.image_odometer.active}
                  onChange={(e) =>
                    toggleField("image_odometer", e.target.checked)
                  }
                />
              )}
            </div>
            <div className=" box-container ">
              <div
                onClick={() => setOpenPreview(true)}
                className="h-full w-full cursor-pointer"
              >
                <Image
                  src={imageSrc}
                  alt=""
                  width={9999}
                  height={9999}
                  className="w-full h-60 xl:h-80 2xl:h-100 object-contain"
                />
              </div>
            </div>
            {openPreview && (
              <div
                className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center "
                onClick={() => setOpenPreview(false)}
              >
                <div
                  className="relative  w-full h-screen p-5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setOpenPreview(false)}
                    className="absolute top-5 right-5 text-white text-xl font-bold"
                  >
                    ✕
                  </button>
                  <Image
                    src={imageSrc}
                    alt="Preview Odometer"
                    width={9999}
                    height={9999}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Informasi Ban */}
        <div className=" flex flex-col gap-3 font-bold text-sm xl:text-base h-full">
          <p>Informasi Ban</p>
          <div className="flex flex-col w-full  gap-5 p-5 bg-secondary rounded-lg border border-input-border">
            {/* ===== TIRES FORM ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {form.tire_warranties.map((tire, index) => (
                <div key={index}>
                  <p className="font-bold text-white">Data Ban {index + 1}</p>

                  <div className="flex flex-col gap-5 mt-3 border border-input-border rounded-lg p-5">
                    {(
                      [
                        ["tire_type", "Tipe Ban"],
                        ["tire_size", "Ukuran Ban"],
                        ["barcode", "Kode Barcode Ban"],
                        ["tire_number", "DOT Tire Number"],
                      ] as const
                    ).map(([key, label]) => (
                      <div key={key} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <label>
                            {label} <span className="text-red-500">*</span>
                          </label>

                          {selectedStatus === "Ajukan Perbaikan Customer" && (
                            <input
                              type="checkbox"
                              checked={tire[key].active}
                              onChange={(e) =>
                                toggleTireField(index, key, e.target.checked)
                              }
                            />
                          )}
                        </div>

                        <DisableGeneralInput value={tire[key].value} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Submit */}
        <div className="flex flex-col-reverse lg:flex-row gap-5 w-full items-stretch">
          {/* left */}
          <div className="flex flex-col gap-3 font-bold text-sm xl:text-base w-full  flex-1">
            <p>Konfirmasi Registasi</p>

            <div className="box-container flex flex-col gap-3 p-5 flex-1">
              {STATUS_OPTIONS.map((label) => (
                <label
                  key={label}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedStatus === label}
                    onChange={() => setSelectedStatus(label)}
                    className="
              w-5 h-5
              appearance-none
              rounded-full
              border-2 border-primary
              checked:bg-primary
              checked:border-primary
              transition
            "
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            <ButtonSubmit label="Submit Perubahan" onClick={handleSubmit} />
          </div>
          {/* right */}
          {(selectedStatus === "Ajukan Perbaikan Customer" ||
            selectedStatus === "Tolak Permintaan Registrasi") && (
            <div className="flex flex-col gap-3 font-bold text-sm xl:text-base w-full lg:basis-[65%] lg:flex-none flex-1">
              <p>Masukan Keterangan Registrasi Garansi</p>

              <div className="box-container flex flex-col gap-3 p-5 flex-1 w-full">
                <p>Keterangan Registrasi Garansi</p>

                <textarea
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Masukan Catatan/Keterangan Registrasi Garansi"
                  className="border-input-border border rounded-lg p-3 flex-1 resize-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
