let sessionStorage = {};

export default {
  get: key => sessionStorage[key],
  set: (key, value) => {
    sessionStorage[key] = value;
  },
  remove: (key) => {
    if (sessionStorage[key]) {
      sessionStorage[key] = null;
    }
  },
  removeAll: () => {
    sessionStorage = null;
  },
};
