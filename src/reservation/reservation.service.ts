import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HotelService } from '../hotel/hotel.service';
import { CreateReservationDto } from './dto/create-reservation-dto';
import { PaginationDto } from './dto/pagination-dto';
import { UpdateReservationDto } from './dto/update-reservation-dto';
import { Reservation } from './schemas/reservation.schema';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<Reservation>,
    private hotelService: HotelService,
  ) {}

  async create(userId: string, reservation: CreateReservationDto) {
    const hotel = await this.hotelService.findById(
      reservation.hotelId,
    );
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // Find if there are any reservation for the same hotel and same arrival date
    const existingReservation = await this.reservationModel.find({
      hotelId: new Types.ObjectId(reservation.hotelId),
      arrivalDate: { $gte: reservation.arrivalDate },
      departureDate: { $lte: reservation.departureDate },
      userId: new Types.ObjectId(userId),
    });

    if (existingReservation.length) {
      throw new BadRequestException(
        'Reservation already exists for the same date',
      );
    }

    reservation.amount = hotel.baseAmount + hotel.taxAmount;

    const createdReservation = await this.reservationModel.create({
      ...reservation,
      userId: new Types.ObjectId(userId),
    });
    return createdReservation;
  }

  async updateReservation(id: string, userId: string, update: UpdateReservationDto) {
    if (update.arrivalDate && update.departureDate) {
      const existingReservation = await this.reservationModel.find({
        arrivalDate: { $gte: update.arrivalDate },
        departureDate: { $lte: update.departureDate },
        userId: new Types.ObjectId(userId),
      });

      if (existingReservation.length) {
        throw new BadRequestException(
          'Cannot update, Reservation already exists for the same date',
        );
      }
    }

    return this.reservationModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      update,
      { new: true },
    );
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
      .sort({ _id: -1 })
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

    return result;
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
