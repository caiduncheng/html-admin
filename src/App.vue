<template>
  <transition name="fade">
    <div class="app">
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
  export default {
  }
</script>

<style>
body .el-table th.gutter{
    display: table-cell!important;
}
.el-loading-spinner .el-loading-text {
  font-size: 2rem;
}
.el-loading-spinner i {
  font-size: 2rem;
}
</style>
