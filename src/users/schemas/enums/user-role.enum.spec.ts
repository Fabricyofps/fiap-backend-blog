import { UserRole } from './user-role.enum';

describe('UserRole Enum', () => {
  it('must contain the value "aluno"', () => {
    expect(UserRole.Aluno).toBe('aluno');
  });

  it('must contain the value "professor"', () => {
    expect(UserRole.Professor).toBe('professor');
  });

  it('must not contain unexpected values', () => {
    const values = Object.values(UserRole);
    expect(values).toEqual(['aluno', 'professor']);
  });
});
