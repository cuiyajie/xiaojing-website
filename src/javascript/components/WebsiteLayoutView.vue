<template>
  <span>
    <div class="website-wrapper">
      <header>
        <div class="layout-container">
          <div class="logo-container">
            <img :src="logo" alt="小瞳助手">小瞳助手
          </div>
          <nav>
            <ul class="clearfix">
              <li><router-link exact to="/">产品介绍</router-link></li>
              <li><router-link to="/login">登录</router-link></li>
            </ul>
          </nav>
        </div>
      </header>
      <span><router-view></router-view></span>
      <footer>
        <div class="layout-container">
          <nav>
            <ul class="clearfix">
              <li><a href="https://www.linkface.cn/">LINKFACE</a></li>
              <li><a href="https://www.jdcapital.com/">九鼎投资</a></li>
              <li><a href="https://www.sensetime.com/">商汤集团</a></li>
            </ul>
          </nav>
          <div class="copyright">©2017 Linkface Corporation 京ICP备 15020634</div>
        </div>
      </footer>
    </div>
  </span>
</template>
<script>
  import logo from '../../img/login/icon_140@2x.png';

  const body = window.document.body;
  
  export default {
    data() {
      return {
        logo,
      };
    },
    methods: {
      setTheme(to) {
        const route = to || this.$route;
        if (route.name === 'home') {
          body.classList.add('dark-theme');
        } else {
          body.classList.remove('dark-theme');
        }
      },
    },
    watch: {
      $route(to) {
        this.setTheme(to);
      },
    },
    mounted() {
      this.setTheme();
    },
  };
</script>
<style lang="scss">
  @import '~scss_var';
  $website-header-height: 62px;

  body.dark-theme {
    background-color: $darkblue;

    .website-wrapper {
      
      header {
        background-color: #FFF;
      }

      footer {
        color: #FFF;
        .copyright {
          margin-top: 24px;
          color: rgba(#FFF, .5);
        }
      }
    }
  }

  .website-wrapper {
    color: $darkblue;

    header {
      height: $website-header-height;
      font-size: 14px;

      nav {
        float: right;

        li {
          float: left;
          height: $website-header-height;
          line-height: $website-header-height;
          padding-left: 15px;
          padding-right: 15px;
          position: relative;

          > a:after {
            content: '';
            position: absolute;
            left: 15px;
            right: 15px;
            bottom: 0;
            height: 4px;
          }

          > a.router-link-active:after {
            background-color: $linkface;
          }
        }
      }
    }

    footer {
      font-size: 14px;
      height: 260px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;

      .copyright {
        margin-top: 24px;
        color: rgba($darkblue, .5);
      }

      nav {
        display: inline-block;
        li {
          float: left;
          padding-left: 15px;
          padding-right: 15px;
        }
      }
    }

    .logo-container {
      padding-top: 11px;
      line-height: 40px;
      display: inline-block;

      img {
        margin-right: 10px;
        width: 40px;
        height: 40px;
        vertical-align: middle;
      }
    }
  }
</style>
