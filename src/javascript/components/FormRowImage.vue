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
      <el-upload :action="uploadUrl"
                 :data="uploadParams"
                 :on-preview="handlePreview"
                 :on-success="handleSuccess">
      	<el-button type="primary" size="small">上传</el-button>
      </el-upload>
    </div>
  </el-row>
</template>
<script>
    import defaultLogo from '../../img/company-logo.png';

    export default {
      data() {
        return {
          
        };
      },
      computed: {
        currentLogo() {
          return this.originImage && this.originImage !== '' ? this.originImage : defaultLogo; 
        },
      },
      props: ['title', 'description', 'originImage', 'uploadUrl', 'uploadParams', 'uploadLimitsize'],
      methods: {
        handlePreview(file) {
          console.log(file);
        },
        handleSuccess() {

        },
      },
    };
</script>
<style>
	.buttons-area .el-upload {
    width: auto;
	}
</style>
