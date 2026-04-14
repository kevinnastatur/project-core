'use client';

import { useLogout, useSession } from '@/lib/hooks/use-auth';
import { useUIStore } from '@/stores/ui.store';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Menu } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  const { data: session } = useSession();
  const logout = useLogout();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const user = session?.data;
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header
      data-testid="main-navbar"
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E5E7EB] bg-white/80 backdrop-blur-xl px-6"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          data-testid="navbar-menu-button"
          className="rounded-lg p-2 text-[#6B7280] hover:bg-[#F9F9FB] hover:text-[#111827] transition-colors lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] font-medium text-[#6B7280]">
            {user?.role?.title || 'Dashboard'}
          </p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            data-testid="navbar-user-menu"
            className="flex items-center gap-3 rounded-lg px-3 py-1.5 hover:bg-[#F9F9FB] transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-[#111827]">{user?.name || 'User'}</p>
              <p className="text-xs text-[#6B7280]">{user?.email}</p>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-[#002FA7] text-xs text-white font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center gap-2" data-testid="dropdown-profile">
              <User className="h-4 w-4" /> Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => logout.mutate()}
            data-testid="dropdown-logout"
            className="text-red-600 focus:text-red-600"
          >
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
