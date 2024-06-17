import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserDto } from 'src/user/dto/create-user-dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response-dto';
import { LoginUserDto } from './dto/login-user-dto';

@Resolver()
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
