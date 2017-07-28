import WebsiteLayoutView from './components/WebsiteLayoutView';
import Login from './modules/Login';
import Homepage from './modules/Homepage';
import LayoutView from './components/LayoutView';
import Staff from './modules/Staff';
import Attendance from './modules/Attendance';
import AttendanceStaff from './modules/AttendanceStaff';
import AttendanceGuest from './modules/AttendanceGuest';
import Department from './modules/Department';
import Company from './modules/Company';
import Address from './modules/Address';
import NotFound from './NotFound';

const WebsiteRouter = {
  path: '/',
  component: WebsiteLayoutView,
  children: [{
    path: 'login',
    name: 'login',
    component: Login,
  }, {
    path: '',
    name: 'home',
    component: Homepage,
  }],
};

const DashboardRouter = {
  path: '/page',
  component: LayoutView,
  children: [{
    path: 'address',
    name: 'address',
    component: Address,
  }, {
    path: 'staff',
    name: 'staff',
    component: Staff,
  }, {
    path: 'attendance',
    name: 'attendance',
    component: Attendance,
  }, {
    path: 'attendance/staff',
    name: 'attendace-staff',
    component: AttendanceStaff,
  }, {
    path: '',
    name: 'attendace-guest',
    component: AttendanceGuest,
  }, {
    path: 'department',
    name: 'department',
    component: Department,
  }, {
    path: 'company',
    name: 'company',
    component: Company,
  }],
};

const NotFoundRouter = {
  path: '*',
  name: 'notfound',
  component: NotFound,
};

export default [
  WebsiteRouter,
  DashboardRouter,
  NotFoundRouter,
];
