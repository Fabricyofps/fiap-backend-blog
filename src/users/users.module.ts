import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserRepository } from './repositories/user.repository';
import { UserMongooseRepository } from './repositories/mongoose/user.mongoose.repository';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [
    {
      provide: UserRepository,
      useClass: UserMongooseRepository,
    },
    UserService,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
