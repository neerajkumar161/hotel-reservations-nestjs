import { Test, TestingModule } from '@nestjs/testing';
import { Hotel } from 'src/hotel/schemas/hotel.schema';
import { ReservationEntity } from 'src/reservation/entities/reservation.entity';
import { TPastStays } from 'src/reservation/types/past-stays';
import { TCurrentUser } from '../common/types/current-user';
import { HotelLoader } from '../dataloader/hotel.loader';
import { UserLoader } from '../dataloader/user.loader';
import { PastStaysDto } from './dto/past-stays-dto';
import { StaySummary } from './entities/stay-summary.entity';
import { User } from './schemas/user.schema';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

const mockCurrentUser: TCurrentUser = { userId: '1', email: 'test@test.com' };

const mockStaySummary: StaySummary = {
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

const mockPastStays: TPastStays = {
  reservations: [
    {
      _id: '1',
      hotelId: '1',
      userId: '1',
      amount: 100,
      status: 'active',
      arrivalDate: new Date('2024-06-15'),
      departureDate: new Date('2024-06-17'),
    },
  ],
  nextCursor: '1',
};

const mockPastStayArgs: PastStaysDto = {
  cursor: '1',
  limit: 10,
  startDate: new Date('2024-06-15'),
  endDate: new Date('2024-06-17'),
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

const mockUser: User = {
  _id: '1',
  name: 'Test User',
  email: 'test@test.com',
  phoneNumber: '+911234567890',
  password: 'tester',
};

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: Partial<UserService> = {
    getUserStaySummary: jest.fn().mockResolvedValue(mockStaySummary),
    getPastStays: jest.fn().mockResolvedValue(mockPastStays),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        { provide: UserService, useValue: userService },
        { provide: HotelLoader, useValue: {} },
        { provide: UserLoader, useValue: {} },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should get stay guestSummary', async () => {
    const response = await resolver.guestSummary(mockCurrentUser);
    expect(response).toEqual(mockStaySummary);
  });

  it('should get pastStays', async () => {
    const response = await resolver.getPastStays(
      mockPastStayArgs,
      mockCurrentUser,
    );
    expect(response.edges.length).toBe(1);
    expect(response.edges[0].node).toEqual(mockPastStays.reservations[0]);
    expect(response.nextCursor).toBe('1');
  });

  it('should return hotelId', async () => {
    jest.spyOn(resolver, 'hotelId').mockResolvedValueOnce(mockHotel);
    const response = await resolver.hotelId(
      mockPastStays.reservations[0] as any as ReservationEntity,
    );
    expect(response).toEqual(mockHotel);
  });

  it('should return userId', async () => {
    jest.spyOn(resolver, 'userId').mockResolvedValueOnce(mockUser);
    const response = await resolver.userId(
      mockPastStays.reservations[0] as any as ReservationEntity,
    );
    expect(response).toEqual(mockUser);
  });
});
