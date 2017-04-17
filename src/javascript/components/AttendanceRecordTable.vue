<template>
  <span>
    <el-table class="custom-table"
              row-key="id"
              :empty-text="emptyText"
              :data="dataStore">
      <el-table-column label="员工" property="user_name" width="80"></el-table-column>
      <el-table-column label="部门" property="department_name" width="150"></el-table-column>
      <el-table-column label="上班签到" property="first_checkin_date" width="100"><template scope="scope">{{ toShortTimeString(scope.row.first_checkin_date) }}</template></el-table-column>
      <el-table-column label="签到地址">
        <template scope="scope"><span>{{ showAddress(scope.row.first_place) }}</span></template>
      </el-table-column>
      <el-table-column label="下班签退" property="last_checkin_date" width="100"><template scope="scope">{{ toShortTimeString(scope.row.last_checkin_date) }}</template></el-table-column>
      <el-table-column label="签退地址">
        <template scope="scope"><span>{{ showAddress(scope.row.last_place) }}</span></template>
      </el-table-column>
      <el-table-column label="工作时长" property="worktime" width="120"><template scope="scope">{{ toDurationString(scope.row.worktime) }}</template></el-table-column>
      <el-table-column label="加班时长" property="overtime" width="120"><template scope="scope">{{ toDurationString(scope.row.overtime) }}</template></el-table-column>
    </el-table>
    <div class="table-footer">
      <pagination class="table-pagination" 
        ref="pagination"
        :page-size="pageSize"
        :total="total"
        :history-store="historyStore"
        @pagination-pagechange="onPageChanged"></pagination>
    </div>
  </span>
</template>
<script>
  import { mapGetters } from 'vuex';
  import Pagination from './Pagination';
  import api from '../api';
  import { dateFilter, default as filters } from '../utils/filters';

  export default {
    data() {
      return {
        emptyText: `没有考勤为${this.name}的记录`,
        dataStore: [],
        historyStore: [],
        pageSize: 10,
        total: 0,
        loading: false,
        lastUserAttendanceId: 0,
        initial: true,
      };
    }, 
    props: ['tab', 'name', 'day', 'department'],
    computed: {
      ...mapGetters({
        company: 'currentCompany',
      }),
    },
    components: {
      Pagination,
    },
    methods: {
      getDataTable(page) {
        return this.historyStore.slice(this.pageSize * (page - 1), this.pageSize * page);
      },
      fetchAttendanceRecords(formLocale, page) {
        if (formLocale) {
          this.dataStore = this.getDataTable(page);
        } else {
          this.loading = true;
          api.fetchUserAttendanceRecords(this.company.id, 
            this.day, 
            this.day, 
            this.tab,
            this.department && this.department.id, 
            null, 
            this.pageSize, 
            this.lastUserAttendanceId).then((response) => {
              this.lastUserAttendanceId = response.body.last_user_attendance_id;
              this.historyStore = this.historyStore.concat(response.body.user_attendances);
              this.dataStore = this.getDataTable(page);
              this.total = response.body.total || 0;
              this.loading = false;
            }, () => {
              this.loading = false;
            });
        }
      },
      onPageChanged(page) {
        this.fetchAttendanceRecords(!page.fetchData, page.newPage);
      },
      show() {
        if (this.initial) {
          this.fetchAttendanceRecords(false, 1);
          this.initial = false;
        }
      },
      clear() {
        this.historyStore = [];
        this.dataStore = [];
        this.lastUserAttendanceId = 0;
        this.total = 0;
        this.$refs.pagination.reset();
        this.initial = true;
      },
      showAddress(addr) {
        if (addr && addr.location) {
          return filters.trimAddress(addr.location);
        } 
        return '';
      },
      ...dateFilter,
    },
  };
</script>
