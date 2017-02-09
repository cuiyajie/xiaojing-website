<template>
	<el-row>
	  <el-col :span="6"><div class="section-val">{{ title }}:</div></el-col>
	  <el-col :span="18"><div class="section-val">{{ value }}</div></el-col>
	</el-row>
</template>
<script>
  export default {
    props: ['title', 'value'],
  };
</script>
