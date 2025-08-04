import { createPostSchema, updatePostSchema } from './post.validation';

describe('Post Validation Schemas', () => {
  const validData = {
    title: 'Título do post',
    content: 'Conteúdo do post',
    author: 'Autor do post',
  };

  describe('createPostSchema', () => {
    it('should pass validation with valid data', () => {
      const result = createPostSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail validation with missing fields', () => {
      const result = createPostSchema.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(3);
      }
    });
  });

  describe('updatePostSchema', () => {
    it('should pass validation with valid data', () => {
      const result = updatePostSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail if fields are missing or invalid', () => {
      const result = updatePostSchema.safeParse({ title: 'Só o título' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });
});
