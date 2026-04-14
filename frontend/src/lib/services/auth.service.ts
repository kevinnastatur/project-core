import axios from 'axios';
import type { ApiResponse, SessionUser } from '@/types';
import type { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput } from '@/lib/validations/auth';

const authApi = axios.create({
  baseURL: '/bff/auth',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export const authService = {
  login: (data: LoginInput) =>
    authApi.post<ApiResponse<SessionUser>>('/login', data).then((r) => r.data),

  register: (data: RegisterInput) =>
    authApi.post<ApiResponse>('/register', data).then((r) => r.data),

  logout: () =>
    authApi.post<ApiResponse>('/logout').then((r) => r.data),

  refresh: () =>
    authApi.post<ApiResponse>('/refresh').then((r) => r.data),

  forgotPassword: (data: ForgotPasswordInput) =>
    authApi.post<ApiResponse>('/forgot-password', data).then((r) => r.data),

  resetPassword: (data: ResetPasswordInput) =>
    authApi.post<ApiResponse>('/reset-password', data).then((r) => r.data),

  getSession: () =>
    authApi.get<ApiResponse<SessionUser>>('/session').then((r) => r.data),
};
