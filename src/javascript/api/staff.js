import _ from 'lodash/core';
import { VueHttp } from './global';
import urls from './api-list';

const FormData = window.FormData;

export function fetchAllStaffs(companyId, departmentId, lastUserId, count) {
  const params = {};
  params.company_id = companyId;
  if (departmentId) {
    params.department_id = departmentId;
  }
  params.last_user_id = lastUserId || 0;
  params.count = count || 10;

  return VueHttp.get(urls.URL_FETCH_ALL_STAFFS, {
    params,
  });
}

export function fetchAllAdmins(companyId) {
  return VueHttp.get(urls.URL_FETCH_ALL_ADMINS, {
    params: {
      company_id: companyId,
    },
  });
}

export function setAdmin(companyId, userId) {
  return VueHttp.post(urls.URL_SET_ADMIN, {
    company_id: companyId,
    user_ids: [userId],
  });
}

export function unsetAdmin(companyId, userId) {
  return VueHttp.post(urls.URL_UNSET_ADMIN, {
    company_id: companyId,
    user_id: userId,
  });
}

export function fetchConditionalStaffs(companyId, queryString, count) {
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
      count: count || 10,
    },
  });
}

export function importStaff(companyId, faceImage) {
  const formData = new FormData();
  formData.append('company_id', companyId);
  formData.append('face_image', faceImage);
  return VueHttp.post(urls.URL_STAFF_IMPORT, formData, {
    timeout: 20 * 1000,
  });
}

export function createStaff({ company_id, user, face_image }) {
  const fields = ['name', 'gender', 'tel', 'department_id', 'job_position', 'birthday', 'email', 'id_number'];
  const checkedUser = {};
  _.each(user, (v, k) => {
    if (v && fields.indexOf(k) !== -1) {
      checkedUser[k] = v;
    }
  });

  const formData = new FormData();
  formData.append('company_id', company_id);
  formData.append('user', JSON.stringify(checkedUser));
  formData.append('face_image', face_image);
  return VueHttp.post(urls.URL_STAFF_CREATE, formData);
}

export function updateStaff({ company_id, user }) {
  const fields = ['id', 'name', 'gender', 'tel', 'department_id', 'job_position', 'birthday', 'email', 'id_number'];
  const checkedUser = {};
  _.each(user, (v, k) => {
    if (v && fields.indexOf(k) !== -1) {
      checkedUser[k] = v;
    }
  });
  return VueHttp.post(urls.URL_STAFF_UPDATE, {
    company_id,
    user: JSON.stringify(checkedUser),
  }); 
}

export function batchUpdateDepartment(companyId, departmentId, userIds) {
  return VueHttp.post(urls.URL_STAFF_BTACH_UPDATE_DEPARTMENT, {
    company_id: companyId,
    department_id: departmentId,
    user_ids: userIds,
  });
}

export function deleteStaff(companyId, userId) {
  return VueHttp.post(urls.URL_STAFF_DELETE, {
    company_id: companyId,
    user_id: userId,
  });
}

export function quitStaff(companyId, userId) {
  return VueHttp.post(urls.URL_STAFF_QUIT, {
    company_id: companyId,
    user_id: userId,
  });
}

export default fetchAllStaffs;
