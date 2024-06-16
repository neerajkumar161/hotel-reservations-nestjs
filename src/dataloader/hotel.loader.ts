import { Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { Types } from 'mongoose';
import { HotelService } from 'src/hotel/hotel.service';
import { Hotel } from 'src/hotel/schemas/hotel.schema';

@Injectable({ scope: Scope.REQUEST })
export class HotelLoader {
  constructor(private hotelService: HotelService) {}

  public readonly batchHotel = new DataLoader<Types.ObjectId, Hotel>(
    async (hotelIds) => {
      const hotels = await this.hotelService.getHotelsById([...hotelIds]);
      const hotelMap = new Map(
        hotels.map((hotel) => [hotel._id.toString(), hotel]),
      );
      return hotelIds.map((id) => hotelMap.get(id.toString()));
    },
  );
}