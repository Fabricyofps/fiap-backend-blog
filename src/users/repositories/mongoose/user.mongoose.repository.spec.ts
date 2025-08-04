import { UserMongooseRepository } from './user.mongoose.repository';
import { User } from 'src/users/schemas/user.schema';
import { IUser } from 'src/users/schemas/models/user.interface';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

describe('UserMongooseRepository', () => {
  let repository: UserMongooseRepository;
  let model: jest.Mocked<Model<User>>;

  const mockUser: IUser = {
    email: 'test@example.com',
    password: 'hashedPassword',
    role: 'aluno',
  };

  beforeEach(async () => {
    const modelMock: Partial<jest.Mocked<Model<User>>> = {
      findOne: jest.fn(),
      findById: jest.fn(),
      updateOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserMongooseRepository,
        {
          provide: getModelToken(User.name),
          useValue: modelMock,
        },
      ],
    }).compile();

    repository = module.get(UserMongooseRepository);
    model = module.get(getModelToken(User.name));
  });

  it('should find user by email', async () => {
    const exec = jest.fn().mockResolvedValue(mockUser);
    model.findOne.mockReturnValue({ exec } as any);

    const result = await repository.findByEmail(mockUser.email);

    expect(model.findOne).toHaveBeenCalledWith({ email: mockUser.email });
    expect(result).toEqual(mockUser);
  });

  it('should create a new user', async () => {
    const saveMock = jest.fn().mockResolvedValue(undefined);

    const mockModelConstructor = jest.fn(() => ({
      save: saveMock,
    })) as unknown as Model<User>;

    const repositoryWithConstructor = new UserMongooseRepository(mockModelConstructor);

    await repositoryWithConstructor.createUser(mockUser);

    expect(mockModelConstructor).toHaveBeenCalledWith(mockUser);
    expect(saveMock).toHaveBeenCalled();
  });

  it('should return user by ID', async () => {
    const exec = jest.fn().mockResolvedValue(mockUser);
    model.findById.mockReturnValue({ exec } as any);

    const result = await repository.getUser('userId123');

    expect(model.findById).toHaveBeenCalledWith('userId123');
    expect(result).toEqual(mockUser);
  });

  it('should update user by ID', async () => {
    const exec = jest.fn().mockResolvedValue(undefined);
    model.updateOne.mockReturnValue({ exec } as any);

    await repository.updateUser('userId123', mockUser);

    expect(model.updateOne).toHaveBeenCalledWith({ _id: 'userId123' }, { $set: mockUser });
  });
});
