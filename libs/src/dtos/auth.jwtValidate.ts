import { TokenDto } from './token.dto';
export class AuthJwtValidateBody {
  token: TokenDto;
}

export class AuthJwtValidate extends TokenDto {}
