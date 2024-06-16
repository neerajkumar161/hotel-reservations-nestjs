import { Field, ObjectType, OmitType, registerEnumType } from '@nestjs/graphql';
import { HotelObjectDto } from 'src/hotel/dto/create-hotel-dto';
import { UserObjectDto } from 'src/user/dto/create-user-dto';
import { CreateReservationDto } from '../dto/create-reservation-dto';
import { ReservationStatus } from '../enum/reservation-status';
import { Reservation } from '../schemas/reservation.schema';

registerEnumType(ReservationStatus, {
  name: 'ReservationStatus',
  description: 'Status of the reservation',
});

@ObjectType()
export class ReservationEntity
  extends OmitType(CreateReservationDto, ['hotelId', 'userId'], ObjectType)
  implements Partial<Reservation<HotelObjectDto, UserObjectDto>>
{
  @Field(() => String)
  _id: string;

  @Field(() => HotelObjectDto)
  hotelId: HotelObjectDto;

  @Field(() => UserObjectDto)
  userId: UserObjectDto;

  @Field()
  amount: number;

  @Field(() => ReservationStatus)
  status: ReservationStatus;
}
