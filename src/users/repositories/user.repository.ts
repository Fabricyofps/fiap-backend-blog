import { IUser } from '../schemas/models/user.interface';

export abstract class UserRepository {
  abstract createUser(user: IUser): Promise<void>;
  abstract getUser(userId: string): Promise<IUser | null>;
  abstract findByEmail(email: string): Promise<IUser | null>;
  abstract updateUser(userId: string, user: IUser): Promise<void>;
}
