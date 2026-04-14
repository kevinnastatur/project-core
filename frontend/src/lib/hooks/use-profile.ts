'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/lib/services/profile.service';
import { toast } from 'sonner';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.get(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData | Record<string, string>) => profileService.update(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['session'] });
      toast.success(res.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal mengupdate profil');
    },
  });
}
