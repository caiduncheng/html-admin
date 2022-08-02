<template>
  <div class="noPermission">
      <icon-svg name="no-permission" class="icon-img"></icon-svg>
      <p class="title">{{$t('error404.noPermission')}}</p>
      <!-- <el-button type="primary" class="gohome" @click="$router.push({ name: 'home' })">{{$t('error404.home')}}</el-button> -->


  </div>
</template>
<style lang="scss" scoped>
.noPermission{
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .icon-img{
    font-size: 22em;
  }
  .title{
    font-size: 26px;
    text-transform: uppercase;
    color: rgb(118, 131, 143);
  }
}
</style>