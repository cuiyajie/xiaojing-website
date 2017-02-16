import { VueHttp } from './global';
import urls from './api-list';

export function fetchAllStaffs(companyId, lastUserId, count) {
  return VueHttp.get(urls.URL_FETCH_ALL_STAFFS, {
    params: {
      company_id: companyId,
      last_user_id: lastUserId,
      count,
    },
  });
}

export function fetchConditionalStaffs(companyId, queryString, count) {
  const queryCount = count || 10;
  const query = {};
  if (/^\d+$/.test(queryString)) {
    query.tel = queryString;  
  } else {
    query.name = queryString;
  }
  return VueHttp.get(urls.URL_FETCH_STAFFS, {
    params: {
      company_id: companyId,
      ...query,
      count: queryCount,
    },
  });
}
