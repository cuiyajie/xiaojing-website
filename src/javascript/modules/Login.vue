<template>
  <div class="login">
    <div class="login-banner">
      <div class="layout-container">
         <ul class="feature-list">
          <li class="clearfix">
            <div class="feature-icon mobile"></div>
            <div class="feature-text">
              <p>01</p>
              <p>登录手机端小瞳助手</p>
            </div>
          </li>
          <li class="clearfix">
            <div class="feature-icon profile"></div>
            <div class="feature-text">
              <p>02</p>
              <p>点击头像进入账户</p>
            </div>
          </li>
          <li class="clearfix">
            <div class="feature-icon qrcode"></div>
            <div class="feature-text">
              <p>03</p>
              <p>登录管理后台</p>
            </div>
          </li>
         </ul>
         <div class="login-qrcode">
           <div class="login-qrcode-inner">
             <div class="qrcode-header">请使用小瞳助手app扫码登录</div>
             <div class="qrcode-container">
               <div class="qrcode-section" v-loading.body="loading" id="qrcode"></div>
               <img :src="logo" class="logo" alt="小瞳助手">
             </div>
             <div class="qrcode-desc">（建议使用IE10、chrome、safari浏览器登录操作）</div>
           </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script>
  import QRCode from 'qrcode-generator';
  import { ActionCable } from 'actioncable-js';
  import logo from '../../img/login/icon_140@2x.png';
  import { NetworkUtils, tryAlive } from '../api/global';
  import api from '../api';

  export default {
    name: 'Login',
    data() {
      return {
        logo,
        loading: false,
        consumer: null,
        subscription: null,
      };
    },
    methods: {
      createSocketConnect(code) {
        /* eslint max-len: ["error", { "ignoreComments": true }]*/
        this.consumer = ActionCable.createConsumer(NetworkUtils.SocketUrl()); // eslint-disable-line new-cap
        const vm = this;
        this.subscription = this.consumer.subscriptions.create({
          channel: 'WebLoginChannel',
          code,
        }, {
          connected() {
            // console.log('connected');
          },
          disconnected() {
            // console.log('disconnected');
          },
          received(data) {
            // console.log('received');
            if (data) {
              vm.$store.dispatch('autoLogin', {
                companyId: data.company_id,
                token: data.token,
                cb() {
                  vm.$router.push('/page');
                },
              });
            }
          },
        });
      },
    },
    mounted() {
      this.loading = true;
      api.fetchLoginCode().then((response) => {
        const code = response.body.code;
        const typeNumber = 4;
        const errorCorrectionLevel = 'M';
        const QR = QRCode(typeNumber, errorCorrectionLevel); // eslint-disable-line new-cap
        QR.addData(code);
        QR.make();
        this.$el.querySelector('#qrcode').innerHTML = QR.createImgTag(8);
        this.loading = false;
        this.createSocketConnect(code);
      }, () => {}); 
    },
    destroyed() {
      if (this.consumer) {
        this.consumer.disconnect();
      }
    },
    created() {
      tryAlive().then((loginParams) => {
        this.$store.dispatch('autoLogin', loginParams);
      }, () => {});
    },
};
</script>

<style lang="scss">
  @import '~scss_var';
  $trangle-bgcolor: #DADADA;

  .login {
    padding: 50px 0;

    .login-banner {
      height: 400px;
      background: url(../../img/login/bg.jpg) no-repeat;
      background-size: cover;
    }

    .layout-container {
      height: 100%;
      background: url(../../img/login/circle.png) 80px no-repeat;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      
      ul.feature-list {
        color: #FFF;
        margin-left: 114px;
      }

      li:nth-child(2) {
        margin: 30px 0 30px 25px;
      }

      .feature-icon {
        margin-top: 12px;
        width: 60px;
        height: 60px;
        background: url(../../img/login/feature-sprites.png) no-repeat;
        float: left;

        &.mobile {
          background-position: 0 0;
        }

        &.profile {
          background-position: -60px 0;
        }

        &.qrcode {
          background-position: 0 -60px;
        }
      }

      .feature-text {
        margin-left: 100px;

        p:nth-child(1) {
          font-size: 36px;
          color: rgba(255, 255, 255, .4);
          line-height: 150%;
          margin: 0;
        }

        p:nth-child(2) {
          font-weight: 300;
          margin: 0;
        }
      }

      .login-qrcode {
        height: 420px;
        margin-right: 100px;
        background-color: #FFF;
        text-align: center;

        .qrcode-container {
          position: relative;
        }

        .qrcode-section {
          position: relative;
          width: 240px;
          height: 240px;
          margin: 5px auto;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .qrcode-desc {
          font-size: 12px;
          color: rgba($darkblue, .5);
        }

        .logo {
          width: 56px;
          height: 56px;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-top: -28px;
          margin-left: -28px;
        }
      }

      .login-qrcode,
      .login-qrcode-inner {
        position: relative;

        &:before,
        &:after {
          content: '';
          position: absolute;
        }
      }

      .login-qrcode-inner {
        padding: 16px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-shadow: 0 0 10px rgba(0, 0, 0, .15);
      }

      .login-qrcode:before {
        top: 0;
        left: -10px;
        border-top: 5px solid transparent;
        border-left: 5px solid transparent;
        border-right: 5px solid $trangle-bgcolor;
        border-bottom: 5px solid $trangle-bgcolor;
      }

      .login-qrcode:after {
        top: 0;
        right: -10px;
        border-top: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid $trangle-bgcolor;
        border-left: 5px solid $trangle-bgcolor;
      }

      .login-qrcode-inner:before {
        bottom: 0;
        left: -10px;
        border-bottom: 5px solid transparent;
        border-left: 5px solid transparent;
        border-top: 5px solid $trangle-bgcolor;
        border-right: 5px solid $trangle-bgcolor;
      }

      .login-qrcode-inner:after {
        bottom: 0;
        right: -10px;
        border-right: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-left: 5px solid $trangle-bgcolor;
        border-top: 5px solid $trangle-bgcolor;
      }
    }
  }
</style>
