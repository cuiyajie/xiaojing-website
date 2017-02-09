<template>
	<el-row>
		<el-col :span="6">上班时间：{{ startTime }}</el-col>
		<el-col :span="6">下班时间：{{ endTime }}</el-col>
		<el-col :span="12">24小时制</el-col>
		<div class="buttons-area">
			<el-button type="primary" size="small" @click="setAttendanceTime">设置</el-button>
		</div>
	</el-row>
</template>
<script>
	export default {
	  methods: {
			
	  },
	};
</script>
