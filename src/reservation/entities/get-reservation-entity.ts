import {
  Field,
  ObjectType,
  OmitType
} from '@nestjs/graphql';
import { HotelObjectDto } from 'src/hotel/dto/create-hotel-dto';
import { CreateReservationDto } from '../dto/create-reservation-dto';

@ObjectType()
export class GetReservationEntity extends OmitType(CreateReservationDto, [
  'hotelId',
], ObjectType) {
  @Field(() => String)
  _id: string;
  
  @Field(() => HotelObjectDto)
  hotelId: HotelObjectDto;
}
