import { z } from 'zod';

export const createRoleSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  userType: z.string().min(1, 'Tipe user wajib diisi'),
  description: z.string().optional(),
  access: z.array(z.string()).default([]),
});

export const updateRoleSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi').optional(),
  userType: z.string().min(1, 'Tipe user wajib diisi').optional(),
  description: z.string().nullable().optional(),
  access: z.array(z.string()).optional(),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
