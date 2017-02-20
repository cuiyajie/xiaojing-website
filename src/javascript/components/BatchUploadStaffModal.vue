<template>
  <span>
    <el-dialog title="批量添加员工"
               v-model="dialogVisible"
               size="small"
               custom-class="batch-upload normal small"
               :close-on-click-modal="false"
               @close="onClose">
        <div class="upload-panel">
          <span v-show="state === STATES.INIT">
            <ul class="upload-rules">
              <li>格式为JPG、JPEG、PNG</li>
              <li>大小不能超过200KB</li>
              <li>文件名称为姓名-手机号码-性别，其中各项不能为空，手机号码为11位合法号码，性别为男女</li>
            </ul>
            <div class="tx_c">
              <el-button type="primary" size="small" @click="onStart" ref="StartButton">
                点击上传图片<input type="file" class="hidden" multiple @change="onFilesAdded">
              </el-button>
            </div>
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
    <upload-success-modal ref="resultModal" :total="total" :fail="fail" @view-details="onViewDetails"></upload-success-modal>
  </span>
</template>
<script>
  import Vue from 'vue';
  import { mapGetters } from 'vuex';
  import Rx from 'rx-lite';
  import api from '../api';

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
                    查看添加失败的<a href="javascript:void(0);" @click="viewDetails">明细</a>
                 </div>
               </el-dialog>`,
    methods: {
      show() {
        this.dialogVisible = true;
      },
      close() {
        this.dialogVisible = false;
      },
      viewDetails() {
        this.$emit('view-details');
        this.dialogVisible = false;
      },
    },
  });

  const UPLOAD_ERRORS = {
    NAME_NOT_INVAILD: '文件名称不符合命名规则',
    FILE_EXTENSION: '文件格式不正确',
    FILE_SIZE: '文件大小不能超过200KB',
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
      };
    },
    computed: {
      ...mapGetters({
        company: 'currentCompany',
      }),
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
        if (this.users.length > 0 && this.state >= this.STATES.SUCCESS) {
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
              } else if (file.size > 200 * 1000) {
                return this.onFail({ 
                  filename: file.name,
                  description: UPLOAD_ERRORS.FILE_SIZE,
                });
              }
              return file;
            })
            .concatMap(file => Rx.Observable.fromPromise(api.importStaff(this.company.id, file)
              .catch(() => Rx.Observable.just({
                error: {
                  filename: file.name, 
                  description: UPLOAD_ERRORS.SERVER_ERROR,
                },
              })
              )));
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
    color: #999;
    line-height: 150%;
    padding-left: 15px;
    margin-bottom: 15px;
    list-style: circle;

    li {
      padding-bottom: 4px;
    }
  }
  
  .batch-upload.el-dialog {

    .el-dialog__body {
      padding-left: 0;
      padding-right: 0;
      max-height: 450px;
      overflow-y: auto;
    }
    .upload-panel {
      padding-left: 20px;
      padding-right: 20px;
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
