import { VueHttp, ENV, keepAlive } from './global';
import urls from './api-list';

export function login(cid, tkn) {
  let companyId = cid;
  let token = tkn;
  if (ENV.isDebug()) {
    if (ENV.isDevelopment()) {
      companyId = 3;
      token = 'CxbqBN8iEQXhQ5mJsME6U7m7';
    } else {
      companyId = 4;
      token = 'sSFizNEEtNxDGwSd6sQN8WcA';
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
