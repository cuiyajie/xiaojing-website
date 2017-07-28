<template>
  <span v-show="pageCount > 1">
	  <el-pagination ref="elPagination" class="pagination-custom" layout="prev,slot,next" :page-size="pageSize" :total="total" @current-change="onCurrentChange">
			<span class="custom-label">{{ currentPage }}&nbsp;/&nbsp;{{ pageCount }}</span>
	  </el-pagination>
  </span>
</template>
<script>

	export default {
  data() {
    return {
      currentPage: 1,
    };
  },
  props: {
    pageSize: {
      type: Number,
      default: 10,
    },
    total: {
      type: Number,
    },
    historyStore: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    pageCount() {
      return Math.ceil(this.total / this.pageSize);
    },
  },
  methods: {
    reset() {
      this.currentPage = 1;
    },
    onCurrentChange(newPage) {
      if (newPage > this.pageCount) {
        return;
      }
      
      const fetchData = this.historyStore.length < this.total && 
          this.historyStore.length < newPage * this.pageSize;
      this.$emit('pagination-pagechange', {
        newPage,
        oldPage: this.currentPage,
        fetchData,
      });
      this.currentPage = newPage;
    },
  },
	};
</script>
<style lang="scss">
  @import '~scss_var';

  .pagination-custom {
  	.btn-prev,
  	.btn-next {
  		border-radius: 4px;
  		border: 0;
  		background-color: $linkface;
  		color: #FFF;

  		&:hover {
  			color: #FFF;
  		}

  		&.disabled {
  			background-color: #DCDCDC;
  		  color: #FFF;
  		}
  	}
  }

  .el-pagination span.custom-label {
    padding: 0 15px;
    margin: 0 10px;
    border-radius: 4px;
    border: 1px solid #eee;
  }
</style>
