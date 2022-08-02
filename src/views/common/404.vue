<template>
  <div class="site-wrapper site-page--not-found">
    <div class="site-content__wrapper">
      <div class="site-content">
        <h2 class="not-found-title">400</h2>
        <p class="not-found-desc">{{$t('error404.sorry')}}<em>{{$t('error404.missing')}}</em>{{$t('error404.la')}}</p>
        <el-button @click="backUpStep">{{$t('error404.back')}}</el-button>
        <el-button type="primary" class="not-found-btn-gohome" @click="$router.push({ name: 'home' })">{{$t('error404.home')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        offLine: false
      }
    },
    mounted () {
      // debugger
      if (!navigator.onLine) {
        this.offLine = true
      }
      window.addEventListener('online', () => {
        if (navigator.onLine) {
          this.offLine = false
        }
      })
    },
    beforeDestroy () {
      window.removeEventListener('offline', () => {
        this.offLine = false
      })
      window.removeEventListener('online', () => {
        this.offLine = false
      })
    },
    methods: {
      backUpStep () {
        // debugger
        if (this.offLine) {
          window.location.reload()
          return
        }
        this.$router.go(-1)
      },
      backHome () {

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
    .not-found-btn-gohome {
      margin-left: 30px;
    }
  }
</style>
