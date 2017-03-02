<template>
  <el-dialog v-model="dialogVisible" :show-close="false" custom-class="image-dialog" ref="imageDialog">
    <div class="image-container">
      <img ref="sourceImage" :src="imageUrl" alt="Source Image">
    </div>
  </el-dialog>
</template>
<script>
  const PADDING = 10;
  const defaultStyle = `margin-bottom: 50px; top: 15%; padding: ${PADDING}px;`;
  const Image = window.Image;
  export default {
    data() {
      return {
        imageUrl: '',
        dialogVisible: false,
      };
    },
    methods: {
      show(image) {
        this.imageUrl = image;
        this.setModalSize();
        this.dialogVisible = true;
      },
      setModalSize() {
        const imageObject = new Image();
        imageObject.src = this.imageUrl;
        imageObject.onload = () => {
          const dialogWidth = `${imageObject.width + (PADDING * 2)}px`;
          const dialogHeight = `${imageObject.height + (PADDING * 2)}px`;
          this.$refs.imageDialog.$refs.dialog.style.cssText = 
            `${defaultStyle} width: ${dialogWidth}; height: ${dialogHeight};`;
        };
      },
    },
  };
</script>
<style lang="scss">
  .image-dialog.el-dialog {

    .el-dialog__header {
      display: none;
    }

    .el-dialog__body {
      padding: 0;
    }

    .image-container img {
      vertical-align: middle;
    }
  }
</style>
