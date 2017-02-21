/* eslint no-param-reassign: ["error", { "props": false }]*/
import Vue from 'vue';
import VueResource from 'vue-resource';
import VueCookie from 'vue-cookie';
import _ from 'lodash/core';
import Cache from './cache';
import { VueSuccesStatus, ServerSuccessStatus, ServerInvalidToken } from './httpstatus';

Vue.use(VueResource);
Vue.use(VueCookie);
Vue.config.debug = false;
Vue.http.options.xhr = { withCredentials: true, crossDomain: true };

let router;

const QueryString = (() => {
  const queryString = {};
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (typeof queryString[pair[0]] === 'undefined') {
      queryString[pair[0]] = decodeURIComponent(pair[1]);
    } else if (typeof queryString[pair[0]] === 'string') {
      const arr = [queryString[pair[0]], decodeURIComponent(pair[1])];
      queryString[pair[0]] = arr;
    } else {
      queryString[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
  return queryString;
})();

const clearCookie = () => {
  const options = { path: '/' };
  Vue.cookie.delete('xtAccessToken', options);
  Vue.cookie.delete('xtCompanyId', options);
};

const handleUnAuthorized = () => {
  if (router) {
    clearCookie();
    router.replace('/login');
  }
};

const environment = {
  isDevelopment: () => {
    const devIP = '192.168.2.181';
    // return false;
    return window.location.href.indexOf('localhost') >= 0 || window.location.href.indexOf(devIP) >= 0;
  },
  isDebug: () => Vue.config.debug,
};

const getHeaders = () => ({ token: Vue.cookie.get('xtAccessToken') });

// check access token
Vue.http.interceptors.push((request, next) => {
	// for unanonymous interface, check cookie.
  let headers;
  if (request.params.authType === 'anonymous') {
    delete request.params.authType;
  } else {
    headers = getHeaders();
    if (headers && headers.token) {
      _.each(headers, (v, k) => {
        request.headers.set(k, v);
      });
    } else {
      handleUnAuthorized();
    }
  }

	// check if token is invalid
  next((response) => {
    const { status, body } = response;
    if (status === VueSuccesStatus.status && body.status === ServerInvalidToken.status) {
      handleUnAuthorized.call(this, request);
      return;
    }
  });
});

function getApiServer() {
  let _apiServer = QueryString.api_server;
  if (_.isEmpty(_apiServer)) {
    if (environment.isDevelopment()) {
      _apiServer = 'http://192.168.2.181';
    } else {
      _apiServer = 'https://xiaojing.linkface.cn';
    }
  }
  return _apiServer;
}

const getUrl = (url) => {
  const apiServer = getApiServer();
  return `${apiServer}${url}`;
};

function getCacheKey(request) {
  const paramsString = _.map(request.params, (v, k) => `${k}=${v}`);
  return `Cache_${request.url}?${paramsString.join('&')}`;
}

// add interceptor used to cache put request result
Vue.http.interceptors.push((request, next) => {
  request.url = getUrl(request.url);

  if (request.method.toLowerCase() === 'get') {
    const cache = Cache.get(getCacheKey(request));
    if (cache) {
      next(request.respondWith(Object.assign({}, cache), VueSuccesStatus));
      return;			
    }
  }

  next((response) => {
    const { status, body } = response;
    if (status === VueSuccesStatus.status && request.method.toLowerCase() === 'get' && body.status === ServerSuccessStatus.status) {
      Cache.set(getCacheKey(request), body.result);
    }
  });
});

// unwrap body data
Vue.http.interceptors.push((request, next) => {
  next((response) => {
    const { status, body } = response;
    if (status === VueSuccesStatus.status && body.status === ServerSuccessStatus.status) {
      response.body = body.result;
    }
  });
});

export const syncRouter = (r) => {
  router = r;
};

export const VueHttp = Vue.http;

export const ENV = environment;

export const SocketUrl = () => {
  if (environment.isDevelopment()) {
    return 'ws://192.168.2.181:7000/websocket';
  } 
  return 'wss://xiaojing.linkface.cn/websocket';
};

export const keepAlive = (companyId, token) => {
  const options = {
    expires: '1M',
    path: '/',
  };
  Vue.cookie.set('xtCompanyId', companyId, options);
  Vue.cookie.set('xtAccessToken', token, options);
};

export const isAlive = () => !!Vue.cookie.get('xtAccessToken', { path: '/' });

export const tryAlive = () => {
  const cb = () => {
    if (/^\/page.*$/.test(window.location.pathname)) {
      router.push(window.location.pathname);
    } else {
      router.push('/page');
    }
  };
  if (environment.isDebug()) {
    return Promise.resolve({
      cb,
    });
  }
  const companyId = Vue.cookie.get('xtCompanyId');
  const token = Vue.cookie.get('xtAccessToken');
  if (companyId && token) {
    return Promise.resolve({
      companyId,
      token,
      cb,
    });
  } 
  handleUnAuthorized();
  return Promise.reject();
};
 
export const logout = () => {
  clearCookie();
  router.replace('/login');
};

export const NetworkUtils = {
  getUrl,
  getHeaders,
  handleUnAuthorized,
  logout,
  SocketUrl,
};

export default VueHttp;
