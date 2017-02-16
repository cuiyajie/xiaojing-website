<template>
  <el-row>
    <el-col :span="6">上班时间：<span class="ml10">{{ startTime }}</span></el-col>
    <el-col :span="6">下班时间：<span class="ml10">{{ endTime }}</span></el-col>
    <el-col :span="12">24小时制</el-col>
    <div class="buttons-area">
      <el-button type="primary" size="small" @click="showDialog">设置</el-button>
    </div>
    <time-settings ref="TimeSettingModal" :start-time="startTime" :end-time="endTime" :save="save"></time-settings>
  </el-row>
</template>
<script>
  import _ from 'lodash/core';
  import _object from 'lodash/fp/object';
  import MessageBox from '../utils/messagebox';

export default {
    props: ['startTime', 'endTime', 'save'],
    components: {
      timeSettings: {
        data() {
          return {
            originalForm: {},
            dialogVisible: false,
            loading: false,
          };
        },
        props: ['startTime', 'endTime', 'save'],
        computed: {
          form() {
            /* eslint no-param-reassign: ["error"]*/
            const times = _.reduce([this.startTime, this.endTime], (timeArr, t) => {
              let newTimeArr;
              if (t && t.split(':').length === 2) {
                newTimeArr = timeArr.concat(t.split(':'));
              } else {
                newTimeArr = timeArr.concat(['00', '00']);
              }
              return newTimeArr;
            }, []);
            this.originalForm = {
              sMinute: times[0],
              sSecond: times[1],
              eMinute: times[2],
              eSecond: times[3],
            };
            return _object.assign({}, this.originalForm);
          },
        },
        template: `<el-dialog title="考勤设置" v-model="dialogVisible" custom-class="time-setting normal tiny" :close-on-click-modal="false" :show-close="false">
                      <el-form :model="form">
                          <el-form-item label="上班时间">
                            <el-input v-model="form.sMinute" size="mini" :disabled="loading"></el-input>
                            <span class="form-seperator">:</span>
                            <el-input v-model="form.sSecond" size="mini" :disabled="loading"></el-input>
                          </el-form-item>
                          <el-form-item label="下班时间">
                            <el-input v-model="form.eMinute" size="mini" :disabled="loading"></el-input>
                            <span class="form-seperator">:</span>
                            <el-input v-model="form.eSecond" size="mini" :disabled="loading"></el-input>
                          </el-form-item>
                      </el-form>
                      <span slot="footer" class="dialog-footer">
                        <el-button type="primary" size="small" @click="saveSetting" :loading="loading">确定</el-button>
                        <el-button size="small" @click="cancel" :disabled="loading">取消</el-button>
                      </span>
                    </el-dialog>`,
        methods: {
          saveSetting() {
            const minuteRegex = /^(?:2[0-3]|[01]?[0-9])$/;
            const secondRegex = /^[0-5][0-9]$/;
            let valid = true;
            _.forEach(this.form, (v, k) => { // eslint-disable-line
              if (!(k.indexOf('Minute') >= 0 ? minuteRegex : secondRegex).test(v)) {
                valid = false;
                return false;
              }
            });
            if (!valid) {
              MessageBox.tip('请输入合法的时间');
              return;
            }

            const startTime = `${this.form.sMinute}:${this.form.sSecond}`;
            const endTime = `${this.form.eMinute}:${this.form.eSecond}`;

            if (this.save) {
              this.loading = true;
              this.save(startTime, endTime)
                .then(() => {
                  this.loading = false;
                  this.dialogVisible = false;
                  this.originalForm = _object.assign({}, this.form);
                }, () => {
                  this.loading = false;
                });
            }
          },
          cancel() {
            this.form = _object.assign({}, this.originalForm);
            this.dialogVisible = false;
          },
        },
        
      },
    },
    methods: {
      showDialog() {
        this.$refs.TimeSettingModal.dialogVisible = true;
      },
    },
};
</script>
<style lang="scss">

  .time-setting {
    .el-input {
      display: inline-block;  
      width: 36px;
    }

    .el-form-item {
      margin-bottom: 5px;
    }

    .el-form-item__content {
      height: 36px;
    }

    .form-seperator {
      vertical-align: top;
      margin-left: 8px;
      margin-right: 6px;
    }

    &.el-dialog--small {
      width: 212px;
    }

    .el-dialog__footer {
      padding-top: 0;
      text-align: center;
    }
  }
</style>
