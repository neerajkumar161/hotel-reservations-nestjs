import { Field, ObjectType } from '@nestjs/graphql';
import { LocationObjectDto } from '../dto/location-dto';
import { THotel } from '../types/hotel-type';

@ObjectType()
export class HotelEntity implements Partial<THotel> {
  @Field((type) => String)
  _id: string;

  @Field()
  name: string;

  @Field((type) => LocationObjectDto)
  location: { lat: string; long: string; };

  @Field()
  rating: string;

  @Field()
  baseAmount: number;

  @Field()
  taxAmount: number;
}
