<template>
  <span>
    <el-dialog :title="title"
               v-model="dialogVisible"
               size="small"
               custom-class="batch-upload normal"
               :close-on-click-modal="false"
               @close="onClose">
        <div class="upload-panel">
          <span v-show="state === STATES.INIT">
            <el-row>
              <el-col :span="12">
                <el-form>
                  <el-form-item label="上传照片">
                    <el-button type="primary" class="upload-button" size="small" @click="onStart" ref="StartButton">
                      选择文件
                      <input type="file" class="hidden" multiple @change="onFilesAdded">
                    </el-button>
                  </el-form-item>
                  <el-form-item label="注意事项"></el-form-item>
                  <el-form-item
                    <ul class="upload-rules">
                      <li>只支持PNG、JPG以及JPEG文件格式</li>
                      <li>图像要求长宽等长，并且不能小于600像素</li>
                      <li>大小不能超过500KB</li>
                      <li>照片命名规则为&#8220;姓名-手机号码-性别&#8221;</li>
                    </ul>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form>
                  <el-form-item label="图示">
                    <div class="upload-sample">
                      <div class="u-s-img"><img :src="UploadSampleAvatar" alt="Upload Sample Image"></div>
                      <div class="u-s-text">周晓丽-18712345678-女</div>
                    </div>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </span>
          <span v-show="state === STATES.UPLOADING">
            <div class="upload-progress">
              <el-progress type="circle" :percentage="progress" :status="progressStatus"></el-progress>
            </div>
          </span>
          <span v-show="state === STATES.RESULT">
            <ul class="fail-list">
              <li v-for="f in failures">
                <div class="fail-row">
                  [文件]&nbsp;{{ f.filename }}
                  <div>[错误]&nbsp;{{ f.description }}</div>
                </div>
              </li>
            </ul>
          </span>
        </div>
    </el-dialog>
    <upload-success-modal ref="resultModal" :total="total" :fail="fail" @view-details="onViewDetails" @close="onClose"></upload-success-modal>
  </span>
