import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import bcrypt from 'bcryptjs';
import { IUser } from '../schemas/models/user.interface';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepository>;

  const mockUser: IUser = {
    email: 'user@test.com',
    password: '123456',
    role: 'aluno',
  };

  beforeEach(() => {
    repository = {
      createUser: jest.fn(),
      getUser: jest.fn(),
      findByEmail: jest.fn(),
      updateUser: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    service = new UserService(repository);
  });

  describe('getUser', () => {
    it('should return user if found', async () => {
      repository.getUser.mockResolvedValue({ ...mockUser, id: '123' });
      const user = await service.getUser('64ca80f404d178bbd69ecdf9');
      expect(user).toBeDefined();
    });

    it('should throw NotFoundException if invalid ID', async () => {
      await expect(service.getUser('invalid')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.getUser.mockResolvedValue(null);
      await expect(service.getUser('64ca80f404d178bbd69ecdf9')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return user if found', async () => {
      repository.findByEmail.mockResolvedValue(mockUser);
      const user = await service.findByEmail(mockUser.email);
      expect(user).toEqual(mockUser);
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findByEmail.mockResolvedValue(null);
      await expect(service.findByEmail(mockUser.email)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update user if valid and role not changed', async () => {
      const updatedUser = { ...mockUser, password: 'newpass' };
      repository.getUser.mockResolvedValue(mockUser);
      repository.updateUser.mockResolvedValue();

      await service.updateUser('64ca80f404d178bbd69ecdf9', updatedUser);
      expect(repository.updateUser).toHaveBeenCalledWith('64ca80f404d178bbd69ecdf9', updatedUser);
    });

    it('should throw if trying to change role', async () => {
      repository.getUser.mockResolvedValue(mockUser);

      const attemptUpdate = {
        ...mockUser,
        role: 'professor',
      };

      await expect(service.updateUser('64ca80f404d178bbd69ecdf9', attemptUpdate)).rejects.toThrow(
        'You cannot change your user role',
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.getUser.mockResolvedValue(null);

      await expect(service.updateUser('64ca80f404d178bbd69ecdf9', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if ID is invalid', async () => {
      await expect(service.updateUser('invalid', mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createuser', () => {
    it('should hash password and call repository.createUser', async () => {
      const userInput: IUser = {
        email: 'newuser@test.com',
        password: 'plainPassword',
        role: 'aluno',
      };

      (jest.spyOn(bcrypt, 'genSalt') as jest.Mock).mockResolvedValue('fakeSalt');
      (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue('hashedPassword');

      repository.createUser.mockResolvedValue(undefined);

      const result = await service.createuser(userInput);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(12);
      expect(bcrypt.hash).toHaveBeenCalledWith(userInput.password, 'fakeSalt');
      expect(repository.createUser).toHaveBeenCalledWith({
        ...userInput,
        password: 'hashedPassword',
      });

      expect(repository.createUser).toHaveBeenCalledWith({
        ...userInput,
        password: 'hashedPassword',
      });

      expect(result).toBeUndefined();
    });
  });
});
