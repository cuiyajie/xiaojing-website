<template>
  <el-dialog title="管理员设置"
             v-model="dialogVisible"
             size="small"
             custom-class="admin-setting normal no-padding"
            :close-on-click-modal="false"
            :show-close="true">
    <div class="dialog-wrapper" v-loading="loading">
      <div class="dialog-banner">
        <div class="dialog-container">
          <el-row>
            <el-col :span="12">
              <staff-auto-complete @handle-request="handleACRequest" @handle-select="handleACSelect"></staff-auto-complete>
            </el-col>
            <el-col :span="12">共{{ adminTotal }}人</el-col>
          </el-row>
        </div>
      </div>
      <div class="dialog-container table">
        <el-row>
          <el-col :span="12">
            <el-table class="custom-table"
                      row-key="id"
                      :empty-text="userlistEmptyText"
                      :data="users">
               <el-table-column width="60">
                <template scope="scope">
                  <span class="action-icon" 
                    :class="{ disabled: scope.row.isAdmin }"
                    @click="addAdmin(scope.row)"><el-icon name="plus"></el-icon></span>
                </template>
               </el-table-column>
               <el-table-column label="姓名" property="name"></el-table-column>
               <el-table-column label="部门" property="department_name"></el-table-column>
               <el-table-column label="职务" property="job_position"></el-table-column>
            </el-table>
            <div class="table-footer">
              <pagination class="table-pagination" 
                 ref="upg"
                 :page-size="pageSize" 
                 :total="userTotal"
                 :history-store="userHistoryStore"
                 @pagination-pagechange="onUserPageChanged">
              </pagination>
            </div>
          </el-col>
          <el-col :span="12">
            <el-table class="custom-table admin"
                      row-key="id"
                      :empty-text="adminlistEmptyText"
                      :data="admins">
               <el-table-column width="60">
                <template scope="scope"><span class="action-icon" @click="removeAdmin(scope.row, scope.$index)"><el-icon name="close"></el-icon></span></template>
               </el-table-column>
               <el-table-column label="姓名" property="name"></el-table-column>
               <el-table-column label="部门" property="department_name"></el-table-column>
               <el-table-column label="职务" property="job_position"></el-table-column>
            </el-table>
            <div class="table-footer"> 
              <pagination class="table-pagination"
                ref="apg"
                 :page-size="pageSize" 
                 :total="adminTotal"
                 :history-store="adminHistoryStore"
                 @pagination-pagechange="onAdminPageChanged">
              </pagination>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>
