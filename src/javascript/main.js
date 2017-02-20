// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import lang from 'element-ui/lib/locale/lang/zh-CN';
import Ellocale from 'element-ui/lib/locale';
import { sync } from 'vuex-router-sync';
import '../../theme/index.css';
import '../fonts/iconfont/iconfont.css';
import filters from './utils/filters';
import routes from './routes';
import store from './store';
import { syncRouter, tryAlive } from './api/global';
import App from './App';

Ellocale.use(lang);

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(ElementUI);

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes, // （缩写）相当于 routes: routes
});

sync(store, router);
syncRouter(router);
tryAlive().then((loginParams) => {
  store.dispatch('autoLogin', loginParams);
}, () => {});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
