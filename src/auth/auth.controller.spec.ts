import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/users/services/user.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Partial<AuthService>;
  let userService: Partial<UserService>;

  beforeEach(async () => {
    authService = {
      validateUser: jest.fn(),
      login: jest.fn(),
    };

    userService = {
      createuser: jest.fn(),
      getUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: UserService, useValue: userService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('register', () => {
    it('should call userService.createuser with user data and return its result', async () => {
      const userData = { email: 'test@test.com', password: '123456', role: 'aluno' };
      (userService.createuser as jest.Mock).mockResolvedValue('user-created');

      const result = await controller.register(userData);

      expect(userService.createuser).toHaveBeenCalledWith(userData);
      expect(result).toBe('user-created');
    });
  });

  describe('login', () => {
    it('should validate user and return login token', async () => {
      const credentials = { email: 'test@test.com', password: '123456' };
      const user = { id: '1', email: 'test@test.com' };
      (authService.validateUser as jest.Mock).mockResolvedValue(user);
      (authService.login as jest.Mock).mockResolvedValue({ access_token: 'token' });

      const result = await controller.login(credentials);

      expect(authService.validateUser).toHaveBeenCalledWith(
        credentials.email,
        credentials.password,
      );
      expect(authService.login).toHaveBeenCalledWith(user);
      expect(result).toEqual({ access_token: 'token' });
    });
  });

  describe('getProfile', () => {
    it('should return user data for authenticated user', async () => {
      const req = { user: { id: '1' } };
      const userProfile = { id: '1', email: 'test@test.com' };
      (userService.getUser as jest.Mock).mockResolvedValue(userProfile);

      const result = await controller.getProfile(req);

      expect(userService.getUser).toHaveBeenCalledWith('1');
      expect(result).toBe(userProfile);
    });
  });
});
