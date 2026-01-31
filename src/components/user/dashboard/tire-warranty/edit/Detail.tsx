"use client";
import ActionLinkPrev from "@/components/ui/button/ActionLinkPrev";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import Image from "next/image";
import GeneralInput from "@/components/ui/GeneralInput";
import OdometerInput from "@/components/ui/OdometerInput";
import FileImageInput from "@/components/ui/FileImageInput";
import DateInput from "@/components/ui/DateInput";
import { HiCalendarDateRange } from "react-icons/hi2";
import FilePdfInput from "@/components/ui/FilePdfInput";
import Link from "next/link";
import DropdownInput from "@/components/ui/DropdownInput";
import BarcodeScanInput from "@/components/ui/BarcodeScanInput";
import ButtonAdd from "@/components/ui/button/ButtonAdd";
import useWarrantyDetailHook from "@/hooks/user/warrantyEdit";
import { CiSearch } from "react-icons/ci";

export default function DetailEditTireWarrantyEdit() {
  const {
    loading,
    loadingSubmit,
    data,
    dataEdit,
    getFieldAlias,
    isEditable,
    setDataEdit,
    setOdometerFile,
    imageSrc,
    openPreview,
    setOpenPreview,
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
  } = useWarrantyDetailHook();
  
  return (
    <>
      <LoadingOverlay show={loading} />
      <LoadingOverlay show={loadingSubmit} />
      <div className="flex flex-col gap-5 w-full p-5 text-white min-h-125 ">
        {/* top */}
        <div className="flex flex-col gap-5">
          <ActionLinkPrev
            href="/dashboard/tire-warranty/status"
            label="Kembali"
            className="w-fit font-bold"
          />
          <div className="text-primary bg-secondary p-5 rounded-lg text-sm xl:text-base flex items-center justify-center  font-bold">
            <p>Scroll dan lakukan perbaikan pada field yang aktif.</p>
          </div>
          <div className=" flex flex-col gap-3 font-bold text-sm xl:text-base ">
            Catatan Dari Dunlop
            <div className="text-white bg-secondary p-5 rounded-lg text-xs xl:text-sm  flex flex-col gap-3">
              <p>Catatan : {data?.reason}</p>
              <div className="flex flex-col">
                <p className="mb-3">Lakukan perbaikan pada field</p>
                <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 px-5 list-disc">
                  {Array.isArray(data?.editable_fields) &&
                    data.editable_fields.map((field, index) => (
                      <li key={index}>{getFieldAlias(field)}</li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Data Kendaraan */}
        <div className="flex flex-col gap-3">
          <p>Data Kendaraan</p>
          <div className="grid grid-cols-1 md:grid-cols-2  w-full gap-5  items-start p-5 bg-secondary rounded-lg border border-input-border h-full">
            <div className="flex flex-col w-full gap-5 ">
              {isEditable("brand") || isEditable("model") ? (
                <div className="flex flex-col md:flex-row items-center gap-5 justify-between">
                  {/* BRAND */}
                  <DropdownInput
                    label="Brand Kendaraan"
                    name="brand"
                    value={dataEdit.brand ?? ""}
                    placeholder="Pilih Brand Kendaraan Anda"
                    options={(brandOptions ?? []).map((item) => ({
                      label: item.name,
                      value: item.name,
                    }))}
                    onChange={(e) => {
                      const selectedName = e.target.value;

                      const selectedBrand = brandOptions.find(
                        (item) => item.name === selectedName
                      );

                      if (!selectedBrand) return;

                      setBrandId(selectedBrand.id);

                      setDataEdit((prev) => ({
                        ...prev,
                        brand: selectedBrand.name,
                        model: "",
                      }));

                      setTypeOptions([]);
                    }}
                    required
                  />

                  {/* TYPE */}
                  <DropdownInput
                    label="Tipe Kendaraan"
                    name="type"
                    value={dataEdit.model ?? ""}
                    placeholder={
                      brandId
                        ? "Pilih Tipe Kendaraan Anda"
                        : "Pilih Brand Terlebih Dahulu"
                    }
                    options={(typeOptions ?? []).map((item) => ({
                      label: item.name,
                      value: item.name,
                    }))}
                    onChange={(e) =>
                      setDataEdit((prev) => ({
                        ...prev,
                        model: e.target.value,
                      }))
                    }
                    required
                    disabled={!brandId}
                  />
                </div>
              ) : (
                /* READ ONLY */
                <div className="flex flex-col md:flex-row gap-5 w-full">
                  <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
                    <label>
                      Brand Kendaraan <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center bg-input-fill border border-input-border rounded-lg">
                      <input
                        value={data?.brand ?? ""}
                        readOnly
                        className="flex-1 bg-transparent py-3 px-5 font-medium outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
                    <label>
                      Tipe Kendaraan <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center bg-input-fill border border-input-border rounded-lg">
                      <input
                        value={data?.model ?? ""}
                        readOnly
                        className="flex-1 bg-transparent py-3 px-5 font-medium outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-3 md:flex-row">
                {/* Plat Nomor Kendaraan */}
                <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
                  {!isEditable("plate_number") && (
                    <label>
                      Plat Nomor Kendaraan{" "}
                      <span className="text-red-500">*</span>
                    </label>
                  )}

                  {isEditable("plate_number") ? (
                    <GeneralInput
                      label=" Plat Nomor Kendaraan"
                      name="plate_number"
                      type="text"
                      placeholder="Masukan Plat Nomor Kendaraan Anda"
                      maxLength={12}
                      reddot
                      value={dataEdit.plate_number ?? data?.plate_number ?? ""}
                      onChange={(e) =>
                        setDataEdit((prev) => ({
                          ...prev,
                          plate_number: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <div className="flex items-center bg-input-fill border border-input-border rounded-lg overflow-hidden text-white/80">
                      <input
                        value={data?.plate_number ?? ""}
                        readOnly
                        className="flex-1 bg-transparent py-3 px-5 font-medium outline-none"
                      />
                    </div>
                  )}
                </div>
                {/* Odometer Awal Kendaraan */}
                <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
                  {!isEditable("odometer") && (
                    <label>
                      Odometer Awal Kendaraan
                      <span className="text-red-500">*</span>
                    </label>
                  )}
                  {isEditable("odometer") ? (
                    <OdometerInput
                      label="Odometer Awal Kendaraan"
                      placeholder="Masukan Odometer Saat Pembelian"
                      name="odometer"
                      value={dataEdit.odometer ?? data?.odometer ?? ""}
                      onChange={(value) =>
                        setDataEdit((prev) => ({
                          ...prev,
                          odometer: value,
                        }))
                      }
                    />
                  ) : (
                    <div className="flex items-center bg-input-fill border border-input-border rounded-lg overflow-hidden">
                      <input
                        value={data?.odometer ?? ""}
                        readOnly
                        className="flex-1 bg-transparent py-3 px-5 font-medium outline-none"
                      />
                      <span className="px-3  font-medium select-none">km</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Foto Odometer Awal Kendaraan */}
            <div className="flex flex-col gap-2 w-full h-full text-white font-bold text-sm xl:text-base">
              {!isEditable("image_odometer") && (
                <label>
                  Odometer Awal Kendaraan<span className="text-red-500">*</span>
                </label>
              )}
              {isEditable("image_odometer") ? (
                <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
                  <label>
                    Odometer Awal Kendaraan
                    <span className="text-red-500">*</span>
                  </label>{" "}
                  <FileImageInput
                    name="odometerImage"
                    label="Upload Gambar Odometer Kendaraan Anda"
                    description="Upload gambar dalam format .PNG/.JPG"
                    required
                    multiple={false}
                    onChange={(value) => {
                      setOdometerFile(value?.[0] ?? null);
                    }}
                  />
                </div>
              ) : (
                <div
                  onClick={() => setOpenPreview(true)}
                  className="bg-input p-5 rounded-lg font-medium text-sm xl:text-base border-2 border-dashed w-full flex flex-col gap-3 items-center justify-center h-40 cursor-pointer transition hover:opacity-80"
                >
                  <Image
                    src={imageSrc}
                    alt="Odometer"
                    width={9999}
                    height={9999}
                    className="w-full h-full object-contain"
                  />
                  <p className="text-xs text-white/60">
                    Klik untuk memperbesar
                  </p>
                </div>
              )}
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
        </div>
        {/* Informasi Pengguna */}
        <div className="flex flex-col gap-3">
          <p>Informasi Pengguna</p>
          <div className="grid grid-cols-1  w-full gap-5 md:justify-between items-center p-5 bg-secondary rounded-lg border border-input-border">
            {/* ID Toko Pembelian*/}
            <div className="w-full">
              {isEditable("store") ? (
                <div className="flex flex-col md:flex-row items-center gap-5 justify-between">
                  {/* STORE ID AUTOCOMPLETE */}
                  <div className="flex flex-col gap-2 w-full font-bold text-sm xl:text-base relative">
                    <label>
                      ID Toko Pembelian <span className="text-red-500">*</span>
                    </label>

                    {/* SELECT BOX */}
                    <button
                      type="button"
                      onClick={() => setOpen((prev) => !prev)}
                      className="flex justify-between items-center bg-secondary border border-input-border rounded-lg px-5 py-3 text-left"
                    >
                      <span>
                        {storeID ||
                          data?.store?.store_id ||
                          "Pilih ID Toko Pembelian"}
                      </span>
                      <span className="text-xs">
                        {" "}
                        <CiSearch />
                      </span>
                    </button>

                    {/* DROPDOWN */}
                    {open && (
                      <div className="absolute top-full mt-2 w-full bg-secondary border border-input-border rounded-lg z-20">
                        {/* SEARCH */}
                        <div className="p-3 border-b border-input-border">
                          <input
                            type="text"
                            placeholder="Cari ID Toko..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-input-border rounded-lg px-3 py-2 outline-none text-sm"
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
                                  setStoreID(item.store_id);
                                  setStoreName(item.store_name);

                                  setDataEdit((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          store_id: item.id,
                                        }
                                      : prev
                                  );

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

                  {/* STORE NAME */}
                  <div className="flex flex-col gap-2 w-full font-bold text-sm xl:text-base">
                    <label>Nama Toko</label>
                    <div className="flex items-center bg-input-fill border border-input-border rounded-lg">
                      <input
                        value={storeName || data?.store?.store_name || ""}
                        placeholder="Generate From ID Toko"
                        readOnly
                        className="flex-1 bg-transparent py-3 px-5 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* READ ONLY MODE */
                <div className="flex flex-col md:flex-row  gap-2 w-full text-white font-bold text-sm xl:text-base">
                  <div className="flex flex-col gap-2 w-full">
                    <label>
                      ID Toko Pembelian <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center bg-input-fill border border-input-border rounded-lg overflow-hidden text-white/80">
                      <input
                        value={data?.store?.store_id ?? ""}
                        readOnly
                        className="flex-1 bg-transparent py-3 px-5 font-medium outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label>Nama Toko</label>
                    <div className="flex items-center bg-input-fill border border-input-border rounded-lg overflow-hidden text-white/80 ">
                      <input
                        value={data?.store?.store_name ?? ""}
                        readOnly
                        className="flex-1 bg-transparent py-3 px-5 font-medium outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Tanggal Pembelian */}
              <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
                {!isEditable("purchase_date") && (
                  <label>
                    Tanggal Pembelian <span className="text-red-500">*</span>
                  </label>
                )}

                {isEditable("purchase_date") ? (
                  <DateInput
                    label="Tanggal Pembelian"
                    name="purchase_date"
                    value={dataEdit.purchase_date ?? data?.purchase_date ?? ""}
                    max={new Date().toISOString().split("T")[0]}
                    required
                    onChange={(value) =>
                      setDataEdit((prev) => ({
                        ...prev,
                        purchase_date: value,
                      }))
                    }
                  />
                ) : (
                  <div className="flex items-center bg-input-fill border border-input-border rounded-lg overflow-hidden">
                    <input
                      type="text"
                      value={data?.purchase_date ?? ""}
                      disabled
                      className="flex-1 bg-transparent py-3 px-5 font-medium outline-none"
                    />
                    <span className="px-3 font-medium select-none">
                      <HiCalendarDateRange />
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
                {!isEditable("invoice_number") && (
                  <label>
                    Nomor Invoice <span className="text-red-500">*</span>
                  </label>
                )}

                {isEditable("invoice_number") ? (
                  <GeneralInput
                    label="Nomor Invoice"
                    name="invoice_number"
                    type="text"
                    placeholder="Masukan Nomor Invoice Pembelian"
                    maxLength={32}
                    value={
                      dataEdit.invoice_number ?? data?.invoice_number ?? ""
                    }
                    reddot
                    onChange={(e) =>
                      setDataEdit((prev) => ({
                        ...prev,
                        invoice_number: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <div className="flex items-center bg-input-fill border border-input-border rounded-lg overflow-hidden text-white/80">
                    <input
                      value={data?.invoice_number ?? ""}
                      readOnly
                      className="flex-1 bg-transparent py-3 px-5 font-medium outline-none"
                    />
                  </div>
                )}
              </div>
              {isEditable("invoice") ? (
                <FilePdfInput
                  label="Unggah Invoice"
                  description="Unggah Invoice Pembelian"
                  name="invoice"
                  required
                  multiple={false}
                  onChange={(value) => {
                    const file = value?.[0] ?? null;
                    setInvoiceFile(file);
                    setDataEdit((prev) => ({
                      ...prev,
                      invoice: file,
                    }));
                  }}
                />
              ) : (
                <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
                  <label>
                    Unggah Invoice <span className="text-red-500">*</span>
                  </label>
                  {data?.invoice ? (
                    <Link
                      href={
                        typeof data.invoice === "string" ? data.invoice : ""
                      }
                      target="_blank"
                      className="flex items-center text-center bg-primary hover:bg-secondary hover:text-primary text-secondary border border-border rounded-lg overflow-hidden "
                    >
                      <p className="flex-1 bg-transparent py-3 px-5 font-medium outline-none">
                        View PDF
                      </p>
                    </Link>
                  ) : (
                    <p className="text-white/60 py-3 px-5">
                      Tidak ada file invoice
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <p>Informasi Ban</p>
        <div className="flex flex-col w-full  gap-5 p-5 bg-secondary rounded-lg border border-input-border">
          {/* ===== TIRES FORM ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data?.tire_warranties?.map((tire, index) => (
              <div key={tire.id}>
                <p>Data Ban {index + 1}</p>

                <div className="flex flex-col gap-5 mt-5 border border-input-border rounded-lg p-5 ">
                  {/* Tipe Ban */}
                  {isEditable(`tire_warranties[${index}].tire_type`) ? (
                    <DropdownInput
                      name={`tirestype-${index}`}
                      label="Tipe Ban"
                      value={tire.tire_type}
                      placeholder="Pilih Tipe Ban"
                      options={[
                        { label: "Premium", value: "premium" },
                        { label: "Sports", value: "sports" },
                      ]}
                      onChange={(e) =>
                        handleTireChange(index, "tire_type", e.target.value)
                      }
                      required
                    />
                  ) : (
                    <div className=" flex flex-col gap-2">
                      {" "}
                      <label>
                        Tipe Ban <span className="text-red-500">*</span>
                      </label>{" "}
                      <div className="flex items-center bg-input-fill border border-input-border rounded-lg overflow-hidden text-white/80">
                        <input
                          value={tire?.tire_type ?? ""}
                          readOnly
                          className="flex-1 bg-transparent py-3 px-5 font-medium outline-none capitalize"
                        />
                      </div>
                    </div>
                  )}
                  {/* Ukuran Ban */}
                  {isEditable(`tire_warranties[${index}].tire_size`) ? (
                    <GeneralInput
                      name={`tiresize-${index}`}
                      label="Ukuran Ban"
                      value={tire.tire_size}
                      placeholder="Masukkan Ukuran Ban"
                      maxLength={16}
                      required
                      reddot
                      onChange={(e) =>
                        handleTireChange(index, "tire_size", e.target.value)
                      }
                    />
                  ) : (
                    <div className=" flex flex-col gap-2">
                      {" "}
                      <label>
                        Ukuran Ban <span className="text-red-500">*</span>
                      </label>{" "}
                      <div className="flex items-center bg-input-fill border border-input-border rounded-lg overflow-hidden text-white/80">
                        <input
                          value={tire?.tire_size ?? ""}
                          readOnly
                          className="flex-1 bg-transparent py-3 px-5 font-medium outline-none capitalize"
                        />
                      </div>
                    </div>
                  )}
                  {isEditable(`tire_warranties[${index}].barcode`) ? (
                    <BarcodeScanInput
                      name={`tirebarcode-${index}`}
                      label="Kode Barcode Ban"
                      required
                      value={tire.barcode}
                      onChange={(value) =>
                        handleTireChange(index, "barcode", value || "")
                      }
                    />
                  ) : (
                    <div className=" flex flex-col gap-2">
                      {" "}
                      <label>
                        Kode Barcode Ban<span className="text-red-500">*</span>
                      </label>{" "}
                      <div className="flex items-center bg-input-fill border border-input-border rounded-lg overflow-hidden text-white/80">
                        <input
                          value={tire?.barcode ?? ""}
                          readOnly
                          className="flex-1 bg-transparent py-3 px-5 font-medium outline-none capitalize"
                        />
                      </div>
                    </div>
                  )}

                  {/* DOT Tire Number */}
                  {isEditable(`tire_warranties[${index}].tire_number`) ? (
                    <GeneralInput
                      name={`tiredotnumber-${index}`}
                      label="DOT Tire Number"
                      value={tire.tire_number}
                      placeholder="Masukkan DOT Tire Number"
                      maxLength={16}
                      required
                      reddot
                      onChange={(e) =>
                        handleTireChange(index, "tire_number", e.target.value)
                      }
                    />
                  ) : (
                    <div className=" flex flex-col gap-2">
                      {" "}
                      <label>
                        DOT Tire Number <span className="text-red-500">*</span>
                      </label>{" "}
                      <div className="flex items-center bg-input-fill border border-input-border rounded-lg overflow-hidden text-white/80">
                        <input
                          value={tire?.tire_number ?? ""}
                          readOnly
                          className="flex-1 bg-transparent py-3 px-5 font-medium outline-none capitalize"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <ButtonAdd label="SUBMIT" onClick={handleSubmit} />
      </div>{" "}
    </>
  );
}
