<template>
  <el-dialog :title="company.name" v-model="dialogVisible" size="small" custom-class="staff-setting normal tiny" :close-on-click-modal="false">
    <div class="avatar-header">
      <div class="avatar-container" @click="onUploadClick">
        <img :src="changed.avatar" alt="User Avater" ref="userAvatar">
        <span>{{ uploadText }}</span>
        <el-upload ref="upload"
                   :action="uploadAjaxUrl"
                   :data="uploadParams"
                   :name="uploadName"
                   :headers="uploadAjaxHeaders"
                   :before-upload="onBeforeUpload"
                   :on-success="onUploadSuccess"
                   :on-error="onUploadError"
                   :show-upload-list="false">
      </div>
    </div>
    <el-form v-model="changed">
      <el-form-item label="姓名"><el-input v-model="changed.name" placeholder="请输入姓名"></el-input></el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="changed.gender">
         <el-radio :label="GENDER.MALE">男</el-radio>
         <el-radio :label="GENDER.FEMALE">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="联系电话"><el-input v-model="changed.tel" placeholder="请输入电话号码"></el-input></el-form-item>
      <el-form-item label="部门"><span class="form-department" @click="handleSelectDepartment">{{ changed.department_name }}<i class="el-icon-caret-right el-icon--right"></i></span></el-form-item>
      <el-form-item label="职务"><el-input v-model="changed.job_position" placeholder="选填"></el-input></el-form-item>
      <el-form-item class="tx_c no-bordered buttons">
       <el-button type="primary" @click="onSubmit" size="small" :disabled="saving">保存</el-button>
       <el-button @click="close" size="small" :disabled="saving">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
  import _ from 'lodash/core';
  import { mapGetters } from 'vuex';
  import { GENDER } from '../utils/constants';
  import MessageBox from '../utils/messagebox';
  import urls from '../api/api-list';
  import api from '../api';
  import { NetworkUtils } from '../api/global';
  import defaultAvatar from '../../img/avatar-darkbg.png';

  const FileReader = window.FileReader;

  export default {
    data() {
      return {
        dialogVisible: false,
        changed: {},
        origin: null,
        GENDER,
        uploadAjaxUrl: NetworkUtils.getUrl(urls.URL_STAFF_UPDATE_FACE),
        uploadParams: {},
        uploadName: 'face_image',
        uploadAjaxHeaders: {},
        uploading: false,
        uploadFile: null,
        saving: false,
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
      uploadText() {
        return this.uploading ? '上传中' : '点击上传';
      },
      isCreate() {
        return !(this.changed && this.changed.id);
      },
    },
    methods: {
      show(staff) {
        if (staff && staff.id) {
          this.origin = staff;
          this.changed = Object.assign({}, staff);
        } else {
          this.changed = Object.assign({}, this.empty);
        }
        this.dialogVisible = true;
      },
      close() {
        this.origin = null;
        this.dialogVisible = false;
      },
      onUploadClick() {
        if (!this.uploading) {
          this.$refs.upload.$el.querySelector('input[type=file]').click();
        }
      },
      setFileAsSource(file) {
        /* eslint consistent-return: "off"*/
        const fileReader = new FileReader();
        fileReader.onload = (ev) => {
          this.$refs.userAvatar.setAttribute('src', ev.target.result);
        };
        fileReader.readAsDataURL(file);
      },
      onBeforeUpload(file) {
        if (!file) {
          return false;
        }
        if (this.isCreate) {
          this.setFileAsSource(file);
          this.uploadFile = file;
          return false;
        } 
        const headers = NetworkUtils.getHeaders(true);
        if (headers && headers.token) {
          this.uploadAjaxHeaders = headers;
          this.uploading = true;
        } else {
          NetworkUtils.handleUnAuthorized();
          return false;
        }
      },
      onUploadSuccess(response, file) {
        this.uploading = false;
        this.setFileAsSource(file);
      },
      onUploadError() {
        this.uploading = false;
      },
      onSubmit() {
        if (_.isEmpty(this.changed.name)) {
          MessageBox.tip('请输入员工姓名');
          return;
        }
        if (!/^1\d{10}$/.test(this.changed.tel)) {
          MessageBox.tip('请输入正确的手机号');
          return;
        }
        
        let action;
        let params = {};

        if (this.isCreate) {
          if (!this.uploadFile) {
            MessageBox.tip('请上传用户头像');
            return;
          }
          action = 'createStaff';
          params = {
            company_id: this.company.id,
            user: this.changed,
            face_image: this.uploadFile,
          };
        } else {
          action = 'updateStaff';
          params = {
            company_id: this.company.id,
            user: this.changed,
          };
        }
        
        this.saving = true;
        api[action](params).then((response) => {
          this.saving = false;
          if (this.isCreate) {
            this.dialogVisible = false;
            this.$emit('staff-added', response.body);
          } else {
            this.origin = Object.assign(this.origin, response.body);
            this.dialogVisible = false;
          }
        }, () => {
          this.saving = false;
          MessageBox.tip(`${this.isCreate ? '添加' : '更新'}用户信息失败`);
        });
      },
      handleSelectDepartment() {
        this.$parent.$refs.departmentlistModal.show({
          id: this.changed.department_id,
          name: this.changed.department_name,
        });
      },
    },
  };
</script>
<style lang="scss">
  @import '~scss_var';  

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
        overflow: hidden;
      }

      img {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
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
