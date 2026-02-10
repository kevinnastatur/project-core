import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Dunlop Warranty System",
  description:
    "Website Dunlop Warranty dirancang untuk memudahkan pengguna produk Dunlop dalam mengakses layanan purna jual seperti permintaan pendaftaran warranty, service berkala, & claim garansi.",
  openGraph: {
    title: "Login | Dunlop Warranty System",
    description:
      "Website Dunlop Warranty dirancang untuk memudahkan pengguna produk Dunlop dalam mengakses layanan purna jual seperti permintaan pendaftaran warranty, service berkala, & claim garansi.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_PATH}/assets/auth/images3.jpeg`,
        width: 1200,
        height: 630,
        alt: "Login | Dunlop Warranty System",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Login | Dunlop Warranty System",
    description:
      "Website Dunlop Warranty dirancang untuk memudahkan pengguna produk Dunlop dalam mengakses layanan purna jual seperti permintaan pendaftaran warranty, service berkala, & claim garansi.",
    images: [`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/auth/images3.jpeg`],
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
