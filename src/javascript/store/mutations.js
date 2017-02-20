import { set } from 'vue';
import _ from 'lodash/core';
import _array from 'lodash/array';
import * as types from './mutation-types';

export default {
  [types.AUTO_LOGIN](state, { user, company }) {
    set(state.global, 'currentUser', user);
    set(state.global, 'currentCompany', company);
  },
  [types.UPDATE_COMPANY](state, updatedField) {
    set(state.global, 'currentCompany', Object.assign({}, state.global.currentCompany, updatedField));
  },
  [types.FETCH_DEPARTMENTS](state, departments) {
    set(state.global, 'departments', departments);
  },
  [types.CREATE_DEPARTMENT](state, department) {
    set(state.global, 'departments', state.global.departments.concat([department]));
  },
  [types.UPDATE_DEPARTMENT](state, department) {
    const mutation = _.map(state.global.departments, d => d.id === department.id ? department : d); // eslint-disable-line
    set(state.global, 'departments', mutation);
  },
  [types.DELETE_DEPARTMENT](state, departmentId) {
    const index = _array.findIndex(state.global.departments, d => d.id === departmentId);
    const departments = state.global.departments;
    set(state.global, 'departments', departments.slice(0, index).concat(departments.slice(index + 1)));
  },
};