</template>
<script>
  import Vue from 'vue';
  import { mapGetters } from 'vuex';
  import Rx from 'rx-lite';
  import api from '../api';
  import UploadSampleAvatar from '../../img/upload-sample-image.jpg';

  const MAX_FILESIZE = 500 * 1024;
  const FILE_DIMENSION = 600;
  const Image = window.Image;

  Vue.component('upload-success-modal', {
    data() {
      return {
        dialogVisible: false,
      };
    },
    props: ['total', 'fail'],
    template: `<el-dialog title="添加完成" 
                 v-model="dialogVisible" 
                 size="small" 
                 custom-class="modal normal tiny" 
                 :close-on-click-modal="false" 
                 :show-close="false">
                 <div class="upload-sucss">
                    本次添加{{ total }}人，{{ fail }}个人添加失败<br/>
                    <span v-show="fail > 0">查看添加失败的<a href="javascript:void(0);" @click="viewDetails">明细</a></span>
                    <span v-show="fail == 0"><a href="javascript:void(0);" @click="close">关闭</a></span>
                 </div>
               </el-dialog>`,
    methods: {
      show() {
        this.dialogVisible = true;
      },
      close() {
        this.dialogVisible = false;
        this.$emit('close');
      },
      viewDetails() {
        this.$emit('view-details');
        this.dialogVisible = false;
      },
    },
  });

  const UPLOAD_ERRORS = {
    NAME_NOT_INVAILD: '照片命名规则为“姓名-手机号码-性别”',
    FILE_EXTENSION: '只支持PNG、JPG以及JPEG文件格式',
    FILE_SIZE: '大小不能超过500KB',
    FILE_DIMENSION: '图像要求长宽等长，并且不能小于600像素',
    SERVER_ERROR: '服务器错误',
    NETWORK_ERROR: '网络错误',
  };

  export default {
    data() {
      const STATES = {
        INIT: 1,
        UPLOADING: 2,
        SUCCESS: 3,
        RESULT: 4,
      };
      return {
        dialogVisible: false,
        STATES,
        state: STATES.INIT,
        users: [],
        failures: [],
        total: 0,
        success: 0,
        fail: 0,
        progressStatus: '',
        UploadSampleAvatar,
      };
    },
    computed: {
      ...mapGetters({
        company: 'currentCompany',
      }),
      title() {
        let title;
        if (this.state === this.STATES.INIT) {
          title = '选择文件';
        } else {
          title = '批量添加员工';
        }
        return title;
      },
      progress() {
        let progress;
        if (this.total > 0) {
          progress = Math.floor(((this.success + this.fail) * 100) / this.total);
        } else {
          progress = 0;
        }

        if (progress === 100) {
          this.progressStatus = 'success';
          setTimeout(() => {
            this.$refs.resultModal.show();
          }, 800);
        }
        return progress;
      },
    },
    methods: {
      onFail(error) {
        this.fail++;
        this.failures.push(error);
        return false;
      },
      onSuccess(user) {
        this.success++;
        this.users.push(user);
      },
      onStart() {
        if (this.state === this.STATES.INIT) {
          const file = this.$refs.StartButton.$el.querySelector('input[type=file]');
          if (file) {
            file.click();
          }
        }
      },
      reset() {
        this.dialogVisible = false;
        this.state = this.STATES.INIT;
        this.fail = 0;
        this.failures = [];
        this.success = 0;
        this.users = [];
        this.total = 0;
        this.progressStatus = '';
      },
      onClose() {
        if (this.users.length > 0) {
          this.$emit('staff-batch-added', this.users.slice());
        }
        this.reset();
      },
      onFilesAdded(event) {
        const files = event.target.files;
        if (files && files.length >= 0) {
          this.total = files.length;
          // setup Rx
          const source = Rx.Observable.fromArray(files)
            .delay(500)
            .filter((file) => {
              const filename = file.name.slice(0, file.name.lastIndexOf('.'));
              if (!/^.+-1\d{10}-[男|女]$/.test(filename)) {
                return this.onFail({ 
                  filename: file.name, 
                  description: UPLOAD_ERRORS.NAME_NOT_INVAILD,
                });
              } else if (/image\/(jpeg|jpg|png)]/.test(file.type)) {
                return this.onFail({ 
                  filename: file.name, 
                  description: UPLOAD_ERRORS.FILE_EXTENSION,
                });
              } else if (file.size > MAX_FILESIZE) {
                return this.onFail({ 
                  filename: file.name,
                  description: UPLOAD_ERRORS.FILE_SIZE,
                });
              }
              return file;
            })
            .flatMap(file => Rx.Observable.create((observer) => {
              const image = new Image();
              const wURL = window.URL || window.webkitURL;
              if (wURL) {
                image.src = wURL.createObjectURL(file);
                image.onload = () => {
                  if (image.width === image.height && image.width >= FILE_DIMENSION) {
                    observer.onNext(file);
                  } else {
                    this.onFail({
                      filename: file.name,
                      description: UPLOAD_ERRORS.FILE_DIMENSION,
                    });
                    observer.onCompleted();
                  }
                };
              }
            }))
            .flatMap(file => Rx.Observable.fromPromise(
              api.importStaff(this.company.id, file)
                .catch(err => Rx.Observable.just({
                  error: {
                    filename: file.name, 
                    description: err && err.body && err.body.message ? 
                                  err.body.message :
                                  UPLOAD_ERRORS.SERVER_ERROR,
                  },
                }))
              )
            );

          // subscribe Rx
          source.subscribe((val) => {
            if (val && val._value && val._value.error) {
              this.onFail(val._value.error);
            } else if (val && val.body.user) {
              this.onSuccess(val.body.user);
            }
          });

          this.state = this.STATES.UPLOADING;
        }
      },
      onViewDetails() {
        this.state = this.STATES.RESULT;
      },
    },
  };
</script>
<style lang="scss">
  @import '~scss_var';
  
  ul.upload-rules {
    font-size: 12px;
    line-height: 150%;
    padding-left: 15px;
    margin-bottom: 15px;
    list-style: circle;

    li {
      padding-bottom: 4px;
    }
  }
  
  .batch-upload.el-dialog {
    width: 560px;
    min-height: 240px;

    .el-dialog__body {
      padding-left: 0;
      padding-right: 0;
      max-height: 450px;
      overflow-y: auto;
    }

    .upload-panel {
      padding-left: 20px;
      padding-right: 20px;

      .el-row .el-col:first-child {
        padding-right: 20px;
      }

      .el-row .el-col:last-child .el-form-item__content {
        padding-left: 60px;
      }

      .el-form-item {
        margin-bottom: 5px;
      }

      .upload-button {
        margin-left: 24px;
      }

      .upload-sample {
        text-align: center;

        .u-s-img {
          width: 150px;
          height: 150px;
          margin: 0 auto;

          img {
            width: 100%;
            height: 100%;
            vertical-align: middle;
          }
        }

        .u-s-text {
          font-size: 12px;
          color: #999;
        }
      }
    }

    .upload-progress {
      text-align: center;
      padding: 15px 0;
    }

    .fail-list {
      font-size: 12px;
      line-height: 150%;
      color: #999;

      li + li {
        padding-top: 5px;
        padding-bottom: 5px;
      }
    }
  }

</style>
