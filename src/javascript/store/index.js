import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);

const state = {
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

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});

