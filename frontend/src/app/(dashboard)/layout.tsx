'use client';

import { Sidebar } from '@/components/common/sidebar';
import { Navbar } from '@/components/common/navbar';
import { useSession } from '@/lib/hooks/use-auth';
import { useUIStore } from '@/stores/ui.store';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isLoading } = useSession();
  const { sidebarOpen } = useUIStore();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9F9FB]">
        <Loader2 className="h-8 w-8 animate-spin text-[#002FA7]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9FB]">
      <Sidebar user={session?.data || null} />
      <div className={cn('transition-all duration-300', sidebarOpen ? 'ml-64' : 'ml-[72px]')}>
        <Navbar />
        <main className="p-6" data-testid="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}
