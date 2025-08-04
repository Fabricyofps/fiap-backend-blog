import z from 'zod';

export const createPostSchema = z.object({
  title: z.string(),
  content: z.string(),
  author: z.string(),
});

export const updatePostSchema = z.object({
  title: z.string(),
  content: z.string(),
  author: z.string(),
});
