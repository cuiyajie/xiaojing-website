const currentUser = state => state.global.currentUser;

const currentCompany = state => state.global.currentCompany;

const departments = state => state.global.departments || {};

export default {
  currentUser,
  currentCompany,
  departments,
};
