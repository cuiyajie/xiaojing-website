const currentUser = state => state.global.currentUser;

const currentCompany = state => state.global.currentCompany;

const departments = state => state.global.departments || {};

const areas = state => state.global.areas || [];

export default {
  currentUser,
  currentCompany,
  departments,
  areas,
};
