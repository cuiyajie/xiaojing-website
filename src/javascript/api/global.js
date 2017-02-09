/* eslint no-param-reassign: ["error", { "props": false }]*/
import Vue from 'vue';
import VueResource from 'vue-resource';
import VueCookie from 'vue-cookie';
import _ from 'lodash/core';
import _object from 'lodash/fp/object';
import Cache from './cache';
import { VueSuccesStatus, VueUnAuthorizedStatus, ServerSuccessStatus, ServerInvalidToken } from './httpstatus';

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

function handleUnAuthorized(request) {
  request.respondWith({}, VueUnAuthorizedStatus);
}

const environment = {
  isDevelopment: () => {
    const devIP = '192.168.2.181';
    return window.location.href.indexOf('localhost') >= 0 || window.location.href.indexOf(devIP) >= 0;
  },
};

// check access token
Vue.http.interceptors.push((request, next) => {
	// for unanonymous interface, check cookie.
  if (Vue.config.debug) {
    request.headers.set('token', 'b3A4mdXeWP7yyT8Ss4N42tSA');
  } else if (request.params.authType !== 'anonymous') {
    const token = Vue.cookie.get('xtAccessToken');
    if (token) {
      request.headers.set('token', token);
    } else {
      handleUnAuthorized.call(this, request);
      return;
    }
  } else {
    delete request.params.authType;
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

// get http request domain
Vue.http.interceptors.push((request, next) => {
  const apiServer = getApiServer();
  request.url = `${apiServer}${request.url}`;
  next();
});

// add interceptor used to cache put request result
Vue.http.interceptors.push((request, next) => {
  if (request.method.toLowerCase() === 'get') {
    const cache = Cache.get(`Cache_${request.url}`);
    if (cache) {
      next(request.respondWith(_object.assignIn(cache, ServerSuccessStatus), VueSuccesStatus));
      return;			
    }
  }

  next((response) => {
    const { status, body } = response;
    if (status === VueSuccesStatus.status && request.method.toLowerCase() === 'get' && body.status === ServerSuccessStatus.status) {
      Cache.set(`Cache_${request.url}`, body.result);
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

export default VueHttp;
