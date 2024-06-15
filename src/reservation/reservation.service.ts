import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HotelService } from 'src/hotel/hotel.service';
import { CreateReservationDto } from './dto/create-reservation-dto';
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

    reservation.amount = hotel.baseAmount * hotel.taxAmount;

    const createdReservation = await this.reservationModel.create(reservation);
    return createdReservation;
  }

  async getReservations() {
    const reservations = await this.reservationModel
      .find()
      // We will use dataloader instead of populate
      .populate({
        path: 'hotelId',
        select: 'name',
      })
      .populate({ path: 'userId', select: 'name' });
    return reservations;
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
