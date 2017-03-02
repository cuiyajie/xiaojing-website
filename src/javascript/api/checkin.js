import { VueHttp } from './global';
import urls from './api-list';
import { dateFilter } from '../utils/filters';

export function fetchStaffCheckins(
  companyId, 
  startTime, 
  endTime, 
  lastCheckinId, 
  count, 
  departmentId, 
  userId) {
  const params = {};
  params.company_id = companyId;
  params.start_time = dateFilter.toShortString(startTime);
  params.end_time = dateFilter.toShortString(endTime);
  params.last_checkin_id = lastCheckinId || 0;
  params.count = count || 15;
  if (departmentId) {
    params.department_id = departmentId;
  }
  if (userId) {
    params.user_id = userId;
  }

  return VueHttp.get(urls.URL_FETCH_STAFF_CHECKIN, {
    params,
  });
}

export function fetchGuestCheckins(
  companyId, 
  startTime, 
  endTime, 
  lastGuestId, 
  count) {
  const params = {};
  params.company_id = companyId;
  params.start_time = dateFilter.toShortString(startTime);
  params.end_time = dateFilter.toShortString(endTime);
  params.last_guest_id = lastGuestId || 0;
  params.count = count || 15;

  return VueHttp.get(urls.URL_FETCH_GUEST_CHECKIN, {
    params,
  });
}

export default fetchStaffCheckins;