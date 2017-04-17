<template>
  <div class="lf-page-container attendance-container">
    <div class="lf-page-preheader">
      <el-row>
        <el-col :span="6">
          <el-date-picker size="small" :editable="false" :clearable="false" v-model="dateRange" type="daterange" placeholder="选择起止日期" @change="onDateRangeChanged"></el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-dropdown menu-align="start">
            <el-button size="small"><span class="text-wrap">{{ selectedDepartment.name }}</span><i class="el-icon-caret-bottom el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown" class="lf-header-dropdown">
               <el-dropdown-item class="text-wrap" v-for="department in departmentslist" :key="department.id" @click.native="selectDepartment(department);">{{ department.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="15">
           <el-button size="small" type="primary" @click="onSearch">查询</el-button>
        </el-col>
      </el-row>      
      <div class="lf-page-header-buttons">
        <el-button size="small" type="primary" @click="onExport">导出</el-button>
      </div>
    </div>
    <div class="lf-page-header bordered">
      <span class="lf-page-caption pin">查询日期{{ daysQueried }}天；正常{{ normal }}人次，迟到{{ latecomer }}人次，缺勤{{ absence }}人次，请假{{ leave }}人次。</span>
    </div>
    <el-table class="custom-table mt15"
      row-key="id"
      :empty-text="emptyText"
      :data="dataStore"
      @row-click="onRowClick">
      <el-table-column label="日期" property="day"><template scope="scope">{{ dateFormatter(scope.row.day) }}</template></el-table-column>
      <el-table-column label="正常" property="normal"></el-table-column>
      <el-table-column label="迟到" property="latecomer"></el-table-column>
      <el-table-column label="缺勤" property="absence"></el-table-column>
      <el-table-column label="早退" property="leave"></el-table-column>
    </el-table>
    <div class="table-footer">
      <pagination class="table-pagination" 
        :page-size="pageSize"
        :total="total"
        :history-store="historyStore"
        @pagination-pagechange="onPageChanged"></pagination>
    </div>
    <day-attendance-modal ref="DayAttendanceModal"></day-attendance-modal>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  import moment from 'moment';
  import Pagination from '../components/Pagination';
  import DayAttendanceModal from '../components/DayAttendanceModal';
  import api from '../api';
  import { ServerSuccessStatus } from '../api/httpstatus';
  import utils from '../utils';
  import { dateFilter } from '../utils/filters';
  import MessageBox from '../utils/messagebox';

  const MAX_EXPORT_DURATION = 32;

  export default {
    data() {
      const end = moment().add(-1, 'days').endOf('day')._d;
      const start = moment(end).add(-1, 'months')._d;
      return {
        emptyText: '暂时没有考勤统计',
        pageSize: 10,
        total: 0,
        dataStore: [],
        historyStore: [],
        lastAttendanceId: 0,
        normal: 0,
        latecomer: 0,
        absence: 0,
        leave: 0,
        loading: false,
        daysQueried: dateFilter.duration2Days(start, end),
        dateRange: [start, end],
        selectedDepartment: { id: 0, name: '所有部门' },
      };
    },
    computed: {
      ...mapGetters({
        company: 'currentCompany',
        departments: 'departments',
      }),
      departmentslist() {
        return [{ id: 0, name: '所有部门' }].concat(this.departments);
      },
    },
    components: {
      Pagination,
      DayAttendanceModal,
    },
    methods: {
      getDataTable(page) {
        return this.historyStore.slice(this.pageSize * (page - 1), this.pageSize * page);
      },
      onDateRangeChanged() {
        const range = this.dateRange;
        if (range && range.length === 2) {
          this.daysQueried = dateFilter.duration2Days(range[0], range[1]);
        }
      },
      selectDepartment(department) {
        this.selectedDepartment = department;
      },
      onSearch() {
        this.lastAttendanceId = 0;
        this.historyStore = [];
        this.fetchAttendanceAnalysis(false, 1);
      },
      onExport() {
        if (this.daysQueried > MAX_EXPORT_DURATION) {
          MessageBox.tip('最多只能导出一个月（31天）的考勤统计');
          return;
        }

        const startDateSStr = dateFilter.toShortString(this.dateRange[0]);
        const endDateSStr = dateFilter.toShortString(this.dateRange[1]);

        MessageBox.lConfirm(`导出本公司从
          ${dateFilter.toShortString(this.dateRange[0])}到
          ${dateFilter.toShortString(this.dateRange[1])}之间的考勤统计？`)
        .then(() => {
          api.downloadAttendanceAnalysis(
            this.company.id, 
            this.dateRange[0], 
            this.dateRange[1]).then((data) => {
              if (data.statusText === ServerSuccessStatus.status) {
                utils.readBlobAsFile(data.bodyBlob, window, `${startDateSStr}至${endDateSStr}考勤统计.xls`);
              }
            });
        }, () => {});
      },
      dateFormatter(day) {
        return dateFilter.toStringWithWeek(moment(day));
      },
      // fetch data async
      fetchAttendanceAnalysis(fromLocale, page) {
        if (fromLocale) {
          this.dataStore = this.getDataTable(page);
        } else {
          this.loading = true;
          api.fetchAttendanceAnalysis(this.company.id, 
              this.dateRange[0], 
              this.dateRange[1],
              this.selectedDepartment.id,
              this.pageSize,
              this.lastAttendanceId).then((response) => {
                this.lastAttendanceId = response.body.last_attendance_id;
                this.historyStore = this.historyStore.concat(response.body.attendances);
                this.dataStore = this.getDataTable(page);
                this.total = response.body.total || 0;
                this.normal = response.body.normal;
                this.absence = response.body.absence;
                this.latecomer = response.body.latecomer;
                this.leave = response.body.leave;
                this.loading = false;
              }, () => {
                this.loading = false;
              });
        }
      },
      onPageChanged(page) {
        this.fetchAttendanceAnalysis(!page.fetchData, page.newPage);
      },
      onRowClick(row) {
        this.$refs.DayAttendanceModal.show(row, this.selectedDepartment);
      },
    },
    watch: {
      company: {
        immediate: true,
        handler() {
          if (this.company && this.company.id) {
            this.fetchAttendanceAnalysis(false, 1);
          }
        },
      },
    },
  };
</script>
