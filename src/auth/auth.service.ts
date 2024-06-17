import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { pbkdf2, randomBytes } from 'node:crypto';
import { promisify } from 'node:util';
import { CreateUserDto } from 'src/user/dto/create-user-dto';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { AuthResponseDto } from './dto/auth-response-dto';
import { LoginUserDto } from './dto/login-user-dto';

const pbkdf2Promise = promisify(pbkdf2);
const KEY_LENGTH = 32;
const DIGEST = 'sha512';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(user: CreateUserDto) {
    // See if email is in use
    const users = await this.userService.find(user.email);
    // If email is in use, throw an error
    if (users.length) {
      throw new BadRequestException('User already exists! Try another email!');
    }
    // If email is not in use, hash the password
    const hashedPassword = await this.generatePassword(user.password);
    // Create a new user and save it
    return await this.userService.create({ ...user, password: hashedPassword });
  }

  async signIn(loginUser: LoginUserDto): Promise<AuthResponseDto> {
    const [user] = await this.userService.find(loginUser.email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const isValidPassword = await this.comparePassword(
      user.password,
      loginUser.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException();
    }

    return this.generateToken(user);
  }

  // We could use the bcrypt library to hash the password (Which is more secure), but we are using the built-in Node.js crypto module
  async generatePassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const ITERATIONS = 10000;

    const hash = await pbkdf2Promise(
      password,
      salt,
      ITERATIONS,
      KEY_LENGTH,
      DIGEST,
    );

    return `${ITERATIONS}.${salt}.${hash.toString('hex')}`;
  }

  async comparePassword(storedPassword: string, suppliedPassword: string) {
    const [iterations, salt, hashedPassword] = storedPassword.split('.');
    const hash = await pbkdf2Promise(
      suppliedPassword,
      salt,
      +iterations,
      KEY_LENGTH,
      DIGEST,
    );
    return hash.toString('hex') === hashedPassword;
  }

  generateToken(user: User) {
    return {
      accessToken: this.jwtService.sign({ email: user.email, sub: user._id }),
    };
  }
}
