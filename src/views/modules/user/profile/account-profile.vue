<template>
  <div class="container-fluid fty-bg-header">
    <div class="container fty-box mt-12">
      <div class="box-header">
        <h1>
          <div class="flex">
            <div
              style="width: 108px; height: 108px;"
              class="mr-5 profile-user-logo"
              @click="updateAvatar"
            >
              <img
                :src="avatarSrc"
                @error="() => avatarSrc = require('../../../../assets/img/head-logo/1.png')"
              />
              <div class="logo-bg-edit-panel fty-transparent-50"></div>
              <div class="logo-edit">{{ $t('common.modify') }}</div>
            </div>
            <div class="text-left flex-col flex-center">
              <div style="text-align: left; padding-top: 1em; color: #12263f; ">
                <h3>{{ username }}</h3>
              </div>
            </div>
          </div>
        </h1>
      </div>
      <el-tabs class="fty-tabs">
        <el-tab-pane>
          <div slot="label">{{ $t('common.overview') }}</div>
          <account-overview :logo-url="selectedAvatar" />
        </el-tab-pane>

        <el-tab-pane>
          <!-- <div slot="label">Permission</div> -->
          <!-- <account-permission /> -->
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      width="800px"
      :visible="dialogVisible"
      @close="dialogVisible = false"
      :title="$t('common.select_avatar')"
    >
      <div class="avatars__container">
        <figure
          v-for="avatar in avatars"
          :key="avatar.src"
          :class="['avatar', {selected: avatar.selected}]"
          @click="() => selectAvatar(avatar)"
        >
          <img :src="avatar.src" alt />
        </figure>
        <div v-for="i in 5" class="avatar-temp" :key="i"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AccountOverview from './tabs/account-overview'

export default {
  data () {
    return {
      avatarSrc: '',
      dialogVisible: false,
      avatars: [...this.$store.getters.avatars].map((v) => ({
        ...v,
        selected: false
      })),
      selectedAvatar: ''
    }
  },
  components: { AccountOverview },
  methods: {
    updateAvatar () {
      this.dialogVisible = true
    },
    selectAvatar (avatar) {
      this.avatars.forEach((el, index) => {
        el.selected = false
      })
      this.avatarSrc = avatar.src
      this.selectedAvatar = avatar.name
      avatar.selected = true
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userAvatar',
      'username',
      'logoUrl',
      'keys',
      'langList'
    ])
  },
  mounted () {
    const logoUrl = this.logoUrl
    // 从本地头像库中找出该用户的头像
    const avatar = this.avatars.find((avatar) => avatar.name === logoUrl)
    if (!avatar) {
      this.selectedAvatar = '1.png'
      this.avatars[0].selected = true
      this.avatarSrc = this.avatars[0].src
    } else {
      // 未修改头像时，默认为该用户的头像
      this.selectedAvatar = avatar.name
      avatar.selected = true
      this.avatarSrc = avatar.src
    }
  }
}
</script>

<style scoped lang="scss">
.avatars__container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .avatar-temp {
    width: 100px;
    height: 100px;
    margin: 5px 10px;
  }
  .avatar {
    position: relative;
    width: 100px;
    height: 100px;
    margin: 5px 10px;
    cursor: pointer;
    border-radius: 0.3rem;
    &::before {
      transition: all 0.3s ease;
    }
    &:hover img {
      transform: scale(0.95);
    }
    &:hover::before {
      content: '';
      border-radius: 0.3rem;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      background-color: rgba(0, 0, 0, 0.54);
      background-image: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20className%3D%22ico-hover%22%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%3E%3Cg%20id%3D%22ico_-_hover%22%20data-name%3D%22ico%20-%20hover%22%20transform%3D%22translate(738%20-1872)%22%20opacity%3D%220.801%22%3E%3Ccircle%20id%3D%22container%22%20cx%3D%2216%22%20cy%3D%2216%22%20r%3D%2216%22%20transform%3D%22translate(-738%201872)%22%20fill%3D%22%23fff%22%2F%3E%3Cpath%20id%3D%22ico_-_checkmark%22%20data-name%3D%22ico%20-%20checkmark%22%20d%3D%22M17%2C11.7l2.667%2C2.7L25%2C9%22%20transform%3D%22translate(-743%201876.3)%22%20fill%3D%22none%22%20stroke%3D%22%233e3e3e%22%20strokeLinecap%3D%22round%22%20strokeLinejoin%3D%22round%22%20strokeWidth%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E');
      background-position: center;
      background-repeat: no-repeat;
    }
    &.selected::before,
    &.selected:hover::before {
      content: '';
      border-radius: 0.3rem;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      background-color: rgba(0, 0, 0, 0.54);
      background-repeat: no-repeat;
      background-image: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20className%3D%22ico-selected%22%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%3E%3Cg%20id%3D%22Group_4382%22%20data-name%3D%22Group%204382%22%20transform%3D%22translate(738%20-1872)%22%3E%3Ccircle%20id%3D%22Ellipse_1%22%20data-name%3D%22Ellipse%201%22%20cx%3D%2216%22%20cy%3D%2216%22%20r%3D%2216%22%20transform%3D%22translate(-738%201872)%22%20fill%3D%22%232296f3%22%2F%3E%3Cg%20id%3D%22user-check%22%20transform%3D%22translate(-743%201876.3)%22%3E%3Cpath%20id%3D%22Path_26%22%20data-name%3D%22Path%2026%22%20d%3D%22M17%2C11.7l2.667%2C2.7L25%2C9%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20strokeLinecap%3D%22round%22%20strokeLinejoin%3D%22round%22%20strokeWidth%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E');
      background-position: center center;
    }
    img {
      border-radius: 0.3rem;
      transition: all 0.3s;
    }
  }
}
.fty-bg-header {
  display: inline-block;
  position: relative;
  width: 100%;
  padding: 0px;
  margin: -20px;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100px;
    background-color: #12263f;
  }

  > .container {
    max-width: 1200px;
  }
}

.profile-user-logo {
  border-radius: 100px;
  /* border: 3px solid white; */
  overflow: hidden;
  position: relative;
  cursor: pointer;
  > div {
    display: none;
  }
  &:hover {
    > div {
      display: inherit;
      &.logo-bg-edit-panel {
        position: absolute;
        bottom: 0;
        left: 0px;
        width: 108px;
        height: 30px;
        background-color: white;
      }
      &.logo-edit {
        font-size: 50%;
        color: #12263f;
        position: absolute;
        top: 80px;
        left: 0;
        text-align: center;
        width: 108px;
        height: 108px;
      }
    }
  }
}
</style>
