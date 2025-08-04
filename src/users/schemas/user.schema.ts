import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { IUser } from './models/user.interface';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User implements IUser {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id?: string;
  @Prop({})
  email: string;
  @Prop()
  password: string;
  @Prop()
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
