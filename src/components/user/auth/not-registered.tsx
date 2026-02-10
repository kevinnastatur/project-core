"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "../../ui/button/Button";
import { IoAlertCircleOutline } from "react-icons/io5";

export default function NotRegisteredComponents() {
  return (
    <main className="flex flex-col py-10 lg:py-0 gap-5 justify-center lg:flex-row lg:justify-between w-full h-full min-h-screen  2xl:w-480 mx-auto ">
      <div className="w-full lg:w-[50%] lg:h-screen h-full flex flex-col justify-center items-center ">
        <div className="flex flex-col gap-3 w-full px-5 lg:p-0 lg:w-[85%] xl:lg:w-[65%] justify-center items-center text-white text-center ">
          <IoAlertCircleOutline className=" text-red-500 text-4xl xl:text-5xl" />

          <h1 className="font-bold text-xl lg:text-2xl xl:text-3xl ">
            Akun Anda belum terdaftar
          </h1>
          <p className="font-medium text-sm lg:text-base">
            Akun anda belum terdaftar, anda dapat melakukan registrasi untuk
            menggunakan semua fitur Warranty System.
          </p>
          <Link href={"/auth/register"} className="w-full mt-5">
            <Button label="Masuk ke halaman registrasi" />
          </Link>
        </div>
      </div>
      <div className="w-full lg:w-[50%] lg:h-screen p-3 hidden lg:block">
        <div className="  w-full h-full   rounded-2xl">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/auth/images3.jpeg`}
            alt="Register Image"
            width={9999}
            height={9999}
            className="w-full h-full object-fit rounded-2xl bg-white "
          />
        </div>
      </div>
    </main>
  );
}
