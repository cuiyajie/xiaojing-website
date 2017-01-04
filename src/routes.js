import Users from './components/User/Users';
import Checkins from './components/Checkin/Checkins';
import Login from './components/Login/Login';
import Container from './components/Container/Container';
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
