<template>
  <el-dialog :title="title" 
      v-model="dialogVisible" 
      size="small" 
      custom-class="day-attendance normal" 
      :close-on-click-modal="false"
      @close="onClose">
    <div class="dialog-body">
      <el-tabs v-model="current" @tab-click="onTabClick" ref="Hello">
        <el-tab-pane v-for="tab in tabs" :name="tab" :label="tabTitle[tab]">
         <attendance-record-table :tab="tab" :name="statusMap[tab]" :day="day" :ref="tabRefs[tab]"></attendance-record-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>
<script>
  import _ from 'lodash/core';
  import moment from 'moment';
  import { dateFilter } from '../utils/filters';
  import AttendanceRecordTable from './AttendanceRecordTable';

  export default {
    data() {
      const statusMap = {
        normal: '正常',
        latecomer: '迟到',
        absence: '缺勤',
        leave: '早退',
      };
      const tabs = Object.keys(statusMap);
      const tabRefs = {};
      _.each(tabs, (v) => {
        tabRefs[v] = `${v}TabTable`;
      });
      return {
        dialogVisible: false,
        data: null,
        day: null,
        tabs,
        statusMap,
        tabRefs,
        current: tabs[0],
      };
    },
    computed: {
      title() {
        return dateFilter.toStringWithWeek(moment(this.day));
      },
      tabTitle() {
        const obj = {};
        if (this.data && this.data.day) {
          _.each(this.statusMap, (v, k) => {
            obj[k] = `${v}（${this.data[k]}）`;
          });
        }
        return obj;
      },
    },
    components: {
      AttendanceRecordTable,
    },
    methods: {
      show(row) {
        if (row && row.day) {
          this.data = row;
          this.day = row.day;
          this.dialogVisible = true;
          this.current = this.tabs[0];
          this.$nextTick(() => {
            this.$refs[`${this.current}TabTable`][0].show();
          });
        }
      },
      onTabClick(tab) {
        this.current = tab.name;
        this.$refs[`${this.current}TabTable`][0].show();
      },
      onClose() {
        _.each(this.tabs, (v) => {
          this.$refs[`${v}TabTable`][0].clear();
        });
      },
    },
  };
</script>
<style lang="scss">
  @import '~scss_var';

  .day-attendance {
    width: 90%;
    max-width: 1100px;
    min-width: 900px;

    &.el-dialog.normal .el-dialog__body {
      padding: 0;
    }

    .dialog-body {
      padding: 0 20px 20px;
      position: relative;

      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 40px;
        background-color: $lightblue;
      }
    }

    .el-tabs__header {
      border-bottom: none;
    }

    .el-tabs__active-bar {
      bottom: auto;
      top: 0;

    }
    .el-tabs__item {
      color: $linkface;
      transition: background-color .3s cubic-bezier(.645,.045,.355,1);

      &.is-active {
        background-color: #FFF;
        color: #333;
      }
    }
  }
</style>