<script>
  import { mapGetters } from 'vuex';
  import _ from 'lodash/core';
  import _array from 'lodash/array';
  import MessageBox from '../utils/messagebox';
  import StaffAutoComplete from './StaffAutoComplete';
  import Pagination from './Pagination';
  import api from '../api';
  import { VueSuccesStatus } from '../api/httpstatus';

  export default {
    data() {
      return {
        dialogVisible: false,
        loading: false,
        pageSize: 6,
        users: [],
        userlistEmptyText: '暂时没有员工数据',
        userTotal: 0,
        lastUserId: 0,
        userHistoryStore: [],
        admins: [],
        adminlistEmptyText: '暂时没有设置管理员',
        adminHistoryStore: [],
        adminTotal: 0,
        initialAdminPage: 1,
      };
    },
    computed: {
      ...mapGetters({
        company: 'currentCompany',
        admin: 'currentUser',
      }),
      upgCurrentPage() {
        return this.$refs.upg.currentPage;
      },
      apgCurrentPage() {
        return this.$refs.apg.currentPage;
      },
    },
    components: {
      StaffAutoComplete,
      Pagination,
    },
    methods: {
      show() {
        this.dialogVisible = true;
      },
      isAdmin(id) {
        const adminIndex = _array.findIndex(this.adminHistoryStore, admin => admin.id === id);
        return id === this.admin.id || adminIndex !== -1;
      },
      handleAdminUsers(usrs) {
        return _.map(usrs, u => Object.assign({}, u, {
          isAdmin: this.isAdmin(u.id),  
        }));
      },
      getDataStore(historyStore, page) {
        return historyStore.slice(this.pageSize * (page - 1), this.pageSize * page);
      },
      fetchAdmins(page) {
        this.admins = this.getDataStore(this.adminHistoryStore, page);
      },
      fetchStaffs(fromLocale, page) {
        if (fromLocale) {
          this.users = this.getDataStore(this.userHistoryStore, page);
        } else {
          api.fetchAllStaffs(
            this.company.id,
            null, 
            this.lastUserId,
            this.pageSize)
            .then((response) => {
              this.lastUserId = response.body.max_user_id;
              const users = this.handleAdminUsers(response.body.users);
              this.userHistoryStore = this.userHistoryStore.concat(users);
              this.users = this.getDataStore(this.userHistoryStore, page);
              this.userTotal = response.body.total || 0;
            }, () => {});
        }
      },
      onAdminPageChanged(page) {
        this.fetchAdmins(page.newPage);
      },
      onUserPageChanged(page) {
        this.fetchStaffs(!page.fetchData, page.newPage);
      },
      handleACRequest(queryString, cb) {
        if (queryString === '') {
          this.lastUserId = 0;
          this.userHistoryStore = [];
          this.userTotal = 0;
          this.fetchStaffs(false, 1);
          cb([]);
        }
      },
      handleACSelect(user) {
        const handledUser = this.handleAdminUsers([user]);
        this.userHistoryStore = handledUser;
        this.userTotal = 1;
        this.users = handledUser;
      },
      addAdmin(u) {
        const user = u;
        if (user.isAdmin) {
          return;
        }
        
        MessageBox.lConfirm(`确定将 ${user.name} 设置为管理员？`).then(() => {
          this.loading = true;
          api.setAdmin(this.company.id, user.id).then(() => {
            user.isAdmin = true;
            this.adminHistoryStore.splice(
              (this.apgCurrentPage - 1) * this.pageSize, 0,
              Object.assign({}, user),
            );
            this.adminTotal++;
            this.fetchAdmins(this.apgCurrentPage);
            this.loading = false;
          }, () => {
            MessageBox.tip('设置失败！');
            this.loading = false;
          });
        }).catch(() => {});
      },
      removeAdmin(user, index) {
        MessageBox.lConfirm(`确定取消 ${user.name} 的管理员身份？`).then(() => {
          this.loading = true;
          api.unsetAdmin(this.company.id, user.id).then(() => {
            this.adminHistoryStore.splice(((this.apgCurrentPage - 1) * this.pageSize) + index, 1);
            this.adminTotal--;
            this.fetchAdmins(this.apgCurrentPage);
            /* eslint-disable */
            _.each(this.userHistoryStore, (u) => {
              const usr = u; 
              if (usr.id === user.id) {
                usr.isAdmin = false;
                return false;
              }
            });
            this.loading = false;
          }, (err) => {
            let errAlert = '设置失败！';
            if (err.status !== VueSuccesStatus.status && err.body.message && err.body.message !== '') {
              errAlert = err.body.message;
            }
            MessageBox.tip(errAlert);
            this.loading = false;
          });
        }).catch(() => {});
      },
    },
    watch: {
      company: {
        immediate: true,
        handler() {
          if (this.company && this.company.id) {
            api.fetchAllAdmins(this.company.id)
              .then((response) => {
                this.adminHistoryStore = response.body.admins;
                const index = _array.findIndex(this.adminHistoryStore, a => a.id === this.admin.id);
                if (index !== -1) {
                  this.adminHistoryStore.splice(index, 1);
                }
                this.adminTotal = this.adminHistoryStore.length || 0;
                this.fetchAdmins(this.initialAdminPage);
                this.fetchStaffs(false, 1);
              }, () => {});
          }
        },
      },
    },
  };
</script>
<style lang="scss">
  @import '~scss_var';

  .admin-setting.el-dialog {
    
    .dialog-banner .el-row .el-col {

      &:nth-child(1) {
        padding-right: 40px;
      }

      &:nth-child(2) {
        padding-left: 20px;
      }

      .el-autocomplete {
        width: 100%;
        max-width: 300px;
      }
    }

    .el-row .el-col:nth-child(2n+1) {
      border-right: 1px solid #eee;
    }

    .table-footer {
      text-align: center;
      margin-bottom: 20px;

      .table-pagination {
        float: none;
      }
    }

    .dialog-container.table .el-row .el-col {
      min-height: 352px;
    }

    .action-icon {
      display: inline-block;
      width: 18px;
      height: 18px;
      line-height: 18px;
      border-radius: 50%;
      color: #FFF;
      font-size: 10px;
      cursor: pointer;
      background-color: $linkface;

      &.disabled {
        background-color: #bbb;
        cursor: auto;
      }
    }

    .el-table.admin .action-icon {
      font-size: 8px;
    }
  }
</style>
