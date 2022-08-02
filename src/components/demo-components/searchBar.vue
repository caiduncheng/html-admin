<template>
  <div class="search-component">
    <div style="margin: 15px 0;">
      <el-input ref="input" :placeholder="placeholder || 'Search Keywords'" v-model="inputVal" class="input-with-select" @keyup.enter.native="emitSearch" clearable @clear="emitSearch">
        <el-select v-if="filter" v-model="selectVal" slot="prepend" placeholder="Filter By" :style="{'width': prependWidth + 'px'}">
          <el-option v-for="item in searchList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          <!-- <el-option label="餐厅名" value="name"></el-option>
          <el-option label="订单号" value="orderNo"></el-option>
          <el-option label="用户电话" value="tel"></el-option> -->
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="emitSearch"></el-button>
      </el-input>
    </div>
  </div>
</template>
<script>
export default {
  // name: 'dingSearch',
  props: ['searchList', 'prependWidth', 'filter', 'placeholder'],
  data () {
    return {
      inputVal: '',
      selectVal: ''
    }
  },
  mounted () {
    this.$refs.input.focus()
  },
  methods: {
    emitSearch () {
      // 将填写的搜索条件以 key：val 形式通知父组件
      if (!this.selectVal) return
      this.$emit('search', this.filter ? {[this.selectVal]: this.inputVal} : this.selectVal)
    }
  }
}
</script>

<style lang="scss">
.search-component {
  .el-select .el-input {
    width: 100%;
  }
  .input-with-select .el-input-group__prepend {
    // background-color: $--color-bg-light;
    background-color: #fff;
    color: $--color-primary-text;
    min-width: 120px;
  }
  .el-input__clear {
    font-size: 1rem;
    font-weight: 900;
  }
  .el-input--medium .el-input__inner {
    height: 40px;
    line-height: 40px;
  }
  .el-input-group__append {
    &:focus,&:active,&:hover {
      border:1px solid $--color-primary;
      background-color: $--color-primary;
      color:#fff;
    }
  }
}
</style>
