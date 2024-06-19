import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { IsDate, IsString, MinDate } from 'class-validator';
import { Reservation } from '../schemas/reservation.schema';
import { IsAfter } from './is-after-decorator';

@InputType()
export class CreateReservationDto implements Partial<Reservation> {
  @Field(() => String)
  @IsString()
  hotelId: string;

  @Field(() => Date)
  @IsDate()
  @MinDate(new Date(), { message: 'Arrival date must be after current date' })
  arrivalDate: Date;

  @Field(() => Date)
  @IsDate()
  @IsAfter('arrivalDate', {
    message: 'Departure date must be after arrival date',
  })
  departureDate: Date;

  amount?: number;
}
