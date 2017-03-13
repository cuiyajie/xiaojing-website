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
  toLongDateString(mDate) {
    return mDate.format('YYYY.MM.DD hh:mm:ss');
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
  duration2Days(start, end) {
    const days = moment.duration(end - start).as('days');
    return days > 0 ? Math.ceil(days) : (days + 1);
  },
};

export default {
  noCacheUrl(url) {
    let startChar = '?';
    if (url && url.split('?').length > 1) {
      startChar = '&';
    }
    return `${url}${startChar}t=${+new Date()}`;
  },
};
