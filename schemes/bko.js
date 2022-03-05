import { nanoid } from 'nanoid';
import { RefreshScheme } from '~auth/runtime';

const parseQuery = (queryString) => {
  const query = {};
  const pairs = queryString.split('&');
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
};

const encodeQuery = (queryObject) => {
  return Object.entries(queryObject)
    .filter(([_key, value]) => typeof value !== 'undefined')
    .map(
      ([key, value]) =>
        encodeURIComponent(key) +
        (value != null ? '=' + encodeURIComponent(value) : '')
    )
    .join('&');
};

const normalizePath = (path = '', ctx) => {
  let result = path.split('?')[0];

  // Remove base path
  if (ctx && ctx.base) {
    result = result.replace(ctx.base, '/');
  }

  // Remove redundant / from the end of path
  if (result.charAt(result.length - 1) === '/') {
    result = result.slice(0, -1);
  }

  // Remove duplicate slashes
  result = result.replace(/\/+/g, '/');

  return result;
};

const urlJoin = (...args) => {
  return args
    .join('/')
    .replace(/[/]+/g, '/')
    .replace(/^(.+):\//, '$1://')
    .replace(/^file:/, 'file:/')
    .replace(/\/(\?|&|#[^!])/g, '$1')
    .replace(/\?/g, '&')
    .replace('&', '?');
};

const getProp = (holder, propName) => {
  if (!propName || !holder || typeof holder !== 'object') {
    return holder;
  }

  if (propName in holder) {
    return holder[propName];
  }

  const propParts = Array.isArray(propName)
    ? propName
    : (propName + '').split('.');

  let result = holder;
  while (propParts.length && result) {
    result = result[propParts.shift()];
  }

  return result;
};

export default class bkoLogin extends RefreshScheme {
  get redirectURI() {
    const basePath = this.$auth.ctx.base || '';
    const path = normalizePath(
      basePath + '/' + this.$auth.options.redirect.callback
    ); // Don't pass in context since we want the base path
    return this.options.redirectUri || urlJoin(requrl(this.req), path);
  }

  get scope() {
    return Array.isArray(this.options.scope)
      ? this.options.scope.join(' ')
      : this.options.scope;
  }

  async login(_opts) {
    this.$auth.reset({ resetInterceptor: false });

    const response = await this.$auth.request({
      url: '/auth/discord',
      method: 'get',
      baseURL: this.$auth.ctx.baseUrl,
    });

    const opts = {
      protocol: 'oauth2',
      response_type: 'code',
      grantType: 'authorization_code',
      client_id: this.options.clientId,
      redirectUri: this.redirectUri,
      scope: this.scope,
      state: response.data,
    };

    this.$auth.$storage.setUniversal(this.name + '.state', opts.state);

    const authorization_url = 'https://discord.com/api/oauth2/authorize';
    const url = authorization_url + '?' + encodeQuery(opts);

    window.location.replace(url);
  }

  async mounted() {
    super.mounted({
      tokenCallback: () => {
        if (this.options.autoLogout) {
          this.$auth.reset();
        }
      },
      refreshTokenCallback: () => this.$auth.reset(),
    });

    const { tokenExpired, refreshTokenExpired } = this.check(true);

    if (refreshTokenExpired || (tokenExpired && this.options.autoLogout)) {
      this.$auth.reset();
    }

    if (!this.requestHandler.interceptor) {
      this.requestHandler.initializeRequestInterceptor(
        this.options.endpoints.refresh.url
      );
    }

    if (!this.$auth.$state.loggedIn) {
      await this._handleCallback();
    }

    return this.$auth.fetchUserOnce();

    // const handled = await this._handleCallback();

    // if (!handled) {
    //   return this.$auth.fetchUserOnce();
    // }
  }

  async _handleCallback() {
    if (
      this.$auth.options.redirect &&
      normalizePath(this.$auth.ctx.route.path, this.$auth.ctx) !==
        normalizePath(this.$auth.options.redirect.callback, this.$auth.ctx)
    ) {
      return;
    }
    // Callback flow is not supported in server side
    if (process.server) {
      return;
    }

    const hash = parseQuery(this.$auth.ctx.route.hash.substr(1));
    const parsedQuery = Object.assign({}, this.$auth.ctx.route.query, hash);
    // accessToken/idToken
    let token = parsedQuery[this.options.token.property];
    // refresh token
    let refreshToken = '';

    if (this.options.refreshToken.property) {
      refreshToken = parsedQuery[this.options.refreshToken.property];
    }

    // Validate state
    const state = this.$auth.$storage.getUniversal(this.name + '.state');
    this.$auth.$storage.setUniversal(this.name + '.state', null);

    if (!parsedQuery.code) return;

    if (state && parsedQuery.state !== state) {
      return;
    }

    // -- Authorization Code Grant --
    const response = await this.$auth.request({
      method: 'post',
      url: 'auth/discord',
      baseURL: this.$auth.ctx.baseUrl,
      data: {
        code: parsedQuery.code,
        state: parsedQuery.state,
      },
    });

    token = getProp(response.data, this.options.token.property) || token;
    refreshToken =
      getProp(response.data, this.options.refreshToken.property) ||
      refreshToken;

    if (!token || !token.length) {
      return;
    }

    // Set token
    this.token.set(token);

    // Store refresh token
    if (refreshToken && refreshToken.length) {
      this.refreshToken.set(refreshToken);
    }
  }
}
