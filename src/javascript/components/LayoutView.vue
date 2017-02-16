<template>
  <!-- use adminLTE layout -->
  <div class="wrapper fixed">
    <header class="main-header">
      <a href="/" class="logo right-border">
        <div class="logo-lg">
          <div class="container overflow-hidden tx_c"><img :src="currentCompany.logo" alt="Company Logo"></div>
        </div>
      </a>
      <!-- Header navbar -->
      <nav class="navbar navbar-static-top" role="navigation">
        <!-- Navbar Right Menu -->
        <div class="navbar-custom-menu">
          <ul class="nav navbar-nav clearfix">
            <!-- User Account Menu -->
            <li class="user user-menu">
                <!-- The user image in the navbar-->
                <img :src="currentUser.avatar || defaultAvatar" class="user-image" alt="User Image">
                <span>{{ currentUser.name }}</span>
            </li>
            <!-- Logout -->
            <li class="logout">
                <a href="">退出</a>
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
              <li><router-link to="staff">员工管理</router-link></li>
              <li><router-link to="department">部门管理</router-link></li>
              <li><router-link to="attendance">考勤管理</router-link></li>
              <li><router-link to="company">公司信息管理</router-link></li>
            </ul>
          </li>
        </ul>
      </section>
    </aside>
    <div class="content-wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import store from '../store';
  import logoSrc from '../../img/linkface.svg';
  import defaultAvatar from '../../img/avatar-darkbg.png';

  export default {
    data() {
      return {
        logoSrc,
        defaultAvatar,
      };
    },
    computed: {
      ...mapGetters({
        currentUser: 'currentUser',
        currentCompany: 'currentCompany',
      }),
    },
    watch: {
      currentCompany(val) {
        if (val) {
          this.$store.dispatch('fetchDepartments', val.id);
        }
      },
    },
  };

  store.dispatch('autoLogin');
</script>

<style lang="scss">
  /* defination */
  @import "~scss_var";
  $header-height: 80px;
  
  /* header */
  .main-header {
    background-color: $lightblue;

    .logo {
      height: $header-height;
      line-height: $header-height;
      background-color: #28334d;

      img {
        height: 60px;
        margin-top: 10px;
      }
    }

    .navbar {
      min-height: $header-height;
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
            vertical-align: middle;
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
  /* sidebar */
  .main-sidebar {
    background-color: $darkblue;
    padding-top: $header-height;
    color: #FFF;

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

              &:before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 2px;
                height: 100%;
                background-color: $linkface;
              }
            }
          }
        }
      }
    }
  }

  .content-wrapper {
    background-color: #FFF;
  }
</style>
