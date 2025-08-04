import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../schemas/models/user.interface';
import { isValidObjectId } from 'mongoose';
import bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createuser(user: IUser) {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    const userToCreate: IUser = {
      ...user,
      password: hashedPassword,
    };
    return this.userRepository.createUser(userToCreate);
  }

  async getUser(userId: string) {
    if (!isValidObjectId(userId)) {
      throw new NotFoundException('Invalid user ID');
    }

    const user = await this.userRepository.getUser(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Credentials not found');
    }

    return user;
  }

  async updateUser(userId: string, user: IUser) {
    if (!isValidObjectId(userId)) {
      throw new NotFoundException('Invalid user ID');
    }

    const existingUser = await this.userRepository.getUser(userId);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (user.role && user.role !== existingUser.role) {
      throw new Error('You cannot change your user role');
    }

    return this.userRepository.updateUser(userId, user);
  }
}
