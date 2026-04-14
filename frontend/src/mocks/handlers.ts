import { http, HttpResponse } from 'msw';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:3001';

// Mock data
const mockAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxODAwMDAwMDAwfQ.mock';
const mockRefreshToken = 'mock-refresh-token-uuid';

const mockUsers = [
  {
    id: 1, name: 'Administrator', slug: 'administrator', email: 'admin@admin.com',
    avatar: null, roleId: 1, isEmailVerified: true,
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
    role: { id: 1, slug: 'super-admin', title: 'Super Administrator', userType: 'super_admin' },
  },
  {
    id: 2, name: 'John Doe', slug: 'john-doe', email: 'john@example.com',
    avatar: null, roleId: 2, isEmailVerified: true,
    createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z',
    role: { id: 2, slug: 'hr-manager', title: 'HR Manager', userType: 'admin' },
  },
  {
    id: 3, name: 'Jane Smith', slug: 'jane-smith', email: 'jane@company.com',
    avatar: null, roleId: 3, isEmailVerified: true,
    createdAt: '2024-02-01T00:00:00Z', updatedAt: '2024-02-01T00:00:00Z',
    role: { id: 3, slug: 'b2b-partner', title: 'B2B Partner', userType: 'b2b' },
  },
  {
    id: 4, name: 'Alice Johnson', slug: 'alice-johnson', email: 'alice@mail.com',
    avatar: null, roleId: 4, isEmailVerified: true,
    createdAt: '2024-02-15T00:00:00Z', updatedAt: '2024-02-15T00:00:00Z',
    role: { id: 4, slug: 'employee', title: 'Employee', userType: 'b2c' },
  },
];

const mockRoles = [
  {
    id: 1, slug: 'super-admin', title: 'Super Administrator', userType: 'super_admin',
    description: 'Full access to all modules',
    access: [
      'module.dashboard.index', 'module.master-data.role.index', 'module.master-data.role.create',
      'module.master-data.role.edit', 'module.master-data.role.delete',
      'module.master-data.user.index', 'module.master-data.user.create',
      'module.master-data.user.edit', 'module.master-data.user.delete',
      'module.log-activity.index', 'module.log-activity.detail',
    ],
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2, slug: 'hr-manager', title: 'HR Manager', userType: 'admin',
    description: 'HR department manager',
    access: ['module.dashboard.index', 'module.master-data.user.index', 'module.master-data.user.create', 'module.master-data.user.edit'],
    createdAt: '2024-01-05T00:00:00Z', updatedAt: '2024-01-05T00:00:00Z',
  },
  {
    id: 3, slug: 'b2b-partner', title: 'B2B Partner', userType: 'b2b',
    description: 'Business partner access',
    access: ['module.dashboard.index'],
    createdAt: '2024-01-10T00:00:00Z', updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 4, slug: 'employee', title: 'Employee', userType: 'b2c',
    description: 'Regular employee',
    access: ['module.dashboard.index'],
    createdAt: '2024-01-10T00:00:00Z', updatedAt: '2024-01-10T00:00:00Z',
  },
];

const mockAccessList = [
  {
    module: 'Dashboard',
    sub_module: [
      {
        module: 'Dashboard',
        activities: [
          { label: 'Menu Dashboard', value: 'module.dashboard.index' },
        ],
      },
    ],
  },
  {
    module: 'Data Master',
    sub_module: [
      {
        module: 'Role',
        activities: [
          { label: 'Menu Role', value: 'module.master-data.role.index' },
          { label: 'Add Role', value: 'module.master-data.role.create' },
          { label: 'Edit Role', value: 'module.master-data.role.edit' },
          { label: 'Delete Role', value: 'module.master-data.role.delete' },
        ],
      },
      {
        module: 'User',
        activities: [
          { label: 'Menu User', value: 'module.master-data.user.index' },
          { label: 'Add User', value: 'module.master-data.user.create' },
          { label: 'Edit User', value: 'module.master-data.user.edit' },
          { label: 'Delete User', value: 'module.master-data.user.delete' },
        ],
      },
    ],
  },
  {
    module: 'History',
    sub_module: [
      {
        module: 'Activity History',
        activities: [
          { label: 'Menu Activity History', value: 'module.log-activity.index' },
          { label: 'Activity History Details', value: 'module.log-activity.detail' },
        ],
      },
    ],
  },
];

function paginateData<T>(data: T[], page = 1, perPage = 15) {
  const total = data.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const from = total === 0 ? null : (page - 1) * perPage + 1;
  const to = total === 0 ? null : Math.min(page * perPage, total);
  const sliced = data.slice((page - 1) * perPage, page * perPage);

  return {
    data: sliced,
    meta: {
      total, per_page: perPage, current_page: page, last_page: lastPage,
      from, to, path: '', first_page_url: '', last_page_url: '',
      next_page_url: page < lastPage ? '' : null, prev_page_url: page > 1 ? '' : null,
    },
    links: [],
  };
}

