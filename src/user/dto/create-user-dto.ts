import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateUserDto {
  _id?: string;

  @Field()
  @IsString()
  readonly name: string;

  @Field()
  @IsEmail()
  readonly email: string;

  @Field()
  @IsString()
  @MaxLength(15)
  readonly phoneNumber: string;

  @Field()
  @IsString()
  @MinLength(5)
  readonly password: string;
}

@ObjectType()
export class UserObjectDto extends OmitType(
  CreateUserDto,
  ['password'] as const,
  ObjectType,
) {
  @Field()
  _id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  phoneNumber: string;
}
