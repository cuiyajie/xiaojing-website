const currentUser = state => state.global.currentUser;

const currentCompany = state => state.global.currentCompany;

const departments = state => state.global.departments || {};

const areas = state => state.global.areas || [];

const addressStore = state => state.global.addressStore || [];

const lastAddressId = state => state.global.lastAddressId;

const addressTotal = state => state.global.addressTotal;

export default {
  currentUser,
  currentCompany,
  departments,
  areas,
  
  addressStore,
  lastAddressId,
  addressTotal,
};
