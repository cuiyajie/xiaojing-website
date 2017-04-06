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
        :history-store="addressStore"
        @pagination-pagechange="onPageChanged"></pagination>
    </div>
    <address-edit-modal ref="AddressModal" @address-added="onAddressAdded" @address-edited="onAddressEdited"></address-edit-modal>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  import Pagination from '../components/Pagination';
  import AddressEditModal from '../components/AddressEditModal';
  import api from '../api';
  import MessageBox from '../utils/messagebox';
  import filters from '../utils/filters';

export default {
    data() {
      return {
        emptyText: '暂时没有办公地点',
        pageSize: 10,
        dataStore: [],
        currentPage: 1,
        loading: false,
      };
    },
    computed: {
      ...mapGetters({
        company: 'currentCompany',
        addressStore: 'addressStore',
        total: 'addressTotal',
        lastAddressId: 'lastAddressId',
      }),
    },
    components: {
      Pagination,
      AddressEditModal,
    },
    methods: {
      getDataTable() {
        this.dataStore = this.addressStore.slice(
          this.pageSize * (this.currentPage - 1), 
          this.pageSize * this.currentPage);
      },
      onPageChanged(page) {
        this.currentPage = page.newPage;
        this.$store.dispatch('fetchAddress', {
          perpage: this.pageSize, 
          current: this.currentPage,
        });
      },
      onAdd() {
        return this.$refs.AddressModal.show();
      },
      onAddressAdded(addr) {
        this.$store.dispatch('createAddress', addr);
      },
      onEdit(row) {
        return this.$refs.AddressModal.show(row);
      },
      onAddressEdited(addr) {
        this.$store.dispatch('updateAddress', addr);
      },
      onDelete(row) {
        MessageBox.lConfirm('删除后，使用此地址员工的办公地点将被清除？').then(() => {
          api.deleteAddress(this.company.id, row.id).then(() => {
            MessageBox.tip('删除成功！');
            this.$store.dispatch('deleteAddress', row.id);
          }, () => {
            MessageBox.tip('删除失败！');
          });
        }).catch(() => {});
      },
      trimLocation: filters.trimAddress,
    },
    watch: {
      company: {
        immediate: true,
        handler() {
          if (this.company && this.company.id) {
            this.$store.dispatch('fetchAddress', {
              perpage: this.pageSize, 
              current: this.currentPage,
            });
          }
        },
      },
      addressStore: {
        immediate: true,
        handler() {
          if (this.addressStore) {
            this.getDataTable();
          }
        },
      },
      currentPage: {
        immediate: true,
        handler() {
          this.getDataTable();
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
