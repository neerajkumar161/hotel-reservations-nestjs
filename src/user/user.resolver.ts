import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { HotelLoader } from 'src/dataloader/hotel.loader';
import { UserLoader } from 'src/dataloader/user.loader';
import { HotelObjectDto } from 'src/hotel/dto/create-hotel-dto';
import { ReservationPage } from 'src/reservation/entities/reservation-page-dto';
import { ReservationEntity } from 'src/reservation/entities/reservation.entity';
import { UserObjectDto } from './dto/create-user-dto';
import { PastStaysDto } from './dto/past-stays-dto';
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

  @Query(() => StaySummary)
  async guestSummary(@Args('userId') userId: string) {
    return this.userService.getUserStaySummary(userId);
  }

  @Query(() => ReservationPage)
  async getPastStays(@Args('pastStaysArgs') args: PastStaysDto) {
    const { reservations, nextCurosr } =
      await this.userService.getPastStays(args);

    const edges = reservations.map((reservation) => ({
      cursor: reservation._id,
      node: reservation,
    }));

    return { edges, nextCurosr };
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
