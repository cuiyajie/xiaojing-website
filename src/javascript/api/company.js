import { VueHttp } from './global';
import urls from './api-list';

export function updateCompany(companyID, updatedFields) {
  return VueHttp.post(urls.URL_UPDATE_COMPANY, {
    company_id: companyID,
    company: JSON.stringify(updatedFields),
  });
}

export default updateCompany;
