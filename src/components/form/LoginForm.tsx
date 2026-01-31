"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import EmailInput from "../ui/EmailInput";
import Button from "../ui/button/Button";
import PasswordInput from "../ui/PasswordInput";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// BasePath for assets (must match next.config.ts)
const BASE_PATH = "/id/warranty";
import LoadingOverlay from "../ui/LoadingOverlay";
import { postUserLogin } from "@/services/Login";
import ResendOverlay from "./Pop-UpResendPassword";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [cfTurnstileToken, setCfTurnstileToken] = useState("");
  const [showSubmitOverlay, setShowSubmitOverlay] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (typeof window !== "undefined") {
    (window as any).onTurnstileVerify = (token: string) => {
      setCfTurnstileToken(token);
    };
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cfTurnstileToken) {
      toast.error("Please verify you are not a robot");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      return;
    }

    setLoading(true);

    try {
      const result = await postUserLogin({
        email,
        password,
        cf_turnstile_token: cfTurnstileToken,
      });

      if (!result.success || !result.token) {
        toast.error("Email atau password salah");
        return;
      }

      toast.success("Login berhasil");
      setTimeout(() => {
        router.push("/dashboard/overview");
      }, 1000);
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      const message = error instanceof Error ? error.message : "Login gagal";

      if (message === "Email not verified") {
        setShowSubmitOverlay(true);
      } else {
        toast.error("Email atau password salah");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        setShowSubmitOverlay(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay show={loading} />
      <main className="flex flex-col py-10 lg:py-0 gap-5 justify-center lg:flex-row lg:justify-between w-full h-full min-h-screen  2xl:w-480 mx-auto ">
        <div className="w-full lg:w-[50%] lg:h-screen h-full flex flex-col justify-center items-center ">
          <div className="flex flex-col gap-3 w-full px-5 lg:p-0 lg:w-[85%] xl:lg:w-[65%] justify-center text-white ">
            <div className=" w-full h-full rounded-2xl">
              <Image
                src={`${BASE_PATH}/assets/logo-default.svg`}
                alt="dunlop-logo"
                width={9999}
                height={9999}
                className="w-fit min-h-5 object-cover rounded-2xl  "
              />
            </div>
            <h1 className="font-bold text-xl lg:text-2xl xl:text-3xl mb-5">
              DUNLOP TYRE INDONESIA Warranty Claim & Services
            </h1>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 w-full"
            >
              <EmailInput
                label="Email"
                name="email"
                value={email}
                placeholder="example@email.com"
                maxLength={256}
                required
                onChange={(e) => setEmail(e.target.value)}
              />

              <PasswordInput
                label="Kata Sandi"
                name="password"
                placeholder="Kata sandi setidaknya 8 karakter"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="cf-turnstile"
                data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                data-callback="onTurnstileVerify"
              />
              <Button label="Masuk" />
            </form>
            <Link
              className="text-end text-primary font-semibold"
              href={"/auth/forgot-password"}
            >
              Lupa Kata Sandi
            </Link>
            <div className="text-center mt-5">
              Belum memiliki akun?{" "}
              <Link href={"/auth/register"}>
                <b>Daftar Sekarang</b>
              </Link>{" "}
            </div>
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
        <ResendOverlay show={showSubmitOverlay} />
      </main>{" "}
    </>
  );
}
