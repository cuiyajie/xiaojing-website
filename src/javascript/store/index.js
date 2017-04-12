import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);

const initialState = {
  global: {
    currentUser: {},
    currentCompany: {},
    departments: [],
    areas: [],
    
    addressStore: [],
    lastAddressId: 0,
    addressTotal: -1,
  },
};

const state = {
  global: Object.assign({}, initialState.global),
};

export { initialState };

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});

