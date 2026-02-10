import DateFormat from "@/components/common/DateFormat";
import { WarrantyItemDetail } from "@/types/warranty";

import { HiCalendarDateRange } from "react-icons/hi2";

interface UserInformationWarrantyProps {
  data: WarrantyItemDetail;
  user: WarrantyItemDetail["user"];
}

export default function UserInformationWarranty({
  data,
  user,
}: UserInformationWarrantyProps) {
  return (
    <div className=" flex flex-col gap-3 font-bold text-sm xl:text-base">
      <p>Informasi Pengguna</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-5 md:justify-between items-center p-5 bg-secondary rounded-lg border border-input-border">
        {/* name */}
        <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
          <label>
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center bg-input-fill border border-input-border rounded-lg overflow-hidden text-white/80">
            <input
              value={user?.name}
              placeholder=""
              required={true}
              readOnly
              className="flex-1 bg-transparent py-3 px-5 font-medium outline-none"
            />
          </div>
        </div>
        {/* phone */}
        <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
          <label>
            Nomor Telepon <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center bg-input-fill border border-input-border rounded-lg overflow-hidden text-white/80">
            <span className="px-3  font-medium select-none">+62</span>
            <input
              value={user?.phone || ""}
              placeholder=""
              maxLength={14}
              required={true}
              readOnly
              className="flex-1 bg-transparent py-3 px-5 font-medium outline-none"
            />
          </div>
        </div>
        {/* Tipe Kendaraan */}
        <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
          <label>
            Tipe Kendaraan <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center bg-input-fill border border-input-border rounded-lg overflow-hidden text-white/80">
            <input
              value={data?.model}
              placeholder=""
              required={true}
              readOnly
              className="flex-1 bg-transparent py-3 px-5 font-medium outline-none"
            />
          </div>
        </div>

        {/* Plat Nomor Kendaraan */}
        <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
          <label>
            Plat Nomor Kendaraan <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center bg-input-fill border border-input-border rounded-lg overflow-hidden text-white/80">
            <input
              value={data?.plate_number ?? ""}
              readOnly
              className="flex-1 bg-transparent py-3 px-5 font-medium outline-none"
            />
          </div>
        </div>

        {/* Odometer Awal Kendaraan */}
        <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
          <label>
            Odometer Awal Kendaraan<span className="text-red-500">*</span>
          </label>

          <div className="flex items-center bg-input-fill border border-input-border rounded-lg overflow-hidden">
            <input
              value={data?.odometer ?? ""}
              readOnly
              className="flex-1 bg-transparent py-3 px-5 font-medium outline-none"
            />
            <span className="px-3  font-medium select-none">km</span>
          </div>
        </div>
        {/* Toko Pembelian */}
        <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
          <label>
            Toko Pembelian<span className="text-red-500">*</span>
          </label>

          <div className="flex items-center bg-input-fill border border-input-border rounded-lg overflow-hidden">
            <input
              type="text"
              value={data?.store.store_name}
              disabled
              className="flex-1  py-3 px-5 font-medium outline-none"
            />
          </div>
        </div>
        {/* Tanggal Pembelian */}
        <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
          <label>
            Tanggal Pembelian <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center bg-input-fill border border-input-border rounded-lg overflow-hidden">
            <p className="flex-1 bg-transparent py-3 px-5 font-medium outline-none">
              {" "}
              <DateFormat date={data?.purchase_date ?? ""} />
            </p>
            <span className="px-3 font-medium select-none">
              <HiCalendarDateRange />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
