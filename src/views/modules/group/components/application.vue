<template>
  <div>
    <!--    <div style="margin-left: 2%; margin-bottom: 1%">
          <div>
            <el-button icon="el-icon-plus" @click="selectAppVisible = true"></el-button>
          </div>
          <span>Add</span>
        </div>-->

    <el-col :span="3" style="margin-top: 1.5%">
      <div @click="selectAppVisible = true">
        <el-row type="flex" justify="center">
          <img :src="'static/img/add-app.png'" class='icon' style="width: 100px;height: 100px"/>
        </el-row>
        <el-row type="flex" justify="center">
          Add
        </el-row>
      </div>
    </el-col>
    <el-col :span="3" v-for="i in appList" :key="i.appFileId" style="margin-top: 1.5%">
      <div @click="handleAppVersionChange(i)">
        <el-popover
          placement="top-start"
          title="Application Details"
          width="400"
          trigger="hover">
          <el-divider></el-divider>
          <div>
            <span style="font-weight: bold">Application Name: </span>{{ i.appName }}
          </div>
          <div>
            <span style="font-weight: bold">Package: </span>{{ i.appPackageName }}
          </div>
          <div>
            <span style="font-weight: bold">Application Vertion Number: </span>{{ i.versionCode }}
          </div>
          <el-button style="color: #DC143C" v-if="isAuth('10400800.MANAGE')" @click="deleteHandle(i)" icon="el-icon-delete"></el-button>
          <div slot="reference">
            <el-row type="flex" justify="center">
              <img :src="iconView(i.iconUrl)" class='icon' style="width: 100px;height: 100px"/>
            </el-row>
            <el-row type="flex" justify="center">
              {{ i.appName }}
            </el-row>
            <el-row type="flex" justify="center">
              {{ i.version }}
            </el-row>
          </div>
        </el-popover>
      </div>
    </el-col>


    <!-- app版本选择提示框 -->
    <el-dialog :visible.sync="appVisible" title="Change Version" width="400px">
      <el-form ref="apkVersionForm" :model="apkVersionForm" :rules="apkVersionRule">
        <el-form-item :label="$t('group.version')" prop="appFileId">
          <el-select v-model="apkVersionForm.appFileId" :placeholder="$t('group.tip_selectVersion')">
            <el-option v-for="apkVersion in apkVersions" :key="apkVersion.versionId" :label="apkVersion.versionName"
                       :value="apkVersion.appFileId"/>
          </el-select>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="isAuth('10400800.MANAGE')" @click="appVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button v-if="isAuth('10400800.MANAGE')" type="primary" @click="confirmAppVersionHandle">{{ $t('common.confirm') }}</el-button>
      </span>
    </el-dialog>

    <selectApp v-if="selectAppVisible" :visible.sync="selectAppVisible" :child-data="{groupId: groupId}"/>
  </div>
</template>

<script>
import {delApk, groupDetails, updGroupApkVersion} from '../../../../api/group'
import {getAppInfoPage} from '../../../../api/sysapp'
import selectApp from './selectApp'

export default {
  props: [`groupId`],
  components: {
    selectApp
  },
  data () {
    return {
      selectAppVisible: false,
      currentDate: new Date(),
      appList: [],
      autoDownload: true,
      dataListLoading: false,
      appVisible: false,
      curClickItem: {},
      apkVersions: [],
      apkVersionForm: {
        appFileId: undefined
      },
      apkVersionRule: {
        appFileId: [
          {required: true, message: 'Please select a version', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    iconView (icon) {
      if (icon) {
        return process.env.ICON_API + icon
      }
      return 'static/img/Android.png'
    },
    deleteHandle (item) {
      console.log('deleteHandle')
      this.curClickItem = item
      let params = {
        appPackageName: this.curClickItem.appPackageName,
        appFileId: item.appFileId,
        oper: 'del',
        version: item.version
      }
      let reqData = []
      reqData.push(params)
      let data2 = {
        apkDtoList: reqData
      }
      delApk(this.groupId, data2).then((res) => {
        console.log('delApk')
        this.getDataList()
      })
    },
    handleAppVersionChange (data) {
      this.appVisible = true
      this.curClickItem = data
      this.apkVersionForm.appFileId = data.appFileId
      // this.queryAppVersionList(data.appPackageName)
      getAppInfoPage({pageNo: 1, pageSize: 1000, packageName: data.appPackageName, versionStyle: 1}).then((res) => {
        this.apkVersions = res.data
      })
    },
    /* queryAppVersionList(packageName) {
      getAppInfoPage({ pageNo: 1, pageSize: 1000, packageName: packageName }).then((res) => {
        this.apkVersions = res.data
      })
    }, */
    confirmAppVersionHandle () {
      console.log('confirmAppVersionHandle')
      console.log(this.curClickItem)
      var choosed = this.apkVersions.find(item => item.appFileId === this.apkVersionForm.appFileId)
      this.$confirm(
        this.$t('group.tip_changeAppVersion', {
          pkgName: this.curClickItem.appPackageName,
          oldVersion: this.curClickItem.versionName,
          newVersion: choosed.versionName
        }),
        this.$t('common.tip'),
        {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }
      ).then(() => {
        console.log(choosed)
        let data = {
          appPackageName: this.curClickItem.appPackageName,
          version: choosed.versionName
        }
        updGroupApkVersion(this.groupId, this.curClickItem.appFileId, data).then(res => {
          console.log('updGroupApkVersion')
          this.appVisible = false
          this.$message.success(this.$t('common.update_success'))
          this.getDataList()
        })
      }).catch(() => {
      })
    },
    getDataList () {
      this.dataListLoading = true
      groupDetails(this.groupId).then(data => {
        this.appList = data.apps
        this.dataListLoading = false
      })
    }
  },
  watch: {
    'groupId' (value) {
      if (value) {
        this.getDataList()
      }
    }
  }

}
</script>

<style lang='scss' scoped>
.block .image {
  width: 48px;
  height: 48px;
  margin-bottom: 20px;
  position: center;
  display: inline-block;
}

.block .content {
  width: auto;
  display: inline-block;
}

.block span {
  display: block;
  color: #333;
}

.block p {
  padding-left: 20px;
  float: left;
  width: 160px;
}

.block.active {
  border: 1px solid rgba(244, 244, 244, 0.8);
  color: rgba(2, 2, 11, 0.73);
  background-color: rgba(244, 244, 244, 0.8);
}

.block span:first-child {
  margin-top: 3px;
  font-size: 16px;
  margin-bottom: 5px;
  font-weight: 500;
  width: 100%;
}

/*
.app-list {
  .icon {
    width: 72px;
    height: 72px;
    position: relative;

    &--add {
      background: #e2e6ed;
    }

    & > .cross {
      position: absolute;
      font-size: 32px;

      .center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      color: #7993b8;
    }
  }
}

.card-header {
  border-bottom: 1px solid #ebeef5;
  padding: 18px 20px;
  margin: 0 -20px 20px;
}*/
</style>
