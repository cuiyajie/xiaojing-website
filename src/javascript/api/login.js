import { VueHttp, ENV, keepAlive } from './global';
import urls from './api-list';

export function login(cid, tkn) {
  let companyId = cid;
  let token = tkn;
  if (ENV.isDebug()) {
    if (ENV.isDevelopment()) {
      // companyId = 4;
      companyId = 28;
      // token = 'b3A4mdXeWP7yyT8Ss4N42tSA';
      token = 'L1yBSAYkCQWfh2XdcMrUP76N';
    } else {
      companyId = 14;
      token = 'rbxQgSpszpQHZ635NSkJDpB9';
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
