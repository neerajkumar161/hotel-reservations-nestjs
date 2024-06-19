import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  MinDate
} from 'class-validator';
import { ReservationStatus } from '../enum/reservation-status';
import { Reservation } from '../schemas/reservation.schema';
import { IsAfter } from './is-after-decorator';

@InputType()
export class UpdateReservationDto implements Partial<Reservation> {
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

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @Field(() => ReservationStatus, { nullable: true })
  @IsEnum(['active', 'cancelled'])
  @IsOptional()
  status?: 'active' | 'cancelled';
}
