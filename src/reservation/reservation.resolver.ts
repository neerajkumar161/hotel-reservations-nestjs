import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Types } from 'mongoose';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';
import { TCurrentUser } from '../common/types/current-user';
import { HotelLoader } from '../dataloader/hotel.loader';
import { UserLoader } from '../dataloader/user.loader';
import { CurrentUser } from '../decorators/current-user-decorator';
import { HotelObjectDto } from '../hotel/dto/create-hotel-dto';
import { UserObjectDto } from '../user/dto/create-user-dto';
import { CreateReservationDto } from './dto/create-reservation-dto';
import { PaginationDto } from './dto/pagination-dto';
import { ReservationPage } from './entities/reservation-page-dto';
import { ReservationEntity } from './entities/reservation.entity';
import { ReservationService } from './reservation.service';
import { UpdateReservationDto } from './dto/update-reservation-dto';

@Resolver(() => ReservationEntity)
@UseGuards(GqlAuthGuard)
export class ReservationResolver {
  constructor(
    private reservationService: ReservationService,
    private hotelLoader: HotelLoader,
    private userLoader: UserLoader,
  ) {}

  @Query(() => ReservationPage)
  async getReservations(@Args('paginationDto') args: PaginationDto) {
    const { reservations, nextCursor } =
      await this.reservationService.getReservations(args);

    const edges = reservations.map((reservation) => ({
      cursor: reservation._id,
      node: reservation,
    }));

    return {
      edges,
      nextCursor,
    };
  }

  @Query(() => ReservationEntity)
  async getReservation(@Args('_id') _id: string) {
    return this.reservationService.getReservation(_id);
  }

  @Mutation(() => ReservationEntity)
  async createReservation(
    @Args('createReservationDto') createReservationDto: CreateReservationDto,
    @CurrentUser() user: TCurrentUser,
  ) {
    return this.reservationService.create(user.userId,createReservationDto);
  }

  @Mutation(() => ReservationEntity)
  async updateReservation(
    @Args('_id') _id: string,
    @Args('updateReservationDto') updateReservationDto: UpdateReservationDto,
    @CurrentUser() user: TCurrentUser,
  ) {

    return this.reservationService.updateReservation(_id, user.userId, updateReservationDto);
  }

  @Mutation(() => String)
  async cancelReservation(@Args('_id') _id: string) {
    return this.reservationService.cancelReservation(_id);
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
