import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../user/dto/create-user-dto';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

const mockUser: CreateUserDto = {
  name: 'Test User',
  email: 'test@test.com',
  phoneNumber: '+911234567890',
  password: 'tester',
};
const mockTokenResponse = {
  accessToken: 'secretToken',
};

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: Partial<AuthService> = {
    signUp: jest.fn().mockResolvedValueOnce(Promise.resolve(mockUser)),
    signIn: jest.fn().mockResolvedValueOnce(Promise.resolve(mockTokenResponse)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: AuthService, useValue: authService },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should signUp user', async () => {
    const user = await resolver.signUp(mockUser);
    expect(resolver).toBeDefined();
    expect(user).toEqual(mockUser);
  });

  it('should signUp user and throw error for already existed user', () => {
    authService.signUp = jest
      .fn()
      .mockRejectedValueOnce(
        new Error('User already exists! Try another email!'),
      );
    expect(resolver.signUp(mockUser)).rejects.toThrow(
      'User already exists! Try another email!',
    );
  });

  it('should signIn user', async () => {
    const response = await resolver.signIn(mockUser);
    expect(response).toEqual(mockTokenResponse);
  });

  it('should signIn user and throw error for invalid user', () => {
    authService.signIn = jest
      .fn()
      .mockRejectedValueOnce(new UnauthorizedException());
    expect(resolver.signIn(mockUser)).rejects.toThrow(UnauthorizedException);
  });
});
