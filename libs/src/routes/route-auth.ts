export const routeAuth = {
  getUrl: (host: string, route: string, version = 'v1') => `${host}/${version}/auth/${route}`,
  login: 'login',
  logout: 'logout',
  jwtValidate: 'jwt-validate',
  killUser: 'kill-user',
  payload: 'payload',
  userRoles: 'user-roles',
};
