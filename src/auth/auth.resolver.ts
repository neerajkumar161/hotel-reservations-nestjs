import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserDto } from '../user/dto/create-user-dto';
import { UserEntity } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response-dto';
import { LoginUserDto } from './dto/login-user-dto';
import { User } from 'src/user/schemas/user.schema';

@Resolver(() => UserEntity)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => UserEntity)
  async signUp(@Args('userInput') args: CreateUserDto) {
    return this.authService.signUp(args);
  }

  @Query(() => AuthResponseDto)
  async signIn(@Args('userInput') args: LoginUserDto) {
    return this.authService.signIn(args);
  }
}
