export class Api {
  module: string;
  constructor(module: string) {
    this.module = module;
  }
  url(host: string, route = '', version = 'v1') {
    return `${host}/${version}/${this.module}${route ? `/${route}` : ''}`;
  }
}
