<template>
  <el-dialog title="更换部门" v-model="dialogVisible" size="small" custom-class="department-setting normal tiny" :close-on-click-modal="false" :show-close="false">
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
  </el-dialog>
</template>
<script>
  import _ from 'lodash/core';
  import { mapGetters } from 'vuex';

  export default {
    data() {
      let defaultDepartment = {};
      if (this.departments && this.departments.length > 0) {
        defaultDepartment = this.departments[0];
      }
      return {
        dialogVisible: false,
        selectedId: defaultDepartment.id,
        selectDepartment: defaultDepartment,
      };
    },
    computed: {
      ...mapGetters({
        departments: 'departments',
      }),
    },
    methods: {
      show(department) {
        if (department && department.id) {
          this.selectedId = department.id;
        } else {
          this.selectedId = (this.departments[0] || {}).id;
        }
        this.dialogVisible = true;
      },
      onSave() {
        const selected = _.find(this.departments, d => d.id === this.selectedId);
        if (selected) {
          this.$emit('select-department', selected);
          this.dialogVisible = false;
        }
      },
      onCancel() {
        this.selectedId = this.departments[0].id;
        this.dialogVisible = false;
      },
    },
  };
</script>
<style lang="scss">

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
        overflow-y: auto;
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
</style>
