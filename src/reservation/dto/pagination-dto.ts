import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class PaginationDto {
  @Field(() => ID, { nullable: true })
  @IsString()
  @IsOptional()
  cursor: string;

  @Field(() => Int)
  @IsNumber()
  limit: number;
}
