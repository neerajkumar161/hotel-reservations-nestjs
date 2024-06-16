import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsString } from 'class-validator';

@InputType()
export class DateRangeDto {
  @Field()
  @IsString()
  userId: string

  @Field(() => Date)
  @IsDate()
  startDate: Date;

  @Field(() => Date)
  @IsDate()
  endDate: Date;
}
