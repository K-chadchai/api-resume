export class Api {
  module: string;
  constructor(module: string) {
    this.module = module;
  }
  url(host: string, route = '', version = 'v1') {
    return `${host}/${version}/${this.module}${route ? `/${route}` : ''}`;
  }
}

// export const routeApiAuth = {
//   url: (host: string, route = '', query?: object) => url(host, 'v1', 'auth', route, query),
//   login: 'login',
//   loginToken: 'loginToken',
//   logout: 'logout',
//   jwtValidate: 'jwtValidate',
//   killUser: 'killUser',
//   payload: 'payload',
//   userRoles: 'userRoles',
//   moduleEnabled: 'moduleEnabled',
// };
