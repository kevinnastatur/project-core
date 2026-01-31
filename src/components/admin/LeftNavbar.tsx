"use client";
import useRegisterLeadsHook from "@/hooks/admin/registerLeadsHooks";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GoDatabase, GoMegaphone } from "react-icons/go";
import { IoPersonAddOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { LuShield, LuUser } from "react-icons/lu";
import {
  MdOutlineArrowDropDown,
  MdOutlineArrowDropUp,
  MdOutlineLogout,
} from "react-icons/md";
import { CgMenuGridO } from "react-icons/cg";

// BasePath for assets (must match next.config.ts)
const BASE_PATH = "/id/warranty";
import { CiDiscount1, CiImageOn } from "react-icons/ci";
import { HiOutlineUsers } from "react-icons/hi2";
import { destroyCookie } from "nookies";
import { showSuccessToast } from "@/helper/toastHelper";
import { useSidebarStore } from "@/stores/useSidebarStore";
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

export default function AdminLeftNavbar() {
  const pathname = usePathname();
  const show = useSidebarStore((s) => s.show);
  const toggle = useSidebarStore((s) => s.toggle);
  const { total } = useRegisterLeadsHook();
  const [registrasiGaransi, setRegistrasiGaransi] = useState<boolean>(false);
  const [bannerPromotion, setBannerPromotion] = useState<boolean>(false);

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
    <>
      {show && (
        <div className="flex flex-col gap-5 text-text-secondary bg-default-color-dark h-screen p-5 text-sm xl:text-base border-r border-input ">
          {/* logo */}
          <div className="flex items-center gap-5 ">
            <div className=" w-35 xl:w-45 h-full rounded-2xl">
              <Image
                src={`${BASE_PATH}/assets/logo-default.svg`}
                alt="dunlop-logo"
                width={1000}
                height={1000}
                className="w-full h-content object-cover rounded-2xl  "
              />
            </div>
            <button onClick={toggle}>{icons}</button>
          </div>
          {/* menu */}
          <div className=" h-full flex flex-col justify-between">
            <div className="flex flex-col gap-2 items-start mt-5 ">
              {/* overview */}
              <Link
                href="/admin/dashboard/overview"
                className={`flex items-center justify-between gap-3 py-2 w-full px-3 rounded-lg transition-all duration-300 ${
                  pathname === "/admin/dashboard/overview"
                    ? "link-active"
                    : "hover:bg-primary hover:text-secondary"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CgMenuGridO />
                  <p>Overview</p>
                </div>
              </Link>
              <div className="w-full h-px bg-input my-3"></div>
              {/* Registrasi Garansi */}
              <button
                onClick={() => setRegistrasiGaransi(!registrasiGaransi)}
                className="flex items-center justify-between gap-0 py-2 w-full px-3 rounded-lg transition-all duration-300 hover:bg-primary hover:text-secondary cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <LuShield />
                  <p>Registrasi Garansi</p>
                </div>
                {registrasiGaransi ? (
                  <MdOutlineArrowDropUp />
                ) : (
                  <MdOutlineArrowDropDown />
                )}
              </button>
              {registrasiGaransi && (
                <div className="flex flex-col gap-2 items-start w-full transition-all duration-500 ease-in-out">
                  <Link
                    href="/admin/dashboard/register-leads"
                    className={`flex items-center justify-between gap-3 py-2 w-full px-3 rounded-lg transition-all duration-300 ${
                      pathname === "/admin/dashboard/register-leads"
                        ? "link-active"
                        : "hover:bg-primary hover:text-secondary"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IoPersonAddOutline />
                      <p>Register</p>
                    </div>
                    <p className="rounded-full bg-[#333333] py-0.5 px-3 text-xs xl:text-sm text-primary ">
                      {total}
                    </p>
                  </Link>
                  <Link
                    href="/admin/dashboard/master-data"
                    className={`flex items-center justify-between gap-3 py-2 w-full px-3 rounded-lg transition-all duration-300 ${
                      pathname === "/admin/dashboard/master-data"
                        ? "link-active"
                        : "hover:bg-primary hover:text-secondary"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <GoDatabase />
                      <p>Master Data</p>
                    </div>
                  </Link>
                </div>
              )}
              <div className="w-full h-px bg-input my-3"></div>
              {/* Atur Banner */}
              <button
                onClick={() => setBannerPromotion(!bannerPromotion)}
                className="flex items-center justify-between gap-0 py-2 w-full px-3 rounded-lg transition-all duration-300 hover:bg-primary hover:text-secondary cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <GoMegaphone />

                  <p>Banner & Promosi</p>
                </div>
                {bannerPromotion ? (
                  <MdOutlineArrowDropUp />
                ) : (
                  <MdOutlineArrowDropDown />
                )}
              </button>
              {bannerPromotion && (
                <div className="flex flex-col gap-2 items-start w-full transition-all duration-500 ease-in-out ">
                  <Link
                    href="/admin/dashboard/banner/view"
                    className={`flex items-center justify-between gap-3 py-2 w-full px-3 rounded-lg transition-all duration-300 ${
                      pathname.startsWith("/admin/dashboard/banner/view")
                        ? "link-active"
                        : "hover:bg-primary hover:text-secondary"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CiImageOn />
                      <p>Atur Banner</p>
                    </div>
                  </Link>
                  <Link
                    href="/admin/dashboard/promo/view"
                    className={`flex items-center justify-between gap-3 py-2 w-full px-3 rounded-lg transition-all duration-300 ${
                      pathname === "/admin/dashboard/promo/view"
                        ? "link-active"
                        : "hover:bg-primary hover:text-secondary"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CiDiscount1 />
                      <p>Atur Promosi</p>
                    </div>
                  </Link>
                </div>
              )}
              <div className="w-full h-px bg-input my-3"></div>
              {/* Manajemen Akun */}
              <Link
                href="/admin/dashboard/account-management/view"
                className={`flex items-center justify-between gap-3 py-2 w-full px-3 rounded-lg transition-all duration-300 ${
                  pathname.startsWith("/admin/dashboard/account-management/")
                    ? "link-active"
                    : "hover:bg-primary hover:text-secondary"
                }`}
              >
                <div className="flex items-center gap-3">
                  <HiOutlineUsers />
                  <p>Manajemen Akun</p>
                </div>
              </Link>
              <div className="w-full h-px bg-input my-3"></div>
            </div>
            <div className="flex flex-col gap-2 items-start">
              {/* Pengaturan Akun */}
              <Link
                href="/admin/dashboard/account-setting/personal-data"
                className={`flex items-center justify-between gap-3 py-2 w-full px-3 rounded-lg transition-all duration-300 ${
                  pathname.startsWith("/admin/dashboard/account-setting/")
                    ? "link-active"
                    : "hover:bg-primary hover:text-secondary"
                }`}
              >
                <div className="flex items-center gap-3">
                  <LuUser />
                  <p>Pengaturan Akun</p>
                </div>
              </Link>
              <div className="w-full h-px bg-input my-3"></div>
              <button
                onClick={HandleLogout}
                className="flex items-center gap-3 py-2 w-full px-3 text-[#DF3400] hover:bg-primary hover:text-secondary rounded-lg transition-all duration-300 cursor-pointer"
              >
                {" "}
                <MdOutlineLogout />
                Logout {""}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
