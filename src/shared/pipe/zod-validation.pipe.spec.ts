import { ZodValidationPipe } from './zod-validation.pipe';
import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';

describe('ZodValidationPipe', () => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const pipe = new ZodValidationPipe(schema);

  it('should return parsed value when valid', () => {
    const validData = {
      email: 'user@test.com',
      password: '123456',
    };

    expect(pipe.transform(validData)).toEqual(validData);
  });

  it('should throw BadRequestException when invalid', () => {
    const invalidData = {
      email: 'invalid-email',
      password: '123',
    };

    expect(() => pipe.transform(invalidData)).toThrow(BadRequestException);
  });
});
