'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/ui.store';
import type { SessionUser } from '@/types';
import {
  Users, Shield, LayoutDashboard, User, ChevronLeft,
  ChevronRight, Database,
} from 'lucide-react';

const adminNavItems = [
  { href: '/users', label: 'Users', icon: Users, permission: 'module.master-data.user.index' },
  { href: '/roles', label: 'Roles', icon: Shield, permission: 'module.master-data.role.index' },
];

const commonNavItems = [
  { href: '/profile', label: 'Profile', icon: User },
];

interface SidebarProps {
  user: SessionUser | null;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const userAccess = user?.role?.userType === 'super_admin'
    ? null // super_admin sees everything
    : [];

  const navItems = [
    ...commonNavItems,
    ...adminNavItems.filter(() => {
      if (!user?.role) return false;
      return user.role.userType === 'super_admin' || user.role.userType === 'admin';
    }),
  ];

  return (
    <aside
      data-testid="admin-sidebar"
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-[#E5E7EB] bg-white transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-[72px]'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-[#E5E7EB] px-4">
        <Link href="/profile" className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#002FA7]">
            <Database className="h-5 w-5 text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-heading text-lg font-bold tracking-tight text-[#111827]">
              HR Analytics
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              data-testid={`sidebar-nav-${item.label.toLowerCase()}`}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-[#002FA7] text-white shadow-sm'
                  : 'text-[#6B7280] hover:bg-[#F9F9FB] hover:text-[#111827]'
              )}
            >
              <item.icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-white' : 'text-[#6B7280]')} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        data-testid="sidebar-toggle-button"
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#6B7280] shadow-sm hover:text-[#111827] transition-colors"
      >
        {sidebarOpen ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
      </button>
    </aside>
  );
}
