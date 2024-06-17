import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class PastStaysDto {
  @Field(() => ID, { nullable: true })
  @IsString()
  @IsOptional()
  cursor: string;

  @Field(() => Int)
  @IsNumber()
  limit: number;

  @Field(() => Date)
  @IsDate()
  startDate: Date;

  @Field(() => Date)
  @IsDate()
  endDate: Date;
}
