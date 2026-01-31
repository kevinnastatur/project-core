"use client";
import DateFormat from "@/components/common/DateFormat";
import ActionLink from "@/components/ui/button/ActionLink";

type WarrantyStatus = 0 | 1 | 2 | 3;

const WARRANTY_STATUS_CONFIG: Record<
  WarrantyStatus,
  {
    label: string;
    description: string;
    badgeClass: string;
    button: string;
  }
> = {
  0: {
    label: "Proses Verifikasi",
    description: "Data garansi sedang dalam proses verifikasi",
    badgeClass: "bg-[#DFAB00] text-black",
    button: "Lihat Detail",
  },
  1: {
    label: "Perbaikan",
    description: "Produk sedang dalam proses perbaikan",
    badgeClass: "bg-[#DF3400] text-white",
    button: "Lakukan Perbaikan Data",
  },
  2: {
    label: "Ditolak",
    description: "Pengajuan garansi ditolak",
    badgeClass: "bg-[#DF3400] text-white",
    button: "Lihat Detail Penolakan",
  },
  3: {
    label: "Garansi Aktif",
    description: "Garansi masih aktif dan berlaku",
    badgeClass: "bg-[#00DF80] text-secondary",
    button: "Lihat Detail",
  },
};

interface CardHistoryWarrantyProps {
  warranty_id: string;
  car_number: string;
  activate_date: string;
  buy_date: string;
  status: 0 | 1 | 2 | 3;
  detailHref: string;
}

export default function CardHistoryWarranty({
  warranty_id,
  car_number,
  activate_date,
  buy_date,
  status,
  detailHref,
}: CardHistoryWarrantyProps) {
  const statusConfig = WARRANTY_STATUS_CONFIG[status];
  return (
    <div
      className="bg-input border-2 border-input-border  hover:border-primary transition-all duration-300 rounded-lg flex flex-col gap-2 p-5  text-primary justify-center  text-lg xl:text-xl min-h-75 md:h-75 xl:h-80 2xl:h-75 "
      style={{
        backgroundImage: "url('/assets/overview/images.png')",
        backgroundSize: "cover",
      }}
    >
      {/* status */}
      <div className="relative inline-flex items-center gap-2">
        {/* Badge */}
        <div
          className={`
      px-3 py-2
      rounded-full
      text-xs xl:text-sm
      flex items-center gap-2
      ${statusConfig.badgeClass}
    `}
        >
          <p>{statusConfig.label}</p>
          {/* Tooltip wrapper */}
          <div className="relative group mt-1">
            <button type="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M7.33398 6.00001H8.66732V4.66668H7.33398M8.00065 13.3333C5.06065 13.3333 2.66732 10.94 2.66732 8.00001C2.66732 5.06001 5.06065 2.66668 8.00065 2.66668C10.9406 2.66668 13.334 5.06001 13.334 8.00001C13.334 10.94 10.9406 13.3333 8.00065 13.3333ZM8.00065 1.33334C7.12517 1.33334 6.25827 1.50578 5.44943 1.84081C4.64059 2.17584 3.90566 2.66691 3.28661 3.28596C2.03636 4.53621 1.33398 6.2319 1.33398 8.00001C1.33398 9.76812 2.03636 11.4638 3.28661 12.7141C3.90566 13.3331 4.64059 13.8242 5.44943 14.1592C6.25827 14.4942 7.12517 14.6667 8.00065 14.6667C9.76876 14.6667 11.4645 13.9643 12.7147 12.7141C13.9649 11.4638 14.6673 9.76812 14.6673 8.00001C14.6673 7.12453 14.4949 6.25762 14.1598 5.44879C13.8248 4.63995 13.3338 3.90502 12.7147 3.28596C12.0956 2.66691 11.3607 2.17584 10.5519 1.84081C9.74304 1.50578 8.87613 1.33334 8.00065 1.33334ZM7.33398 11.3333H8.66732V7.33334H7.33398V11.3333Z"
                  fill="black"
                />
              </svg>
            </button>

            {/* Tooltip */}
            <div
              className="
        absolute
        bottom-full
        left-1/2
        -translate-x-1/2
        mb-5
        px-3 py-2
        rounded-lg
        text-xs
        text-secondary
 
        bg-primary
        whitespace-nowrap
        opacity-0
        scale-95
        pointer-events-none
        transition-all duration-200
        group-hover:opacity-100
        group-hover:scale-100
        z-50
      "
            >
              {statusConfig.description}
              <div
                className="
          absolute
          top-full
          left-1/2
          -translate-x-1/2
          w-2 h-2
          bg-dark
          rotate-45
        "
              />
            </div>
          </div>
        </div>
      </div>

      {/* detail */}
      <div className="flex gap-3 w-full items-start mt-3">
        {/* left */}
        <div className="flex flex-col gap-3 w-[60%] lg:w-1/2">
          <div className="flex flex-col gap-1">
            <p className="text-sm xl:text-base font-medium">ID Warranty</p>
            <p className="text-base xl:text-xl text-white">{warranty_id}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm xl:text-base font-medium">Plat Nomor</p>
            <p className="text-base xl:text-xl text-white">{car_number}</p>
          </div>
        </div>
        {/* right */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-sm xl:text-base font-medium">Masa Garansi</p>
            <p className="text-base xl:text-xl text-white">
              Aktif s/d {""}
              <DateFormat date={activate_date} />
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm xl:text-base font-medium">
              Tanggal Pembelian
            </p>
            <p className="text-base xl:text-xl text-white">
              {" "}
              <DateFormat date={buy_date} />
            </p>
          </div>
        </div>
      </div>

      <ActionLink
        href={detailHref}
        label={statusConfig.button}
        className=" w-full flex justify-center md:justify-start md:w-fit mt-3"
      />
    </div>
  );
}
