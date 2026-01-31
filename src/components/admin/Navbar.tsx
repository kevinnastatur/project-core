"use client";

import { showErrorToast } from "@/helper/toastHelper";
import userHooks from "@/hooks/user/userHooks";
import { getNotifIndex, updateNotif } from "@/services/admin/General";
import { useSidebarStore } from "@/stores/useSidebarStore";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdClose, IoMdNotificationsOutline } from "react-icons/io";
import { useRouter } from "next/navigation";

const icons = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <g clipPath="url(#clip0_78323_44075)">
      <path
        d="M8.25 4.5V19.5"
        stroke="#A3A3A3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.25 4.5H3.75C3.33579 4.5 3 4.83579 3 5.25V18.75C3 19.1642 3.33579 19.5 3.75 19.5H20.25C20.6642 19.5 21 19.1642 21 18.75V5.25C21 4.83579 20.6642 4.5 20.25 4.5Z"
        stroke="#A3A3A3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_78323_44075">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

type NavbarConfig = {
  match: (pathname: string) => boolean;
  parent: string;
  child: string;
  childActive?: boolean;
};

export default function AdminNavbar() {
  const router = useRouter();
  const toggle = useSidebarStore((s) => s.toggle);
  const searchParams = useSearchParams();
  const warranty_code = searchParams.get("warranty_code");
  const { user } = userHooks();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [notifShow, setNotifShow] = useState(false);
  const PAGE_SIZE = 3;
  const [notifData, setNotifData] = useState<any[]>([]);
  const [notifList, setNotifList] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const NAVBAR_CONFIG: NavbarConfig[] = [
    {
      match: (pathname) => pathname === "/admin/dashboard/overview",
      parent: "Dashboard Overview",
      child: "",
      childActive: false,
    },
    {
      match: (pathname) => pathname === "/admin/dashboard/master-data",
      parent: "Registrasi Garansi",
      child: "Data Registrasi",
    },
    {
      match: (pathname) => pathname.startsWith("/admin/dashboard/master-data/"),
      parent: "Registrasi Garansi",
      child: "Data Registrasi",
      childActive: true,
    },
    {
      match: (pathname) => pathname.startsWith("/admin/dashboard/maintenance"),
      parent: "Maintenance",
      child: "Permintaan Maintenance",
    },
    {
      match: (pathname) =>
        pathname.startsWith("/admin/dashboard/register-leads"),
      parent: "Registrasi Garansi",
      child: "Data Registrasi Baru",
      childActive: true,
    },
    {
      match: (pathname) =>
        pathname.startsWith("/admin/dashboard/register-detail/"),
      parent: "Registrasi Garansi",
      child: `Detail Registrasi - ${warranty_code}`,
      childActive: true,
    },
    // banner
    {
      match: (pathname) => pathname.startsWith("/admin/dashboard/banner/view"),
      parent: "Banner & Promosi",
      child: ``,
      childActive: false,
    },
    {
      match: (pathname) =>
        pathname.startsWith("/admin/dashboard/banner/create"),
      parent: "Banner & Promosi",
      child: `Tambah Banner`,
      childActive: true,
    },
    {
      match: (pathname) => pathname.startsWith("/admin/dashboard/banner/edit"),
      parent: "Banner & Promosi",
      child: `Rubah Banner`,
      childActive: true,
    },
    // promo
    {
      match: (pathname) => pathname.startsWith("/admin/dashboard/promo/view"),
      parent: "Banner & Promosi",
      child: ``,
      childActive: false,
    },
    {
      match: (pathname) => pathname.startsWith("/admin/dashboard/promo/create"),
      parent: "Banner & Promosi",
      child: `Tambah Promo Baru`,
      childActive: true,
    },
    {
      match: (pathname) => pathname.startsWith("/admin/dashboard/promo/edit"),
      parent: "Banner & Promosi",
      child: `Rubah Promo`,
      childActive: true,
    },
    // account management
    {
      match: (pathname) =>
        pathname.startsWith("/admin/dashboard/account-management/view"),
      parent: "Manajemen Akun",
      child: `Data Akun`,
      childActive: true,
    },
    {
      match: (pathname) =>
        pathname.startsWith("/admin/dashboard/account-management/create"),
      parent: "Manajemen Akun",
      child: `Tambah Akun Baru`,
      childActive: true,
    },
    {
      match: (pathname) =>
        pathname.startsWith("/admin/dashboard/account-management/edit"),
      parent: "Manajemen Akun",
      child: `Rubah Akun`,
      childActive: true,
    },
    // account management
    {
      match: (pathname) =>
        pathname.startsWith("/admin/dashboard/account-setting"),
      parent: "Pengaturan Akun",
      child: ``,
      childActive: false,
    },
  ];

  const navbar = NAVBAR_CONFIG.find((item) => item.match(pathname));

  if (!navbar) return null;

  useEffect(() => {
    const getNotif = async () => {
      try {
        const res = await getNotifIndex();
        const notifArray = Object.values(res.data);

        setNotifData(notifArray);
        setVisibleCount(PAGE_SIZE);
      } catch (error) {
        console.error(error);
      }
    };

    getNotif();
  }, []);

  useEffect(() => {
    setNotifList(notifData.slice(0, visibleCount));
  }, [notifData, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  const handleNotif = async (id: string) => {
    if (!id || loadingId === id) return;

    setLoadingId(id);

    try {
      await updateNotif(id);

      setNotifList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, read_at: new Date().toISOString() } : item
        )
      );
    } catch (error) {
      console.error("handleNotif error:", error);
      showErrorToast("Error", "Gagal menandai notifikasi");
    } finally {
      setLoadingId(null);
    }
  };
  const handleView = async (item: any) => {
    setNotifShow(false);

    await handleNotif(item.id);

    router.push(
      `/admin/dashboard/register-detail/${item.data.warranty_id}?warranty_code=${item.data.warranty_code}`
    );
    router.refresh();
  };

  return (
    <div className="w-full h-full">
      <div className="w-full bg-default-color-dark flex justify-between items-center p-5 relative">
        <div className=" flex flex-col gap-2">
          {" "}
          <button onClick={toggle}>{icons}</button>
          <div className="flex flex-wrap items-start gap-2 text-sm xl:text-base text-text-secondary">
            <span>{navbar.parent}</span>
            {navbar.child && <span>/</span>}
            <span
              className={navbar.childActive ? "text-primary" : "text-primary"}
            >
              {navbar.child}
            </span>
          </div>
        </div>
        <div className="flex gap-5 items-center text-white relative">
          <button
            onClick={() => setNotifShow((prev) => !prev)}
            className="cursor-pointer relative"
          >
            <IoMdNotificationsOutline className="text-lg xl:text-2xl" />
            {notifData.length > 0 && (
              <div className="bg-primary text-[8px] xl:text-xs absolute text-secondary w-5 h-5 flex items-center justify-center rounded-full -top-2 -right-2">
                {notifData.length > 0 &&
                  notifData.filter((item) => !item.read_at).length}
              </div>
            )}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex gap-3 items-center cursor-pointer"
          >
            <div className="rounded-full w-8 h-8 xl:w-10 xl:h-10 bg-primary text-secondary flex items-center justify-center font-bold text-base xl:text-lg">
              {user?.name?.slice(0, 2).toUpperCase()}
            </div>

            <p className="text-sm xl:text-base font-semibold capitalize hidden md:block">
              {user?.name}
            </p>
          </button>
        </div>
      </div>
      {notifShow && (
        <div className="absolute right-5 top-20 bg-white p-5 min-w-30 md:w-87.5 xl:w-100 rounded-lg text-secondary max-h-125 overflow-y-auto">
          <div className="flex items-center justify-between">
            <p>Panel Notifikasi</p>
            <button
              className="text-red-500 cursor-pointer"
              onClick={() => setNotifShow(false)}
            >
              <IoMdClose />
            </button>
          </div>
          <div className="w-full h-px bg-input my-3"></div>
          {notifList.map((item) => (
            <div key={item.id} className="py-2  flex flex-col gap-3 ">
              {item.data.message ===
                "A new warranty has been submitted and requires review." && (
                <div>
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">
                      {" "}
                      Pengajuan garansi baru telah dikirim dan memerlukan
                      peninjauan.
                    </p>
                    <p>
                      Kode Garansi:{" "}
                      <span className="font-semibold">
                        {item.data.warranty_code}
                      </span>{" "}
                    </p>
                    <p>
                      Plat Nomor:{" "}
                      <span className="font-semibold">
                        {item.data.plate_number}
                      </span>
                    </p>
                  </div>
                </div>
              )}
              {item.data.message ===
                "A warranty has been revised and is pending review." && (
                <div>
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">
                      Pengajuan garansi telah diperbarui dan sedang menunggu
                      peninjauan.
                    </p>
                    <p>
                      Kode Garansi:{" "}
                      <span className="font-semibold">
                        {item.data.warranty_code}
                      </span>
                    </p>
                    <p>
                      Plat Nomor:{" "}
                      <span className="font-semibold">
                        {item.data.plate_number}
                      </span>
                    </p>
                  </div>
                </div>
              )}
              {!item.read_at && (
                <div className="flex w-full gap-2">
                  <button
                    type="button"
                    disabled={loadingId === item.id}
                    onClick={() => handleView(item)}
                    className={`w-full flex justify-center py-2 rounded-lg
    ${
      loadingId === item.id
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-primary text-secondary hover:opacity-90"
    }
  `}
                  >
                    {loadingId === item.id ? "Loading..." : "Lihat"}
                  </button>

                  <button
                    onClick={() => handleNotif(item.id)}
                    disabled={loadingId === item.id}
                    className="bg-secondary text-primary py-2 rounded-lg disabled:opacity-50 cursor-pointer w-full"
                  >
                    {loadingId === item.id ? "Loading..." : "Tandai Baca"}
                  </button>
                </div>
              )}
            </div>
          ))}
          {notifList.length === 0 && (
            <p className="text-center text-xs xl:text-sm">
              Tidak ada notifikasi
            </p>
          )}
          {visibleCount < notifData.length && (
            <button
              onClick={handleLoadMore}
              className="w-full mt-3 py-2 text-xs xl:text-sm bg-secondary text-primary hover:bg-secondary/80 rounded-lg cursor-pointer"
            >
              Load more
            </button>
          )}
        </div>
      )}
    </div>
  );
}
