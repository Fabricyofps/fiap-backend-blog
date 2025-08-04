import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: { verifyAsync: jest.Mock };

  beforeEach(() => {
    jwtService = {
      verifyAsync: jest.fn(),
    };
    guard = new AuthGuard(jwtService as any);
  });

  it('should return true if token is valid and set user on request', async () => {
    const token = 'valid-token';
    const payload = { sub: 'userId' };

    jwtService.verifyAsync.mockResolvedValue(payload);

    const request = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;

    const result = await guard.canActivate(context);

    expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, { secret: 'teste' });

    expect(payload.sub).toEqual(payload.sub);

    expect(result).toBe(true);
  });

  it('should throw UnauthorizedException if no token is present', async () => {
    const request = {
      headers: {},
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if token verification fails', async () => {
    const token = 'invalid-token';

    jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

    const request = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });
});
