<template>
  <el-row>
    <el-col :span="6"><img :src="adminAvatar" alt="Admin Avatar" class="avatar"></el-col>
    <el-col :span="6">管理员</el-col>
    <el-col :span="12" class="pad-btn" v-html="currentAdminStr"></el-col>
    <div class="buttons-area">
      <el-button type="primary" size="small" @click="showDialog">更换</el-button>
    </div>
    <admin-settings ref="AdminSettingModal" :save="save" :company-id="companyId"></admin-settings>
  </el-row>
</template>
<script>
  import _ from 'lodash/core';
  import defaultAdminAvatar from '../../img/avatar.png';
  import Pagination from './Pagination';
  import StaffAutoComplete from './StaffAutoComplete';
  import api from '../api';
  import { tableValFilter } from '../utils/filters';

export default {
    computed: {
      adminAvatar() {
        return this.admin && this.admin.avatar ? this.admin.avatar : defaultAdminAvatar;
      },
      currentAdminStr() {
        return this.admin ? `${this.admin.name}&nbsp;&nbsp;${this.admin.tel}` : '&nbsp;';
      },
    },
    components: {
      adminSettings: {
        data() {
          return {
            dialogVisible: false,
            loading: false,
            pageSize: 6,
            total: 0,
            dataStore: [],
            lastUserID: null,
            historyStore: [],
            selected: [],
            emptyText: '没有符合条件的员工',
          };
        },
        components: {
          Pagination,
          StaffAutoComplete,
        },
        props: ['save', 'companyId'],
        template: `<el-dialog title="更换管理员" v-model="dialogVisible" custom-class="admin-setting normal" :close-on-click-modal="false">
                      <el-row class="dialog-header">
                        <el-col :span="12">
                          <staff-auto-complete @handle-request="handleRequest" @handle-select="handleSelect"></staff-auto-complete>
                        </el-col>
                      </el-row>
                      <el-row class="dialog-table">
                        <el-table class="custom-table"
                           ref="staffTable"
                           v-loading.body="loading"
                           row-key="id"
                          :empty-text="emptyText"
                          :data="dataStore"
                          :reserve-selection="true"
                          @selection-change="onSelectionChange">
                          <el-table-column type="selection"></el-table-column>
                          <el-table-column label="姓名" property="name"></el-table-column>
                          <el-table-column label="性别" property="gender"><template scope="scope">{{ gender(scope.row.gender) }}</template></el-table-column>
                          <el-table-column label="电话" property="tel" width="130"></el-table-column>
                          <el-table-column label="部门" property="department_name"></el-table-column>
                          <el-table-column label="职务" property="job_position"></el-table-column>
                          <el-table-column label="状态" property="status"><template scope="scope">{{ staffStatus(scope.row.status) }}</template></el-table-column>
                        </el-table>
                        <div class="table-footer">
                          <el-button type="primary" size="small" @click="saveAdminSetting">确定</el-button>
                          <el-button size="small" @click="cancel">取消</el-button>
                          <pagination class="table-pagination" 
                            :page-size="pageSize" 
                            :total="total"
                            @pagination-pagechange="onPageChanged"></pagination>
                        </div>
                      </el-row>
                   </el-dialog>`,
        methods: {
          saveAdminSetting() {
            
          },
          cancel() {
            this.dialogVisible = false;
          },
          // fetch data async
          fetchAllStaffs(fromLocale, page) {
            if (fromLocale) {
              this.dataStore = 
                this.historyStore.slice(this.pageSize * (page - 1), this.pageSize * page);
            } else {
              this.loading = true;
              api.fetchAllStaffs(
                this.companyId, 
                null, 
                this.lastUserID, 
                this.pageSize).then((response) => {
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
          handleRequest(queryString, cb) {
            if (queryString === '') {
              this.lastUserID = 0;
              this.historyStore = [];
              this.fetchAllStaffs();
              cb([]);
            }
          },
          // handle select one option in autocomplete
          handleSelect(item) {
            this.dataStore = item ? [item] : [];
          },
          onPageChanged(page) {
            this.fetchAllStaffs(!page.fetchData, page.newPage);
          },
          onSelectionChange(selection) {
            _.each(this.dataStore, (row) => {
              const inSelection = selection.indexOf(row);
              const inSelected = this.selected.indexOf(row.id);
              if (inSelection === -1 && inSelected !== -1) {
                this.selected.splice(inSelected, 1);
              } else if (inSelection !== -1 && inSelected === -1) {
                this.selected.push(row.id);
              }
            });
          },
          ...tableValFilter,
        },
        watch: {
          companyId: {
            immediate: true,
            handler(val) {
              if (val) {
                this.fetchAllStaffs();
              }
            },
          },
          dataStore: {
            handler() {
              if (this.dataStore && this.dataStore.length > 0) {
                this.$nextTick(() => {
                  _.each(this.dataStore, (u) => {
                    if (this.selected.indexOf(u.id) !== -1) {
                      this.$refs.staffTable.toggleRowSelection(u, true);
                    }
                  });
                });
              }
            },
          },
        },
      },
    },
    props: ['admin', 'save', 'companyId'],
    methods: {
      showDialog() {
        this.$refs.AdminSettingModal.dialogVisible = true;
      },
    },
};
</script>
<style lang="scss">
  @import '~scss_var';
  .el-dialog.el-dialog--small.admin-setting {
    width: 750px;

    .el-row {
      padding-left: 20px;
      padding-right: 20px;
    }

    .dialog-header {
      padding-top: 10px;
      padding-bottom: 10px;
      background-color: $lightblue;

      .el-col:first-child {
        padding-right: 20px;
      }
    }

    .el-dialog__body {
      padding: 0 0 30px;
    }

    .table-pagination {
      margin-top: 4px;
    }

    .el-autocomplete {
      width: 100%;
    }
  }
</style>
