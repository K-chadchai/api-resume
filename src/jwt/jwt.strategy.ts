/* eslint-disable @typescript-eslint/camelcase */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtConstant, TokenDto, routeApiAuth } from '@newsolution/api-authen';
import axios from 'axios';
import { ComException } from '@newsolution/api-common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtConstant.SECRET_KEY,
    });
  }

  async validate(token: TokenDto): Promise<any> {
    // return await this.authService.jwtValidate(token);
    try {
      const response = await axios.post(
        routeApiAuth.url(process.env.API_AUTHEN_HOST, routeApiAuth.jwtValidate),
        { token },
        { headers: { 'api-validate-key': JwtConstant.VALIDATE_KEY } },
      );

      if (response.data) return response.data;
      throw new NotFoundException(`jwtValidate : Not found ,response.data`);
    } catch (err) {
      console.log(err);
      throw new ComException(err, 'jwtValidate Failure');
    }
  }
}
