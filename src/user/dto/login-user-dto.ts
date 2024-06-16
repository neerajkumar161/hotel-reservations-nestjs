import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class LoginUserDto {
  @Field()
  @IsEmail()
  readonly email: string;

  @Field()
  @IsString()
  @MinLength(5)
  readonly password: string;
}
