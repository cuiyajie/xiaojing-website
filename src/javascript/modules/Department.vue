<template>
  <div class="lf-page-container department-container">
    <div class="lf-page-header bordered">
      <span class="lf-page-caption">共{{ departments.length }}个部门</span>
      <div class="lf-page-header-buttons">
        <el-button type="primary" size="small" @click="onAdd">添加部门</el-button>
      </div>
    </div>
    <el-table class="custom-table mt15"
      row-key="id"
      :empty-text="emptyText"
      :data="dataStore">
      <el-table-column label="部门名称" property="name"></el-table-column>
      <el-table-column label="部门人数" property="user_count"></el-table-column>
      <el-table-column label="创建时间" property="created_at" :formatter="timeFormatter"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <span v-show="actionVisible(scope.row)">
            <el-button type="primary" size="small" @click="onEdit(scope.row);">编辑</el-button>
            <el-button size="small" @click="onDelete(scope.row);">删除</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <pagination class="table-pagination" 
        :page-size="pageSize"
        :total="departments.length"
        @pagination-pagechange="onPageChanged"></pagination>
    </div>
    <department-setting-modal ref="SettingModal" :company="company"></department-setting-modal>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  import Pagination from '../components/Pagination';
  import api from '../api';
  import { dateFilter } from '../utils/filters';
  import MessageBox from '../utils/messagebox';

export default {
    data() {
      return {
        emptyText: '暂时没有添加部门',
        currentPage: 1,
        pageSize: 10,
        dataStore: [],
        loading: false,
      };
    },
    computed: {
      ...mapGetters({
        company: 'currentCompany',
        departments: 'departments',
      }),
    },
    components: {
      Pagination,
      DepartmentSettingModal: {
        data() {
          return {
            dialogVisible: false,
            changed: {
              name: '',
            },
            loading: false,
          };
        },
        computed: {
          title() {
            return `${this.changed.id === undefined ? '添加' : '修改'}部门`;
          },
        },
        props: ['company'],
        template: `<el-dialog v-loading.body="loading" :title="title" v-model="dialogVisible" size="small" custom-class="department-editing normal tiny" :close-on-click-modal="false" :show-close="false">
                      <el-input placeholder="请输入部门" size="small" :disabled="loading" :maxlength="10" v-model="changed.name"></el-input>
                      <div class="description">不超过10个字，名称不能重复</div>
                      <span slot="footer" class="dialog-footer">
                        <el-button type="primary" size="small" @click="onSave" :loading="loading">确定</el-button>
                        <el-button size="small" @click="close" :disabled="loading">取消</el-button>
                      </span>
                    </el-dialog>`,
        methods: {
          show(department) {
            if (department) {
              this.changed = Object.assign({}, department);
            } else {
              this.changed = {};
            }
            this.dialogVisible = true;
          },
          close() {
            this.dialogVisible = false;
            this.changed = { name: '' };
          },
          onSave() {
            if (this.changed.name === '') {
              MessageBox.tip('部门名称不能为空！');
              return;
            }
            if (this.changed.name.length > 10) {
              MessageBox.tip('部门名称过长！');
              return;
            }
            this.loading = true;
            const requestAction = this.changed.id === undefined ? 'createDepartment' : 'updateDepartment';
            const requestParams = { name: this.changed.name };
            if (this.changed.id) {
              requestParams.id = this.changed.id;
            }
            api[requestAction](this.company.id, requestParams).then((response) => {
              this.loading = false;
              this.$store.dispatch(requestAction, response.body);
              this.dialogVisible = false;
            }, (err) => {
              if (err && err.body && err.body.message) {
                MessageBox.tip(err.body.message);
              }
              this.loading = false;
            });
          },
        }, 
      },
    },
    methods: {
      refreshDataStore() {
        this.dataStore = this.departments.slice(this.pageSize * (this.currentPage - 1), 
        this.pageSize * this.currentPage);
      },
      onPageChanged(page) {
        this.currentPage = page.newPage;
        this.refreshDataStore();
      },
      timeFormatter(row) {
        return dateFilter.toNormalString(row.created_at);
      },
      onAdd() {
        return this.$refs.SettingModal.show();
      },
      onEdit(row) {
        return this.$refs.SettingModal.show(row);
      },
      onDelete(row) {
        MessageBox.lConfirm('确定删除该部门？').then(() => {
          api.deleteDepartment(this.company.id, row.id).then(() => {
            this.$store.dispatch('deleteDepartment', row.id);
          }, () => {
            MessageBox.tip('删除失败！');
          });
        }).catch(() => {});
      },
      actionVisible(row) {
        return row.name !== '默认部门';
      },
    },
    watch: {
      departments: {
        immediate: true,
        handler() {
          if (this.departments && this.departments.length > 0) {
            this.refreshDataStore();
          }
        },
      },
    },
};
</script>
<style lang="scss">
  .department-editing.el-dialog {

    .description {
      margin-top: 10px;
    }
  }
</style>
