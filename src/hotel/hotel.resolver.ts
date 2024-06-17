import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  Resolver
} from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';
import { CreateHotelDto } from './dto/create-hotel-dto';
import { UpdateHotelDto } from './dto/update-hotel-dto';
import { HotelEntity } from './entities/hotel.entity';
import { HotelService } from './hotel.service';

@Resolver('Hotel')
@UseGuards(GqlAuthGuard)
export class HotelResolver {
  constructor(private hotelService: HotelService) {}

  @Query(() => HotelEntity)
  async getHotel(@Args('_id') _id: string) {
    return this.hotelService.findById(_id);
  }

  @Query(() => [HotelEntity])
  async getHotels() {
    return this.hotelService.getHotels();
  }

  @Mutation(() => HotelEntity)
  async createHotel(@Args('createHotelDto') hotel: CreateHotelDto) {
    return this.hotelService.create(hotel);
  }

  @Mutation(() => HotelEntity)
  async updateHotel(
    @Args('_id') _id: string,
    @Args('updateHotelDto') attrs: UpdateHotelDto,
  ) {
    return this.hotelService.updateHotel(_id, attrs);
  }

  @Mutation(() => HotelEntity)
  async deleteHotel(@Args('_id') _id: string) {
    return this.hotelService.deleteHotel(_id);
  }
}
