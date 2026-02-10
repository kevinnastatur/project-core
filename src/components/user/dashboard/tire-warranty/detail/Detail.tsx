"use client";
import ActionLinkPrev from "@/components/ui/button/ActionLinkPrev";
import ButtonClose from "@/components/ui/button/ButtonClose";
import UserInformationWarranty from "./UserInformation";
import useUserWarrantyHook from "@/hooks/user/warrantyDetail";
import UserInformationTireWarranty from "./TiresInformation";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { useUserStore } from "@/stores/useUserStore";
import GaransiCardInformation from "./GaransiCardInformation";

export default function DetailTireWarranty() {
  const { alertTop, setAlertTop, loading } = useUserWarrantyHook();
  const { user } = useUserStore();
  const { data } = useUserWarrantyHook();

  return (
    <>
      <LoadingOverlay show={loading} />
      <div className="flex flex-col gap-5 w-full p-5 text-white min-h-125 ">
        {/* top */}
        <div className="flex flex-col gap-5">
          <ActionLinkPrev
            href="/dashboard/tire-warranty/status"
            label="Kembali"
            className="w-fit font-bold"
          />
          {!data?.reason && (
            <div className="relative flex flex-col md:flex-row md:justify-between md:items-center gap-5 font-bold text-xl xl:text-2xl">
              <p>Daftar Garansi Ban Dunlop</p>
            </div>
          )}

          {/* ALERT SUKSES */}
          {alertTop && data?.status !== (0 && 2) && (
            <div className="text-primary bg-secondary p-5 rounded-lg text-sm xl:text-base flex items-center justify-between font-bold">
              <p>
                Selamat, {user?.name}! Anda telah berhasil mendaftarkan Garansi
                Ban Anda. Ingatlah untuk menjadwalkan pemeliharaan rutin agar
                garansi Anda tetap berlaku dan menghindari pembatalan. Tetap
                aman di jalan!
              </p>
              <ButtonClose onClick={() => setAlertTop(false)} />
            </div>
          )}

          {/* ALERT MENUNGGU */}
          {alertTop && data?.status === 0 && (
            <div className="text-primary bg-secondary p-5 rounded-lg text-sm xl:text-base flex items-center justify-center font-bold">
              <p>
                Kami sedang memeriksa pendaftaran garansi ban Anda. Terima kasih
                atas kesabaran Anda!
              </p>
            </div>
          )}

          {/* ALERT DITOLAK */}
          {Boolean(data?.reason) && data?.status === 2 && (
            <div className=" flex flex-col gap-2 text-sm xl:text-base font-bold">
              <div className="text-white bg-[#DF3400] p-5 rounded-lg  flex items-center justify-between ">
                <p>
                  Kami mohon maaf, tetapi pendaftaran garansi ban Anda telah
                  ditolak. Jika Anda memiliki pertanyaan, jangan ragu untuk
                  menghubungi tim dukungan kami untuk bantuan.
                </p>
              </div>
              <p className="mt-3"> Catatan Dari Dunlop</p>

              <div className="text-white bg-secondary py-5 rounded-lg  ">
                <div className="flex flex-col gap-2 px-5">{data?.reason}</div>
              </div>
            </div>
          )}
        </div>
        {/* bottom */}
        {user && data && <GaransiCardInformation user={user} data={data} />}
        {user && data && <UserInformationWarranty user={user} data={data} />}
        {data && <UserInformationTireWarranty data={data} />}
      </div>{" "}
    </>
  );
}
