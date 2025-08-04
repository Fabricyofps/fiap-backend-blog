import { createUserSchema, updateUserSchema } from './user.validation';
import { ZodError } from 'zod';

describe('User Validation Schema', () => {
  const validData = {
    email: 'usuario@exemplo.com',
    password: 'senhaSegura',
    role: 'aluno',
  };

  describe('createUserSchema', () => {
    it('must validate a valid payload', () => {
      const parsed = createUserSchema.parse(validData);
      expect(parsed).toEqual(validData);
    });

    it('should throw error if email is invalid', () => {
      expect(() => createUserSchema.parse({ ...validData, email: 'invalido' })).toThrow(ZodError);
    });

    it('should throw error if password is too short', () => {
      expect(() => createUserSchema.parse({ ...validData, password: '123' })).toThrow(ZodError);
    });

    it('should throw error if role is invalid', () => {
      expect(() => createUserSchema.parse({ ...validData, role: 'admin' })).toThrow(ZodError);
    });
  });

  describe('updateUserSchema', () => {
    it('must validate a valid payload', () => {
      const parsed = updateUserSchema.parse(validData);
      expect(parsed).toEqual(validData);
    });

    it('should throw error if role is missing', () => {
      expect(() =>
        updateUserSchema.parse({
          email: validData.email,
          password: validData.password,
        }),
      ).toThrow(ZodError);
    });
  });
});
