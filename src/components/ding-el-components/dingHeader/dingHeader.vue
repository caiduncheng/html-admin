<template>
  <div class="header-component">
    <div class="title">
      <slot name="title">
        <h1>{{title || defaultTitle}}</h1>
      </slot>
    </div>
    <div class="operate">
      <slot name="operate">
         <el-button><i class="el-icon-download"></i> Export</el-button>
        <el-button><i class="el-icon-upload2"></i> Import</el-button>
        <el-button>More<i class="el-icon-caret-bottom"></i></el-button>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title'],
  name: 'dingHeader',
  data () {
    return {
      defaultTitle: 'Default Title'
    }
  }
}
</script>

<style lang="scss">
.header-component {
  margin-bottom: 1rem;
  line-height: 40px;
  display: flex;
  align-items: flex-start;
  .title {
    margin-right: auto!important;
    h1 {
      font-size: 1.5rem;
      margin: 0;
    }
  }
  .operate {
    height: 40px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .el-button,i {
      color: $--color-primary-text-sec;
      font-weight: 400;
    }
    .el-button {
      // line-height: 24px;
      padding: 12px;
      margin: 0;
      border: none;
      background-color: $--color-bg-light;
      &:focus,&:hover {
        background-color: #E6E8ED;
        color: $--color-primary-text;
      }
    }
  }
}
</style>
