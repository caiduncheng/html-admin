<template>
  <div class="site-wrapper site-page--not-found">
    <div class="site-content__wrapper">
      <div class="site-content">
        <h2 class="not-found-title">503</h2>
        <p class="not-found-desc">{{message}}</p>
        <!-- <p class="not-found-desc">{{$t('error503.sorry')}}<em>{{$t('error503.missing')}}</em>{{$t('error404.la')}}</p> -->
        <el-button type="primary" class="not-found-btn-gohome" @click="close">{{$t('error503.close')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      code: '',
      message: ''
    }
  },
  mounted () {
    this.code = this.$route.query.code
    // this.message = this.$route.query.msg
    if (this.code === '5511') {
      this.message = 'THE SYSENCLOSURE CANNOT BE FOUND,IT MAY HAVE BEEN DELETED'
    }
  },
  methods: {
    close () {
      window.opener = null
      window.open('', '_self')
      window.close()
    }
  }
}
</script>

<style lang="scss">
  .site-wrapper.site-page--not-found {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    .site-content__wrapper {
      padding: 0;
      margin: 0;
      background-color: #fff;
    }
    .site-content {
      position: fixed;
      top: 15%;
      left: 50%;
      z-index: 2;
      padding: 30px;
      text-align: center;
      transform: translate(-50%, 0);
    }
    .not-found-title {
      margin: 20px 0 15px;
      font-size: 10em;
      font-weight: 400;
      color: rgb(55, 71, 79);
    }
    .not-found-desc {
      margin: 0 0 30px;
      font-size: 26px;
      text-transform: uppercase;
      color: rgb(118, 131, 143);
      > em {
        font-style: normal;
        color: #ee8145;
      }
    }
    // .not-found-btn-gohome {
    //   margin-left: 30px;
    // }
  }
</style>
