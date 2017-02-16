import moment from 'moment';
import { STAFF_STATUS, GENDER } from './constants';

export const tableValFilter = {
  gender: (val) => {
    if (val === GENDER.MALE) {
      return '男';
    } 
    return val === GENDER.FEMALE ? '女' : '未知';
  },

  staffStatus: val => STAFF_STATUS[val] || '未知',
};

export const dateFilter = {
  toNormalString(date) {
    return moment(date).format('YYYY-MM-DD hh:mm:ss');
  },
};

export default tableValFilter;
