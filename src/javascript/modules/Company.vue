<template>
  <div class="company-container">
    <div class="section-header">公司信息</div>
    <div class="section-row bordered">
      <form-row-label title="公司ID" :value="company.id"></form-row-label>
    </div>
    <div class="section-row bordered">
      <form-row-text-input title="公司名称" :value="company.name" description="50字以内" placeholder="请输入公司名称" :save="saveCompanyName"></form-row-text-input>
    </div>
    <div class="section-row">
      <form-row-image title="公司标志" :origin-image="company.logo" description="只支持PNG，JPG格式文件；图片尺寸100*100像素；文件大小100KB。"
        :upload-url="uploadCompanyLogoUrl" 
        :upload-params="uploadCompanyLogoParams"
        :upload-limitsize="uploadCompanyLogoLimit">  
      </form-row-image>
    </div>
    <div class="section-header">考勤机</div>
    <div class="section-header">管理员（可以进行考勤管理，登录网站管理后台）</div>
    <div class="section-header">考勤设置（每日工作时长 9小时）</div>  
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  import api from '../api';
  import urls from '../api/api-list';
  import FormRowLabel from '../components/FormRowLabel';
  import FormRowTextInput from '../components/FormRowTextInput';
  import FormRowImage from '../components/FormRowImage';

  export default {
    data() {
      return {
        uploadCompanyLogoUrl: urls.URL_UPDATE_COMPANY,
        uploadCompanyLogoLimit: 100000,
      };
    },
    computed: {
      ...mapGetters({
        company: 'currentCompany',
      }),
      uploadCompanyLogoParams() {
        return { company_id: this.company.id };
      },
    },
    components: {
      FormRowLabel,
      FormRowTextInput,
      FormRowImage,
    },
    methods: {
      saveCompanyName(name) {
        return api.updateCompany(this.company.id, { name });
      },
      saveCompanyAttendanceTime(startTime, endTime) {
        return api.updateCompany(this.company.id, { start_time: startTime, end_time: endTime });
      },
    },
};
</script>
<style lang="scss">
  @import "~scss_var";

  .company-container {
    padding: 25px 20px 60px;
    color: #313131;
    
    .section-header {
      line-height: 200%;
      border-bottom: 1px solid $linkface;
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

      .el-button {
        padding: 7px 16px;
      }

      .value-input {
      	width: calc(100% - 20px);
      	margin-top: -8px;
      	margin-bottom: -8px;
      }

      .value-image {
      	overflow: hidden;
      	img {
      		height: 100px;
      	}
      }
    }
  }
</style>
