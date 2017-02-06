import Login from './modules/Login';
import LayoutView from './components/LayoutView';
import Staff from './modules/Staff';
import Attendance from './modules/Attendance';
import Department from './modules/Department';
import Company from './modules/Company';
import NotFound from './NotFound';

const LoginRouter = {
  path: '/login',
  name: 'login',
  component: Login,
};

const DashboardRouter = {
  path: '/',
  name: 'dashboard',
  component: LayoutView,
  children: [{
    path: '/staff',
    name: 'staff',
    component: Staff,
  }, {
    path: '/attendance',
    name: 'attendance',
    component: Attendance,
  }, {
    path: '/department',
    name: 'department',
    component: Department,
  }, {
    path: '/company',
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
  LoginRouter,
  DashboardRouter,
  NotFoundRouter,
];
