/* eslint no-param-reassign: ["error", { "props": false }]*/
import Vue from 'vue';
import VueResource from 'vue-resource';
import VueCookie from 'vue-cookie';
import _ from 'lodash/core';
import _object from 'lodash/fp/object';
import Cache from './cache';
import { VueSuccesStatus, ServerSuccessStatus, ServerInvalidToken } from './httpstatus';

Vue.use(VueResource);
Vue.use(VueCookie);
Vue.config.debug = true;
Vue.http.options.xhr = { withCredentials: true, crossDomain: true };

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

const handleUnAuthorized = () => {

};

const environment = {
  isDevelopment: () => {
    const devIP = '192.168.2.181';
    return window.location.href.indexOf('localhost') >= 0 || window.location.href.indexOf(devIP) >= 0;
  },
};

const getHeaders = (isDebug) => {
  if (isDebug) {
    return { token: 'b3A4mdXeWP7yyT8Ss4N42tSA' };
  } 
  const token = Vue.cookie.get('xtAccessToken');
  if (token) {
    return { token };
  } 
  return null;
};

// check access token
Vue.http.interceptors.push((request, next) => {
	// for unanonymous interface, check cookie.
  let headers; 
  if (Vue.config.debug) {
    headers = getHeaders(true);
  } else if (request.params.authType !== 'anonymous') {
    headers = getHeaders();
  } else {
    delete request.params.authType;
  }
  if (headers && headers.token) {
    _.each(headers, (v, k) => {
      request.headers.set(k, v);
    });
  } else {
    handleUnAuthorized();
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
      _apiServer = '';
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
      next(request.respondWith(_object.assign({}, cache), VueSuccesStatus));
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

export const VueHttp = Vue.http;

export const ENV = environment;

export const HttpUtils = {
  getUrl,
  getHeaders,
  handleUnAuthorized,
};

export default VueHttp;
