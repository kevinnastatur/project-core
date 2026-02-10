import { WarrantyItemDetail } from "@/types/warranty";
import html2canvas from "html2canvas";
import { useRef } from "react";
interface UserInformationWarrantyProps {
  data: WarrantyItemDetail;
  user: WarrantyItemDetail["user"];
}

const warningIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
  >
    <path
      d="M18 9.375C18.6213 9.375 19.125 9.87868 19.125 10.5V19.5C19.125 20.1213 18.6213 20.625 18 20.625C17.3787 20.625 16.875 20.1213 16.875 19.5V10.5C16.875 9.87868 17.3787 9.375 18 9.375Z"
      fill="#DF3400"
    />
    <path
      d="M18 25.5C18.8284 25.5 19.5 24.8284 19.5 24C19.5 23.1716 18.8284 22.5 18 22.5C17.1716 22.5 16.5 23.1716 16.5 24C16.5 24.8284 17.1716 25.5 18 25.5Z"
      fill="#DF3400"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M1.875 18C1.875 9.09441 9.09441 1.875 18 1.875C26.9056 1.875 34.125 9.09441 34.125 18C34.125 26.9056 26.9056 34.125 18 34.125C9.09441 34.125 1.875 26.9056 1.875 18ZM18 4.125C10.337 4.125 4.125 10.337 4.125 18C4.125 25.663 10.337 31.875 18 31.875C25.663 31.875 31.875 25.663 31.875 18C31.875 10.337 25.663 4.125 18 4.125Z"
      fill="#DF3400"
    />
  </svg>
);
export default function GaransiCardInformation({
  data,
  user,
}: UserInformationWarrantyProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        scale: 5,
        backgroundColor: null,
      });

      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = image;
      link.download = `${user?.name}-${data?.warranty_code}.png`;
      link.click();
    } catch (error) {
      console.error("Gagal download kartu garansi", error);
    }
  };
  return (
    <div className=" flex flex-col lg:flex-row gap-5 font-bold text-sm xl:text-base h-full w-full ">
      <div className="flex flex-col gap-3">
        <p>Kartu Garansi Ban</p>
        <div
          ref={cardRef}
          className=" w-full h-65 lg:w-70 lg:h-45 xl:w-80 xl:h-50 rounded-lg relative  "
          style={{
            backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_PATH}/assets/warranty/kartu-garansi.png)`,
            backgroundSize: "cover",
          }}
        >
          {data?.status !== 3 && (
            <div className="w-full h-full inset-0 bg-black/80 rounded-lg absolute z-10 flex items-center justify-center">
              {data?.status === 0 && (
                <div className="flex flex-col gap-1 text-center p-3">
                  <div className="flex items-center justify-center w-full h-full">
                    {warningIcon}
                  </div>

                  <p>Menunggu Verifikasi</p>
                  <p className="text-xs xl:text-sm">
                    Mohon tunggu 1x24 Jam untuk proses verifikasi garansi ban
                  </p>
                </div>
              )}
              {data?.status === 2 && (
                <div className="flex flex-col gap-1 text-center p-3">
                  <div className="flex items-center justify-center w-full h-full">
                    {warningIcon}
                  </div>

                  <p>Ditolak</p>
                  <p className="text-xs xl:text-sm">Pendaftaran Anda Ditolak</p>
                </div>
              )}
            </div>
          )}
          <div className="p-3 absolute bottom-0 text-secondary font-bold flex flex-col  ">
            <p className="capitalize text-base xl:text-lg">{user?.name}</p>
            <p className="font-light">{data?.warranty_code}</p>
          </div>
        </div>
        <button
          onClick={handleDownloadImage}
          className="text-start text-xs xl:text-sm underline-offset-4 underline text-primary cursor-pointer"
        >
          Unduh Kartu Garansi
        </button>
      </div>
      <div className="flex flex-col gap-3 h-full w-full">
        <p>Riwayat Maintenance</p>
        <div
          className=" w-full h-37.5  lg:h-45 xl:h-50  rounded-lg relative  "
          style={{
            backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_PATH}/assets/warranty/example.png)`,
            backgroundSize: "cover",
          }}
        >
          <div className="w-full h-full inset-0 bg-black rounded-lg absolute z-10 flex items-center justify-center">
            <div className="flex flex-col gap-1 text-center p-3">
              {/* <div className="flex items-center justify-center w-full h-full">
                {warningIcon}
              </div> */}

              <p>Coming Soon</p>
              {/* <p className="text-xs xl:text-sm">
                Mohon tunggu 1x24 Jam untuk proses verifikasi garansi ban
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
