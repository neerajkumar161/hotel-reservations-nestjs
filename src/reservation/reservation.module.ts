import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationResolver } from './reservation.resolver';

@Module({
  providers: [ReservationService, ReservationResolver]
})
export class ReservationModule {}
