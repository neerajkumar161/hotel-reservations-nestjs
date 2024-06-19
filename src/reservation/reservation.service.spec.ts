import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { HotelService } from '../hotel/hotel.service';
import { Hotel } from '../hotel/schemas/hotel.schema';
import { ReservationService } from './reservation.service';
import { Reservation } from './schemas/reservation.schema';

const mockObjectId = new Types.ObjectId() as unknown as string;

const mockReservation: Reservation = {
  _id: '1',
  hotelId: mockObjectId,
  userId: '1',
  amount: 100,
  status: 'active',
  arrivalDate: new Date('2024-06-15'),
  departureDate: new Date('2024-06-17'),
};

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

describe('ReservationService', () => {
  let service: ReservationService;
  let hotelService: Partial<HotelService> = {
    findById: jest.fn().mockResolvedValueOnce(mockHotel),
  };

  let chainableMock = {
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValueOnce([mockReservation]),
  };

  let reservationModel: Partial<Model<Reservation>> = {
    create: jest.fn().mockResolvedValue(mockReservation),
    find: jest.fn().mockReturnValue(chainableMock),
    findOne: jest.fn().mockResolvedValueOnce(mockReservation),
    findOneAndUpdate: jest.fn().mockResolvedValueOnce(mockReservation),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        { provide: HotelService, useValue: hotelService },
        {
          provide: getModelToken(Reservation.name),
          useValue: reservationModel,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
  });

  it('should create the reservation', async () => {
    const reservation = await service.create(mockObjectId, mockReservation);
    expect(reservation).toEqual(mockReservation);
  });

  it('should create the reservation but throw an error when hotel not found', () => {
    jest
      .spyOn(service, 'create')
      .mockRejectedValueOnce(new NotFoundException('Hotel not found'));
    expect(service.create(mockObjectId, mockReservation)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should create the reservation but throw an error when arrivalDate and Departure date for reservation already exists', () => {
    jest
      .spyOn(service, 'create')
      .mockRejectedValueOnce(new BadRequestException('Hotel not found'));
    expect(service.create(mockObjectId, mockReservation)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should get reservations', async () => {
    const response = await service.getReservations({ limit: 10 });
    expect(response.reservations.length).toBe(1);
    expect(response.nextCursor).toBe(null);
  });

  it('should get reservation', async () => {
    const response = await service.getReservation('1');
    expect(response).toEqual(mockReservation);
  });

  it('should cancel the reservation', async () => {
    const response = await service.cancelReservation('1');
    expect(response).toBe('Reservation cancelled');
  });

  it('should throw an error when reservation not found', () => {
    jest
      .spyOn(service, 'cancelReservation')
      .mockRejectedValueOnce(new NotFoundException('Reservation not found'));
    expect(service.cancelReservation('1')).rejects.toThrow(NotFoundException);
  });
});
