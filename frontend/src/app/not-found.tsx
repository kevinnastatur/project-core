import Link from 'next/link';
import { Database, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F9FB]">
      <div className="mx-auto max-w-md text-center px-6">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#002FA7]">
            <Database className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* 404 display */}
        <p className="font-heading text-8xl font-bold tracking-tighter text-[#E5E7EB]">
          404
        </p>

        <div className="mt-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3F4F6]">
            <Search className="h-6 w-6 text-[#9CA3AF]" />
          </div>
        </div>

        <h1 className="mt-4 font-heading text-2xl font-bold text-[#111827]">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mt-3 text-sm text-[#6B7280] leading-relaxed">
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
          Periksa kembali URL atau kembali ke beranda.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#002FA7] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#002585] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-medium text-[#111827] hover:bg-[#F9F9FB] transition-colors"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
