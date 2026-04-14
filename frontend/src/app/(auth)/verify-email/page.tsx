'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    axios.post('/bff/auth/action', { _endpoint: 'verify-email', token })
      .then((res) => {
        setStatus('success');
        setMessage(res.data.message || 'Email verified successfully');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed');
      });
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md border-[#E5E7EB] shadow-none">
        <CardContent className="pt-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#002FA7]" />
              <p className="mt-4 text-sm text-[#6B7280]">Verifying your email...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#34C759]/10">
                <CheckCircle className="h-7 w-7 text-[#34C759]" />
              </div>
              <h2 className="font-heading text-xl font-bold text-[#111827]" data-testid="verify-email-success">Email Verified</h2>
              <p className="mt-2 text-sm text-[#6B7280]">{message}</p>
              <Link href="/login" className="mt-6 inline-block text-sm text-[#002FA7] font-medium hover:underline" data-testid="verify-email-login-link">
                Continue to login
              </Link>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FF3B30]/10">
                <XCircle className="h-7 w-7 text-[#FF3B30]" />
              </div>
              <h2 className="font-heading text-xl font-bold text-[#111827]" data-testid="verify-email-error">Verification Failed</h2>
              <p className="mt-2 text-sm text-[#6B7280]">{message}</p>
              <Link href="/login" className="mt-6 inline-block text-sm text-[#002FA7] font-medium hover:underline">
                Back to login
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#002FA7]" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
