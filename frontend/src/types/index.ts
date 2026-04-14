// ─── API Response Contract (immutable) ───
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}

// ─── Pagination (Laravel-style from backend paginator) ───
export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number | null;
  to: number | null;
  path: string;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  links: PaginationLink[];
}

// ─── Role ───
export interface Role {
  id: number;
  slug: string;
  title: string;
  userType: string;
  description: string | null;
  access: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── User ───
export interface User {
  id: number;
  name: string | null;
  slug: string | null;
  email: string | null;
  avatar: string | null;
  roleId: number | null;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  role?: Pick<Role, 'id' | 'slug' | 'title' | 'userType'> | null;
}

// ─── Auth ───
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SessionUser {
  id: number;
  name: string | null;
  email: string | null;
  avatar: string | null;
  role: Pick<Role, 'id' | 'slug' | 'title' | 'userType'> | null;
}

// ─── Permission Tree (from ACCESS_LIST) ───
export interface PermissionActivity {
  label: string;
  value: string;
}

export interface PermissionSubModule {
  module: string;
  activities: PermissionActivity[];
}

export interface PermissionModule {
  module: string;
  sub_module: PermissionSubModule[];
}

// ─── Query Params ───
export interface ListParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}
