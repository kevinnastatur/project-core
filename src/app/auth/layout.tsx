import { Toaster } from "sonner";
// import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <Toaster position="top-right" richColors />
        {/* <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        /> */}
        {children}
      </body>
    </html>
  );
}
