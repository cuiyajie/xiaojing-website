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
                 :show-upload-list="false">
      	<el-button type="primary" size="small" :disabled="loading" :loading="loading">上传</el-button>
      </el-upload>
    </div>
  </el-row>
</template>
<script>
    import defaultLogo from '../../img/company-logo.png';
    import { HttpUtils } from '../api/global';

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
          return HttpUtils.getUrl(this.uploadUrl);
        },
        ajaxHeaders() {
          const headers = HttpUtils.getHeaders(true);
          if (headers && headers.token) {
            return headers;
          } 
          HttpUtils.handleUnAuthorized();
          return null;
        },
      },
      props: ['title', 'description', 'originImage', 'uploadUrl', 'uploadName', 'uploadParams', 'uploadLimitsize', 'uploadSuccess'],
      methods: {
        handleSuccess() {
          if (this.uploadSuccess) {
            this.uploadSuccess();
          }
        },
      },
    };
</script>
<style>
	.buttons-area .el-upload {
    width: auto;
	}
</style>
