'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

export default function B2BDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-[#111827]" data-testid="b2b-heading">
          B2B Dashboard
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">Welcome to the business partner portal</p>
      </div>

      <Card className="border-[#E5E7EB]">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#002FA7]/10">
            <Building2 className="h-8 w-8 text-[#002FA7]" />
          </div>
          <h2 className="font-heading text-xl font-bold text-[#111827]">Partner Dashboard</h2>
          <p className="mt-2 text-sm text-[#6B7280] text-center max-w-md">
            Your business analytics and reports will appear here. This section is under development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
