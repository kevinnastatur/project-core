'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations/auth';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/lib/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: ForgotPasswordInput) => {
      const res = await axios.post('/bff/auth/action', { _endpoint: 'request-password-reset', email: data.email });
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res.message);
      setSent(true);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send reset email');
    },
  });

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <Card className="w-full max-w-md border-[#E5E7EB] shadow-none">
          <CardContent className="pt-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#34C759]/10">
              <Mail className="h-7 w-7 text-[#34C759]" />
            </div>
            <h2 className="font-heading text-xl font-bold text-[#111827]">Check your email</h2>
            <p className="mt-2 text-sm text-[#6B7280]">
              We&apos;ve sent a password reset link to your email address.
            </p>
            <Link href="/login" className="mt-6 inline-block text-sm text-[#002FA7] font-medium hover:underline" data-testid="forgot-password-back-login">
              Back to login
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link href="/login" className="mb-8 inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#111827] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>

        <Card className="border-[#E5E7EB] shadow-none">
          <CardHeader className="space-y-1 pb-4">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-[#111827]">Forgot Password</h1>
            <p className="text-sm text-[#6B7280]">Enter your email and we&apos;ll send a reset link</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-[#111827]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  data-testid="forgot-password-email-input"
                  {...register('email')}
                  className="border-[#E5E7EB] focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={mutation.isPending}
                data-testid="forgot-password-submit-button"
                className="w-full bg-[#002FA7] hover:bg-[#002585] text-white font-medium"
              >
                {mutation.isPending ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
