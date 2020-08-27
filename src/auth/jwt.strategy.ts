/* eslint-disable @typescript-eslint/camelcase */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtConstant, TokenDto } from '@libs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtConstant.SECRET_KEY,
    });
  }

  async validate(token: TokenDto) {
    return await this.authService.jwtValidate(token);
  }
}
