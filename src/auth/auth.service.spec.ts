import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../user/dto/create-user-dto';
import { UserService } from '../user/user.service';
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

describe('AuthService', () => {
  let service: AuthService;
  let authService: Partial<UserService> = {
    find: jest.fn().mockResolvedValue(Promise.resolve([mockUser])),
    create: jest.fn().mockResolvedValueOnce(Promise.resolve(mockTokenResponse)),
  };
  let jwtService: Partial<JwtService> = {
    sign: jest.fn().mockResolvedValueOnce(mockTokenResponse),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: authService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should signUp the user', async () => {
    jest.spyOn(authService, 'find').mockResolvedValueOnce([]);
    const response = await service.signUp(mockUser);
    expect(response).toEqual(mockTokenResponse);
  });

  it('should signUp the user and throw error for already existed user', () => {
    expect(service.signUp(mockUser)).rejects.toThrow(
      'User already exists! Try another email!',
    );
  });

  it('should signIn the user', async () => {
    jest.spyOn(service, 'comparePassword').mockResolvedValueOnce(true);
    const response = await service.signIn(mockUser);
    const accessToken = await response.accessToken;
    expect(accessToken).toEqual(mockTokenResponse);
  });

  it('should signIn the user and throw exception when email is not existed', async () => {
    jest.spyOn(authService, 'find').mockResolvedValueOnce([]);
    expect(service.signIn(mockUser)).rejects.toThrow(UnauthorizedException);
  });

  it('should signIin the user and throw error is password is invalide', () => {
    jest.spyOn(service, 'comparePassword').mockResolvedValueOnce(false);
    expect(service.signIn(mockUser)).rejects.toThrow(UnauthorizedException);
  });
});
