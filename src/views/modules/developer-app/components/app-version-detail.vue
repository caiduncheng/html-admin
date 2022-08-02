<template>
  <div class="app-version-detail">
    <el-drawer
      :close-on-click-modal="false"
      :with-header="false"
      custom-class="detail"
      :visible.sync="visible"
      size="44%"
      :title="$t('common.detail')"
      v-loading="dataListLoading"
      @close="cancel">
      <el-form v-model="appVersionInfo"
               ref="appVersionInfo"
               inline-message
               label-position="top"
               label-width="auto">
        <el-descriptions direction="vertical" :column="12" border>
          <el-descriptions-item :label="$t('appstore.application.appIconUrl')" :span="4">
            <div style="text-align: center">
              <img style="height: 80px; width: 80px;"
                   :src="iconView(appVersionInfo.appIconUrl)"/>
            </div>
          </el-descriptions-item>
          <el-descriptions-item :label="$t('appstore.application.appName')" :span="4">
            {{ appVersionInfo.appName }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('appstore.application.appVersion')" :span="4">
            {{ appVersionInfo.appVersion }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('appstore.application.appVersionCode')" :span="4">
            {{ appVersionInfo.appVersionCode }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('appstore.application.appSize')" :span="4">
            {{ appVersionInfo.appSize }} MB
          </el-descriptions-item>
          <el-descriptions-item :label="$t('appstore.application.status')" :span="4">
            <div>{{ handleStatus(appVersionInfo.status) }}</div>
          </el-descriptions-item>
          <el-descriptions-item :label="$t('appstore.application.packageName')" :span="4">
            {{ appVersionInfo.packageName }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('appstore.application.downloadCount')" :span="4">
            {{ appVersionInfo.downloadCount }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('developer_app.u_key')" :span="4">
            {{ appVersionInfo.signUkey }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('appstore.application.portrait')" :span="4">
            <div v-if="appVersionInfo.portrait === 1">{{ $t('common.yes') }}</div>
            <div v-if="appVersionInfo.portrait === 0">{{ $t('common.no') }}</div>
          </el-descriptions-item>
          <el-descriptions-item :label="$t('appstore.application.landscape')" :span="4">
            <div v-if="appVersionInfo.landscape === 1">{{ $t('common.yes') }}</div>
            <div v-if="appVersionInfo.landscape === 0">{{ $t('common.no') }}</div>
          </el-descriptions-item>
          <el-descriptions-item :label="$t('appstore.application.autoFit')" :span="4">
            <div v-if="appVersionInfo.autoFit === 1">{{ $t('common.yes') }}</div>
            <div v-if="appVersionInfo.autoFit === 0">{{ $t('common.no') }}</div>
          </el-descriptions-item>
          <el-descriptions-item :label="$t('appstore.application.mainLanguage')" :span="4">
            <el-select v-model="appVersionInfo.mainLanguage" size="mini" disabled>
              <el-option
                v-for="lang in langList"
                :key="lang.val"
                :value="lang.val"
                :label="lang.label"
              />
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item :label="$t('appstore.application.supportLanguage')" :span="4">
            <el-select
              v-model="appVersionInfo.supportLanguage"
              multiple
              disabled
              default-first-option
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="lang in langList"
                :key="lang.id"
                :value="lang.val"
                :label="lang.label"
              />
            </el-select>
          </el-descriptions-item>

          <el-descriptions-item :label="$t('appstore.application.developerName')" :span="4">
            {{ appVersionInfo.developerName }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('appstore.application.submitTime')" :span="2">
            {{ formatDate(appVersionInfo.submitTime) }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('developer_app.app_resource')" :span="12">
            <el-button type="primary" size="small" @click="viewImage">{{ $t('developer_app.app_image') }}</el-button>
            <el-button type="primary" size="small" @click="viewPermission">{{ $t('developer_app.app_permission') }}
            </el-button>
            <el-button type="primary" size="small" v-if="appVersionInfo.status === 7 && isAuth('10401402.MANAGE')"
                       @click="HandleInitialReview">{{ $t('developer_app.initial_examine.examine') }}
            </el-button>
          </el-descriptions-item>
          <el-descriptions-item v-if="appVersionInfo.status !== 7"
                                :label="$t('developer_app.initial_examine.examine_time')" :span="4">
            {{ formatDate(appVersionInfo.initialExaminePassTime) }}
          </el-descriptions-item>
          <el-descriptions-item v-if="appVersionInfo.status !== 7"
                                :label="$t('developer_app.initial_examine.explanation')" :span="4">
            {{ appVersionInfo.initialExamineExplain }}
          </el-descriptions-item>
          <el-descriptions-item v-if="(appVersionInfo.status !== 7) && (appVersionInfo.status !== 8)"
                                :label="$t('developer_app.test_device')" :span="4">
            <el-popover
              placement="right"
              width="500"
              trigger="click">
              <el-table :data="devModelData">
                <el-table-column width="150" prop="devModel" :label="$t('developer_app.device_model')"
                                 style="padding: 2px"></el-table-column>
                <el-table-column width="150" prop="testResult" :label="$t('developer_app.status')" style="padding: 2px">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.testResult === 0" size="small" type="info">
                      {{ $t('developer_app.model_test_result[0].label') }}
                    </el-tag>
                    <el-tag v-if="scope.row.testResult === 1" size="small" type="success">
                      {{ $t('developer_app.model_test_result[1].label') }}
                    </el-tag>
                    <el-tag v-if="scope.row.testResult === 2" size="small" type="warning">
                      {{ $t('developer_app.model_test_result[2].label') }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column width="350" prop="remark" :label="$t('developer_app.test_remark')"
                                 style="padding: 2px"></el-table-column>
              </el-table>
              <el-button type="primary" size="small" slot="reference">{{ $t('developer_app.device_model') }}</el-button>
            </el-popover>
          </el-descriptions-item>
          <el-descriptions-item v-if="appVersionInfo.status !== 7" :label="$t('developer_app.sign.app_summary')"
                                :span="12">
            {{ appVersionInfo.apkDigest }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('appstore.application.appIntroduction')" :span="12">
            <el-input
              v-model="appVersionInfo.appIntroduction"
              :maxlength=512
              :rows="5"
              type="textarea"
              disabled
            />
          </el-descriptions-item>
          <el-descriptions-item :label="$t('appstore.application.revision')" :span="12">
            <el-input
              v-model="appVersionInfo.revision"
              :maxlength=512
              :rows="5"
              type="textarea"
              disabled
            />
          </el-descriptions-item>
        </el-descriptions>
        <el-card class="box-card" shadow="never" style="margin: 10px 0;">
          <div slot="header" class="clearfix">
            <span>{{ $t('appstore.application.screenshots') }}</span>
            <div style="text-align: center;">
              <el-radio v-model="screenshotType" :label="1" :disabled="screenshots_h.length===0">
                {{ $t('appstore.application.horizontalScreenshot') }}
              </el-radio>
              <el-radio v-model="screenshotType" :label="2" :disabled="screenshots_v.length===0">
                {{ $t('appstore.application.verticalScreenshot') }}
              </el-radio>
            </div>
          </div>
          <el-carousel v-if="screenshotType == 1" :interval="4000" type="card" height="200px">
            <el-carousel-item v-for="item in screenshots_h" :key="item.appImagesId">
              <div class="demo-image__preview">
                <el-image
                  @click="showEnlargedPicture(item.url)"
                  :src="iconView(item.url)"
                  :preview-src-list="tempEnlargedPicture">
                </el-image>
              </div>
            </el-carousel-item>
          </el-carousel>
          <el-carousel v-else-if="screenshotType == 2" :interval="4000" type="card" height="200px">
            <el-carousel-item v-for="item in screenshots_v" :key="item.appImagesId">
              <el-image
                @click="showEnlargedPicture(item.url)"
                :src="iconView(item.url)"
                :preview-src-list="tempEnlargedPicture">
              </el-image>
            </el-carousel-item>
          </el-carousel>
          <div class="data-empty" v-else>
            <icon-svg class="data-empty-icon" name="chart-data-empty"></icon-svg>
            <div class="data-empty-text">{{ $t('common.noData') }}</div>
          </div>
        </el-card>
      </el-form>
    </el-drawer>

    <view-res v-if="viewResVisible" ref="viewRes" @close="viewResVisible = false"
              @refreshDataList="getDataList"></view-res>
  </div>
</template>
<script>
import {getAppVersionInfo, screenshotList} from '@/api/developer-app'
import {formatDate} from '@/utils/formatDate'
import ViewRes from './view-res'
import {HTMLDecode} from '../../../../utils'

export default {
  components: {
    ViewRes
  },
  data () {
    return {
      visible: false,
      appVersionId: 0,
      appId: 0,
      appVersionInfo: '',
      dataListLoading: false,
      viewResVisible: false,
      screenshotType: 1,
      screenshots_h: [],
      screenshots_v: [],
      tempEnlargedPicture: [],
      devModelData: [],
      langList: [
        {val: 'zh-CN', label: this.$t('language_list.zh')},
        {val: 'en-US', label: this.$t('language_list.en')},
        {val: 'ko', label: this.$t('language_list.ko')},
        {val: 'jp', label: this.$t('language_list.jp')},
        {val: 'pt', label: this.$t('language_list.pt')},
        {val: 'ru', label: this.$t('language_list.ru')},
        {val: 'fr', label: this.$t('language_list.fr')},
        {val: 'de', label: this.$t('language_list.de')},
        {val: 'es', label: this.$t('language_list.es')},
        {val: 'it', label: this.$t('language_list.it')},
        {val: 'ar', label: this.$t('language_list.ar')},
        {val: 'other', label: this.$t('language_list.other')}
      ]
    }
  },
  methods: {
    showEnlargedPicture (url) {
      url = this.iconView(url)
      this.tempEnlargedPicture.length = 0
      this.tempEnlargedPicture.push(url)
    },
    handleStatus (status) {
      if (status === 9) {
        return this.$t('developer_app.version_status_option[0].label')
      } else if (status === 7) {
        return this.$t('developer_app.version_status_option[1].label')
      } else if (status === 6) {
        return this.$t('developer_app.version_status_option[2].label')
      } else if (status === 5) {
        return this.$t('developer_app.version_status_option[3].label')
      } else if (status === 2) {
        return this.$t('developer_app.version_status_option[4].label')
      } else if (status === 1) {
        return this.$t('developer_app.version_status_option[5].label')
      } else if (status === 0) {
        return this.$t('developer_app.version_status_option[6].label')
      }
    },
    iconView (icon) {
      if (icon) {
        return process.env.ICON_API + icon
        // return icon
      }
      return 'static/img/Android.png'
    },
    async init (appId, appVersionId) {
      this.visible = true
      this.appVersionId = appVersionId
      this.appId = appId
      this.dataListLoading = true
      this.screenshots_h = []
      this.screenshots_v = []
      this.tempEnlargedPicture = []
      if (this.appVersionId && this.appId) {
        this.getDataList()
        await screenshotList(this.appId, {
          appVersionId: this.appVersionId,
          screenType: 1
        }).then(data => {
          this.screenshots_h = data
        }).catch(e => {
          console.log(`err:${JSON.stringify(e)}`)
        })
        await screenshotList(this.appId, {
          appVersionId: this.appVersionId,
          screenType: 2
        }).then(data => {
          this.screenshots_v = data
          if (this.screenshots_h.length > 0) {
            this.screenshotType = 1
          } else if (this.screenshots_v.length > 0) {
            this.screenshotType = 2
          }
        }).catch(e => {
          this.dataListLoading = false
          console.log(`err:${JSON.stringify(e)}`)
        })
      }
    },
    getDataList () {
      getAppVersionInfo(this.appId, this.appVersionId).then(data => {
        this.appVersionInfo = data
        this.devModelData = data.devModelList
        this.appVersionInfo.appIntroduction = HTMLDecode(data.appIntroduction)
        this.appVersionInfo.revision = HTMLDecode(data.revision)
        this.dataListLoading = false
      }).catch(e => {
        this.dataListLoading = false
        console.log(`err:${JSON.stringify(e)}`)
      })
    },
    cancel () {
      this.visible = false
      this.$emit('close')
      this.$emit('refreshDataList')
    },
    formatDate (cellValue) {
      return formatDate(cellValue, 'yyyy-MM-dd hh:mm:ss')
    },
    viewImage () {
      this.viewResVisible = true
      this.$nextTick(() => {
        this.$refs.viewRes.init(this.appVersionId, 'image')
      })
    },
    viewPermission () {
      this.viewResVisible = true
      this.$nextTick(() => {
        this.$refs.viewRes.init(this.appVersionId, 'permission')
      })
    },
    HandleInitialReview () {
      this.viewResVisible = true
      this.$nextTick(() => {
        this.$refs.viewRes.init(this.appVersionId, 'initialReview')
      })
    }
  }
}
</script>

<style lang="scss">

.app-version-detail {
  .el-popover {
    width: 35%;
    overflow: auto;
    height: 304px;
  }

  .el-select {
    width: 100%;
  }

  .el-input.is-disabled .el-input__inner {
    background-color: white;
    color: black;
  }

  .timeDiv {
    width: 100%;
  }

  .el-col {
    text-align: center;
    border: 1px solid #ddd;
  }

  .table {
    .el-col {
      text-align: center;
      border: 1px solid #ddd;
      padding: 5px;
    }
  }

  .table-head {
    background: #eee;
  }
}
</style>
