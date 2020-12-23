const queryString = (query) => {
  return Object.keys(query)
    .map((key) => key + '=' + query[key])
    .join('&');
};

export const url = (host: string, version: string, module: string, route = '', query: object) =>
  `${host}/${version}/${module}${route ? `/${route}` : ''}${query ? `?${queryString(query)}` : ''}`;
