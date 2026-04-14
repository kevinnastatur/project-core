import Link from 'next/link';
import { Database, ArrowRight, Users, Shield, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F9F9FB]">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#002FA7]/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <nav className="mb-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#002FA7]">
                <Database className="h-5 w-5 text-white" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-[#111827]">
                HR Analytics
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                data-testid="home-login-link"
                className="rounded-lg px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                data-testid="home-register-link"
                className="rounded-lg bg-[#002FA7] px-4 py-2 text-sm font-medium text-white hover:bg-[#002585] transition-colors"
              >
                Get Started
              </Link>
            </div>
          </nav>

          <div className="max-w-3xl">
            <p className="mb-4 text-xs uppercase tracking-[0.25em] font-medium text-[#002FA7]">
              HR Analytics Platform
            </p>
            <h1 className="font-heading text-5xl font-bold tracking-tighter text-[#111827] sm:text-6xl lg:text-7xl">
              People data,
              <br />
              <span className="text-[#002FA7]">amplified.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-[#6B7280] leading-relaxed">
              Unified HR analytics and reporting system. Manage users, roles, permissions,
              and gain insights across your entire organization.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/admin/login"
                data-testid="home-admin-login"
                className="inline-flex items-center gap-2 rounded-lg bg-[#002FA7] px-6 py-3 text-sm font-medium text-white hover:bg-[#002585] transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-lg"
              >
                Admin Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/b2b/login"
                data-testid="home-b2b-login"
                className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-6 py-3 text-sm font-medium text-[#111827] hover:bg-[#F9F9FB] transition-all duration-200 hover:-translate-y-0.5"
              >
                B2B Portal <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Users,
              title: 'User Management',
              desc: 'Complete CRUD operations for managing employees, partners, and administrators.',
            },
            {
              icon: Shield,
              title: 'Role-Based Access',
              desc: 'Granular RBAC with permission trees. Control who sees and does what.',
            },
            {
              icon: BarChart3,
              title: 'HR Reports',
              desc: 'Analytics dashboards with real-time insights on workforce metrics.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group rounded-lg border border-[#E5E7EB] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#002FA7]/10">
                <feature.icon className="h-5 w-5 text-[#002FA7]" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-[#111827]">{feature.title}</h3>
              <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] px-6 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-[#6B7280]">
          HR Analytics &copy; {new Date().getFullYear()}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
