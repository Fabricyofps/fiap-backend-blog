import { IUser } from '../schemas/models/user.interface';
import { UserRepository } from './user.repository';

class MockUserRepository extends UserRepository {
  createUser = jest.fn();
  getUser = jest.fn();
  findByEmail = jest.fn();
  updateUser = jest.fn();
}

describe('UserRepository (abstrata)', () => {
  let repository: MockUserRepository;

  const mockUser: IUser = {
    email: 'test@example.com',
    password: '123456',
    role: 'aluno',
  };

  beforeEach(() => {
    repository = new MockUserRepository();
  });

  it('must call createUser with the correct user', async () => {
    await repository.createUser(mockUser);
    expect(repository.createUser).toHaveBeenCalledWith(mockUser);
  });

  it('must call getUser with the correct id', async () => {
    const userId = '123';
    await repository.getUser(userId);
    expect(repository.getUser).toHaveBeenCalledWith(userId);
  });

  it('must call findByEmail with the correct email', async () => {
    const email = 'test@example.com';
    await repository.findByEmail(email);
    expect(repository.findByEmail).toHaveBeenCalledWith(email);
  });

  it('must call updateUser with correct id and data', async () => {
    const userId = '123';
    await repository.updateUser(userId, mockUser);
    expect(repository.updateUser).toHaveBeenCalledWith(userId, mockUser);
  });
});
