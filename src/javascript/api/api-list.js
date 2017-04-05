export default {
  // Login Related
  URL_AUTO_LOGIN: '/v1.0/companies/auto_login',
  URL_FETCH_LOGIN_CODE: '/v1.0/companies/scan_code',
  // Company Related
  URL_UPDATE_COMPANY: '/v1.0/companies/update',
  URL_FETCH_ALL_ADMINS: '/v1.0/companies/admin_list',
  URL_SET_ADMIN: '/v1.0/users/create_admin',
  URL_UNSET_ADMIN: '/v1.0/users/delete_admin',
  // Departments Related
  URL_FETCH_ALL_DEPARTMENTS: '/v1.0/departments/company_departments',
  URL_CREATE_DEPARTMENT: '/v1.0/departments/create',
  URL_UPDATE_DEPARTMENT: '/v1.0/departments/update',
  URL_DELETE_DEPARTMENT: '/v1.0/departments/delete',
  // Staff Related
  URL_FETCH_ALL_STAFFS: '/v1.0/users/company_users',
  URL_FETCH_STAFFS: '/v1.0/users/search_users',
  URL_STAFF_UPDATE_FACE: '/v1.0/users/update_face',
  URL_STAFF_CREATE: '/v1.0/users/create',
  URL_STAFF_UPDATE: '/v1.0/users/update_profile',
  URL_STAFF_DELETE: '/v1.0/users/delete',
  URL_STAFF_QUIT: '/v1.0/users/quit',
  URL_STAFF_IMPORT: '/v1.0/users/import_image',
  URL_STAFF_BTACH_UPDATE_DEPARTMENT: '/v1.0/users/change_department',
  // Attendance Related
  URL_FETCH_ATTENDANCE_ANALYSIS: '/v1.0/attendances/company_attendances_detail',
  URL_EXPORT_ATTENDANCE_ANALYSIS: '/v1.0/attendances/export',
  URL_FETCH_USER_ATTENDANCE: '/v1.0/user_attendances/query',
  // Checkin Related
  URL_FETCH_STAFF_CHECKIN: '/v1.0/checkins/list',
  URL_EXPORT_STAFF_CHECKINS: '/v1.0/checkins/export',
  URL_FETCH_GUEST_CHECKIN: '/v1.0/guests/list',
  // Address Related
  URL_FETCH_AREAS: '/areas.json',
  URL_FETCH_ADDRESSES: '/v1.0/addresses/list',
  URL_ADDRESS_CREATE: '/v1.0/addresses/create',
  URL_ADDRESS_UPDATE: '/v1.0/addresses/update',
  URL_ADDRESS_DELETE: '/v1.0/addresses/delete',
};
