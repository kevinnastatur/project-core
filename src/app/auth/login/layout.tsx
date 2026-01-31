import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Dunlop Warranty System",
  description:
    "Login ke sistem Dunlop Warranty untuk mengelola garansi kendaraan, melihat status klaim, dan memperbarui data Anda.",
  robots:
    process.env.NEXT_PUBLIC_ENV === "production"
      ? "noindex, nofollow"
      : "index, follow",
  openGraph: {
    title: "Login | Dunlop Warranty System",
    description:
      "Masuk ke Dunlop Warranty System untuk mengakses layanan garansi kendaraan Anda secara aman.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Login | Dunlop Warranty System",
    description:
      "Masuk ke Dunlop Warranty System untuk mengakses layanan garansi kendaraan Anda.",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
