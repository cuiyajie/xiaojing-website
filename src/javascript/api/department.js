import { VueHttp } from './global';
import urls from './api-list';

export function fetchDepartments(companyId) {
  return VueHttp.get(urls.URL_FETCH_ALL_DEPARTMENTS, {
    params: {
      company_id: companyId,
    },
  });
}

export function createDepartment(companyId, fields) {
  return VueHttp.post(urls.URL_CREATE_DEPARTMENT, {
    company_id: companyId,
    department: JSON.stringify(fields),
  });
}

export function updateDepartment(companyId, fields) {
  return VueHttp.post(urls.URL_UPDATE_DEPARTMENT, {
    company_id: companyId,
    department: JSON.stringify(fields),
  });
}

export function deleteDepartment(companyId, departmentId) {
  return VueHttp.post(urls.URL_DELETE_DEPARTMENT, {
    company_id: companyId,
    department_id: departmentId,
  });
}

export default fetchDepartments;
