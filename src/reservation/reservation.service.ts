import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HotelService } from 'src/hotel/hotel.service';
import { CreateReservationDto } from './dto/create-reservation-dto';
import { PaginationDto } from './dto/pagination-dto';
import { Reservation } from './schemas/reservation.schema';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<Reservation>,
    private hotelService: HotelService,
  ) {}

  async create(reservation: CreateReservationDto) {
    const hotel = await this.hotelService.findById(
      reservation.hotelId as unknown as string,
    );
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    reservation.amount = hotel.baseAmount + hotel.taxAmount;

    const createdReservation = await this.reservationModel.create(reservation);
    return createdReservation;
  }

  async getReservations(
    args: PaginationDto,
  ): Promise<{ reservations: Reservation[]; nextCursor: string }> {
    const query = {};
    if (args.cursor) {
      query['_id'] = { $gt: args.cursor };
    }

    const reservations = await this.reservationModel
      .find(query)
      .sort({ _id: 1 })
      .limit(args.limit + 1)
      .exec();
    const hasNextPage = reservations.length > args.limit;
    const nextCursor = hasNextPage ? reservations[args.limit - 1]._id : null;

    const result = {
      reservations: hasNextPage
        ? reservations.slice(0, args.limit)
        : reservations,
      nextCursor,
    };

    console.log('GetReservations', result);
    return result;
  }

  async getUserReservations(userId: string) {
    return this.reservationModel
      .find({ userId })
      .populate({
        path: 'hotelId',
      })
      .populate({
        path: 'userId',
      });
    // return reservations;
  }

  getReservation(_id: string) {
    return this.reservationModel.findOne({ _id });
  }

  async cancelReservation(_id: string) {
    const reservation = await this.reservationModel.findOneAndUpdate(
      { _id },
      { status: 'cancelled' },
      { new: true },
    );

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return 'Reservation cancelled';
  }
}
