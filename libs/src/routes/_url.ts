const queryString = (query) => {
  return Object.keys(query)
    .map((key) => key + '=' + query[key])
    .join('&');
};

export const url = (host: string, version: string, module: string, route = '', query: object) =>
  `${host}/${version}/${module}${route ? `/${route}` : ''}${query ? `?${queryString(query)}` : ''}`;

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
