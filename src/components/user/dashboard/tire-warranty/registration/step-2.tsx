"use client";

import GeneralInput from "@/components/ui/GeneralInput";
import ActionLink from "@/components/ui/button/ActionLink";
import { useEffect, useState } from "react";
import DateInput from "@/components/ui/DateInput";
import { useWarrantyStore } from "@/stores/useWarrantyRegistrationStore";
import FilePdfInput from "@/components/ui/FilePdfInput";
import ActionLinkPrevGrey from "@/components/ui/button/ActionLinkPrevGrey";
import { getStore } from "@/services/Warranty";
import { StoreItem } from "@/types/general";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { CiSearch } from "react-icons/ci";
import FileInput from "@/components/ui/FileInput";
export default function WarrantyRegistrationStep2() {
  const {
    setField,
    invoiceNumber,
    purchaseDate,
    setInvoice,
    invoice,
    store_id,
  } = useWarrantyStore();
  const [data, setData] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(false);
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

  const filteredStore = data.filter(
    (item) =>
      item.store_id.toLowerCase().includes(search.toLowerCase()) ||
      item.store_name.toLowerCase().includes(search.toLowerCase())
  );

  const isFormValid =
    store_id !== "" && purchaseDate.trim() !== "" && invoice !== null;

  return (
    <div className="flex flex-col gap-5 font-bold text-sm xl:text-base">
      {/* right */}
      <LoadingOverlay show={loading} />
      <div className="flex flex-col gap-3 w-full h-full  ">
        <p>Data Pembelian</p>
        <div className="flex flex-col w-full gap-5 p-5 bg-secondary rounded-lg border border-input-border">
          <div className="flex flex-col md:flex-row items-center gap-5 justify-between">
            {/* STORE ID AUTOCOMPLETE */}
            <div className="flex flex-col gap-2 w-full font-bold text-sm xl:text-base relative">
              <label>ID Toko Pembelian</label>

              {/* SELECT BOX */}
              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex justify-between items-center bg-secondary border border-input-border rounded-lg px-5 py-3 text-left"
              >
                <span>{storeID || "Masukan ID Toko Pembelian"}</span>
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
                      placeholder="Cari Nama Toko..."
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
                            setStoreID(item.store_id);
                            setField("store_id", item.id);
                            setStoreName(item.store_name);
                            setOpen(false);
                            setSearch("");
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-primary/20 transition"
                        >
                          <p className="font-semibold text-xs">
                            {item.store_id}
                          </p>
                          <p className="text-sm text-white/60">
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

            <div className="flex flex-col gap-2 w-full font-bold text-sm xl:text-base">
              <label>Nama Toko</label>
              <div className="flex items-center bg-input-fill border border-input-border rounded-lg">
                <input
                  value={storeName}
                  placeholder="Generate From ID Toko"
                  readOnly
                  className="flex-1 bg-transparent py-3 px-5 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <DateInput
              label="Tanggal Pembelian"
              name="purchaseDate"
              value={purchaseDate}
              max={new Date().toISOString().split("T")[0]}
              required
              onChange={(e) => setField("purchaseDate", e)}
            />
            <GeneralInput
              label="Nomor Invoice"
              name="invoiceNumber"
              value={invoiceNumber}
              placeholder="Masukan Nomor Invoice Pembelian"
              maxLength={32}
              onChange={(e) => setField("invoiceNumber", e.target.value)}
            />
            <FileInput
              label="Unggah Invoice"
              description="Unggah Invoice Pembelian"
              name="buktiPembelian"
              required
              multiple={false}
              onChange={(files) => {
                setInvoice(files[0]);
              }}
            />
            {/* <FilePdfInput
              label="Unggah Invoice"
              description="Unggah Invoice Pembelian"
              name="buktiPembelian"
              required
              multiple={false}
              onChange={(files) => {
                setInvoice(files[0]);
              }}
            /> */}
          </div>
        </div>
      </div>
      <div className=" flex gap-5 items-center">
        <ActionLinkPrevGrey
          href="/dashboard/tire-warranty/registration?step=1"
          label="Kembali"
          className="w-full flex justify-center  "
        />
        <ActionLink
          href="/dashboard/tire-warranty/registration?step=3"
          label="Lanjutkan"
          className="w-full flex justify-center"
          disabled={!isFormValid}
        />
      </div>
    </div>
  );
}
