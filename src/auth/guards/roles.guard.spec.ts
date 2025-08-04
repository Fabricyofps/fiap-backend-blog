import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    rolesGuard = new RolesGuard(reflector);
  });

  it('should allow access if no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: 'aluno' } }),
      }),
    } as unknown as ExecutionContext;

    expect(rolesGuard.canActivate(context)).toBe(true);
  });

  it('should allow access if user role matches required roles', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['professor', 'aluno']);

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: 'aluno' } }),
      }),
    } as unknown as ExecutionContext;

    expect(rolesGuard.canActivate(context)).toBe(true);
  });

  it('should deny access if user role does not match required roles', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['professor']);

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: 'aluno' } }),
      }),
    } as unknown as ExecutionContext;

    expect(rolesGuard.canActivate(context)).toBe(false);
  });
});
