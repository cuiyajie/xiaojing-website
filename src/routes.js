import User from './components/User/index';
import Checkin from './components/Checkin/index';
import Login from './components/Login/login';
import Container from './components/Container/container';
import NotFound from './components/NotFound';

export default [
  {
    path: '/login',
    name: 'login',
    component: Login,
  }, {
    path: '/',
    redirect: '/login',
  }, {
    path: '/page',
    component: Container,
    children: [
      {
        path: 'users',
        name: 'users',
        component: User,
      }, {
        path: 'checkins',
        name: 'checkins',
        component: Checkin,
      },
    ],
  }, {
    path: '*',
    name: 'NotFound',
    component: NotFound,
  },
];
