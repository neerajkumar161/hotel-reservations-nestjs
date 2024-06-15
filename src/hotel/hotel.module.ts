import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelResolver } from './hotel.resolver';
import { HotelService } from './hotel.service';
import { Hotel, HotelSchema } from './schemas/hotel.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
  ],
  providers: [HotelResolver, HotelService],
  exports: [HotelService],
})
export class HotelModule {}
