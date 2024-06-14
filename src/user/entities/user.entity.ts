import { Field, ObjectType } from '@nestjs/graphql';
import { TUser } from '../types/user-type';

@ObjectType()
export class UserEntity implements Partial<TUser> {
  @Field((type) => String)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  phoneNumber: string;
}
