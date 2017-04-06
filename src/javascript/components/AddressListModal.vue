<template>
  <el-dialog title="选择办公地点"
             v-model="dialogVisible"
             size="small"
             custom-class="normal light-header address-list"
             :close-on-click-modal="false"
             :show-close="true">
    <el-table class="custom-table header-hidden"
              row-key="id">
      <el-table-column width="30">
        <template scope="scope"><span v-if="scope.row.is_default" class="default-label left"></span></template>
      </el-table-column>
      <el-table-column property="location"></el-table-column>
      <el-table-column width="30">
        <template scope="scope"><el-radio v-model="selectedId" :label="scope.row.id"></el-radio></template>
      </el-table-column>
    </el-table>
    <div class="table-footer tx_c">
      <el-button type="primary" @click="onSave" class="stretched" :disabled="saving">确定</el-button>
      <el-button @click="close" class="stretched" :disabled="saving">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { mapGetters } from 'vuex';

  export default {
    data() {
      return {
        dialogVisible: false,
        selectedId: null,
        saving: false,
      };
    },
    computed: {
      ...mapGetters({
        addressStore: 'addressStore',
      }),
    },
    methods: {
      show() {

      },
      onSave() {

      },
      close() {

      },
    },
  };
</script>
<style lang="scss">
  @import '~scss_var';
  
  .address-list {

    &.el-dialog {
      width: 450px;
    }
  }

</style>
