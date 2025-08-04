import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import z from 'zod';
import { updateUserSchema } from '../schemas/validations/user.validation';

type UpdateUser = z.infer<typeof updateUserSchema>;

describe('UserController', () => {
  let controller: UserController;
  let userService: { updateUser: jest.Mock };

  const mockUserId = 'abc123';
  const updateDto: UpdateUser = {
    email: 'new@email.com',
    password: 'newpassword123',
    role: 'aluno',
  };

  beforeEach(async () => {
    userService = {
      updateUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userService }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  describe('updateUser', () => {
    it('should call userService.updateUser with correct parameters', async () => {
      userService.updateUser.mockResolvedValue({ success: true });

      const result = await controller.updateUser(mockUserId, updateDto);

      expect(userService.updateUser).toHaveBeenCalledWith(mockUserId, updateDto);
      expect(result).toEqual({ success: true });
    });
  });
});
