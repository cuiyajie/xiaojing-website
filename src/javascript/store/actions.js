import * as types from './mutation-types';
import api from '../api';

export const autoLogin = ({ commit }, { companyId, token, cb }) => {
  api.login(companyId, token).then(({ body }) => {
    commit(types.AUTO_LOGIN, {
      user: body.user || {},
      company: body.company || {},
    });
    if (cb) {
      cb();
    }
  }, () => {});
};

export const fetchDepartments = ({ commit }, companyId) => {
  api.fetchDepartments(companyId).then(({ body }) => {
    commit(types.FETCH_DEPARTMENTS, body.departments);
  });
};

export const updateCompany = ({ commit }, updatedField) => {
  commit(types.UPDATE_COMPANY, updatedField);
};

export const createDepartment = ({ commit }, newDepartment) => {
  commit(types.CREATE_DEPARTMENT, newDepartment);
};

export const updateDepartment = ({ commit }, newDepartment) => {
  commit(types.UPDATE_DEPARTMENT, newDepartment);
};

export const deleteDepartment = ({ commit }, departmentId) => {
  commit(types.DELETE_DEPARTMENT, departmentId);
};

export const fetchAreas = ({ commit }, cb) => {
  api.fetchAreas().then(({ body }) => {
    commit(types.FETCH_AREAS, body);
    if (cb) {
      cb();
    }
  }); 
};

export const fetchAddress = ({ commit, state }, { perpage = 10, current = 1 }) => {
  commit(types.FETCH_ADDRESS, {
    perpage, 
    current,
  });
};

export const createAddress = ({ commit }, newAddress) => {
  commit(types.CREATE_ADDRESS, newAddress);
};

export const updateAddress = ({ commit }, newAddress) => {
  commit(types.UPDATE_ADDRESS, newAddress);
};

export const deleteAddress = ({ commit }, addressId) => {
  commit(types.DELETE_ADDRESS, addressId);
};

export default autoLogin;
