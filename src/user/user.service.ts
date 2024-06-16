import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reservation } from 'src/reservation/schemas/reservation.schema';
import { StaySummary } from './entities/stay-summary.entity';
import { User } from './schemas/user.schema';

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Reservation.name) private reservationModel: Model<Reservation>,
  ) {}

  async create(user: User): Promise<User> {
    console.log(user);
    const createdUser = await this.userModel.create(user);
    return createdUser;
  }

  getUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  getUsersById(ids: Types.ObjectId[]): Promise<User[]> {
    return this.userModel.find({ _id: { $in: ids } }).exec();
  }

  async getUserStaySummary(userId: string): Promise<StaySummary> {
    const userReservations = await this.reservationModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate({
        path: 'hotelId',
      })
      .populate({
        path: 'userId',
      });

    console.log('UserReservations', userReservations);

    const upComingStays = userReservations.filter(
      (reservation) => reservation.arrivalDate > new Date(),
    );
  
    const pastStays = userReservations.filter(
      (reservation) => reservation.departureDate < new Date(),
    );
    const cancelledStays = userReservations.filter(
      (reservation) => reservation.status === 'cancelled',
    );

    console.log(upComingStays, pastStays, cancelledStays);
    return {
      guestId: userId,
      upcomingStaysCount: upComingStays.length,
      upComingTotalNights: upComingStays.reduce(
        (acc, stay) =>
          acc +
          (stay.departureDate.getTime() - stay.arrivalDate.getTime()) /
            MILLISECONDS_IN_A_DAY,
        0,
      ),
      upComingTotalAmount: upComingStays.reduce(
        (acc, stay) => acc + stay.amount,
        0,
      ), // Because we're storing sum of baseAmount and taxAmount in amount field
      pastStaysCount: pastStays.length,
      pastTotalNights: pastStays.reduce(
        (acc, stay) =>
          acc +
          (stay.departureDate.getTime() - stay.arrivalDate.getTime()) /
            MILLISECONDS_IN_A_DAY,
        0,
      ),
      pastTotalAmount: pastStays.reduce((acc, stay) => acc + stay.amount, 0),
      cancelledStaysCount: cancelledStays.length,
      totalStaysAmount: userReservations.reduce(
        (acc, stay) => acc + stay.amount,
        0,
      ),
    };
  }

  async getPastStays(userId: string, startDate: Date, endDate: Date) {
    console.log(typeof startDate, endDate);
    const pastStays = await this.reservationModel
      .find({
        userId: new Types.ObjectId(userId),
        departureDate: { $gte: startDate, $lte: endDate },
      })

      console.log('Past Stays', pastStays);

      return pastStays;
  }

  async findOne(_id: string) {
    const user = await this.userModel.findOne({ _id: _id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  find(email: string) {
    return this.userModel.find({ email });
  }

  async update(_id: string, attrs: Partial<User>) {
    const updatedUser = await this.userModel.findOneAndUpdate({ _id }, attrs, {
      new: true,
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async remove(_id: string) {
    const user = await this.userModel.findOneAndDelete({ _id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
