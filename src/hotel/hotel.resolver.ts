import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { CreateHotelDto } from './dto/create-hotel-dto';
import { UpdateHotelDto } from './dto/update-hotel-dto';
import { HotelEntity } from './entities/hotel.entity';
import { HotelService } from './hotel.service';

@Resolver('Hotel')
export class HotelResolver {
  constructor(private hotelService: HotelService){}

  @Query(() => HotelEntity)
  async getHotel(@Args('_id') _id: string) {
    return this.hotelService.findById(_id);
  }

  // Need Pagination in GetAll Hotels, but not in User and Hotel Resolver
  @Query(() => [HotelEntity])
  async getHotels() {
    return this.hotelService.getHotels();
  }

  @Mutation(() => HotelEntity)
  async createHotel(@Args('createHotelDto') hotel: CreateHotelDto) {
    return this.hotelService.create(hotel);
  }

  @Mutation(() => HotelEntity)
  async updateHotel(@Args('_id') _id: string, @Args('updateHotelDto') attrs: UpdateHotelDto) {
    return this.hotelService.updateHotel(_id, attrs);
  }

  @Mutation(() => HotelEntity)
  async deleteHotel(@Args('_id') _id: string) {
    return this.hotelService.deleteHotel(_id);
  }
}
