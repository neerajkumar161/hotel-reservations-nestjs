import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TCurrentUser } from 'src/common/types/current-user';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // This method, will set context.req.user object
  async validate(payload: Record<string, string>): Promise<TCurrentUser> {
    return { userId: payload.sub, email: payload.email };
  }
}
