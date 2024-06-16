import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelLoader } from 'src/dataloader/hotel.loader';
import { UserLoader } from 'src/dataloader/user.loader';
import { HotelModule } from 'src/hotel/hotel.module';
import {
  Reservation,
  ReservationSchema,
} from 'src/reservation/schemas/reservation.schema';
import { User, UserSchema } from './schemas/user.schema';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    HotelModule
  ],
  providers: [UserResolver, UserService, HotelLoader, UserLoader],
  exports: [UserService],
})
export class UserModule {}
