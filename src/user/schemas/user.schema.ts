import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TUser } from '../types/user-type';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User implements Partial<TUser> {
  _id?: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
