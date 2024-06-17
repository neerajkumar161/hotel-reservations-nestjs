import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Hotel } from 'src/hotel/schemas/hotel.schema';
import { User } from 'src/user/schemas/user.schema';
import { HotelLoader } from '../dataloader/hotel.loader';
import { UserLoader } from '../dataloader/user.loader';
import { ReservationEntity } from './entities/reservation.entity';
import { ReservationResolver } from './reservation.resolver';
import { ReservationService } from './reservation.service';
import { Reservation } from './schemas/reservation.schema';

const mockReservation: Reservation =
  {
    _id: '1',
    hotelId: '1',
    userId: '1',
    amount: 100,
    status: 'active',
    arrivalDate: new Date('2024-06-15'),
    departureDate: new Date('2024-06-17'),
  }

const mockHotel: Hotel = {
  _id: '1',
  name: 'Test Hotel',
  email: 'testhotel@test.com',
  phoneNumber: '+911234567890',
  location: { lat: '223', long: '455' },
  rating: '5',
  baseAmount: 100,
  taxAmount: 10,
};

const mockUser: User = {
  _id: '1',
  name: 'Test User',
  email: 'test@test.com',
  phoneNumber: '+911234567890',
  password: 'tester',
};

describe('ReservationResolver', () => {
  let resolver: ReservationResolver;
  let reservationService: Partial<ReservationService> = {
    getReservations: jest.fn().mockResolvedValueOnce({
      reservations: [mockReservation],
      nextCursor: '1',
    }),
    getReservation: jest.fn().mockResolvedValueOnce(mockReservation),
    create: jest.fn().mockResolvedValueOnce(mockReservation),
    cancelReservation: jest
      .fn()
      .mockResolvedValueOnce('Reservation cancelled!'),
  };

  let mockHotelLoader: Partial<HotelLoader> = {};
  let mockUserLoader: Partial<UserLoader> = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationResolver,
        { provide: ReservationService, useValue: reservationService },
        { provide: HotelLoader, useValue: mockHotelLoader },
        { provide: UserLoader, useValue: mockUserLoader },
      ],
    }).compile();

    resolver = module.get<ReservationResolver>(ReservationResolver);
  });

  it('should get reservations', async () => {
    const response = await resolver.getReservations({ limit: 10 });
    expect(response.edges.length).toBe(1);
    expect(response.edges[0].node).toEqual(mockReservation);
    expect(response.nextCursor).toBe('1');
  });

  it('should get reservation', async () => {
    const response = await resolver.getReservation('1');
    expect(response).toEqual(mockReservation);
  });

  it('should create reservation', async () => {
    const response = await resolver.createReservation(
      {
        hotelId: '1',
        arrivalDate: new Date('2024-06-15'),
        departureDate: new Date('2024-06-17'),
        amount: 100,
      },
      { userId: '1', email: 'test@test.com' },
    );
    expect(response).toEqual(mockReservation);
  });

  it('should create reservation and throw error when hotel is not found', () => {
    jest
      .spyOn(resolver, 'createReservation')
      .mockRejectedValueOnce(new NotFoundException('Hotel not found'));
    expect(
      resolver.createReservation(
        {
          hotelId: '1',
          arrivalDate: new Date('2024-06-15'),
          departureDate: new Date('2024-06-17'),
          amount: 100,
        },
        { userId: '1', email: 'test@test.com' },
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should cancel the reservation', async () => {
    const response = await resolver.cancelReservation('1');
    expect(response).toBe('Reservation cancelled!');
  });

  it('should cancel the reservation and throw error when reservation is not found', () => {
    jest
      .spyOn(resolver, 'cancelReservation')
      .mockRejectedValueOnce(new NotFoundException('Reservation not found'));
    expect(resolver.cancelReservation('1')).rejects.toThrow(NotFoundException);
  });

  it('should return hotelId', async () => {
    jest.spyOn(resolver, 'hotelId').mockResolvedValueOnce(mockHotel);
    const response = await resolver.hotelId(
      mockReservation as any as ReservationEntity,
    );
    expect(response).toEqual(mockHotel);
  });

  it('should return userId', async () => {
    jest.spyOn(resolver, 'userId').mockResolvedValueOnce(mockUser);
    const response = await resolver.userId(
      mockReservation as any as ReservationEntity,
    );
    expect(response).toEqual(mockUser);
  });
});
