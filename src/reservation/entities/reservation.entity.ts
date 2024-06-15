import { Field, ObjectType, OmitType, registerEnumType } from '@nestjs/graphql';
import { CreateReservationDto } from '../dto/create-reservation-dto';
import { ReservationStatus } from '../enum/reservation-status';
import { Reservation } from '../schemas/reservation.schema';

registerEnumType(ReservationStatus, {
  name: 'ReservationStatus',
  description: 'Status of the reservation',
});

@ObjectType()
export class ReservationEntity
  extends OmitType(CreateReservationDto, [], ObjectType)
  implements Partial<Reservation>
{

  @Field(() => String)
  _id: string;
  
  @Field()
  amount: number;

  @Field(() => ReservationStatus)
  status: ReservationStatus;
}
