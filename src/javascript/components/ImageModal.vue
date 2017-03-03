<template>
  <el-dialog v-model="dialogVisible" :show-close="false" custom-class="image-dialog" ref="imageDialog">
    <div class="image-container">
      <img ref="sourceImage" :src="imageUrl" alt="Source Image">
    </div>
  </el-dialog>
</template>
<script>
  const PADDING = 10;
  const DIALOG_MARGIN = 50;
  const defaultStyle = `padding: ${PADDING}px;`;
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
      getModalSize(imageObject) {
        let dialogWidth = imageObject.width + (PADDING * 2);
        let dialogHeight = imageObject.height + (PADDING * 2);
        const ratio = dialogWidth / dialogHeight;
        const winRatio = window.innerWidth / window.innerHeight;
        if (ratio > winRatio && dialogWidth + (DIALOG_MARGIN * 2) > window.innerWidth) {
          dialogWidth = window.innerWidth - (DIALOG_MARGIN * 2);
          dialogHeight = Math.ceil(dialogWidth / ratio);
        } else if (ratio < winRatio && dialogHeight + (DIALOG_MARGIN * 2) > window.innerHeight) {
          dialogHeight = window.innerHeight - (DIALOG_MARGIN * 2);
          dialogWidth = Math.ceil(dialogHeight * ratio);
        }
        const dialogMarginTop = Math.floor((window.innerHeight - dialogHeight) / 2);
        return {
          dialogWidth,
          dialogHeight,
          dialogMarginTop,
        };
      },
      setModalSize() {
        const imageObject = new Image();
        imageObject.src = this.imageUrl;
        imageObject.onload = () => {
          const modalSize = this.getModalSize(imageObject);
          this.$refs.imageDialog.$refs.dialog.style.cssText = 
            `${defaultStyle} 
             width: ${modalSize.dialogWidth}px; 
             height: ${modalSize.dialogHeight}px; 
             margin-top: ${modalSize.dialogMarginTop}px`;
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
      text-align: center;
    }

    .image-container img {
      width: 100%;
      height: auto;
      vertical-align: middle;
    }
  }
</style>
