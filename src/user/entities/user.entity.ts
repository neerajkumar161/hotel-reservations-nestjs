import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { TUser } from '../types/user-type';

@ObjectType()
export class UserEntity implements Partial<TUser> {
  @Field(() => String)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  phoneNumber: string;
}


@ObjectType()
export class UserEntityDepricated extends OmitType(UserEntity, []) {
  @Field({ deprecationReason: 'Not available!'})
  hotelId: string;

  @Field({ deprecationReason: 'Not available!'})
  userId: string;
}