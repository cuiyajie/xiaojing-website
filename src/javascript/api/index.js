import * as LoginApi from './login';
import * as CompanyApi from './company';
import * as StaffApi from './staff';
import * as DepartmentApi from './department';
import * as AttendanceApi from './attendance';
import * as CheckinApi from './checkin';
import * as AddressApi from './address';

export default {
  ...LoginApi,
  ...CompanyApi,
  ...StaffApi,
  ...DepartmentApi,
  ...AttendanceApi,
  ...CheckinApi,
  ...AddressApi,
};
