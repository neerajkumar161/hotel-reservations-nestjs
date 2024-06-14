import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsPhoneNumber, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateUserDto {
  @Field()
  @IsString()
  readonly name: string;

  @Field()
  @IsEmail()
  readonly email: string;

  @Field()
  @IsString()
  @IsPhoneNumber()
  readonly phoneNumber: string;

  @Field()
  @IsString()
  @MinLength(5)
  readonly password: string;
}
