import { Field, Int, ObjectType } from '@nestjs/graphql';
import { THotel } from '../types/hotel-type';

@ObjectType()
export class HotelEntity implements Partial<THotel> {
  @Field((type) => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  location: string;

  @Field()
  rating: string;

  @Field()
  baseAmount: number;

  @Field()
  taxAmount: number;
}
