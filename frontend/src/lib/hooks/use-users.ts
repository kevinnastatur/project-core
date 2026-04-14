'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/lib/services/user.service';
import { toast } from 'sonner';
import type { ListParams } from '@/types';
import type { CreateUserInput, UpdateUserInput } from '@/lib/validations/user';

export function useUsers(params?: ListParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.list(params),
  });
}

export function useUser(slug: string) {
  return useQuery({
    queryKey: ['user', slug],
    queryFn: () => userService.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserInput) => userService.create(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(res.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal membuat user');
    },
  });
}

export function useUpdateUser(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserInput) => userService.update(slug, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', slug] });
      toast.success(res.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal mengupdate user');
    },
  });
}
