<template>
  <div class="lf-page-container attendance-container">
    <div class="lf-page-preheader">
      <el-row>
        <el-col :span="6">
          <el-date-picker size="small" :editable="false" :clearable="false" v-model="dateRange" type="daterange" placeholder="选择起止日期" @change="onDateRangeChanged"></el-date-picker>
        </el-col>
        <el-col :span="3"> 
          <staff-auto-complete @handle-request="handleRequest" @handle-select="handleSelect"></staff-auto-complete>
        </el-col>
        <el-col :span="3">
          <el-dropdown menu-align="start">
            <el-button size="small">{{ selectedDepartment.name }}<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown" class="lf-header-dropdown">
               <el-dropdown-item v-for="department in departmentslist" :key="department.id" @click.native="selectDepartment(department);">{{ department.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="12">
           <el-button size="small" type="primary" @click="onSearch">查询</el-button>
        </el-col>
      </el-row>    
      <div class="lf-page-header-buttons">
        <el-button size="small" type="primary" @click="onExport">导出</el-button>
      </div>
    </div>
    <div class="lf-page-header bordered">
      <span class="lf-page-caption pin">查询日期{{ daysQueried }}天；共{{ total }}条查询记录。</span>
    </div>
    <el-table class="custom-table checkin mt15"
      row-key="id"
      :empty-text="emptyText"
      :data="dataStore">
      <el-table-column label="日期"><template scope="scope">{{ dateFormatter(scope.row.check_time) }}</template></el-table-column>
      <el-table-column label="员工" property="user_name"></el-table-column>
      <el-table-column label="部门" property="department_name"></el-table-column>
      <el-table-column label="职务" property="job_position"></el-table-column>
      <el-table-column label="人脸照片"><template scope="scope"><img class="thumb-image" :src="scope.row.face_image" alt="User FaceImage" @click="viewSourceImage(scope.row.face_image)"></template></el-table-column>
    </el-table>
    <div class="table-footer">
      <pagination class="table-pagination" 
        ref="Pagination"
        :page-size="pageSize"
        :total="total"
        :history-store="historyStore"
        @pagination-pagechange="onPageChanged"></pagination>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  import moment from 'moment';
  import Pagination from '../components/Pagination';
  import StaffAutoComplete from '../components/StaffAutoComplete';
  import api from '../api';
  import { ServerSuccessStatus } from '../api/httpstatus';
  import utils from '../utils';
  import { dateFilter } from '../utils/filters';
  import ImageModal from '../utils/imagemodal';
  import MessageBox from '../utils/messagebox';

  const MAX_EXPORT_DURATION = 31;

  export default {
    data() {
      const end = new Date();
      const start = end;
      return {
        emptyText: '暂时没有员工的考勤记录',
        pageSize: 15,
        total: 0,
        dataStore: [],
        historyStore: [],
        lastCheckinId: 0,
        daysQueried: dateFilter.duration2Days(start, end),
        dateRange: [start, end],
        selectedDepartment: { id: 0, name: '所有部门' },
        selectedStaffId: 0,
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
      StaffAutoComplete,
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
      handleRequest(queryString, cb) {
        if (queryString === '') {
          this.selectedStaffId = 0;
          cb([]);
        }
      },
      handleSelect(staff) {
        this.selectedStaffId = staff.id;
      },
      selectDepartment(department) {
        this.selectedDepartment = department;
      },
      onSearch() {
        this.lastCheckinId = 0;
        this.historyStore = [];
        this.total = 0;
        this.$refs.Pagination.reset();
        this.fetchStaffCheckins(false, 1);
      },
      onExport() {
        if (this.daysQueried > MAX_EXPORT_DURATION) {
          MessageBox.tip('最多只能导出一个月（31天）的员工考勤记录');
          return;
        }

        const startDateSStr = dateFilter.toShortString(this.dateRange[0]);
        const endDateSStr = dateFilter.toShortString(this.dateRange[1]);
        const departmentText = this.selectDepartment && this.selectedDepartment.id ? this.selectedDepartment.name : '';

        MessageBox.lConfirm(`导出本公司从
          ${startDateSStr}到
          ${endDateSStr}${departmentText}的员工考勤记录？`)
        .then(() => {
          api.downloadStaffCheckins(
            this.company.id, 
            this.dateRange[0], 
            this.dateRange[1],
            this.selectedDepartment.id).then((data) => {
              if (data.statusText === ServerSuccessStatus.status) {
                utils.readBlobAsFile(
                  data.bodyBlob, 
                  window, 
                  `${startDateSStr}至${endDateSStr}${departmentText}员工考勤记录.xls`);
              }
            });
        }, () => {});
      },
      dateFormatter(day) {
        return dateFilter.toLongDateString(moment(day));
      },
      // fetch data async
      fetchStaffCheckins(fromLocale, page) {
        if (fromLocale) {
          this.dataStore = this.getDataTable(page);
        } else {
          this.loading = true;
          api.fetchStaffCheckins(this.company.id, 
              this.dateRange[0], 
              this.dateRange[1],
              this.lastCheckinId,
              this.pageSize,
              this.selectedDepartment.id,
              this.selectedStaffId).then((response) => {
                this.lastCheckinId = response.body.last_checkin_id;
                this.historyStore = this.historyStore.concat(response.body.checkins);
                this.dataStore = this.getDataTable(page);
                this.total = response.body.total;
                this.loading = false;
              }, () => {
                this.loading = false;
              });
        }
      },
      onPageChanged(page) {
        this.fetchStaffCheckins(!page.fetchData, page.newPage);
      },
      viewSourceImage(image) {
        ImageModal.show(image);
      },
    },
    watch: {
      company: {
        immediate: true,
        handler() {
          if (this.company && this.company.id) {
            this.fetchStaffCheckins(false, 1);
          }
        },
      },
    },
  };
</script>
<style lang="scss">
  .custom-table.checkin {
    img.thumb-image {
      cursor: pointer;
      width: auto;
      height: 40px;
      vertical-align: middle;
      margin: 5px 0;
    }
  }
</style>
