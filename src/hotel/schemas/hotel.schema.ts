import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { THotel } from '../types/hotel-type';

export type UserDocument = HydratedDocument<THotel>;

@Schema()
export class Hotel implements Partial<THotel> {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  phoneNumber: string;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
