<template>
  <el-dialog title="选择办公地点"
             v-model="dialogVisible"
             size="small"
             custom-class="normal light-header address-list"
             :close-on-click-modal="false"
             :show-close="true">
    <div class="dialog-wrapper">
      <el-table class="custom-table header-hidden second-column-left"
                row-key="id"
                :data="addressStore">
        <el-table-column width="40">
          <template scope="scope"><span v-if="scope.row.is_default" class="default-label left">默认</span></template>
        </el-table-column>
        <el-table-column>
          <template scope="scope"><span>{{ trimLocation(scope.row.location) }}</span></template>
        </el-table-column>
        <el-table-column width="40">
          <template scope="scope"><el-radio v-model="selected.id" :label="scope.row.id" @click.native="onRadioClick(scope.row)"></el-radio></template>
        </el-table-column>
      </el-table>
      <div class="load-block" v-loading="loading" v-show="loading"></div>
    </div>
    <div class="table-footer tx_c">
      <el-button type="primary" @click="onSave" class="stretched">确定</el-button>
      <el-button @click="close" class="stretched">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { mapGetters } from 'vuex';
  import _ from 'lodash/core';
  import filters from '../utils/filters';
  import MessageBox from '../utils/messagebox';

  export default {
    data() {
      return {
        dialogVisible: false,
        selected: {},
        perpage: 8,
        defaultAddress: {},
        loading: false,
        // auto appending related
        scrollListener: null,
      };
    },
    computed: {
      ...mapGetters({
        company: 'currentCompany',
        addressStore: 'addressStore',
        addressTotal: 'addressTotal',
      }),
      currentPage() {
        if (this.addressTotal <= 0) {
          return 1;
        } 
        return Math.ceil(this.addressTotal / this.perpage);
      },
      hasMore() {
        return this.addressStore.length < this.addressTotal;
      },
    },
    methods: {
      show(addr) {
        if (addr && addr.id) {
          this.selected = addr;
        } else {
          this.selected = Object.assign({}, this.defaultAddress);
        }
        this.dialogVisible = true;
      },
      onRadioClick(row) {
        if (this.selected.id !== row.id) {
          this.selected = row;
        }
      },
      onSave() {
        if (this.selected.id == null) {
          MessageBox.tip('请至少选择一个办公地点');
          return;
        }
        this.$emit('select-address', this.selected);
        this.close();
      },
      close() {
        this.dialogVisible = false;
      },
      trimLocation: filters.trimAddress,
    },
    mounted() {
      if (!this.scrollListener) {
        this.scrollListener = this.$el.addEventListener('scroll', (e) => {
          const wrapper = e.target;
          if (wrapper.classList.contains('dialog-wrapper')) {
            e.stopPropagation();
            if (!this.loading && this.hasMore &&
                wrapper.scrollHeight <= wrapper.clientHeight + wrapper.scrollTop) {
              this.loading = true;
              setTimeout(() => {
                this.$store.dispatch('fetchAddress', {
                  perpage: this.perpage,
                  current: this.currentPage,
                });
              }, 200);
            }
          }
        }, true);
      }
    },
    watch: {
      company: {
        immediate: true,
        handler() {
          if (this.company && this.company.id) {
            this.$store.dispatch('fetchAddress', {
              perpage: this.perpage, 
              current: 1,
            });
          }
        },
      },
      addressStore: {
        immediate: true,
        handler() {
          _.each(this.addressStore, (a) => {
            if (a.is_default) {
              this.defaultAddress = a;
            }
          });
          this.loading = false;
        },
      },
    },
  };
</script>
<style lang="scss">
  @import '~scss_var';
  
  .address-list {

    &.el-dialog {
      width: 450px;

      .el-dialog__body {
        padding-left: 0;
        padding-right: 0;
      }
    }

    .dialog-wrapper {
      padding-left: 20px;
      padding-right: 20px;
      height: 280px;
      overflow-y: auto;
    }

    .el-table {
      padding-bottom: 0 !important;

      tr td:first-child .cell,
      tr td:last-child .cell {
        padding: 0;
        text-align: center;
      }

      .el-radio__label {
        display: none;
      }
    }

    .table-footer {
      padding-top: 20px;
    }

    .load-block {
      height: 40px;
      margin-top: 20px;
    }

    .el-loading-spinner .circular {
      width: 30px;
      height: 30px;
    }
  }

  .default-label.left {
    margin-left: 0;
  }

</style>
