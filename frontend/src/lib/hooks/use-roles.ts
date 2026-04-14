'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { roleService } from '@/lib/services/role.service';
import { toast } from 'sonner';
import type { ListParams } from '@/types';
import type { CreateRoleInput, UpdateRoleInput } from '@/lib/validations/role';

export function useRoles(params?: ListParams) {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: () => roleService.list(params),
  });
}

export function useRole(slug: string) {
  return useQuery({
    queryKey: ['role', slug],
    queryFn: () => roleService.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useAccessList() {
  return useQuery({
    queryKey: ['access-list'],
    queryFn: () => roleService.getAccessList(),
    staleTime: 30 * 60 * 1000,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleInput) => roleService.create(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success(res.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal membuat role');
    },
  });
}

export function useUpdateRole(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRoleInput) => roleService.update(slug, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role', slug] });
      toast.success(res.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal mengupdate role');
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => roleService.delete(slug),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success(res.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menghapus role');
    },
  });
}
