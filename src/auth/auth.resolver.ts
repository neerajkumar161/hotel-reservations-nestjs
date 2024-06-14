import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserEntity } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user-dto';
import { LoginUserDto } from 'src/user/dto/login-user-dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => UserEntity)
  async signUp(@Args('userInput') args: CreateUserDto) {
    return this.authService.signUp(args);
  }

  @Mutation(() => UserEntity)
  async signIn(@Args('userInput') args: LoginUserDto) {
    return this.authService.signIn(args);
  }
}
