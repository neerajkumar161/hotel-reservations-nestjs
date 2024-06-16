import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { HotelLoader } from 'src/dataloader/hotel.loader';
import { UserLoader } from 'src/dataloader/user.loader';
import { HotelObjectDto } from 'src/hotel/dto/create-hotel-dto';
import { ReservationEntity } from 'src/reservation/entities/reservation.entity';
import { UserObjectDto } from './dto/create-user-dto';
import { DateRangeDto } from './dto/date-range-dto';
import { StaySummary } from './entities/stay-summary.entity';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(
    private userService: UserService,
    private hotelLoader: HotelLoader,
    private userLoader: UserLoader,
  ) {}

  @Query(() => String)
  async hello() {
    return 'Hello World!';
  }

  @Query(() => [UserEntity])
  async users() {
    return this.userService.getUsers();
  }

  // Required Pagination
  @Query(() => StaySummary)
  async guestSummary(@Args('userId') userId: string) {
    return this.userService.getUserStaySummary(userId);
  }

  // Required Pagination
  @Query(() => [ReservationEntity])
  async getPastStays(
    @Args('dateRange') args: DateRangeDto,
  ) {
    // Using Date Range of Past Days like past 6 months or 12 months
    console.log('Args', args);
    return this.userService.getPastStays(
      args.userId,
      args.startDate,
      args.endDate,
    );
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
