'use client';

import { useProfile, useUpdateProfile } from '@/lib/hooks/use-profile';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, User, Mail, Shield, Calendar } from 'lucide-react';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: '', email: '' },
  });

  useEffect(() => {
    if (profile?.data) {
      reset({ name: profile.data.name || '', email: profile.data.email || '' });
    }
  }, [profile, reset]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#002FA7]" />
      </div>
    );
  }

  const user = profile?.data;
  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-[#111827]" data-testid="profile-heading">
          Profile
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <Card className="border-[#E5E7EB]">
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-[#002FA7] text-xl text-white font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-heading text-xl font-bold text-[#111827]" data-testid="profile-name">
                {user?.name || 'Unnamed User'}
              </h2>
              <p className="text-sm text-[#6B7280]" data-testid="profile-email">{user?.email}</p>
              <div className="mt-3 flex items-center gap-2">
                {user?.role && (
                  <Badge variant="secondary" className="bg-[#002FA7]/10 text-[#002FA7] border-0" data-testid="profile-role-badge">
                    <Shield className="mr-1 h-3 w-3" /> {user.role.title}
                  </Badge>
                )}
                {user?.isEmailVerified && (
                  <Badge variant="secondary" className="bg-[#34C759]/10 text-[#34C759] border-0">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Card className="border-[#E5E7EB]">
        <CardHeader>
          <CardTitle className="font-heading text-lg font-semibold text-[#111827]">Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border border-[#E5E7EB] p-4">
              <User className="h-5 w-5 text-[#6B7280]" />
              <div>
                <p className="text-xs uppercase tracking-[0.15em] font-medium text-[#6B7280]">Name</p>
                <p className="text-sm font-medium text-[#111827]">{user?.name || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-[#E5E7EB] p-4">
              <Mail className="h-5 w-5 text-[#6B7280]" />
              <div>
                <p className="text-xs uppercase tracking-[0.15em] font-medium text-[#6B7280]">Email</p>
                <p className="text-sm font-medium text-[#111827]">{user?.email || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-[#E5E7EB] p-4">
              <Shield className="h-5 w-5 text-[#6B7280]" />
              <div>
                <p className="text-xs uppercase tracking-[0.15em] font-medium text-[#6B7280]">Role</p>
                <p className="text-sm font-medium text-[#111827]">{user?.role?.title || 'No role'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-[#E5E7EB] p-4">
              <Calendar className="h-5 w-5 text-[#6B7280]" />
              <div>
                <p className="text-xs uppercase tracking-[0.15em] font-medium text-[#6B7280]">Member Since</p>
                <p className="text-sm font-medium text-[#111827]">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Card className="border-[#E5E7EB]">
        <CardHeader>
          <CardTitle className="font-heading text-lg font-semibold text-[#111827]">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((data) => updateProfile.mutate(data))}
            className="space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#111827]">Name</Label>
                <Input
                  {...register('name')}
                  data-testid="profile-edit-name"
                  className="border-[#E5E7EB] focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#111827]">Email</Label>
                <Input
                  type="email"
                  {...register('email')}
                  data-testid="profile-edit-email"
                  className="border-[#E5E7EB] focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                />
              </div>
            </div>
            <Separator className="bg-[#E5E7EB]" />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={updateProfile.isPending}
                data-testid="profile-save-button"
                className="bg-[#002FA7] hover:bg-[#002585] text-white"
              >
                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
