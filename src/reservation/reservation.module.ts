import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelLoader } from 'src/dataloader/hotel.loader';
import { UserLoader } from 'src/dataloader/user.loader';
import { HotelModule } from 'src/hotel/hotel.module';
import { ReservationResolver } from './reservation.resolver';
import { ReservationService } from './reservation.service';
import { Reservation, ReservationSchema } from './schemas/reservation.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Reservation.name,
        schema: ReservationSchema,
      },
    ]),
    HotelModule,
    UserModule
  ],
  providers: [ReservationService, ReservationResolver, HotelLoader, UserLoader],
  exports: [ReservationService],
})
export class ReservationModule {}
