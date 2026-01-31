"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuUser } from "react-icons/lu";
import { BiSolidLock } from "react-icons/bi";

export default function TabPersonalDataAdmin() {
  const pathname = usePathname();
  const path = pathname.startsWith("/admin/dashboard/account-setting");
  const Tab = [
    {
      id: 1,
      src: <LuUser />,
      title: "Data Diri",
      link: "/admin/dashboard/account-setting/personal-data",
      hover: "/admin/dashboard/account-setting/personal-data",
    },
    {
      id: 2,
      src: <BiSolidLock />,
      title: "Kata Sandi",
      link: "/admin/dashboard/account-setting/password",
      hover: "/admin/dashboard/account-setting/password",
    },
  ];

  return (
    <>
      {path && (
        <nav className="flex flex-col gap-5 w-full p-5 bg-background">
          <div className=" flex lg:flex-col gap-3 text-white text-sm xl:text-base w-full   ">
            <div className="flex flex-wrap gap-3 items-center">
              {Tab.map((item) => {
                const isActive =
                  pathname === item.hover ||
                  pathname.startsWith(item.hover + "/");

                return (
                  <div className="flex flex-col relative ">
                    <Link
                      href={item.link}
                      key={item.id}
                      className={`font-semibold flex gap-2 items-center hover:bg-[#333333] px-5 py-3 rounded-lg  ${
                        isActive ? "bg-[#333333]" : ""
                      }`}
                    >
                      {item.src}
                      <p>{item.title}</p>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
