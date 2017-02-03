// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import { sync } from 'vuex-router-sync';
import App from './modules/App';
import filters from './utils/filters';
import routes from './routes';
import store from './vuex/store';

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(ElementUI);
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes, // （缩写）相当于 routes: routes
});

sync(store, router);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');

