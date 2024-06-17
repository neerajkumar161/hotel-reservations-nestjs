import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelLoader } from '../dataloader/hotel.loader';
import { UserLoader } from '../dataloader/user.loader';
import { HotelModule } from '../hotel/hotel.module';
import {
  Reservation,
  ReservationSchema,
} from '../reservation/schemas/reservation.schema';
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
