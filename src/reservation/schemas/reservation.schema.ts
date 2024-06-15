import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Hotel } from 'src/hotel/schemas/hotel.schema';
import { User } from 'src/user/schemas/user.schema';
import { TReservation } from '../types/reservation-type';

export type ReservationDocument = HydratedDocument<TReservation>;

@Schema()
export class Reservation implements TReservation {
  // We can use String or Object, Since mongoose internally converts the string to ObjectId
  @Prop({ type: Types.ObjectId, ref: Hotel.name })
  hotelId: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  userId: string;

  @Prop({ type: Date })
  arrivalDate: Date;

  @Prop({ type: Date })
  departureDate: Date;

  @Prop({ type: String, enum: ['active', 'cancelled'], default: 'active' })
  status: 'active' | 'cancelled';

  @Prop({ type: Number })
  amount: number;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

ReservationSchema.pre('save', function (next) {
  if (typeof this.hotelId === 'string') {
    this.hotelId = new Types.ObjectId(this.hotelId) as unknown as string;
  }

  if (typeof this.userId === 'string') {
    this.userId = new Types.ObjectId(this.userId) as unknown as string;
  }

  next();
});
