import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateHotelDto } from './dto/create-hotel-dto';
import { UpdateHotelDto } from './dto/update-hotel-dto';
import { Hotel } from './schemas/hotel.schema';

@Injectable()
export class HotelService {
  constructor(@InjectModel(Hotel.name) private hotelModel: Model<Hotel>) {}

  async create(hotel: CreateHotelDto): Promise<Hotel> {
    const createdHotel = await this.hotelModel.create(hotel);
    return createdHotel;
  }

  getHotels(): Promise<Hotel[]> {
    return this.hotelModel.find().exec();
  }

  async findById(_id: string): Promise<Hotel> {
    const hotel = await this.hotelModel.findOne({ _id: _id });
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return hotel;
  }

  deleteHotel(_id: string): Promise<Hotel> {
    const hotel = this.hotelModel.findOneAndDelete({ _id });
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return hotel;
  }

  updateHotel(_id: string, attrs: UpdateHotelDto): Promise<Hotel> {
    const updatedHotel = this.hotelModel.findOneAndUpdate({ _id }, attrs, {
      new: true,
    });
    if (!updatedHotel) {
      throw new NotFoundException('Hotel not found');
    }

    return updatedHotel;
  }
}
