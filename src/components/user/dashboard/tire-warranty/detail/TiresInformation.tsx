import { WarrantyItemDetail, Tire } from "@/types/warranty";

interface UserInformationTireWarrantyProps {
  data: {
    tire_warranties?: Tire[];
  };
}

export default function UserInformationTireWarranty({
  data,
}: UserInformationTireWarrantyProps) {
  return (
    <div className=" flex flex-col gap-3 font-bold text-sm xl:text-base h-full">
      <p>Informasi Ban</p>
      <div className="flex flex-col w-full  gap-5 p-5 bg-secondary rounded-lg border border-input-border">
        {/* ===== TIRES FORM ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {data?.tire_warranties?.map((tire, index) => (
            <div key={tire.id}>
              <p>Data Ban {index + 1}</p>
              <div className="flex flex-col gap-5 mt-3 border border-input-border rounded-lg p-5 ">
                {/* Tipe Ban */}

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

                {/* Ukuran Ban */}

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

                {/* Kode Barcode Ban */}
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

                {/* DOT Tire Number */}

                <div className=" flex flex-col gap-2">
                  {" "}
                  <label>
                    DOT Tire Number <span className="text-red-500">*</span>
                  </label>{" "}
                  <div className="flex items-center bg-input-fill border border-input-border rounded-lg overflow-hidden text-white/80">
                    <input
                      value={tire?.tire_number ?? ""}
                      readOnly
                      className="flex-1 bg-transparent py-3 px-5 font-medium outline-none uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
