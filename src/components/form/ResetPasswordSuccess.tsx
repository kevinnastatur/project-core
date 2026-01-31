"use client";

// BasePath for assets (must match next.config.ts)
const BASE_PATH = "/id/warranty";
export default function ResetPasswordSuccess() {
  return (
    <main className="flex flex-col py-10 lg:py-0 gap-5 justify-center lg:flex-row lg:justify-between w-full h-full min-h-screen  2xl:w-480 mx-auto ">
      <div className="w-full lg:w-[50%] lg:h-screen h-full flex flex-col justify-center items-center ">
        <div className="flex flex-col gap-3 w-full px-5 lg:p-0 lg:w-[85%] xl:lg:w-[65%] justify-center items-center text-white text-center ">
          <IoIosCheckmarkCircleOutline className=" text-green-500 text-4xl xl:text-5xl" />

          <h1 className="font-bold text-xl lg:text-2xl xl:text-3xl ">
            Reset kata sandi akun berhasil
          </h1>
          <p className="font-medium text-sm lg:text-base">
            Bagus!! Kata sandi baru Anda telah diatur. Anda dapat menggunakan
            kata sandi baru Anda untuk masuk ke akun Anda.
          </p>
          <Link href={"/auth/login"} className="w-full mt-5">
            <Button label="Kembali ke halaman login" />
          </Link>
        </div>
      </div>
      <div className="w-full lg:w-[50%] lg:h-screen p-3 hidden lg:block">
        <div className="  w-full h-full   rounded-2xl">
          <Image
            src={`${BASE_PATH}/assets/auth/images2.png`}
            alt="Register Image"
            width={9999}
            height={9999}
            className="w-full h-full object-cover rounded-2xl bg-white "
          />
        </div>
      </div>
    </main>
  );
}
