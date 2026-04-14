import apiClient from '@/lib/api/client';
import type { ApiResponse, User } from '@/types';

export const profileService = {
  get: () =>
    apiClient.get<ApiResponse<User>>('/profile').then((r) => r.data),

  update: (data: FormData | Record<string, string>) =>
    apiClient.put<ApiResponse<User>>('/profile', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    }).then((r) => r.data),
};
