import { InjectModel } from '@nestjs/mongoose';
import { UserRepository } from '../user.repository';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { IUser } from 'src/users/schemas/models/user.interface';

export class UserMongooseRepository implements UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  findByEmail(email: string): Promise<IUser | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async createUser(user: IUser): Promise<void> {
    const createUser = new this.userModel(user);
    await createUser.save();
  }

  getUser(userId: string): Promise<IUser | null> {
    return this.userModel.findById(userId).exec();
  }

  async updateUser(userId: string, user: IUser): Promise<void> {
    await this.userModel.updateOne({ _id: userId }, { $set: user }).exec();
  }
}
