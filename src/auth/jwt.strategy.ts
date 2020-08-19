import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as constants from 'src/app/app.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: constants.APP_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    const { userId, userName, uuid } = payload;
    return { userId, userName, uuid };
  }
}
