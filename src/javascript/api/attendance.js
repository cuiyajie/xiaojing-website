import { VueHttp } from './global';
import urls from './api-list';
import { dateFilter } from '../utils/filters';
import { ATTENDANCE_STATUS } from '../utils/constants';

export function fetchAttendanceAnalysis(
  companyId, 
  startTime, 
  endTime, 
  departmentId, 
  count, 
  lastAttendanceId) {
  const params = {};
  params.company_id = companyId;
  params.start_time = dateFilter.toShortString(startTime);
  params.end_time = dateFilter.toShortString(endTime);
  if (departmentId) {
    params.department_id = departmentId;
  }
  params.count = count || 10;
  params.last_attendance_id = lastAttendanceId || 0;

  return VueHttp.get(urls.URL_FETCH_ATTENDANCE_ANALYSIS, {
    params,
  });
}

export function fetchUserAttendanceRecords(
  companyId, 
  startTime, 
  endTime, 
  status, 
  userId, 
  count, 
  lastUserAttendanceId) {
  const params = {};
  params.company_id = companyId;
  params.start_time = dateFilter.toShortString(startTime);
  params.end_time = dateFilter.toShortString(endTime);
  if (status) {
    params.status = ATTENDANCE_STATUS[status];
  }
  if (userId) {
    params.user_id = userId;
  }
  params.count = count || 10;
  params.last_user_attendance_id = lastUserAttendanceId || 0;

  return VueHttp.get(urls.URL_FETCH_USER_ATTENDANCE, {
    params,
  });
}
