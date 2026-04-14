import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/components/common/query-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'HR Analytics',
  description: 'HR Analytics & Report System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <QueryProvider>
          {children}
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
