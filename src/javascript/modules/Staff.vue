<template>
  <div class="lf-page-container staff-container">
    <div class="lf-page-preheader">
      <el-row>
        <el-col :span="6">
          <staff-auto-complete ref="autoComplete" @handle-request="handleRequest" @handle-select="handleSelect"></staff-auto-complete>
        </el-col>
        <el-col :span="3">
          <el-dropdown menu-align="start">
            <el-button size="small">{{ selectedDepartment.name }}<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown" class="lf-header-dropdown">
               <el-dropdown-item v-for="department in departmentslist" :key="department.id" @click.native="selectDepartment(department);">{{ department.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <!-- <el-col :span="5">
          <el-dropdown menu-align="start">
            <el-button size="small">{{ selectedStatus.name }}<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown" class="lf-header-dropdown">
              <el-dropdown-item v-for="stat in statuslist" :key="stat.id" @click.native="selectStat(stat);">{{ stat.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> 
        </el-col> -->
        <el-col :span="15">
           <el-button size="small" type="primary" @click="onSearch">查询</el-button>
        </el-col>
      </el-row>
      <div class="lf-page-header-buttons">
        <el-button size="small" type="primary" @click="onAdd">添加员工</el-button>
        <el-button size="small" @click="onStaffBatchAdd">批量添加</el-button>
      </div>
    </div>
    <div class="lf-page-header bordered">
      <span class="lf-page-caption">共{{ total }}人</span>
    </div>
    <el-table class="custom-table mt15"
      row-key="id"
      ref="staffTable"
      :row-style="{ cursor: 'pointer' }"
      :empty-text="emptyText"
      :data="dataStore"
      :reserve-selection="true"
      @selection-change="onSelectionChange"
      @row-click="onRowClick">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="姓名" property="name"></el-table-column>
      <el-table-column label="性别" property="user_count"><template scope="scope">{{ gender(scope.row.gender) }}</template></el-table-column>
      <el-table-column label="电话" property="tel"></el-table-column>
      <el-table-column label="部门" property="department_name"></el-table-column>
      <el-table-column label="职务" property="job_position"></el-table-column>
      <el-table-column label="状态" property="status"><template scope="scope">{{ staffStatus(scope.row.status) }}</template></el-table-column>
    </el-table>
    <div class="table-footer">
      <el-button size="small" type="primary" @click="changeDepartment">更换部门</el-button>
      <pagination class="table-pagination" ref="pagination"
        :page-size="pageSize"
        :total="total"
        :history-store="historyStore"
        @pagination-pagechange="onPageChanged"></pagination>
    </div>
    <department-list-modal ref="multiDepartmentlistModal" @select-department="onModalMultiSelectDepartment"></department-list-modal>
    <department-list-modal ref="departmentlistModal" @select-department="onModalSelectDepartment"></department-list-modal>
    <staff-edit-modal ref="staffModal" @staff-added="onStaffAdded"></staff-edit-modal>
    <staff-view-modal ref="staffViewModal" @staff-edit="onStaffEdit" @staff-delete="onStaffDelete"></staff-view-modal>
    <batch-upload-staff-modal ref="batchUploadModal" @staff-batch-added="onStaffBatchAdded"></batch-upload-staff-modal>
    <address-list-modal ref="addresslistModal" @select-address="onAddressSelected"></address-list-modal>
  </div>
</template>
<script>
  import _ from 'lodash/core';
  import _array from 'lodash/array';
  import { mapGetters } from 'vuex';
  import Pagination from '../components/Pagination';
  import StaffAutoComplete from '../components/StaffAutoComplete';
  import StaffEditModal from '../components/StaffEditModal';
  import StaffViewModal from '../components/StaffViewModal';
  import BatchUploadStaffModal from '../components/BatchUploadStaffModal';
  import DepartmentListModal from '../components/DepartmentListModal';
  import AddressListModal from '../components/AddressListModal';
  import { tableValFilter } from '../utils/filters';
  import { STAFF_STATUS } from '../utils/constants';
  import MessageBox from '../utils/messagebox';
  import api from '../api';

  const defaultDepartment = { id: 0, name: '所有部门' };
  const defaultStatus = { id: 0, name: '所有状态' };

  export default {
    data() {
      return {
        emptyText: '暂时没有符合条件的员工！',
        pageSize: 10,
        total: 0,
        dataStore: [],
        historyStore: [],
        selected: [],
        loading: false,
        selectedDepartment: defaultDepartment,
        selectedStatus: defaultStatus,
      };
    },
    computed: {
      ...mapGetters({
        company: 'currentCompany',
        departments: 'departments',
      }),
      departmentslist() {
        return [defaultDepartment].concat(this.departments);
      },
      statuslist() {
        return [defaultStatus].concat(_.map(STAFF_STATUS, (v, k) => ({ id: k, name: v })));
      },
    },
    components: {
      Pagination,
      StaffAutoComplete,
      StaffEditModal,
      StaffViewModal,
      BatchUploadStaffModal,
      DepartmentListModal,
      AddressListModal,
    },
    methods: {
      handleRequest(queryString, cb) {
        if (queryString === '') {
          this.clearStore();
          this.fetchAllStaffs(false, 1);
          cb([]);
        } else {
          this.resetQuery();
        }
      },
      handleSelect(staff) {
        this.historyStore = [staff];
        this.total = 1;
        this.dataStore = [staff];
      },
      selectDepartment(department) {
        this.selectedDepartment = department;
      },
      selectStat(stat) {
        this.selectedStatus = stat;
      },
      clearStore() {
        this.lastUserID = 0;
        this.historyStore = [];
        this.dataStore = [];
        this.total = 0;
        this.$refs.pagination.reset();
      },
      resetQuery() {
        this.selectedDepartment = defaultDepartment;
        this.selectedStatus = defaultStatus;
      },
      getDataTable(page) {
        return this.historyStore.slice(this.pageSize * (page - 1), this.pageSize * page);
      },
      // fetch data async
      fetchAllStaffs(fromLocale, page) {
        if (fromLocale) {
          this.dataStore = this.getDataTable(page);
        } else {
          this.loading = true;
          api.fetchAllStaffs(
            this.company.id, 
            this.selectedDepartment.id, 
            this.lastUserID,
            this.pageSize).then((response) => {
              this.lastUserID = response.body.max_user_id;
              this.historyStore = this.historyStore.concat(response.body.users);
              this.dataStore = this.getDataTable(page);
              this.total = response.body.total || 0;
              this.loading = false;
            }, () => {
              this.loading = false;
            });
        }
      },
      onPageChanged(page) {
        this.fetchAllStaffs(!page.fetchData, page.newPage);
      },
      onRowClick(row, event, column) {
        if (column.type !== 'selection') {
          this.$refs.staffViewModal.show(row);
        }
      },
      ...tableValFilter,
      onSearch() {
        this.$refs.autoComplete.clear();
        this.clearStore();
        this.fetchAllStaffs(false, 1);
      },
      onAdd() {
        this.$refs.staffModal.show();
      },
      onStaffAdded(staff) {
        this.historyStore.splice(0, 0, staff);
        this.total = this.total + 1;
        this.$refs.pagination.onCurrentChange(1);
      },
      onStaffEdit(staff) {
        this.$refs.staffModal.show(staff);
      },
      onStaffDelete(staffId) {
        const index = _array.findIndex(this.historyStore, u => u.id === staffId);
        this.historyStore.splice(index, 1);
        this.total = this.total - 1;
        this.$refs.pagination.onCurrentChange(this.$refs.pagination.currentPage);
      },
      onStaffBatchAdd() {
        this.$refs.batchUploadModal.dialogVisible = true;
      },
      onStaffBatchAdded(staffs) {
        this.historyStore = staffs.concat(this.historyStore);
        this.total = this.total + staffs.length;
        this.$refs.pagination.onCurrentChange(1);
      },
      onModalSelectDepartment(selected) {
        this.$refs.staffModal.changed.department_id = selected.id;
        this.$refs.staffModal.changed.department_name = selected.name;
      },
      onAddressSelected(selected) {
        this.$refs.staffModal.changed.address_id = selected.id;
        this.$refs.staffModal.changed.location = selected.location;
      },
      onSelectionChange(selection) {
        this.selected = selection;
      },
      onModalMultiSelectDepartment(selectedDepartment) {
        const userIds = _.map(this.selected, s => s.id);
        api.batchUpdateDepartment(this.company.id, selectedDepartment.id, userIds).then(() => {
          _.each(this.selected, (s) => {
            Object.assign(s, {
              department_id: selectedDepartment.id,
              department_name: selectedDepartment.name,
            });
          });
          this.$refs.staffTable.clearSelection();
          MessageBox.tip('修改部门成功！');
        }, () => {
          MessageBox.tip('修改部门失败！');
        });
      },
      changeDepartment() {
        if (!this.selected || this.selected.length === 0) {
          MessageBox.tip('请选择至少一位员工');
          return;
        }
        
        this.$refs.multiDepartmentlistModal.show();
      },
    },
    watch: {
      company: {
        immediate: true,
        handler() {
          if (this.company && this.company.id) {
            this.fetchAllStaffs(false, 1);
          }
        },
      },
    },
  };
</script>
<style lang="scss">
  @import '~scss_var';

  .lf-header-dropdown.el-dropdown-menu {
    width: 190px;
    font-size: 14px;

    .el-dropdown-menu__item {
      line-height: 30px;

      &:not(.is-disabled):hover {
        background-color: $linkface;
        color: #FFF;
      }
    }
  }
</style>
