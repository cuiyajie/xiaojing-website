import * as types from './mutation-types';
import api from '../api';

export const autoLogin = ({ commit }) => {
  api.loginDebug().then(({ body }) => {
    commit(types.AUTO_LOGIN, {
      user: body.user || {},
      company: body.company || {},
    });
  });
};

export default autoLogin;
