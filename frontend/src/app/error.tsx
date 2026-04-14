'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F9FB]">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <h1 className="font-heading text-2xl font-bold text-[#111827]">
          Terjadi Kesalahan
        </h1>
        <p className="mt-3 text-sm text-[#6B7280] leading-relaxed">
          {error.message || 'Sesuatu berjalan tidak sesuai harapan. Silakan coba lagi.'}
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-[#9CA3AF]">
            Error ID: {error.digest}
          </p>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-[#002FA7] hover:bg-[#002585]"
          >
            <RefreshCw className="h-4 w-4" />
            Coba Lagi
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/')}
            className="border-[#E5E7EB] text-[#111827] hover:bg-[#F3F4F6]"
          >
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
}
