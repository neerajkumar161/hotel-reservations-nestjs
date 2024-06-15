import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateReservationDto } from './dto/create-reservation-dto';
import { ReservationEntity } from './entities/reservation.entity';
import { ReservationService } from './reservation.service';

@Resolver()
export class ReservationResolver {
  constructor(private reservationService: ReservationService) {}

  @Query(() => [ReservationEntity])
  async getReservations() {
    return this.reservationService.getReservations();
  }

  @Query(() => ReservationEntity)
  async getReservation(@Args('_id') _id: string) {
    return this.reservationService.getReservation(_id);
  }

  @Mutation(() => ReservationEntity)
  async createReservation(
    @Args('createReservationDto') createReservationDto: CreateReservationDto,
  ) {
    return this.reservationService.create(createReservationDto);
  }

  @Mutation(() => String)
  async cancelReservation(@Args('_id') _id: string) {
    return this.reservationService.cancelReservation(_id);
  }
}
