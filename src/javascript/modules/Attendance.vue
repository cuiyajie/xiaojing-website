<template>
  <div class="lf-page-container attendance-container">
    <div class="lf-page-fixed">
      <el-row>
        <el-col :span="9">
        </el-col>
        <el-col :span="5">
          <staff-auto-complete @handle-request="handleRequest" @handle-select="handleSelect"></staff-auto-complete>
        </el-col>
        <el-col :span="5">
          <el-dropdown menu-align="start">
            <el-button size="small">{{ selectedDepartment.name }}<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown" class="staff-header-dropdown">
               <el-dropdown-item v-for="department in departmentslist" :key="department.id" @click.native="selectDepartment(department);">{{ department.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="5">
           <el-button size="small" type="primary">查询</el-button>
        </el-col>
      </el-row>
    </div>

    
    <div class="lf-page-header bordered">
      <span class="lf-page-caption">共{{ total }}人</span>
      <div class="lf-page-header-buttons">
        <el-button size="small" type="primary" @click="onAdd">添加员工</el-button>
        <el-button size="small" @click="onBatchAdd">批量添加</el-button>
      </div>
    </div>
    <el-table class="custom-table mt15"
      row-key="id"
      :empty-text="emptyText"
      :data="dataStore">
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
      <pagination class="table-pagination" 
        :page-size="pageSize"
        :total="total"
        @pagination-pagechange="onPageChanged"></pagination>
    </div>
    <department-list-modal ref="multiDepartmentlistModal" @select-department=""></department-list-modal>
    <department-list-modal ref="departmentlistModal" @select-department=""></department-list-modal>
    <staff-modal ref="staffModal"></staff-modal>
  </div>
</template>
<script>
  import Vue from 'vue';
  import _ from 'lodash/core';
  import _object from 'lodash/fp/object';
  import { mapGetters } from 'vuex';
import Pagination from '../components/Pagination';
  import StaffAutoComplete from '../components/StaffAutoComplete';
  import api from '../api';
  import { tableValFilter } from '../utils/filters';
  import { STAFF_STATUS, GENDER } from '../utils/constants';
  import defaultAvatar from '../../img/avatar-darkbg.png';

  Vue.component('department-list-modal', {
    data() {
      return {
        dialogVisible: false,
      };
    },
    computed: {
      ...mapGetters({
        departments: 'departments',
      }),
      selectedId() { // eslint-disable-line
        if (this.departments && this.departments.length > 0) {
          return this.departments[0].id;
        }
      },
    },
    template: `<el-dialog title="更换部门" v-model="dialogVisible" size="small" custom-class="department-setting normal tiny" :close-on-click-modal="false" :show-close="false">
                 <div class="radio-group-body">
                   <div class="radio-group-body-inner">
                   <el-radio-group v-model="selectedId">
                     <el-radio v-for="department in departments" :label="department.id">{{ department.name }}</el-radio>
                   </el-radio-group>
                   </div>
                 </div>
                 <div class="radio-group-footer">
                   <el-button type="primary" size="small" @click="onSave">确定</el-button>
                   <el-button size="small" @click="onCancel">取消</el-button>
                 </div>
               </el-dialog>`,
    methods: {
      onSave() {
        this.$emit('select-department', this.selectedId);
        this.dialogVisible = false;
      },
      onCancel() {
        this.selectedId = this.departments[0].id;
        this.dialogVisible = false;
      },
    },
  });

  Vue.component('staff-modal', {
    data() {
      return {
        dialogVisible: false,
        changed: {},
        GENDER,
      };
    },
    computed: {
      ...mapGetters({
        company: 'currentCompany',
        departments: 'departments',
      }),
      empty() {
        return {
          avatar: defaultAvatar,
          name: '',
          gender: GENDER.MALE,
          tel: '',
          department_id: this.departments[0].id,
          department_name: this.departments[0].name,
          job_position: '',
        };
      },
    },
    template: `<el-dialog :title="company.name" v-model="dialogVisible" size="small" custom-class="staff-setting normal tiny" :close-on-click-modal="false">
                 <div class="avatar-header">
                   <div class="avatar-container" @click.native="uploadAvatar">
                     <img :src="changed.avatar" alt="User Avater">
                     <span>点击上传</span>
                   </div>
                 </div>
                 <el-form v-model="changed">
                   <el-form-item label="姓名"><el-input placeholder="请输入姓名"></el-input></el-form-item>
                   <el-form-item label="性别">
                     <el-radio-group v-model="changed.gender">
                      <el-radio :label="GENDER.MALE">男</el-radio>
                      <el-radio :label="GENDER.FEMALE">女</el-radio>
                     </el-radio-group>
                   </el-form-item>
                   <el-form-item label="联系电话"><el-input placeholder="请输入电话号码"></el-input></el-form-item>
                   <el-form-item label="部门"><span class="form-department" @click="handleSelectDepartment">{{ changed.department_name }}<i class="el-icon-caret-right el-icon--right"></i></span></el-form-item>
                   <el-form-item label="职务"><el-input placeholder="选填"></el-input></el-form-item>
                   <el-form-item class="tx_c no-bordered buttons">
                    <el-button type="primary" @click="onSubmit" size="small">保存</el-button>
                    <el-button @click="close" size="small">取消</el-button>
                   </el-form-item>
                 </el-form>
               </el-dialog>`,
    methods: {
      show(staff) {
        if (staff && staff.id) {
          this.changed = staff;
        } else {
          this.changed = _object.assign({}, this.empty);
        }
        this.dialogVisible = true;
      },
      close() {
        this.dialogVisible = false;
      },
      uploadAvatar() {

      },
      onSubmit() {

      },
      handleSelectDepartment() {
        this.$parent.$refs.departmentlistModal.dialogVisible = true;
      },
    },
  });

  export default {
    data() {
      return {
        emptyText: '暂时没有符合条件的员工！',
        currentPage: 1,
        pageSize: 5,
        total: 0,
        dataStore: [],
        historyStore: [],
        selected: [],
        loading: false,
        selectedDepartment: { id: 0, name: '所有部门' },
        selectedStatus: { id: 0, name: '所有状态' },
      };
    },
    computed: {
      ...mapGetters({
        company: 'currentCompany',
        departments: 'departments',
      }),
      departmentslist() {
        return [{ id: 0, name: '所有部门' }].concat(this.departments);
      },
      statuslist() {
        return [{ id: 0, name: '所有状态' }].concat(_.map(STAFF_STATUS, (v, k) => ({ id: k, name: v })));
      },
    },
    components: {
      Pagination,
      StaffAutoComplete,
    },
    methods: {
      handleRequest(queryString, cb) {
        cb();
      },
      handleSelect() {

      },
      selectDepartment(department) {
        this.selectedDepartment = department;
      },
      selectStat(stat) {
        this.selectedStatus = stat;
      },
      // fetch data async
      fetchAllStaffs(fromLocale, page) {
        if (fromLocale) {
          this.dataStore = this.historyStore.slice(this.pageSize * (page - 1), this.pageSize * page);
        } else {
          this.loading = true;
          api.fetchAllStaffs(this.company.id, this.lastUserID, this.pageSize).then((response) => {
            this.lastUserID = response.body.max_user_id;
            this.dataStore = response.body.users;
            this.historyStore = this.historyStore.concat(this.dataStore);
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
      onSelectionChange() {
        
      },
      ...tableValFilter,
      onAdd() {
        this.$refs.staffModal.show();
      },
      onBatchAdd() {

      },
      changeDepartment() {
        this.$refs.multiDepartmentlistModal.dialogVisible = true;
      },
    },
    watch: {
      company: {
        immediate: true,
        handler() {
          if (this.company && this.company.id) {
            this.fetchAllStaffs();
          }
        },
      },
      dataStore: {
        handler() {
          
        },
      },
    },
  };
</script>
<style lang="scss">
  @import '~scss_var';

  .staff-container {
    .lf-page-fixed {
      .el-col {
        padding-right: 15px;
      }

      .el-autocomplete {
        width: 100%;
      }

      .el-col > .el-button,
      .el-col > .el-dropdown {
        margin-top: 1px;
      }

      .el-col > .el-dropdown,
      .el-dropdown > .el-button {
        width: 100%;
      }
    }
  }

  .staff-header-dropdown.el-dropdown-menu {
    width: 152px;
    font-size: 14px;

    .el-dropdown-menu__item {
      line-height: 30px;

      &:not(.is-disabled):hover {
        background-color: $linkface;
        color: #FFF;
      }
    }
  }

  .department-setting.el-dialog {
    .el-dialog__body {
      position: relative;
      padding: 0;
    }

    .el-radio-group {
      width: 100%;

      .el-radio {
        font-size: 14px;
        line-height: 18px;
        display: block;
        position: relative;

        & + .el-radio {
          margin-left: 0;
          margin-top: 15px;
        }

        .el-radio__input {
          position: absolute;
          top: 0;
          right: 0;
        }
      }
    }

    .radio-group-body {
      padding: 0 0 70px;
      .radio-group-body-inner {
        height: 300px;
        padding: 30px 20px 0;
        overflow-y: scroll;
      }
    }

    .radio-group-footer {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 0;
      text-align: center;
      padding: 10px 0 20px;
      background-color: #FFF;
      border-radius: 4px;
    }
  }

  .staff-setting.el-dialog {
    width: 300px !important;
    .el-dialog__body {
      position: relative;
      padding-top: 90px;
    }
    .avatar-header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background-color: $darkblue;
      text-align: center;
      padding: 15px 0;

      .avatar-container {
        cursor: pointer;
        position: relative;
        width: 60px;
        height: 60px;
        margin: 0 auto;
        border-radius: 50%;
        line-height: 60px;
      }

      img {
        position: absolute;
        width: 100%;
        height: 100%;
      }

      span {
        position: relative;
        font-size: 12px;
        display: inline-block;
        width: 100%;
        color: $linkface;
      }
    }

    .el-form {
      padding-top: 10px;
    }

    .el-form-item {
      margin-bottom: 0;
      border-bottom: 1px solid #eee;

      &.buttons {
        margin-top: 10px;
      }

      .el-input,
      .el-radio-group,
      .form-department {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }

      .form-department {
        cursor: pointer;

        i {
          color: $linkface;
        }
      }

      .el-input {
        width: 160px;

        input[type=text] {
          text-align: right;
          border: none;
        }
      }
    }
  }
</style>
