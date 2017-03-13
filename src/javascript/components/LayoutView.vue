<template>
  <!-- use adminLTE layout -->
  <div class="wrapper fixed">
    <header class="main-header">
      <div class="logo logo-lg">
        <div class="container overflow-hidden tx_c"><img :src="currentCompany.logo || defaultCompanyLogo" alt="Company Logo"></div>
      </div>
      <!-- Header navbar -->
      <nav class="navbar navbar-static-top bottom-border" role="navigation">
        <div class="navbar-left">{{ currentCompany.name }}</div>
        <!-- Navbar Right Menu -->
        <div class="navbar-custom-menu">
          <ul class="nav navbar-nav clearfix">
            <!-- User Account Menu -->
            <li class="user user-menu">
                <!-- The user image in the navbar-->
                <img :src="currentUser.avatar || defaultAvatar" class="user-image" alt="User Image">
                <span :class="{ 'no-border': !currentUser.name || currentUser.name === '' }">{{ currentUser.name }}</span>
            </li>
            <!-- Logout -->
            <li class="logout">
                <a href="javascript:void(0);" @click="logout">退出</a>
            </li>
          </ul>
        </div>
      </nav>
      <!-- end Header navbar -->
    </header>
    <aside class="main-sidebar right-border">
      <section class="sidebar">
        <ul class="sidebar-menu">
          <li class="treeview active">
            <div class="trewview-header"><i class="lnf-icon-briefcase"></i><span>工作</span></div>
            <ul class="treeview-menu menu-open">
              <li><router-link to="/page/staff">员工管理</router-link></li>
              <li><router-link to="/page/department">部门管理</router-link></li>
              <li><router-link exact to="/page">考勤统计</router-link></li>
              <li><router-link to="/page/attendance/staff">员工签到记录</router-link></li>
              <li><router-link to="/page/attendance/guest">访客签到记录</router-link></li>
              <li><router-link to="/page/company">公司信息管理</router-link></li>
            </ul>
          </li>
        </ul>
      </section>
      <div class="company-name-logo">
        <p>今始科技有限公司</p>
        <p>linkface.cn</p>
      </div>
    </aside>
    <div class="content-wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import logoSrc from '../../img/linkface.svg';
  import defaultAvatar from '../../img/avatar-darkbg.png';
  import defaultCompanyLogo from '../../img/company-logo.png';
  import { logout, tryAlive } from '../api/global';

  export default {
    data() {
      return {
        logoSrc,
        defaultAvatar,
        defaultCompanyLogo,
      };
    },
    computed: {
      ...mapGetters({
        currentUser: 'currentUser',
        currentCompany: 'currentCompany',
      }),
    },
    methods: {
      logout,
    },
    watch: {
      currentCompany(val) {
        if (val) {
          this.$store.dispatch('fetchDepartments', val.id);
        }
      },
    },
    created() {
      if (!this.currentCompany || !this.currentCompany.id) {
        tryAlive().then((loginParams) => {
          this.$store.dispatch('autoLogin', loginParams);
        }, () => {});
      }
    },
  };
</script>

<style lang="scss">
  /* defination */
  @import "~scss_var";
  $header-height: 80px;
  $container-border-size: 8px;
  
  /* header */
  .main-header {
    background-color: $darkblue;

    .logo {
      height: $header-height;
      line-height: $header-height;
      background-color: $darkblue;

      img {
        height: 60px;
        margin-top: 10px;
      }
    }

    .navbar {
      min-height: $header-height;
      color: #FFF;

      &.bottom-border:after {
        left: $container-border-size;
      }
    }

    .navbar-left {
      float: left;
      line-height: $header-height;
      font-size: 20px;
    }

    .navbar-custom-menu {
      padding-right: 20px;

      .navbar-nav li {
        position: relative;
        float: left;

        &.user,
        &.logout {
          line-height: 40px;
        }

        &.user {
          margin-top: 20px;
          height: 40px;
          span {
            padding-left: 15px;
            padding-right: 20px;
            border-right: 1px solid #c9c9c9;

            &.no-border {
              border-right: none;
            }
          }
        }

        &.logout {
          color: $linkface;
          
          a {
            margin-top: 20px;
            display: block;
            padding-left: 20px;
          }
        }
      }
    }

    .user-image {
      width: 40px;
      height: 40px;
      vertical-align: middle;
      border-radius: 50%;
    }
  }

  .content-wrapper {

    &:before,
    &:after {
      content: '';
      position: fixed;
      top: $header-height;
      left: $sidebar-width;
      width: $container-border-size;
      height: $container-border-size;
    }
    &:before {
      background-color: $darkblue;
    }
    &:after {
      border-top-left-radius: $container-border-size;
      background-color: #FFF;
      border-left: 2px solid $linkface;
      border-top: 2px solid $linkface;
    }
  }

  /* sidebar */
  .main-sidebar {
    background-color: $darkblue;
    padding-top: $header-height;
    color: #FFF;

    &.right-border:after {
      top: $header-height + $container-border-size;
    }

    .sidebar {
      margin-top: 60px;

      .trewview-header {
        padding-left: 36px;

        i[class^="lnf-icon-"] {
          margin-right: 14px;
        }
      }

      .treeview-menu {
        padding: 15px 0;

        & > li {

          & > a {
            font-size: 16px;
            padding: 15px 10px 15px 66px;

            &.router-link-active {
              position: relative;
              background-color: $darkerblue;

              &:before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 4px;
                height: 100%;
                background-color: $linkface;
              }
            }
          }
        }
      }
    }

    .company-name-logo {
      text-align: center;
      position: absolute;
      left: 0;
      width: 100%;
      bottom: 30px;
      
      p {
        margin: 0;

        &:first-child {
          color: rgba(255, 255, 255, .2);
          margin-bottom: 5px;
        }

        &:last-child {
          color: rgba(255, 255, 255, .1);
          letter-spacing: 4px;
        }
      }
    }
  }

  .content-wrapper {
    background-color: #FFF;
  }
</style>
