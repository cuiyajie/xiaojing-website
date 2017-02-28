import Vue from 'vue';
import Login from 'src/javascript/modules/Login.vue';

describe('Login Module', () => {
  it('has a created hook', () => {
    expect(Login.name).to.equal('Login');
  });
  
  it('should load the qrcode image', () => {
    const vm = new Vue(Login).$mount();
    expect(vm.$el.querySelector('#qrcode img')).not.to.equal(undefined);
  });
});
