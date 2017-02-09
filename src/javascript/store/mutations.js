import { set } from 'vue';
import * as types from './mutation-types';

export default {
  [types.AUTO_LOGIN](state, { user, company }) {
    set(state.global, 'currentUser', user);
    set(state.global, 'currentCompany', company);
  },
};
