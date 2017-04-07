<template>
  <el-dialog :title="company.name" v-model="dialogVisible" size="small" custom-class="staff-setting staff-view normal tiny" :close-on-click-modal="false">
    <div class="avatar-header">
      <div class="avatar-container">
        <img :src="viewed.avatar" alt="User Avater">
      </div>
      <span :class="{ leave: viewed.status === ENUM_STAFF_STATUS.LEAVE }">
        {{ staffStatus(viewed.status) }}
      </span>
    </div>
    <el-form v-model="viewed">
      <el-form-item label="姓名"><span class="form-value">{{ viewed.name }}</span></el-form-item>
      <el-form-item label="性别"><span class="form-value">{{ gender(viewed.gender) }}</span></el-form-item>
      <el-form-item label="联系电话"><span class="form-value">{{ viewed.tel }}</span></el-form-item>
      <el-form-item label="邮箱"><span class="form-value">{{ viewed.email }}</span></el-form-item>
      <el-form-item label="部门"><span class="form-value">{{ viewed.department_name }}</span></el-form-item>
      <el-form-item label="职务"><span class="form-value">{{ viewed.job_position }}</span></el-form-item>
      <el-form-item label="办公地点"><span class="form-value text-wrap">{{ trimAddress(viewed.location) }}</span></el-form-item>
      <el-form-item class="tx_c no-bordered buttons">
       <el-button type="primary" @click="edit" size="small">编辑</el-button>
       <el-button type="primary" @click="onQuit" size="small" 
          v-show="viewed.status === ENUM_STAFF_STATUS.NORMAL">设为离职</el-button>
       <el-button @click="onDelete" size="small">删除</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
  import { mapGetters } from 'vuex';
  import { ENUM_STAFF_STATUS } from '../utils/constants';
  import { tableValFilter, default as filters } from '../utils/filters';
  import MessageBox from '../utils/messagebox';
  import api from '../api';

  export default {
    data() {
      return {
        dialogVisible: false,
        viewed: {},
        ENUM_STAFF_STATUS,
      };
    },
    computed: {
      ...mapGetters({
        company: 'currentCompany',
      }),
    },
    methods: {
      show(staff) {
        if (staff && staff.id) {
          this.viewed = staff;
          this.dialogVisible = true;
        }
      },
      close() {
        this.viewed = {};
        this.dialogVisible = false;
      },
      edit() {
        this.$emit('staff-edit', this.viewed);
        this.close();
      },
      onQuit() {
        MessageBox.lConfirm('确定将该员工设置为离职？').then(() => {
          api.quitStaff(this.company.id, this.viewed.id).then(() => {
            this.viewed.status = ENUM_STAFF_STATUS.LEAVE;
            this.close();
          }, () => {
            MessageBox.tip('设置失败！');
          });
        }).catch(() => {});
      },
      onDelete() {
        MessageBox.lConfirm('确定删除该员工？').then(() => {
          api.deleteStaff(this.company.id, this.viewed.id).then(() => {
            this.$emit('staff-delete', this.viewed.id);
            this.close();
          }, () => {
            MessageBox.tip('删除失败！');
          });
        }).catch(() => {});
      },
      trimAddress: filters.trimAddress,
      ...tableValFilter,
    },
  };
</script>
<style lang="scss">
  @import '~scss_var';  

  .staff-view.el-dialog {
    span.form-value {
      display: block;
      text-align: right;
    }

    span.form-value.text-wrap {
      width: 180px;
    }

    &.staff-setting .avatar-header span {
      position: absolute;
      padding: 1px 6px;
      left: 50%;
      transform: translateX(-50%);
      bottom: 5px;
      font-size: 10px;
      width: auto;
      border: 1px solid $linkface;
      border-radius: 6px;

      &.leave {
        border: 1px solid #bbb;
        color: #bbb;
      }
    }
  }
</style>
