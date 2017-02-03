<template>
  <div class="tx_c nav-container">
    <h1>小睛考勤</h1>
    <el-menu default-active="1" class="el-menu-vertical-demo">
      <el-menu-item index="1">
        <i class="el-icon-menu"></i>
        <router-link to="/page/users">用户管理</router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <i class="el-icon-setting"></i>
        <router-link to="/page/checkins">考勤管理</router-link>
      </el-menu-item>
    </el-menu>
    <div class="mt20 fz_14 fw_bolder">欢迎你，{{ getUsername }}</div>
    <div class="mt5 fz_12">{{ new Date() | formatDate }}</div>
  </div>
</template>

<script>
import store from '../../vuex/store';

export default {
  computed: {
    getUsername() {
      return store.state.user.name;
    },
  },
};
</script>

<style>
.nav-container a {
  display: inline-block;
  padding: 4px 0 5px;
  color: #555;
  text-align: center;
  text-decoration: none;
}
.nav-container .router-link-active {
  color: deepskyblue;
}
</style>