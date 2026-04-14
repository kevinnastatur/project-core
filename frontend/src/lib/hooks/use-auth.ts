'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/services/auth.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { LoginInput, RegisterInput } from '@/lib/validations/auth';

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: () => authService.getSession(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      toast.success(response.message);
      const userType = response.data?.role?.userType;
      if (userType === 'super_admin' || userType === 'admin') {
        router.push('/users');
      } else if (userType === 'b2b') {
        router.push('/b2b');
      } else {
        router.push('/profile');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login gagal');
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: (response) => {
      toast.success(response.message);
      router.push('/login');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registrasi gagal');
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
      router.push('/login');
    },
  });
}
