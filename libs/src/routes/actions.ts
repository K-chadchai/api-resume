import { getRoute } from '@newsolution/api-common';

export const routeApiActions = {
  url: (host: string, route = '', query?: object) => getRoute(host, 'v1', 'actions', route, query),
  // ----------- Actions -----------
  // ----------- Actions -----------
};
