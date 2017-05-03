<template>
  <div class="lf-page-container company-container">
    <div class="section-header">公司信息</div>
    <div class="section-row bordered">
      <form-row-label title="公司ID" :value="company.id"></form-row-label>
    </div>
    <div class="section-row bordered">
      <form-row-text-input title="公司名称" :value="company.name" description="50字以内" placeholder="请输入公司名称" :save="saveCompanyName"></form-row-text-input>
    </div>
    <div class="section-row image-row">
      <form-row-image title="公司标志" :origin-image="company.logo" description="只支持PNG，JPG，JPEG格式文件；文件小于400KB。"
         upload-name="logo" 
        :upload-url="uploadCompanyLogoUrl"
        :upload-extensions="uploadExtensions" 
        :upload-params="uploadCompanyLogoParams"
        :upload-limitsize="uploadCompanyLogoLimit"
        :upload-success="saveCompanyLogoSuccess">  
      </form-row-image>
    </div>
    <div class="section-header">管理员</div>
    <div class="section-row admin-row">
      <el-row>
        <el-col :span="24">可以进行考勤管理，登录网站管理后台</el-col>
        <div class="buttons-area">
          <el-button type="primary" size="small" @click="showAdminSetting">设置</el-button>
        </div>
      </el-row>
    </div>
    <div class="section-header">考勤设置（每日工作时长 9小时）</div>
    <div class="section-row">
      <form-row-attendance-time :start-time="company.start_time" :end-time="company.end_time" :save="saveCompanyAttendanceTime"></form-row-attendance-time>
    </div>
    <div class="section-row bordered">
      <form-row-text-input title="Web Hook" :value="company.callback_url" placeholder="请输入Web Hook地址" :save="saveWebHook"></form-row-text-input>
    </div>
    <admin-setting-modal ref="adminSettingModal"></admin-setting-modal>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  import api from '../api';
  import urls from '../api/api-list';
  import utils from '../utils/filters';
  import FormRowLabel from '../components/FormRowLabel';
  import FormRowTextInput from '../components/FormRowTextInput';
  import FormRowImage from '../components/FormRowImage';
  import AdminSettingModal from '../components/AdminSettingModal';
  import FormRowAttendanceTime from '../components/FormRowAttendanceTime';

  export default {
    data() {
      return {
        uploadCompanyLogoUrl: urls.URL_UPDATE_COMPANY,
        uploadCompanyLogoLimit: 400 * 1024,
        uploadExtensions: ['jpg', 'jpeg', 'png'],
      };
    },
    computed: {
      ...mapGetters({
        company: 'currentCompany',
        admin: 'currentUser',
      }),
      uploadCompanyLogoParams() {
        return { company_id: this.company.id, company: JSON.stringify({}) };
      },
    },
    components: {
      FormRowLabel,
      FormRowTextInput,
      FormRowImage,
      AdminSettingModal,
      FormRowAttendanceTime,
    },
    methods: {
      saveCompanyName(name) {
        return api.updateCompany(this.company.id, { name });
      },
      saveWebHook(url) {
        return api.updateCompany(this.company.id, { callback_url: url });
      },
      saveCompanyLogoSuccess(data) {
        if (data && data.logo) {
          this.$store.dispatch('updateCompany', { logo: utils.noCacheUrl(data.logo) });
        }
      },
      saveCompanyAttendanceTime(startTime, endTime) {
        const updatedFields = { 
          start_time: startTime, 
          end_time: endTime, 
        };
        return api.updateCompany(this.company.id, updatedFields).then(() => {
          this.$store.dispatch('updateCompany', updatedFields);
        });
      },
      showAdminSetting() {
        this.$refs.adminSettingModal.show();
      },
    },
};
</script>
<style lang="scss">
  @import "~scss_var";

  .company-container {
    
    .section-header {
      margin-top: 30px;
      line-height: 200%;
      border-bottom: 1px solid $linkface;

      &:first-child {
        margin-top: 14px;
      }
    }

    .section-row {
      font-size: 14px;
      padding-top: 15px;
      padding-bottom: 15px;
      position: relative;

      &.bordered {
        border-bottom: 1px solid #eee;
      }

      .buttons-area {
        position: absolute;
        right: 0;
        top: -6px;
        z-index: 10;
      }

      .el-col {
      	&.mid {
      	  padding-right: 15px;
      	}

      	&.pad-btn {
      		padding-right: 70px;
      	}

      	&.pad-btns {
      		padding-right: 140px;
      	}
      }

      .value-input {
      	width: calc(100% - 20px);
      	margin-top: -8px;
      	margin-bottom: -8px;
      }

      &.image-row {
        line-height: 150%;
      }

      .value-image {
      	overflow: hidden;
      	img {
          vertical-align: middle;
      		height: 100px;
      	}
      }

      &.admin-row {
        line-height: 40px;

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          vertical-align: middle;
        }
      }
    }
  }
</style>
