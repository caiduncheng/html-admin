<template>
  <div>
    <div v-if="showUpload">
      <upload-page @backHandle="backHandle" appTypeCode='04'/>
    </div>
    <div v-else class="mod-menu app-store">
      <el-row>
        <el-button v-if="isAuth('10400402.MANAGE')" type="success" @click="uploadHandle" style="margin-top: 10px" icon="el-icon-upload">{{ $t('sysapp.upload') }}</el-button>
      </el-row>
      <el-divider content-position="left"></el-divider>

      <el-col class="leftPart" :span="5" :style="{ 'height': colHeight + 'px' }">

        <el-card v-for="cate in categoryList" :key="cate.categoryId"
                 @click.native="getAppDataList(cate)"
                 :class="{active: clickCategory == null ? false : (clickCategory.appFileId == cate.appFileId)}">
          <el-row type="flex" justify="start" align="middle" style="height: 60px">
            <el-col :span="8">
              <img :src="iconView(cate.iconUrl)" style="height: 48px;width: 48px">
            </el-col>
            <el-col :span="15">
              <div>
                <el-row type="flex" justify="start">
                  <span style="font-size: 16px;margin-bottom: 10px">{{cate.appName}}</span>
                </el-row>
                <el-row type="flex" justify="start">
                  {{cate.version}}
                </el-row>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="19">
        <div style="width: 100%;">
          <el-table
            :data="appList"
            v-loading="dataListLoading"
            stripe
            border
            height="calc(100vh - 220px)"
            style="width: 100%;">
            <el-table-column type="expand">
              <template slot-scope="props">
                  <el-descriptions title="" :column="2" border>
                    <el-descriptions-item :label="$t('sysapp.appName')">{{ props.row.appName }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('sysapp.appPackageName')">{{ props.row.appPackageName }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('sysapp.fileSize')">{{ (props.row.fileLength/1024/1024).toFixed(2) }} MB</el-descriptions-item>
                    <el-descriptions-item :label="$t('sysapp.fileMd5')">{{ props.row.fileMd5 }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('sysapp.version')">{{ props.row.versionName }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('sysapp.uploadTime')">{{ uploadFormatDate(props.row) }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('sysapp.supportDevice')">
                      <el-checkbox v-model="props.row.modeHand === 1" disabled>{{$t('sysapp.handHeld')}}</el-checkbox>
                      <el-checkbox v-model="props.row.modeHd === 1" disabled>{{$t('sysapp.hd')}}</el-checkbox>
                    </el-descriptions-item>
                    <el-descriptions-item :label="$t('sysapp.updateMode')">
                      <el-tag size="mini" :class="'flow-state-tag-' + props.row.forceUpdate" v-if="props.row.forceUpdate === 0">{{$t('sysapp.normalUpdate')}}</el-tag>
                      <el-tag size="mini" :class="'flow-state-tag-' + props.row.forceUpdate" v-if="props.row.forceUpdate === 1">{{$t('sysapp.silentUpdate')}}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item :label="$t('sysapp.installMode')">
                      <el-tag size="mini" :class="'flow-state-tag-' + props.row.deleteUpdate" v-if="props.row.deleteUpdate === 0">{{$t('sysapp.patchInstall')}}</el-tag>
                      <el-tag size="mini" :class="'flow-state-tag-' + props.row.deleteUpdate" v-if="props.row.deleteUpdate === 1">{{$t('sysapp.deleteInstall')}}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item :label="$t('sysapp.production')">
                      <el-tag size="mini" :class="`flow-state-tag-${props.row.versionStyle}`" v-if="props.row.versionStyle === 0">{{$t('sysapp.grayscaleStyle')}}</el-tag>
                      <el-tag size="mini" :class="`flow-state-tag-${props.row.versionStyle}`" v-if="props.row.versionStyle === 1">{{$t('sysapp.productionStyle')}}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item :label="$t('sysapp.remark')">{{ props.row.remark }}</el-descriptions-item>
                  </el-descriptions>
<!--                <br>
                <el-button  @click="downloadHandle(props.row)">{{$t('sysapp.downloadBtn')}}</el-button>
                <el-button type="warning" @click="deleteHandle(props.row)">{{$t('common.delete')}}</el-button>-->
              </template>
            </el-table-column>
            <el-table-column prop="versionName" :label="$t('sysapp.version')" header-align="center" align="center"></el-table-column>
            <el-table-column prop="installDevCnt" :label="$t('sysapp.installDevCount')" header-align="center" align="center"></el-table-column>
            <el-table-column prop="forceUpdate" :label="$t('sysapp.updateMode')" header-align="center" align="center">
              <template slot-scope="scope">
                <el-tag size="mini" :class="`flow-state-tag-${scope.row.forceUpdate}`" v-if="scope.row.forceUpdate === 0">{{$t('sysapp.normalUpdate')}}</el-tag>
                <el-tag size="mini" :class="`flow-state-tag-${scope.row.forceUpdate}`" v-if="scope.row.forceUpdate === 1">{{$t('sysapp.silentUpdate')}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="deleteUpdate" :label="$t('sysapp.installMode')" header-align="center" align="center">
              <template slot-scope="scope">
                <el-tag size="mini" :class="`flow-state-tag-${scope.row.deleteUpdate}`" v-if="scope.row.deleteUpdate === 0">{{$t('sysapp.patchInstall')}}</el-tag>
                <el-tag size="mini" :class="`flow-state-tag-${scope.row.deleteUpdate}`" v-if="scope.row.deleteUpdate === 1">{{$t('sysapp.deleteInstall')}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="versionStyle" :label="$t('sysapp.production')" header-align="center" align="center">
              <template slot-scope="scope">
                <el-tag size="mini" :class="`flow-state-tag-${scope.row.versionStyle}`" v-if="scope.row.versionStyle === 0">{{$t('sysapp.grayscaleStyle')}}</el-tag>
                <el-tag size="mini" :class="`flow-state-tag-${scope.row.versionStyle}`" v-if="scope.row.versionStyle === 1">{{$t('sysapp.productionStyle')}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="creTime" :label="$t('sysapp.uploadTime')" header-align="center" align="center" :formatter="uploadFormatDate"></el-table-column>
            <el-table-column
              v-if="isAuth('10400402.MANAGE')"
              header-align="center"
              align="center"
              :label="$t('common.operate')">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="$t('common.downloadBtn')" placement="top">
                  <el-button class="tag-green" type="text" :loading="loading" @click="downloadHandle(scope.row)" icon="el-icon-bottom"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="$t('sysapp.terminalListBtn')" placement="top">
                  <el-button v-show="scope.row.versionStyle === 0" style="color: #556de7" :loading="loading" @click="terminalListHandle(scope.row)" icon="el-icon-s-order"/>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="$t('sysapp.productionReleaseBtn')" placement="top">
                  <el-button v-show="scope.row.versionStyle === 0" style="color: #556de7" :loading="loading" @click="productionReleaseHandle(scope.row)">
                    <icon-svg  name="release"></icon-svg>
                  </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="$t('common.deleteBtn')" placement="top">
                  <el-button  style="color: #DC143C" :loading="loading" @click="deleteHandle(scope.row)" icon="el-icon-delete"/>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <br>
          <el-pagination
            v-if="paginationShow"
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
          <grayscale :visible.sync='grayscaleVisible' @close='grayscaleVisible = false' ref="grayscale" @refreshDataList='backHandle'> </grayscale>
        </div>
      </el-col>
    </div>
  </div>
</template>

<script>
import {getAppInfoPage, downloadApp, deleteApp, getOptionalAppList, sysProductionRelease} from '../../../api/sysapp'
import {formatDate} from '@/utils/formatDate'
import uploadPage from './upload.vue'
import Grayscale from './components/grayscale'
export default {
  components: {
    uploadPage,
    Grayscale
  },
  data () {
    return {
      dataForm: {
        appName: '',
        developerName: '',
        chargeStrategy: ''
      },
      uploadVisible: false,
      grayscaleVisible: false,
      showUpload: false,
      categoryList: [],
      appList: [],
      loading: false,
      dataListLoading: false,
      noMore: false,
      busy: false,
      pageNo: 1,
      pageSize: 10,
      rows: 0,
      clickCategory: null,
      clickAppId: 0,
      paginationShow: true,
      pageIndex: 1,
      totalPage: 0
    }
  },
  computed: {
    colHeight () {
      return this.$store.state.common.documentClientHeight - 82 - 80
    },
    categoryTotal () {
      // eslint-disable-next-line no-return-assign
      return this.categoryList !== [] ? this.categoryList.reduce((total, category) => total += category.appCount, 0) : 0
    }
  },
  activated () {
    this.getCategoryDataList()
    this.getAppDataList()
  },
  methods: {
    getCategoryDataList () {
      this.loading = false
      getOptionalAppList().then(data => {
        this.categoryList = data
      })
    },
    getAppDataList (cate) {
      this.dataListLoading = true
      this.loading = false
      this.clickCategory = cate
      let packageName = cate == null ? null : cate.appPackageName
      getAppInfoPage({
        'pageNo': this.pageNo,
        'pageSize': this.pageSize,
        'packageName': packageName
      }).then(data => {
        console.log(data)
        this.appList = data.data
        this.totalPage = data.rows
        this.dataListLoading = false
      })
    },
    loadMore () {
      if (this.pageNo > this.rows / this.pageSize) {
        this.loading = false
        this.busy = true
        this.noMore = true
        return
      }
      this.loading = true
      this.busy = false
      this.pageNo = this.pageNo + 1
      getAppInfoPage({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        appCategoryId: this.clickCategoryId
      }).then(data => {
        if (this.appList.length >= this.rows) {
          this.loading = false
          this.busy = true
          this.noMore = true
        } else {
          setTimeout(() => {
            this.appList = this.appList.concat(data.data.data)
            this.loading = false
          }, 1000)
        }
      })
    },
    showDetailHandle (appId, appVersionId) {
      this.$router.push({
        name: 'app-detail',
        query: {
          appId: appId,
          appVersionId: appVersionId
        }
      })
    },
      // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageNo = 1
      this.getAppDataList(this.clickCategory)
    },
      // 当前页
    currentChangeHandle (val) {
      this.pageNo = val
      this.getAppDataList(this.clickCategory)
    },
    uploadHandle () {
      this.showUpload = true
    },
    downloadHandle (row) {
      let appFileId = row.appFileId
      this.loading = true
      downloadApp(appFileId).then(data => {
        this.loading = false
        console.log(row)
        if (data.url !== null) {
          // const link = document.createElement('a')
          // link.style.display = 'none'
          window.open(data.url, '_blank')
          // link.setAttribute('href', data.url)
          // link.click()
        } else {
          this.$message({
            type: 'error',
            message: this.$t('sysapp.downloadFailed')
          })
        }
      }).catch((e) => {
        this.loading = false
      })
    },
    deleteHandle (row) {
      this.$confirm(this.$t('sysapp.deleteConfirm'), '', {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.loading = true
        console.log(`${row.appFileId}  ${row.operatorId}`)
        deleteApp(row.appFileId).then(data => {
          this.$message({
            type: 'success',
            message: this.$t('common.success')
          })
          this.loading = false
          this.getAppDataList(this.clickCategory)
          this.getCategoryDataList()
        }).catch((e) => {
          this.loading = false
        })
      })
      console.log(row)
    },
    terminalListHandle (row) {
      this.grayscaleVisible = true
      this.$nextTick(() => {
        this.$refs.grayscale.init(row.appFileId)
      })
    },
    uploadFormatDate (row) {
      return formatDate(row.creTime, 'yyyy-MM-dd  hh:mm:ss')
    },
    backHandle (refresh) {
      this.showUpload = false
      if (refresh) {
        this.getCategoryDataList()
        this.getAppDataList()
      }
    },
    iconView (icon) {
      if (icon) {
        return process.env.ICON_API + icon
      }
      return 'static/img/Android.png'
    },
    productionReleaseHandle (row) {
      this.$confirm('Are you sure to Release the application?', '', {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.loading = true
        sysProductionRelease(row.appFileId).then((res) => {
          this.loading = false
          if (res) {
            this.$message({
              type: 'success',
              message: 'Release version successfully!'
            })
            this.getAppDataList(this.clickCategory)
            this.getCategoryDataList()
          }
        }).catch((e) => {
          this.loading = false
        })
      })
    }
  }
}
</script>


<style lang="scss" scoped>
.app-store {
  .loadTxt {
    text-align: center;
    width: 100%;
    color: $--color-primary-text-sec;
    // z-index: 99;
  }
  .leftPart {
    // border-right: 1px solid $--color-primary-text;
    overflow-y: auto;
    .el-card {
      text-align: center;
      width: 92%;
      margin: 0 0 10px;
      padding: 5px 0;
      box-shadow: none;
      cursor: pointer;
      // &:hover {
      //  transform: scale(1.1);
      //   box-shadow: 0 2px 12px 0 #0000001a;
      //   color: $--color-primary;
      // }
    }
  }
  .rightPart {
    flex-wrap: wrap;
    align-content: flex-start;
    overflow: auto;
    .app-item {
      height: 240px;
      .el-image {
        width: 100px;
        height: 100px;
        border-radius: 5px;
      }
      cursor: pointer;
      text-align: center;
      margin: 2px 0 10px;
      transition: all .5s;
      p {
        margin: 0;
        line-height: 1.2rem;
        font-size: small;
      }
      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
.active {
  background-color: #ffffff !important;
  border: 1px solid #409EFF;
}
.el-form-item {
  margin-bottom: 10px;
}
.el-form {
  margin-top: 10px;
}
</style>
