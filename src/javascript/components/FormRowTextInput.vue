<template>
  <el-row>
    <el-col :span="6"><div class="section-val">{{ title }}:</div></el-col>
    <el-col :span="6" class="mid">
      <div class="section-val">
        <span v-show="!editing">{{ value }}</span>
        <el-input v-show="editing" :placeholder="placeholder" v-model="valueEditing" class="value-input" size="small" :maxlength="50"></el-input>
      </div>
    </el-col>
    <el-col :span="12" class="pad-btns"><div class="section-val">{{ description }}</div></el-col>
    <div class="buttons-area">
      <el-button v-show="!editing" @click="edit" type="primary" size="small">编辑</el-button>
      <el-button v-show="editing" @click="quitEdit" :disabled="loading" size="small">取消</el-button>
      <el-button v-show="editing" @click="saveEdit" type="primary" :loading="loading" size="small">保存</el-button>
    </div>
  </el-row>
</template>
<script>
  export default {
    data() {
      return {
        valueEditing: '',
        editing: false,
        loading: false,
      };
    },
    props: ['title', 'description', 'placeholder', 'value', 'save'],
    methods: {
      edit() {
        this.valueEditing = this.value;
        this.editing = true;
      },
      quitEdit() {
        this.editing = false;
      },
      saveEdit() {
        if (this.save && !this.loading) {
          this.loading = true;
          this.save(this.valueEditing).then(() => {
            this.loading = false;
            this.value = this.valueEditing;
            this.editing = false;
          }, () => {
            this.loading = false;
          });
        }
      },
    },
  };
</script>
