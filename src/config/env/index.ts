import z from 'zod';
import 'dotenv/config';
const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  BLOG_MONGO_URI: z.string().min(5, 'BLOG_MONGO_URI is required'),
  BLOG_JWT_SECRET: z.string().min(10, 'BLOG_JWT_SECRET is required'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid environment variables:', _env.error.format());
  throw new Error('Fix your environment variables.');
}

export const env = _env.data;
