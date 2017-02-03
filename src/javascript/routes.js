import Users from './modules/User/Users';
import Checkins from './modules/Checkin/Checkins';
import Login from './modules/Login/Login';
import Container from './modules/Container/Container';
import NotFound from './modules/NotFound';

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
        component: Users,
      }, {
        path: 'checkins',
        name: 'checkins',
        component: Checkins,
      },
    ],
  }, {
    path: '*',
    name: 'NotFound',
    component: NotFound,
  },
];
