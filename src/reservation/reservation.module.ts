import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelModule } from 'src/hotel/hotel.module';
import { ReservationResolver } from './reservation.resolver';
import { ReservationService } from './reservation.service';
import { Reservation, ReservationSchema } from './schemas/reservation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Reservation.name,
        schema: ReservationSchema,
      },
    ]),
    HotelModule
  ],
  providers: [ReservationService, ReservationResolver],
})
export class ReservationModule {}
