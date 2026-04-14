'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';
import { useLogin } from '@/lib/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Link from 'next/link';
import { Database, ArrowLeft, Building2 } from 'lucide-react';

export default function B2BLoginPage() {
  const login = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="flex min-h-screen">
      {/* Left: Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0A1628]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] to-[#002FA7]/30" />
        <div className="relative flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Database className="h-5 w-5" />
            </div>
            <span className="font-heading text-xl font-bold">HR Analytics</span>
          </div>
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
              <Building2 className="h-6 w-6 text-blue-300" />
            </div>
            <h2 className="font-heading text-4xl font-bold tracking-tight">
              Business Portal
            </h2>
            <p className="mt-3 text-white/50 text-lg max-w-md">
              Access your organization&apos;s HR data, reports, and partner services.
            </p>
          </div>
          <p className="text-sm text-white/30">B2B Partner Access</p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#111827] transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>

          <Card className="border-[#E5E7EB] shadow-none">
            <CardHeader className="space-y-1 pb-4">
              <div className="mb-2 inline-flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#002FA7]" />
                <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#002FA7]">B2B Partner</span>
              </div>
              <h1 className="font-heading text-2xl font-bold tracking-tight text-[#111827]">Partner Login</h1>
              <p className="text-sm text-[#6B7280]">Sign in to access your business dashboard</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit((data) => login.mutate(data))} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-[#111827]">Business Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="partner@company.com"
                    data-testid="b2b-login-email-input"
                    {...register('email')}
                    className="border-[#E5E7EB] focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-[#111827]">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 8 characters"
                    data-testid="b2b-login-password-input"
                    {...register('password')}
                    className="border-[#E5E7EB] focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                  />
                  {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={login.isPending}
                  data-testid="b2b-login-submit-button"
                  className="w-full bg-[#002FA7] hover:bg-[#002585] text-white font-medium"
                >
                  {login.isPending ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-[#6B7280]">
                <Link href="/login" className="text-[#002FA7] font-medium hover:underline" data-testid="b2b-login-back-link">
                  Back to regular login
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
