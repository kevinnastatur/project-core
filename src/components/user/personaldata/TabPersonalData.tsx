"use client";
import Image from "next/image";
import { useState } from "react";
import { FaQuestion, FaSortDown } from "react-icons/fa";
import { IoMdLogOut, IoMdNotificationsOutline } from "react-icons/io";
import Link from "next/link";
import { usePathname } from "next/navigation";
import userHooks from "@/hooks/user/userHooks";
import { destroyCookie } from "nookies";
import { showSuccessToast } from "@/helper/toastHelper";
import { CgMenuGridO } from "react-icons/cg";
import { BsPatchCheck } from "react-icons/bs";
import { LuUser } from "react-icons/lu";
import { useSearchParams } from "next/navigation";
import { BiSolidLock } from "react-icons/bi";
import { TbRosetteDiscount } from "react-icons/tb";

type NavbarConfig = {
  match: (pathname: string) => boolean;
  parent: string;
  child: string;
  childActive?: boolean;
};

export default function TabPersonalData() {
  const { user } = userHooks();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const warranty_code = searchParams.get("warranty_code");
  const Tab = [
    {
      id: 1,
      src: <LuUser />,
      title: "Data Diri",
      link: "/dashboard/account-setting/personal-data",
      hover: "/dashboard/account-setting/personal-data",
    },
    {
      id: 2,
      src: <BiSolidLock />,
      title: "Kata Sandi",
      link: "/dashboard/account-setting/password",
      hover: "/dashboard/account-setting/password",
    },
    {
      id: 3,
      src: <TbRosetteDiscount />,
      title: "Promosi",
      link: "/dashboard/promotion",
      hover: "/dashboard/promotion",
    },
  ];

  const HandleLogout = () => {
    destroyCookie(null, "access_token", { path: "/" });
    destroyCookie(null, "role", { path: "/" });

    sessionStorage.clear();
    localStorage.clear();

    showSuccessToast("Success", "Anda berhasil logout");

    setTimeout(() => {
      window.location.replace("/auth/login");
    }, 1500);
  };
  return (
    <nav className="w-full p-5 bg-background">
      <div className="flex flex-col gap-5 text-white text-sm xl:text-base">
        <div
          className="
          flex gap-3 items-center
          w-full overflow-x-auto
          flex-nowrap
          scrollbar-hide
        "
        >
          {Tab.map((item) => {
            const isActive =
              pathname === item.hover || pathname.startsWith(item.hover + "/");

            return (
              <Link
                key={item.id}
                href={item.link}
                className={`
                shrink-0
                font-semibold flex gap-2 items-center
                px-5 py-3 rounded-lg
                hover:bg-[#333333]
                ${isActive ? "bg-[#333333]" : ""}
                 ${item.id === 3 ? "hidden lg:flex" : ""}
              `}
              >
                {item.src}
                <p className="whitespace-nowrap">{item.title}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
