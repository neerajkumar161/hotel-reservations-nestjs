import { Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { Types } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';

@Injectable({ scope: Scope.REQUEST })
export class UserLoader {
  constructor(private userService: UserService) {}

  public readonly batchUser = new DataLoader<Types.ObjectId, User>(
    async (userIds) => {
      const users = await this.userService.getUsersById([...userIds]);
      const usersMap = new Map(
        users.map((user) => [user._id.toString(), user]),
      );
      return userIds.map((id) => usersMap.get(id.toString()));
    },
  );
}
