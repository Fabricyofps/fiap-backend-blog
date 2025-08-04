import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User, UserSchema } from './user.schema';

jest.setTimeout(15000);

describe('User Schema Basic', () => {
  let userModel: mongoose.Model<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/test-db-backend'),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
    }).compile();

    userModel = module.get<mongoose.Model<User>>(getModelToken(User.name));
    await mongoose.connection.asPromise();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await userModel.deleteMany({});
  });

  it('must create a user with email, password and role', async () => {
    const user = await userModel.create({
      email: 'teste@exemplo.com',
      password: '123456',
      role: 'aluno',
    });

    expect(user).toHaveProperty('_id');
    expect(user.email).toBe('teste@exemplo.com');
    expect(user.password).toBe('123456');
    expect(user.role).toBe('aluno');
  });
});
