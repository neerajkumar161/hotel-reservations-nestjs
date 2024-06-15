import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { THotel } from '../types/hotel-type';

export type HotelDocument = HydratedDocument<THotel>;

@Schema()
export class Hotel implements THotel {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  phoneNumber: string;

  @Prop({ type: { lat: String, long: String } })
  location: { lat: string; long: string };

  @Prop({ type: String })
  rating: string;

  @Prop({ type: Number })
  baseAmount: number;

  @Prop({ type: Number })
  taxAmount: number;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
