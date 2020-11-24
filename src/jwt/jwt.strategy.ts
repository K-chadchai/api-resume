/* eslint-disable @typescript-eslint/camelcase */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { JwtConstant, TokenDto, routeApiAuth } from '@newsolution/api-authen';
import axios from 'axios';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtConstant.SECRET_KEY,
    });
  }

  async validate(token: TokenDto) {
    // return await this.authService.jwtValidate(token);
    return axios
      .post(
        routeApiAuth.url(process.env.API_AUTHEN_HOST, routeApiAuth.jwtValidate),
        { token },
        {
          headers: {
            'api-validate-key': JwtConstant.VALIDATE_KEY,
          },
        },
      )
      .then((response) => {
        if (response.data) return response.data;
        throw new NotFoundException(`jwtValidate : Not found ,response.data`);
      })
      .catch((err) => {
        throw new InternalServerErrorException(`jwtValidate : API Error, ${err}`);
      });
  }
}
