// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import { sync } from 'vuex-router-sync';
import '../../theme/index.css';
import '../fonts/iconfont/iconfont.css';
import App from './App';
import filters from './utils/filters';
import routes from './routes';
import store from './store';

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

const VueInstance = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

export default VueInstance;
