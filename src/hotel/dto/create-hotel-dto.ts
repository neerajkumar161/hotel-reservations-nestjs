import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsObject, IsString } from 'class-validator';
import { THotel } from '../types/hotel-type';
import { LocationInputDto } from './location-dto';

@InputType()
export class CreateHotelDto implements Partial<THotel> {
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => LocationInputDto)
  @IsObject()
  location: { lat: string; long: string; };

  @Field(() => String)
  @IsString()
  rating: string;

  @Field(() => Number)
  @IsNumber()
  baseAmount: number;

  @Field(() => Number)
  @IsNumber()
  taxAmount: number;
}