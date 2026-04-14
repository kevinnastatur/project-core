'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';
import { useRegister } from '@/lib/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Link from 'next/link';
import { Database, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const registerMutation = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <div className="flex min-h-screen">
      {/* Left */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#002FA7]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#002FA7] to-[#001A5C]" />
        <div className="relative flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <Database className="h-8 w-8" />
            <span className="font-heading text-xl font-bold">HR Analytics</span>
          </div>
          <div>
            <h2 className="font-heading text-4xl font-bold tracking-tight">
              Join the platform
            </h2>
            <p className="mt-3 text-white/70 text-lg max-w-md">
              Create your account to access HR analytics, reports, and workforce insights.
            </p>
          </div>
          <p className="text-sm text-white/40">New Member Registration</p>
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
              <h1 className="font-heading text-2xl font-bold tracking-tight text-[#111827]">Create Account</h1>
              <p className="text-sm text-[#6B7280]">Fill in your details to get started</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit((data) => registerMutation.mutate(data))} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-[#111827]">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    data-testid="register-name-input"
                    {...register('name')}
                    className="border-[#E5E7EB] focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-[#111827]">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    data-testid="register-email-input"
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
                    data-testid="register-password-input"
                    {...register('password')}
                    className="border-[#E5E7EB] focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                  />
                  {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={registerMutation.isPending}
                  data-testid="register-submit-button"
                  className="w-full bg-[#002FA7] hover:bg-[#002585] text-white font-medium"
                >
                  {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-[#6B7280]">
                Already have an account?{' '}
                <Link href="/login" className="text-[#002FA7] font-medium hover:underline" data-testid="register-login-link">
                  Sign In
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
