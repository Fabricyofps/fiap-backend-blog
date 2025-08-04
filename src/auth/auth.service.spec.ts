import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userService: { findByEmail: jest.Mock };
  let jwtService: { sign: jest.Mock };

  const mockUser = {
    _id: 'userId123',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: 'user',
  };

  beforeEach(() => {
    userService = {
      findByEmail: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('signedJwtToken'),
    };

    authService = new AuthService(userService as any, jwtService as any);
  });

  describe('validateUser', () => {
    it('should return user if password matches', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser(mockUser.email, 'password');

      expect(userService.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(bcrypt.compare).toHaveBeenCalledWith('password', mockUser.password);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.validateUser(mockUser.email, 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      userService.findByEmail.mockRejectedValue(new UnauthorizedException('User not found'));

      await expect(authService.validateUser('unknown@example.com', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('should return access_token on login', async () => {
      const result = await authService.login(mockUser);

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser._id,
        email: mockUser.email,
        role: mockUser.role,
      });

      expect(result).toEqual({
        access_token: 'signedJwtToken',
      });
    });
  });
});
