<template>
  <div>
    <div class="aside-nav">
      <side-nav></side-nav>
    </div>
    <router-view class="aside-container"></router-view>
  </div>

</template>

<script>
import SideNav from './SideNav';

export default {
  components: {
    SideNav,
  },
};
</script>

<style>
.aside-nav {
  float: left;
  width: 200px;
  margin: 0 50px 0 0;
  padding-left: 0;
}
.aside-container {
  float: left;
}
</style>
