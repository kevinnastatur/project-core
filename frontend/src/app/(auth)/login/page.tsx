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
import { Database, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const login = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="flex min-h-screen">
      {/* Left: Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#002FA7]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#002FA7] to-[#001A5C]" />
        <div className="relative flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <Database className="h-8 w-8" />
            <span className="font-heading text-xl font-bold">HR Analytics</span>
          </div>
          <div>
            <h2 className="font-heading text-4xl font-bold tracking-tight">
              Welcome back
            </h2>
            <p className="mt-3 text-white/70 text-lg max-w-md">
              Sign in to access your personal dashboard, profile, and HR services.
            </p>
          </div>
          <p className="text-sm text-white/40">Employee Portal</p>
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
              <h1 className="font-heading text-2xl font-bold tracking-tight text-[#111827]">Sign In</h1>
              <p className="text-sm text-[#6B7280]">Enter your credentials to access your account</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit((data) => login.mutate(data))} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-[#111827]">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    data-testid="login-email-input"
                    {...register('email')}
                    className="border-[#E5E7EB] focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                  />
                  {errors.email && <p className="text-xs text-red-500" data-testid="login-email-error">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-[#111827]">Password</Label>
                    <Link href="/forgot-password" className="text-xs text-[#002FA7] hover:underline" data-testid="login-forgot-password-link">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 8 characters"
                    data-testid="login-password-input"
                    {...register('password')}
                    className="border-[#E5E7EB] focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                  />
                  {errors.password && <p className="text-xs text-red-500" data-testid="login-password-error">{errors.password.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={login.isPending}
                  data-testid="login-submit-button"
                  className="w-full bg-[#002FA7] hover:bg-[#002585] text-white font-medium"
                >
                  {login.isPending ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-[#6B7280]">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-[#002FA7] font-medium hover:underline" data-testid="login-register-link">
                  Register
                </Link>
              </p>

              <div className="mt-4 flex items-center gap-2 text-center justify-center">
                <Link href="/admin/login" className="text-xs text-[#6B7280] hover:text-[#002FA7] transition-colors" data-testid="login-admin-link">
                  Admin Login
                </Link>
                <span className="text-[#E5E7EB]">|</span>
                <Link href="/b2b/login" className="text-xs text-[#6B7280] hover:text-[#002FA7] transition-colors" data-testid="login-b2b-link">
                  B2B Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
