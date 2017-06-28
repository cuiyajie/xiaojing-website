<template>
  <div class="lf-page-container attendance-container">
    <div class="lf-page-preheader">
      <el-row>
        <el-col :span="6">
          <el-date-picker size="small" :editable="false" :clearable="false" v-model="dateRange" type="daterange" placeholder="选择起止日期" @change="onDateRangeChanged"></el-date-picker>
        </el-col>
        <el-col :span="18">
           <el-button size="small" type="primary" @click="onSearch">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="lf-page-header bordered">
      <span class="lf-page-caption pin">查询日期{{ daysQueried }}天；共{{ total }}条查询记录。</span>
    </div>
    <el-table class="custom-table checkin mt15"
      row-key="id"
      :empty-text="emptyText"
      :data="dataStore">
      <el-table-column label="日期" property="dacheck_timey"><template scope="scope">{{ dateFormatter(scope.row.check_time) }}</template></el-table-column>
      <el-table-column label="访客照片"><template scope="scope"><img class="thumb-image" :src="scope.row.face_image" alt="User FaceImage" @click="viewSourceImage(scope.row.face_image)"></template></el-table-column>
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
  import api from '../api';
  import { dateFilter } from '../utils/filters';
  import ImageModal from '../utils/imagemodal';

  export default {
    data() {
      const end = new Date();
      const start = end;
      return {
        emptyText: '暂时没有访客的考勤记录',
        pageSize: 15,
        total: 0,
        dataStore: [],
        historyStore: [],
        lastGuestId: 0,
        daysQueried: dateFilter.duration2Days(start, end),
        dateRange: [start, end],
      };
    },
    computed: {
      ...mapGetters({
        company: 'currentCompany',
        departments: 'departments',
      }),
    },
    components: {
      Pagination,
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
      onSearch() {
        this.lastGuestId = 0;
        this.total = 0;
        this.historyStore = [];
        this.$refs.Pagination.reset();
        this.fetchGuestCheckins(false, 1);
      },
      dateFormatter(day) {
        return dateFilter.toLongDateString(moment(day));
      },
      // fetch data async
      fetchGuestCheckins(fromLocale, page) {
        if (fromLocale) {
          this.dataStore = this.getDataTable(page);
        } else {
          this.loading = true;
          api.fetchGuestCheckins(this.company.id, 
              this.dateRange[0], 
              this.dateRange[1],
              this.lastGuestId,
              this.pageSize).then((response) => {
                this.lastGuestId = response.body.last_guest_id;
                this.historyStore = this.historyStore.concat(response.body.guests);
                this.dataStore = this.getDataTable(page);
                this.total = response.body.total;
                this.loading = false;
              }, () => {
                this.loading = false;
              });
        }
      },
      onPageChanged(page) {
        this.fetchGuestCheckins(!page.fetchData, page.newPage);
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
            this.fetchGuestCheckins(false, 1);
          }
        },
      },
    },
  };
</script>
