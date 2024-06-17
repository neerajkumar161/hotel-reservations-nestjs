import { UseGuards } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';
import { TCurrentUser } from '../common/types/current-user';
import { HotelLoader } from '../dataloader/hotel.loader';
import { UserLoader } from '../dataloader/user.loader';
import { CurrentUser } from '../decorators/current-user-decorator';
import { HotelObjectDto } from '../hotel/dto/create-hotel-dto';
import { ReservationPage } from '../reservation/entities/reservation-page-dto';
import { ReservationEntity } from '../reservation/entities/reservation.entity';
import { UserObjectDto } from './dto/create-user-dto';
import { PastStaysDto } from './dto/past-stays-dto';
import { StaySummary } from './entities/stay-summary.entity';
import { UserEntity, UserEntityDepricated } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => UserEntity)
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(
    private userService: UserService,
    private hotelLoader: HotelLoader,
    private userLoader: UserLoader,
  ) {}

  @Query(() => [UserEntityDepricated], { description: 'Testing Purpose Only!' })
  async getAllUsers() {
    return this.userService.getUsers();
  }

  @Query(() => StaySummary)
  async guestSummary(@CurrentUser() user: TCurrentUser) {
    return this.userService.getUserStaySummary(user.userId);
  }

  @Query(() => ReservationPage)
  async getPastStays(
    @Args('pastStaysArgs') args: PastStaysDto,
    @CurrentUser() user: TCurrentUser,
  ) {
    const { reservations, nextCursor } = await this.userService.getPastStays(
      args,
      user.userId,
    );

    const edges = reservations.map((reservation) => ({
      cursor: reservation._id,
      node: reservation,
    }));

    return { edges, nextCursor };
  }

  @ResolveField(() => HotelObjectDto)
  async hotelId(@Parent() reservation: ReservationEntity) {
    return this.hotelLoader.batchHotel.load(
      reservation.hotelId as unknown as Types.ObjectId,
    );
  }

  @ResolveField(() => UserObjectDto)
  async userId(@Parent() reservation: ReservationEntity) {
    return this.userLoader.batchUser.load(
      reservation.userId as unknown as Types.ObjectId,
    );
  }
}
