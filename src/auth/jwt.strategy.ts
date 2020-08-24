/* eslint-disable @typescript-eslint/camelcase */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { JWT_SECRET_KEY, IToken, ComSpec, JWT_VALIDATE_KEY } from '@nikom.san/api-common';
import axios from 'axios';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET_KEY,
    });
  }

  async validate(token: IToken) {
    // return await this.authService.jwtValidate(token);
    return await axios
      .post(
        `${process.env.API_AUTHEN_HOST}${ComSpec.authen.jwtValidate}`,
        { token },
        {
          headers: {
            'api-validate-key': JWT_VALIDATE_KEY,
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
