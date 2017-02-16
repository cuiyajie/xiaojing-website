<template>
  <el-autocomplete 
       size="small" 
       placeholder="请输入员工姓名或电话" 
       icon="search"
      :model="searchText"
      :fetch-suggestions="handleRequest"
      :trigger-on-focus="false"
      custom-item="auto-complete-tpl"
      @select="handleSelect">
    </el-autocomplete>
</template>
<script>
  import Vue from 'vue';
  import { mapGetters } from 'vuex';
  import api from '../api';

  Vue.component('auto-complete-tpl', {
    functional: true,
    render: (h, ctx) => {
      const item = ctx.props.item;
      return h('li', ctx.data, [`${item.name}\t${item.tel}`]);
    },
    props: ['item'],
  });

export default {
    data() {
      return {
        searchText: '',
      };
    },
    computed: {
      ...mapGetters({
        company: 'currentCompany',
      }),
    },
    methods: {
      handleRequest(queryString, cb) {
        if (queryString !== '') {
          api.fetchConditionalStaffs(this.company.id, queryString).then((response) => {
            cb(response.body.users);
          });
        }
        this.$emit('handle-request', queryString, cb);
      },
      handleSelect(item) {
        this.$emit('handle-select', item);
      },
    },
};
</script>
