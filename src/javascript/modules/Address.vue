<template>
  <div class="lf-page-container department-container">
    <div class="lf-page-header bordered">
      <div class="lf-page-header-buttons">
        <el-button type="primary" size="small" @click="onAdd">添加办公地点</el-button>
      </div>
    </div>
    <el-table class="custom-table first-column-left mt15"
      row-key="id"
      :empty-text="emptyText"
      :data="dataStore">
      <el-table-column label="办公地点">
        <template scope="scope">
          <span>{{ trimLocation(scope.row.location) }}<span v-if="scope.row.is_default" class="default-label">默认</span></span>
        </template>
      </el-table-column>
      <el-table-column label="使用人数" property="user_count"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <span>
            <el-button type="primary" size="small" @click="onEdit(scope.row);">编辑</el-button>
            <el-button size="small" @click="onDelete(scope.row, scope.$index);">删除</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <pagination class="table-pagination" 
        ref="pagination"
        :page-size="pageSize"
        :total="total"
        :history-store="historyStore"
        @pagination-pagechange="onPageChanged"></pagination>
    </div>
    <address-edit-modal ref="AddressModal" @address-added="onAddressAdded" @address-edited="onAddressEdited"></address-edit-modal>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  import _ from 'lodash/core';
  import Pagination from '../components/Pagination';
  import AddressEditModal from '../components/AddressEditModal';
  import api from '../api';
  import MessageBox from '../utils/messagebox';
  import { ADDRESS_SEPERATOR } from '../utils/constants'; 

  const RegExp = window.RegExp;
  const escapeReg = regexp => regexp.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

export default {
    data() {
      const addrRegExp = new RegExp(escapeReg(ADDRESS_SEPERATOR), 'g');
      return {
        addrRegExp,
        emptyText: '暂时没有办公地点',
        pageSize: 10,
        dataStore: [],
        historyStore: [],
        loading: false,
        total: 0,
      };
    },
    computed: {
      ...mapGetters({
        company: 'currentCompany',
      }),
    },
    components: {
      Pagination,
      AddressEditModal,
    },
    methods: {
      getDataTable(page) {
        return this.historyStore.slice(this.pageSize * (page - 1), this.pageSize * page);
      },
      fetchAddresses(fromLocale, page) {
        if (fromLocale) {
          this.dataStore = this.getDataTable(page);
        } else {
          this.loading = true;
          api.fetchAddresses(
            this.company.id,
            this.lastAddressID, 
            this.pageSize).then((response) => {
              this.lastAddressID = response.body.last_address_id;
              this.historyStore = this.historyStore.concat(response.body.addresses);
              this.dataStore = this.getDataTable(page);
              this.total = response.body.total || 0;
              this.loading = false;
            }, () => {
              this.loading = false;
            });
        }
      },
      onPageChanged(page) {
        this.fetchAddresses(!page.fetchData, page.newPage);
      },
      onAdd() {
        return this.$refs.AddressModal.show();
      },
      onAddressAdded(addr) {
        this.historyStore.splice(0, 0, addr);
        this.total = this.total + 1;
        this.$refs.pagination.onCurrentChange(1);
        if (addr.is_default) {
          this.remarkDefault(addr.id);
        }
      },
      onEdit(row) {
        return this.$refs.AddressModal.show(row);
      },
      onAddressEdited(addr) {
        if (addr.is_default) {
          this.remarkDefault(addr.id);
        }
      },
      onDelete(row, index) {
        MessageBox.lConfirm('删除后，使用此地址员工的办公地点将被清除？').then(() => {
          api.deleteAddress(this.company.id, row.id).then(() => {
            MessageBox.tip('删除成功！');
            const curr = this.$refs.pagination.currentPage;
            this.historyStore.splice(((curr - 1) * this.pageSize) + index, 1);
            this.total--;
            this.$refs.pagination.onCurrentChange(curr);
          }, () => {
            MessageBox.tip('删除失败！');
          });
        }).catch(() => {});
      },
      trimLocation(location) {
        return location.replace(this.addrRegExp, '');
      },
      remarkDefault(addrId) {
        _.each(this.historyStore, (addr) => {
          /* eslint no-param-reassign: ["off"]*/
          addr.is_default = (addr.id === addrId);
        });
      },
    },
    watch: {
      company: {
        immediate: true,
        handler() {
          if (this.company && this.company.id) {
            this.fetchAddresses(false, 1);
          }
        },
      },
    },
};
</script>
<style lang="scss">
  @import '~scss_var';

  .department-editing.el-dialog {

    .description {
      margin-top: 10px;
    }
  }

  .default-label {
    background-color: $linkface;
    display: inline-block;
    padding: 0 8px;
    border-radius: 10px;
    color: #FFF;
    margin-left: 10px;
    line-height: 150%;
    font-size: 12px;
  }
</style>
