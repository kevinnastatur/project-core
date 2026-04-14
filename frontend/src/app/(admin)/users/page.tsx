'use client';

import { useState, useCallback } from 'react';
import { useUsers, useCreateUser, useUpdateUser } from '@/lib/hooks/use-users';
import { useRoles } from '@/lib/hooks/use-roles';
import { DataTable } from '@/components/common/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema, type CreateUserInput, type UpdateUserInput } from '@/lib/validations/user';
import { Plus, Pencil, Loader2 } from 'lucide-react';
import type { User, ListParams } from '@/types';

const userTypeColors: Record<string, string> = {
  super_admin: 'bg-red-100 text-red-700',
  admin: 'bg-orange-100 text-orange-700',
  b2b: 'bg-blue-100 text-blue-700',
  b2c: 'bg-green-100 text-green-700',
};

export default function UsersPage() {
  const [params, setParams] = useState<ListParams>({ page: 1, per_page: 15 });
  const { data, isLoading } = useUsers(params);
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const searchTimeout = useCallback(() => {
    let timer: NodeJS.Timeout;
    return (search: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => setParams((p) => ({ ...p, page: 1, search: search || undefined })), 300);
    };
  }, [])();

  const users = data?.data?.data || [];
  const meta = data?.data?.meta || null;

  const columns = [
    {
      key: 'name', header: 'Name',
      render: (user: User) => (
        <div>
          <p className="font-medium text-[#111827]">{user.name || '-'}</p>
          <p className="text-xs text-[#6B7280]">{user.slug}</p>
        </div>
      ),
    },
    { key: 'email', header: 'Email' },
    {
      key: 'role', header: 'Role',
      render: (user: User) => user.role ? (
        <Badge variant="secondary" className={`border-0 ${userTypeColors[user.role.userType] || 'bg-gray-100 text-gray-700'}`}>
          {user.role.title}
        </Badge>
      ) : <span className="text-[#6B7280] text-xs">No role</span>,
    },
    {
      key: 'isEmailVerified', header: 'Status',
      render: (user: User) => (
        <Badge variant="secondary" className={user.isEmailVerified ? 'bg-[#34C759]/10 text-[#34C759] border-0' : 'bg-[#FF3B30]/10 text-[#FF3B30] border-0'}>
          {user.isEmailVerified ? 'Verified' : 'Unverified'}
        </Badge>
      ),
    },
    {
      key: 'createdAt', header: 'Created',
      render: (user: User) => (
        <span className="text-xs text-[#6B7280]">
          {new Date(user.createdAt).toLocaleDateString('id-ID')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#111827]" data-testid="users-heading">
            Users
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">Manage system users</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="create-user-button" className="bg-[#002FA7] hover:bg-[#002585] text-white">
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <CreateUserForm onSuccess={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={users as unknown as Record<string, unknown>[]}
        meta={meta}
        onPageChange={(page) => setParams((p) => ({ ...p, page }))}
        onSearch={searchTimeout}
        searchPlaceholder="Search users..."
        isLoading={isLoading}
        actions={(item) => {
          const user = item as unknown as User;
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditUser(user)}
              data-testid={`edit-user-${user.slug}`}
              className="text-[#6B7280] hover:text-[#111827]"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          );
        }}
      />

      {/* Edit Dialog */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="sm:max-w-md">
          {editUser && <EditUserForm user={editUser} onSuccess={() => setEditUser(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateUserForm({ onSuccess }: { onSuccess: () => void }) {
  const createUser = useCreateUser();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading text-lg font-bold text-[#111827]">Add New User</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={handleSubmit((data) => createUser.mutate(data, { onSuccess }))}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#111827]">Name</Label>
          <Input {...register('name')} data-testid="create-user-name" className="border-[#E5E7EB]" />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#111827]">Email</Label>
          <Input type="email" {...register('email')} data-testid="create-user-email" className="border-[#E5E7EB]" />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#111827]">Password</Label>
          <Input type="password" {...register('password')} data-testid="create-user-password" className="border-[#E5E7EB]" />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>
        <DialogFooter>
          <Button type="submit" disabled={createUser.isPending} data-testid="create-user-submit" className="bg-[#002FA7] hover:bg-[#002585] text-white">
            {createUser.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create User
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

function EditUserForm({ user, onSuccess }: { user: User; onSuccess: () => void }) {
  const updateUser = useUpdateUser(user.slug || '');
  const { data: rolesData } = useRoles({ per_page: 100 });
  const { register, handleSubmit, control, formState: { errors } } = useForm<UpdateUserInput>({
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      roleId: user.roleId,
    },
  });

  const roles = rolesData?.data?.data || [];

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading text-lg font-bold text-[#111827]">Edit User</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={handleSubmit((data) => updateUser.mutate(data, { onSuccess }))}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#111827]">Name</Label>
          <Input {...register('name')} data-testid="edit-user-name" className="border-[#E5E7EB]" />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#111827]">Email</Label>
          <Input type="email" {...register('email')} data-testid="edit-user-email" className="border-[#E5E7EB]" />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#111827]">Role</Label>
          <Controller
            name="roleId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value?.toString() || ''}
                onValueChange={(val) => field.onChange(val ? parseInt(val) : null)}
              >
                <SelectTrigger data-testid="edit-user-role" className="border-[#E5E7EB]">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={updateUser.isPending} data-testid="edit-user-submit" className="bg-[#002FA7] hover:bg-[#002585] text-white">
            {updateUser.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Changes
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
