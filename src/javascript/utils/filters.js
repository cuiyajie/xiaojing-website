import moment from 'moment';
import 'moment-duration-format';
import 'moment/locale/zh-cn';
import { STAFF_STATUS, GENDER, ADDRESS_SEPERATOR } from './constants';

moment.locale('zh-cn');

const RegExp = window.RegExp;
const escapeReg = regexp => regexp.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
const addrRegExp = new RegExp(escapeReg(ADDRESS_SEPERATOR), 'g');

const getStartOfDay = date => new Date(date.getFullYear(), 
    date.getMonth(), date.getDate(), 0, 0, 0);

const getEndOfDay = date => new Date(date.getFullYear(),
    date.getMonth(), date.getDate(), 23, 59, 59);

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
    return mDate.format('YYYY.MM.DD HH:mm:ss');
  },
  toShortString(date) {
    return moment(date).format('YYYY-MM-DD');
  },
  toShortTimeString(date) {
    const mDate = moment(date);
    return mDate.isValid() ? mDate.format('HH:mm:ss') : '--';
  },
  toDurationString(duration) {
    return duration > 0 ? moment.duration(duration, 'seconds').format('h小时m分') : '--';
  },
  duration2Days(start, end) {
    const dStart = getStartOfDay(start);
    const dEnd = getEndOfDay(end);
    return Math.ceil(moment.duration(dEnd - dStart).as('days'));
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
  trimAddress(addr) {
    const address = addr || '';
    return address.replace(addrRegExp, '');
  },
  pad(str, num = 2) {
    let source = str.toString();
    const len = num - source.length;
    for (let i = 0; i < len; i++) {
      source = `0${source}`;
    }
    return source.slice(-num);
  },
};
