import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { Reservation } from '../schemas/reservation.schema';

@InputType()
export class CreateReservationDto implements Partial<Reservation> {
  @Field(() => String)
  @IsString()
  hotelId: string;

  @Field(() => String)
  @IsString()
  userId: string;

  @Field(() => Date)
  @IsDate()
  arrivalDate: Date;

  @Field(() => Date)
  @IsDate()
  departureDate: Date;

  amount?: number;
}
