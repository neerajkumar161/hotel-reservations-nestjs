import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TStaySummary } from '../types/stay-summary-type';

@ObjectType()
export class StaySummary implements TStaySummary {
  @Field()
  guestId: string;

  @Field(() => Int)
  upcomingStaysCount: number;

  @Field(() => Int)
  upComingTotalAmount: number;

  @Field(() => Int)
  upComingTotalNights: number;

  @Field(() => Int)
  pastStaysCount: number;

  @Field(() => Int)
  pastTotalAmount: number;

  @Field(() => Int)
  pastTotalNights: number;

  @Field(() => Int)
  cancelledStaysCount: number;

  @Field(() => Int)
  totalStaysAmount: number;
}
