<template>
  <el-row>
    <el-col :span="6"><div class="section-val">{{ title }}:</div></el-col>
    <el-col :span="6" class="mid">
      <div class="section-val value-image">
        <img :src="currentLogo" alt="Image Logo">
      </div>
    </el-col>
    <el-col :span="12" class="pad-btn"><div class="section-val">{{ description }}</div></el-col>
    <div class="buttons-area">
      <el-upload :action="ajaxUrl"
                 :data="uploadParams"
                 :name="uploadName"
                 :headers="ajaxHeaders"
                 :on-success="handleSuccess"
                 :show-upload-list="false"
                 :before-upload="onBeforeUpload">
      	<el-button type="primary" size="small" :disabled="loading" :loading="loading">上传</el-button>
      </el-upload>
    </div>
  </el-row>
</template>
<script>
    import prettySize from 'prettysize';
    import defaultLogo from '../../img/company-logo.png';
    import { NetworkUtils } from '../api/global';
    import MessageBox from '../utils/messagebox';

    export default {
      data() {
        return {
          loading: false,
        };
      },
      computed: {
        currentLogo() {
          return this.originImage && this.originImage !== '' ? this.originImage : defaultLogo; 
        },
        ajaxUrl() {
          return NetworkUtils.getUrl(this.uploadUrl);
        },
        ajaxHeaders() {
          const headers = NetworkUtils.getHeaders(true);
          if (headers && headers.token) {
            return headers;
          } 
          NetworkUtils.handleUnAuthorized();
          return null;
        },
      },
      props: ['title', 'description', 'originImage', 'uploadUrl', 'uploadName', 'uploadParams', 'uploadLimitsize', 'uploadExtensions', 'uploadSuccess'],
      methods: {
        handleSuccess(data) {
          if (this.uploadSuccess && data.result) {
            this.uploadSuccess(data.result);
          }
        },
        onBeforeUpload(file) {
          if (!file) {
            return false;
          }
          
          if (file.size > this.uploadLimitsize) {
            MessageBox.tip(`文件大小不能超过${prettySize(this.uploadLimitsize)}`);
            return false;
          }

          const regex = new RegExp(`image/(${this.uploadExtensions.join('|')})`);
          if (this.uploadExtensions && !regex.test(file.type)) {
            MessageBox.tip('文件格式不符合要求');
            return false;
          }

          return file;
        },
      },
    };
</script>
<style>
	.buttons-area .el-upload {
    width: auto;
	}
</style>
