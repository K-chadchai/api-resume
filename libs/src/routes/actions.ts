import { url } from './_url';

export const routeApiActions = {
  url: (host: string, route = '', query?: object) => url(host, 'v1', 'actions', route, query),
  // -----
  // -----
};
