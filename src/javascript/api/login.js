import { VueHttp } from './global';
import urls from './api-list';

export function loginDebug() {
  const companyId = 4;
  return VueHttp.post(urls.URL_AUTO_LOGIN, {
    company_id: companyId,
  });
}

export default loginDebug;
