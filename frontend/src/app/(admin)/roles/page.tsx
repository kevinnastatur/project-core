'use client';

import { useState, useCallback } from 'react';
import { useRoles, useCreateRole, useUpdateRole, useDeleteRole, useAccessList } from '@/lib/hooks/use-roles';
import { DataTable } from '@/components/common/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRoleSchema, type CreateRoleInput, type UpdateRoleInput } from '@/lib/validations/role';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import type { Role, ListParams, PermissionModule } from '@/types';

const userTypeColors: Record<string, string> = {
  super_admin: 'bg-red-100 text-red-700',
  admin: 'bg-orange-100 text-orange-700',
  b2b: 'bg-blue-100 text-blue-700',
  b2c: 'bg-green-100 text-green-700',
};

const userTypeOptions = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'b2b', label: 'B2B' },
  { value: 'b2c', label: 'B2C' },
];

export default function RolesPage() {
  const [params, setParams] = useState<ListParams>({ page: 1, per_page: 15 });
  const { data, isLoading } = useRoles(params);
  const [createOpen, setCreateOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [deleteRole, setDeleteRole] = useState<Role | null>(null);
  const deleteRoleMutation = useDeleteRole();

  const searchTimeout = useCallback(() => {
    let timer: NodeJS.Timeout;
    return (search: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => setParams((p) => ({ ...p, page: 1, search: search || undefined })), 300);
    };
  }, [])();

  const roles = data?.data?.data || [];
  const meta = data?.data?.meta || null;

  const columns = [
    {
      key: 'title', header: 'Title',
      render: (role: Role) => (
        <div>
          <p className="font-medium text-[#111827]">{role.title}</p>
          <p className="text-xs text-[#6B7280]">{role.slug}</p>
        </div>
      ),
    },
    {
      key: 'userType', header: 'Type',
      render: (role: Role) => (
        <Badge variant="secondary" className={`border-0 ${userTypeColors[role.userType] || 'bg-gray-100 text-gray-700'}`}>
          {role.userType}
        </Badge>
      ),
    },
    { key: 'description', header: 'Description', render: (role: Role) => <span className="text-sm text-[#6B7280]">{role.description || '-'}</span> },
    {
      key: 'access', header: 'Permissions',
      render: (role: Role) => (
        <span className="text-sm font-medium text-[#002FA7]">{role.access?.length || 0} permissions</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#111827]" data-testid="roles-heading">
            Roles
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">Manage roles and permissions</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="create-role-button" className="bg-[#002FA7] hover:bg-[#002585] text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <RoleForm mode="create" onSuccess={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={roles as unknown as Record<string, unknown>[]}
        meta={meta}
        onPageChange={(page) => setParams((p) => ({ ...p, page }))}
        onSearch={searchTimeout}
        searchPlaceholder="Search roles..."
        isLoading={isLoading}
        actions={(item) => {
          const role = item as unknown as Role;
          return (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => setEditRole(role)} data-testid={`edit-role-${role.slug}`} className="text-[#6B7280] hover:text-[#111827]">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setDeleteRole(role)} data-testid={`delete-role-${role.slug}`} className="text-[#6B7280] hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        }}
      />

      {/* Edit Dialog */}
      <Dialog open={!!editRole} onOpenChange={(open) => !open && setEditRole(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          {editRole && <RoleForm mode="edit" role={editRole} onSuccess={() => setEditRole(null)} />}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteRole} onOpenChange={(open) => !open && setDeleteRole(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteRole?.title}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="delete-role-cancel">Cancel</AlertDialogCancel>
            <AlertDialogAction
              data-testid="delete-role-confirm"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (deleteRole) {
                  deleteRoleMutation.mutate(deleteRole.slug, { onSuccess: () => setDeleteRole(null) });
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function RoleForm({ mode, role, onSuccess }: { mode: 'create' | 'edit'; role?: Role; onSuccess: () => void }) {
  const createRole = useCreateRole();
  const updateRole = useUpdateRole(role?.slug || '');
  const { data: accessListData } = useAccessList();

  const { register, handleSubmit, control, formState: { errors }, watch, setValue } = useForm<CreateRoleInput>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: mode === 'edit' && role
      ? { title: role.title, userType: role.userType, description: role.description || '', access: role.access || [] }
      : { title: '', userType: '', description: '', access: [] },
  });

  const selectedAccess = watch('access') || [];
  const accessList: PermissionModule[] = accessListData?.data || [];

  const togglePermission = (value: string) => {
    const current = selectedAccess;
    if (current.includes(value)) {
      setValue('access', current.filter((v) => v !== value));
    } else {
      setValue('access', [...current, value]);
    }
  };

  const toggleModule = (moduleActivities: string[]) => {
    const allSelected = moduleActivities.every((a) => selectedAccess.includes(a));
    if (allSelected) {
      setValue('access', selectedAccess.filter((v) => !moduleActivities.includes(v)));
    } else {
      const newAccess = [...new Set([...selectedAccess, ...moduleActivities])];
      setValue('access', newAccess);
    }
  };

  const onSubmit = (data: CreateRoleInput) => {
    if (mode === 'create') {
      createRole.mutate(data, { onSuccess });
    } else {
      updateRole.mutate(data as UpdateRoleInput, { onSuccess });
    }
  };

  const isPending = mode === 'create' ? createRole.isPending : updateRole.isPending;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading text-lg font-bold text-[#111827]">
          {mode === 'create' ? 'Add New Role' : 'Edit Role'}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#111827]">Title</Label>
            <Input {...register('title')} data-testid="role-form-title" className="border-[#E5E7EB]" />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#111827]">User Type</Label>
            <Controller
              name="userType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger data-testid="role-form-userType" className="border-[#E5E7EB]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {userTypeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.userType && <p className="text-xs text-red-500">{errors.userType.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#111827]">Description</Label>
          <Textarea {...register('description')} data-testid="role-form-description" className="border-[#E5E7EB] resize-none" rows={2} />
        </div>

        {/* Permission Tree */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-[#111827]">Permissions</Label>
          <div className="rounded-lg border border-[#E5E7EB] divide-y divide-[#E5E7EB]" data-testid="permission-tree">
            {accessList.map((module) => (
              <div key={module.module} className="p-4">
                <p className="text-xs uppercase tracking-[0.15em] font-semibold text-[#6B7280] mb-3">
                  {module.module}
                </p>
                <div className="space-y-3">
                  {module.sub_module.map((sub) => {
                    const allValues = sub.activities.map((a) => a.value);
                    const allChecked = allValues.every((v) => selectedAccess.includes(v));
                    const someChecked = allValues.some((v) => selectedAccess.includes(v));

                    return (
                      <div key={sub.module} className="rounded-md bg-[#F9F9FB] p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Checkbox
                            checked={allChecked ? true : someChecked ? 'indeterminate' : false}
                            onCheckedChange={() => toggleModule(allValues)}
                            data-testid={`permission-module-${sub.module.toLowerCase().replace(/\s+/g, '-')}`}
                          />
                          <span className="text-sm font-medium text-[#111827]">{sub.module}</span>
                        </div>
                        <div className="ml-6 grid gap-2 sm:grid-cols-2">
                          {sub.activities.map((activity) => (
                            <label
                              key={activity.value}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Checkbox
                                checked={selectedAccess.includes(activity.value)}
                                onCheckedChange={() => togglePermission(activity.value)}
                                data-testid={`permission-${activity.value}`}
                              />
                              <span className="text-sm text-[#6B7280]">{activity.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#6B7280]">{selectedAccess.length} permission(s) selected</p>
        </div>

        <DialogFooter>
          <Button type="submit" disabled={isPending} data-testid="role-form-submit" className="bg-[#002FA7] hover:bg-[#002585] text-white">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {mode === 'create' ? 'Create Role' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