export const handlers = [
  // Auth: Login
  http.post(`${API_BASE}/api/v1/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    if (body.email === 'admin@admin.com' && body.password === 'password') {
      return HttpResponse.json({
        success: true, message: 'Login successful',
        data: { accessToken: mockAccessToken, refreshToken: mockRefreshToken },
      });
    }
    if (body.email === 'john@example.com' && body.password === 'password') {
      return HttpResponse.json({
        success: true, message: 'Login successful',
        data: { accessToken: mockAccessToken, refreshToken: mockRefreshToken },
      });
    }
    return HttpResponse.json(
      { success: false, message: 'Invalid email or password', data: null },
      { status: 401 }
    );
  }),

  // Auth: Register
  http.post(`${API_BASE}/api/v1/auth/register`, async () => {
    return HttpResponse.json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
      data: { user: { id: 5, name: 'New User', email: 'new@example.com' }, token: 'verify-token' },
    }, { status: 201 });
  }),

  // Auth: Refresh
  http.post(`${API_BASE}/api/v1/auth/refresh-token`, async () => {
    return HttpResponse.json({
      success: true, message: 'Token refreshed successfully',
      data: { accessToken: mockAccessToken },
    });
  }),

  // Auth: Logout
  http.post(`${API_BASE}/api/v1/auth/logout`, async () => {
    return HttpResponse.json({ success: true, message: 'Logged out successfully', data: null });
  }),

  // Auth: Request Password Reset
  http.post(`${API_BASE}/api/v1/auth/request-password-reset`, async () => {
    return HttpResponse.json({ success: true, message: 'Password reset email sent', data: null });
  }),

  // Auth: Reset Password
  http.post(`${API_BASE}/api/v1/auth/reset-password`, async () => {
    return HttpResponse.json({ success: true, message: 'Password reset successfully', data: null });
  }),

  // Auth: Verify Email
  http.get(`${API_BASE}/api/v1/auth/verify-email`, async () => {
    return HttpResponse.json({ success: true, message: 'Email verified successfully', data: null });
  }),

  // Profile
  http.get(`${API_BASE}/api/v1/profile`, async () => {
    return HttpResponse.json({ success: true, message: 'Profile retrieved successfully', data: mockUsers[0] });
  }),

  http.put(`${API_BASE}/api/v1/profile`, async () => {
    return HttpResponse.json({ success: true, message: 'Profile updated successfully', data: mockUsers[0] });
  }),

  // Users
  http.get(`${API_BASE}/api/v1/users`, async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const perPage = parseInt(url.searchParams.get('per_page') || '15');
    const search = url.searchParams.get('search')?.toLowerCase();

    let filtered = [...mockUsers];
    if (search) {
      filtered = filtered.filter(
        (u) => u.name?.toLowerCase().includes(search) || u.email?.toLowerCase().includes(search)
      );
    }

    return HttpResponse.json({
      success: true, message: 'User list retrieved successfully',
      data: paginateData(filtered, page, perPage),
    });
  }),

  http.get(`${API_BASE}/api/v1/users/:slug`, async ({ params }) => {
    const user = mockUsers.find((u) => u.slug === params.slug);
    if (!user) return HttpResponse.json({ success: false, message: 'User not found', data: null }, { status: 404 });
    return HttpResponse.json({ success: true, message: 'User retrieved successfully', data: user });
  }),

  http.post(`${API_BASE}/api/v1/users`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const newUser = {
      id: mockUsers.length + 1,
      name: body.name as string, slug: (body.name as string).toLowerCase().replace(/\s+/g, '-'),
      email: body.email as string, avatar: null, roleId: null, isEmailVerified: false,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), role: null,
    };
    mockUsers.push(newUser);
    return HttpResponse.json({ success: true, message: 'User created successfully', data: newUser }, { status: 201 });
  }),

  http.put(`${API_BASE}/api/v1/users/:slug`, async ({ params, request }) => {
    const user = mockUsers.find((u) => u.slug === params.slug);
    if (!user) return HttpResponse.json({ success: false, message: 'User not found', data: null }, { status: 404 });
    const body = (await request.json()) as Record<string, unknown>;
    Object.assign(user, body);
    return HttpResponse.json({ success: true, message: 'User updated successfully', data: user });
  }),

  // Roles
  http.get(`${API_BASE}/api/v1/roles`, async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const perPage = parseInt(url.searchParams.get('per_page') || '15');

    return HttpResponse.json({
      success: true, message: 'Roles retrieved successfully',
      data: paginateData(mockRoles, page, perPage),
    });
  }),

  http.get(`${API_BASE}/api/v1/roles/access-list`, async () => {
    return HttpResponse.json({ success: true, message: 'Access list retrieved successfully', data: mockAccessList });
  }),

  http.get(`${API_BASE}/api/v1/roles/:slug`, async ({ params }) => {
    const role = mockRoles.find((r) => r.slug === params.slug);
    if (!role) return HttpResponse.json({ success: false, message: 'Role not found', data: null }, { status: 404 });
    return HttpResponse.json({ success: true, message: 'Role retrieved successfully', data: role });
  }),

  http.post(`${API_BASE}/api/v1/roles`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const newRole = {
      id: mockRoles.length + 1,
      slug: (body.title as string).toLowerCase().replace(/\s+/g, '-'),
      title: body.title as string, userType: body.userType as string,
      description: (body.description as string) || null, access: (body.access as string[]) || [],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    mockRoles.push(newRole);
    return HttpResponse.json({ success: true, message: 'Role created successfully', data: newRole }, { status: 201 });
  }),

  http.put(`${API_BASE}/api/v1/roles/:slug`, async ({ params, request }) => {
    const role = mockRoles.find((r) => r.slug === params.slug);
    if (!role) return HttpResponse.json({ success: false, message: 'Role not found', data: null }, { status: 404 });
    const body = (await request.json()) as Record<string, unknown>;
    Object.assign(role, body);
    return HttpResponse.json({ success: true, message: 'Role updated successfully', data: role });
  }),

  http.delete(`${API_BASE}/api/v1/roles/:slug`, async ({ params }) => {
    const idx = mockRoles.findIndex((r) => r.slug === params.slug);
    if (idx === -1) return HttpResponse.json({ success: false, message: 'Role not found', data: null }, { status: 404 });
    mockRoles.splice(idx, 1);
    return HttpResponse.json({ success: true, message: 'Role deleted successfully', data: null });
  }),
];
