import { set } from 'vue';
import _ from 'lodash/core';
import _array from 'lodash/array';
import * as types from './mutation-types';
import api from '../api';


function remarkDefault(store, addr) {
  if (addr.is_default) {
    _.each(store, (a) => {
      /* eslint no-param-reassign: ["off"]*/
      a.is_default = (a.id === addr.id);
    });
  }
}

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
  [types.FETCH_AREAS](state, areas) {
    set(state.global, 'areas', areas);
  },
  [types.FETCH_ADDRESS](state, { perpage, current }) {
    const stat = state.global;
    if (stat.addressTotal < 0 || (
        stat.addressStore.length < stat.addressTotal &&
        perpage * current > stat.addressStore.length)) {
      api.fetchAddresses(
        stat.currentCompany.id,
        stat.lastAddressId,
        perpage,
        )
      .then((res) => {
        set(stat, 'lastAddressId', res.body.last_address_id);
        set(stat, 'addressTotal', res.body.total);
        set(stat, 'addressStore', stat.addressStore.concat(res.body.addresses));
      }, () => { });
    }
  },
  [types.CREATE_ADDRESS](state, newAddress) {
    set(state.global, 'addressStore', state.global.addressStore.concat([newAddress]));
    set(state.global, 'addressTotal', ++state.global.addressTotal);
    remarkDefault(state.global.addressStore, newAddress);
  },
  [types.UPDATE_ADDRESS](state, newAddress) {
    const mutation = _.map(state.global.addressStore, a => a.id === newAddress.id ? newAddress : a); // eslint-disable-line
    set(state.global, 'addressStore', mutation);
    remarkDefault(state.global.addressStore, newAddress);
  },
  [types.DELETE_ADDRESS](state, addressId) {
    const index = _array.findIndex(state.global.addressStore, a => a.id === addressId);
    const addressStore = state.global.addressStore;
    set(state.global, 'addressStore', addressStore.slice(0, index).concat(addressStore.slice(index + 1)));
    set(state.global, 'addressTotal', --state.global.addressTotal);
  },
};
