import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Roles } from './roles.decorator';

describe('Roles decorator', () => {
  it('should set metadata with roles', () => {
    class TestClass {
      @Roles('admin', 'user')
      testMethod() {}
    }

    const reflector = new Reflector();

    const roles = reflector.get<string[]>(ROLES_KEY, TestClass.prototype.testMethod);

    expect(roles).toEqual(['admin', 'user']);
  });
});
