import moment from 'moment';
import 'moment-duration-format';
import 'moment/locale/zh-cn';
import { STAFF_STATUS, GENDER } from './constants';

moment.locale('zh-cn');

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
  toStringWithWeek(mDate) {
    return mDate.format('YYYY.MM.DD dddd');
  },
  toShortString(date) {
    return moment(date).format('YYYY-MM-DD');
  },
  toShortTimeString(date) {
    const mDate = moment(date);
    return mDate.isValid() ? mDate.format('hh:mm:ss') : '--';
  },
  toDurationString(duration) {
    return duration > 0 ? moment.duration(duration, 'seconds').format('h小时m分') : '--';
  },
};

export default tableValFilter;
