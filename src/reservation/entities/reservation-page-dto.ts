import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ReservationEntity } from './reservation.entity';

@ObjectType()
export class ReservationEdge {
  @Field(() => ID, { nullable: true })
  cursor: string;

  @Field(() => ReservationEntity)
  node: ReservationEntity;
}

@ObjectType()
export class ReservationPage {
  @Field(() => [ReservationEdge])
  edges: ReservationEdge[];

  @Field(() => String, { nullable: true })
  nextCursor?: string;
}