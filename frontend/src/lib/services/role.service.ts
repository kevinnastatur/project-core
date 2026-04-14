import apiClient from '@/lib/api/client';
import type { ApiResponse, PaginatedResponse, Role, PermissionModule, ListParams } from '@/types';
import type { CreateRoleInput, UpdateRoleInput } from '@/lib/validations/role';

export const roleService = {
  list: (params?: ListParams) =>
    apiClient.get<ApiResponse<PaginatedResponse<Role>>>('/roles', { params }).then((r) => r.data),

  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Role>>(`/roles/${slug}`).then((r) => r.data),

  create: (data: CreateRoleInput) =>
    apiClient.post<ApiResponse<Role>>('/roles', data).then((r) => r.data),

  update: (slug: string, data: UpdateRoleInput) =>
    apiClient.put<ApiResponse<Role>>(`/roles/${slug}`, data).then((r) => r.data),

  delete: (slug: string) =>
    apiClient.delete<ApiResponse>(`/roles/${slug}`).then((r) => r.data),

  getAccessList: () =>
    apiClient.get<ApiResponse<PermissionModule[]>>('/roles/access-list').then((r) => r.data),
};
