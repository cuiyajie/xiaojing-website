import * as LoginApi from './login';
import * as CompanyApi from './company';
import * as StaffApi from './staff';
import * as DepartmentApi from './department';

export default {
  ...LoginApi,
  ...CompanyApi,
  ...StaffApi,
  ...DepartmentApi,
};
