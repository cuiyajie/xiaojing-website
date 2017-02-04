import Login from './modules/Login';

import Staff from './modules/Staff';
import Attendance from './modules/Attendance';
import Department from './modules/Department';
import Company from './modules/Company';

import NotFound from './NotFound';

const LoginRouter = {
  path: '/login',
  name: 'login',
  component: Login
};

const DefaultRouter = {
  path: '/',
  redirect: '/login'
};

const ManagementRouter = [
  {
    path: '/staff',
    name: 'staff'
    component: Staff
  }, {
    path: '/attendance',
    name: 'attendance',
    component: Attendance
  }, {
    path: '/department',
    name: department,
    component: Department
  }, {
    path: '/company',
    name: 'company',
    component: Company
  }
];

const _404Router = {
  path: '*',
  name: 'notfound',
  component: NotFound
};

export default [
  LoginRouter,
  DefaultRouter,
  ...ManagementRouter,
  _404Router
];
