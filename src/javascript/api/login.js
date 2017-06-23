import { VueHttp, ENV, keepAlive } from './global';
import urls from './api-list';

export function login(cid, tkn) {
  let companyId = cid;
  let token = tkn;
  if (ENV.isDebug()) {
    if (ENV.isDevelopment()) {// eslint-disable-line
      
    } else {
      companyId = 1;
      token = 'P6skSFEHgVpzne5dMHrdgk4d';
    }
  }
  keepAlive(companyId, token);
  return VueHttp.post(urls.URL_AUTO_LOGIN, {
    company_id: companyId,
  });
}

export function fetchLoginCode() {
  return VueHttp.get(urls.URL_FETCH_LOGIN_CODE, {
    params: {
      authType: 'anonymous',
    },
  });
}

export default login;
