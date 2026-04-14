import apiClient from '@/lib/api/client';
import type { ApiResponse, PaginatedResponse, User, ListParams } from '@/types';
import type { CreateUserInput, UpdateUserInput } from '@/lib/validations/user';

export const userService = {
  list: (params?: ListParams) =>
    apiClient.get<ApiResponse<PaginatedResponse<User>>>('/users', { params }).then((r) => r.data),

  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<User>>(`/users/${slug}`).then((r) => r.data),

  create: (data: CreateUserInput) =>
    apiClient.post<ApiResponse<User>>('/users', data).then((r) => r.data),

  update: (slug: string, data: UpdateUserInput) =>
    apiClient.put<ApiResponse<User>>(`/users/${slug}`, data).then((r) => r.data),
};
