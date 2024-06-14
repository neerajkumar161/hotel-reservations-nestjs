import { Query, Resolver } from '@nestjs/graphql';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => String)
  async hello() {
    return 'Hello World!';
  }

  @Query(() => [UserEntity])
  async users() {
    return this.userService.getUsers();
  }
}
