import { TokenDto } from '../dtos';

export const routeApiAuth = {
  getUrl: (host: string, route: string, version = 'v1') => `${host}/${version}/auth/${route}`,
  login: 'login',
  loginToken: 'login-token',
  logout: 'logout',
  jwtValidate: 'jwtValidate',
  killUser: 'killUser',
  payload: 'payload',
  userRoles: 'userRoles',
  moduleEnabled: 'moduleEnabled',
};

// login
export class RAuthLogin {
  token: string;
}
// logout
export class RAuthLogout {
  uuid: string;
  logout_time: Date;
}
// jwtValidate
export class BAuthJwtValidate {
  token: TokenDto;
}
export class RAuthJwtValidate extends TokenDto {}
// killUser
export class RAuthKillUser {
  rowsEffect: number;
}
// payload
export class RAuthPayload extends TokenDto {}
// userRoles
export class RAuthUserRoles {
  rolesActoins: { [key: string]: string[] };
  rolesCode: string[];
  actionsCode: string[];
}

export class BAuthModuleEnabled {
  EmployeeId: string;
  Platform: string;
}
export class RAuthModuleEnabled {
  ProgramKey: string;
  ProgramName: string;
  ProgramDescribe: string;
}
