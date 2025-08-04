import z from 'zod';

export const createUserSchema = z.object({
  email: z.email().min(6),
  password: z.string().min(5),
  role: z.enum(['aluno', 'professor']),
});

export const updateUserSchema = z.object({
  email: z.email().min(6),
  password: z.string().min(5),
  role: z.enum(['aluno', 'professor']),
});
