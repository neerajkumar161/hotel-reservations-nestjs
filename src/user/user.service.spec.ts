import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { Reservation } from '../reservation/schemas/reservation.schema';
import { GetStaysDto } from './dto/past-stays-dto';
import { StaySummary } from './entities/stay-summary.entity';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';

const mockObjectId = new Types.ObjectId() as unknown as string;

const mockUser: User = {
  _id: '1',
  name: 'Test User',
  email: 'test@test.com',
  phoneNumber: '+911234567890',
  password: 'tester',
};

const mockUserStaySummary: StaySummary = {
  guestId: '1',
  upcomingStaysCount: 1,
  upComingTotalNights: 2,
  pastStaysCount: 1,
  pastTotalNights: 2,
  cancelledStaysCount: 1,
  pastTotalAmount: 100,
  totalStaysAmount: 100,
  upComingTotalAmount: 100,
};

const mockPastStayArgs: GetStaysDto = {
  cursor: '1',
  limit: 10,
  startDate: new Date('2024-06-15'),
  endDate: new Date('2024-06-17'),
};

const mockReservation: Reservation = {
  _id: '1',
  hotelId: '1',
  userId: '1',
  amount: 100,
  status: 'active',
  arrivalDate: new Date('2024-06-15'),
  departureDate: new Date('2024-06-17'),
};

describe('UserService', () => {
  let service: UserService;
  let chainableMock = {
    exec: jest.fn().mockResolvedValue([mockUser]),
  };

  let userModel: Partial<Model<User>> = {
    create: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn().mockReturnValue(chainableMock),
    findOne: jest.fn().mockResolvedValue(mockUser),
    findOneAndUpdate: jest
      .fn()
      .mockImplementation((_id: string, attrs: Partial<User>) => ({
        ...mockUser,
        ...attrs,
      })),
    findOneAndDelete: jest.fn().mockResolvedValue(mockUser),
  };

  let reservationModel: Partial<Model<Reservation>> = {
    find: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue([]),
      }),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
        {
          provide: getModelToken(Reservation.name),
          useValue: reservationModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should call create method and return user', async () => {
    const response = await service.create(mockUser);
    expect(response).toEqual(mockUser);
  });

  it('should call getUsers method and return users', async () => {
    const response = await service.getUsers();
    expect(response).toEqual([mockUser]);
  });

  it('should call getUserStaySummary', async () => {
    jest
      .spyOn(service, 'getUserStaySummary')
      .mockResolvedValueOnce(mockUserStaySummary);
    const response = await service.getUserStaySummary('1');
    expect(response).toEqual(mockUserStaySummary);
  });

  it('should call getPastStays and return past stays', async () => {
    jest.spyOn(reservationModel, 'find').mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce([mockReservation]),
    } as any);

    const response = await service.getPastStays(mockPastStayArgs, mockObjectId);
    expect(response.reservations.length).toBe(1);
    expect(response.nextCursor).toBe(null);
    expect(response.reservations[0]).toEqual(mockReservation);
  });

  it('should call findOne and return user', async () => {
    const response = await service.findOne('1');
    expect(response).toEqual(mockUser);
  });

  it('should call find and return users', async () => {
    const response = await service.find('test@test.com').exec();
    expect(response).toEqual([mockUser]);
  });

  it('should call findOne and throws error', async () => {
    jest
      .spyOn(service, 'findOne')
      .mockRejectedValueOnce(new NotFoundException('User not found'));
    expect(service.findOne('2')).rejects.toThrow(NotFoundException);
  });

  it('should call update and return updated user', async () => {
    const response = await service.update('1', { name: 'Updated User' });
    expect(response.name).toBe('Updated User');
    expect(response.email).toBe(mockUser.email);
    expect(response.phoneNumber).toBe(mockUser.phoneNumber);
  });

  it('should call update and throws error', async () => {
    jest
      .spyOn(service, 'update')
      .mockRejectedValueOnce(new NotFoundException('User not found'));
    expect(service.update('2', { name: mockUser.name })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should call remove and return deleted user', async () => {
    const response = await service.remove('1');
    expect(response).toEqual(mockUser);
  });
});
