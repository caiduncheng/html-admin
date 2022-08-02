<template>
  <el-dialog
    :visible.sync='visible'
    :title="$t('group.selectApp')"
    width='950px'
    :before-close='modalClose'
    :close-on-click-modal='false'
    :close-on-press-escape='false'
  >
    <div class='panel' v-loading="dataListLoading">
      <el-collapse v-if='groupAppResp != undefined' v-model='activeNames' @change='handleChange'>
        <el-collapse-item :title="$t('group.curApp')" name='curApp'>
          <div v-if='groupAppResp.groupApps != undefined && groupAppResp.groupApps.length > 0' class='panel-body'>
            <ul id='currentApp'>
              <li v-for='app in groupAppResp.groupApps'>
                <a href='javascript:;'>
                  <img :src="iconView(app.iconUrl)">
                  <span>{{ app.appName }}</span>
                  <i class='iconfont el-icon-remove' @click='handleSub(app)'/>
                </a>
                <div class='version-list'>
                  <el-select v-model='app.appFileId' :placeholder="$t('common.tip_select')">
                    <el-option v-for='versions in app.appVersionList' v-if='app.appVersionList != null'
                               :key="versions.appFileId" :label='versions.versionName' :value='versions.appFileId'/>
                  </el-select>
                </div>
              </li>
            </ul>
          </div>
        </el-collapse-item>

        <el-collapse-item :title="$t('group.otherApp')" name='otherApp'>
          <div v-if='groupAppResp.otherApps != undefined && groupAppResp.otherApps.length > 0' class='panel-body'>
            <ul id='otherApp'>
              <li v-for='app in groupAppResp.otherApps'>
                <a href='javascript:;'>
                  <img :src="iconView(app.iconUrl)">
                  <span>{{ app.appName }}</span>
                  <i class='iconfont el-icon-circle-plus' @click='handleAdd(app)'/>
                </a>
                <div class='version-list'>
                  <el-select v-model='app.appFileId' :placeholder="$t('common.tip_select')">
                    <el-option v-for='versions in app.appVersionList' v-if='app.appVersionList != null'
                               :key="versions.appFileId" :label='versions.versionName' :value='versions.appFileId'/>
                  </el-select>
                </div>
              </li>
            </ul>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div slot='footer' class='dialog-footer'>
      <el-button v-if="isAuth('10400800.MANAGE')" @click='modalClose()'>{{ $t('common.cancel') }}</el-button>
      <el-button v-if="isAuth('10400800.MANAGE')" type='primary' :loading="confirmLoading" @click='confirm()'>{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {getSysGroupApps, addApk} from '../../../../api/group'

export default {
  name: 'SelectApp',
  props: {
    childData: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      groupId: this.childData.groupId,
      activeNames: ['curApp', 'otherApp'],
      groupAppResp: undefined,
      dataListLoading: false,
      confirmLoading: false,
      appVersionList: []
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    iconView (icon) {
      if (icon) {
        return process.env.ICON_API + icon
      }
      return 'static/img/Android.png'
    },
    fetchData () {
      this.dataListLoading = true
      getSysGroupApps(this.groupId).then(res => {
        this.groupAppResp = res
        this.dataListLoading = false
      })
    },
    modalClose () {
      this.confirmLoading = false
      this.$emit('update:visible', false) // 直接修改父组件的属性
    },
    handleChange () {
    },
    handleAdd (data) {
      this.groupAppResp.otherApps.splice(this.groupAppResp.otherApps.findIndex(app => app.appFileId === data.appFileId), 1)
      this.groupAppResp.groupApps.push(data)
    },
    handleSub (data) {
      this.groupAppResp.groupApps.splice(this.groupAppResp.groupApps.findIndex(app => app.appFileId === data.appFileId), 1)
      this.groupAppResp.otherApps.push(data)
    },
    confirm () {
      this.confirmLoading = true
      const choosedIds = this.groupAppResp.groupApps.map(item => {
        return item.appFileId
      })
      addApk(this.groupId, {'appFileIds': choosedIds}).then(res => {
        this.modalClose()
        this.$message.success(this.$t('common.update_success'))
        this.$parent.getDataList()
      }).catch((e) => {
        this.confirmLoading = false
      })
    }
  }
}
</script>
<style lang='scss' scoped>

.panel .panel-body > ul li {
  float: left;
  list-style: none;
  margin-bottom: 20px;
  width: 160px;
  text-align: center;
}

.panel .panel-body > ul li a {
  width: 100%;
  display: inline-block;
  position: relative;
}

.panel .panel-body > ul li a img {
  width: 85px;
  height: 85px;
}

.panel .panel-body > ul li a span {
  display: block;
  margin: 4px 0 0 0;
  color: #31708f;
  font-size: 14px;
  line-height: 1.5;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.panel .panel-body > ul li a span.version {
  color: #999;
}

.panel .panel-body > ul li a i.iconfont {
  position: absolute;
  top: -2px;
  right: 21.5%;
  font-size: 24px;
}

.panel .panel-body > ul li a i.iconfont.el-icon-remove {
  color: red;
}

.panel .panel-body > ul li a i.iconfont.el-icon-circle-plus {
  color: green;
}

.panel .panel-body > ul li .version-list {
  width: 110px;
  margin: 0 auto;
  text-align: left;
}

.panel .panel-body p.tip {
  padding: 30px;
  text-align: center;
  font-size: 25px;
  font-weight: 500;
  color: #888888;
}

</style>
