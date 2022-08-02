<template>
  <div class="app-detail" v-if="appInfo != null">
    <!--    <el-drawer
          :close-on-click-modal="false"
          :with-header="false"
          custom-class="detail"
          :visible.sync="visible"
          size="44%"
          :title="$t('common.detail')"
          v-loading="dataListLoading"
          @close="cancel">-->
    <el-page-header @back="goToAppStore" content="">
    </el-page-header>
    <el-row style="margin: 20px 0px">
      <el-col :span="3">
        <span style="height: 110px; width: 110px; line-height: 110px;margin: 30%">
          <img style="height: 110px; width: 110px;"
               :src="iconView(appInfo.appIconUrl)"/>
        </span>
      </el-col>
      <el-col :span="7">
        <div style="margin-top: -10px;">
          <h1 class="page-title"> {{ appInfo.appName }}</h1>
          <p class="text-muted" style="color: #99a9bf;">{{ $t('appstore.application.lastestVersionName') }}:
            {{ appInfo.lastestVersionName }} </p>
          <p class="text-muted" style="color: #99a9bf;">{{ $t('appstore.application.developerName') }}:
            {{ appInfo.keyName }} </p>
          <!--          <p class="text-muted" style="color: #99a9bf;">{{ $t('appstore.application.downloadCount') }}:
                      {{ appInfo.downloadCount }} </p>
                    <p class="text-muted" style="color: #99a9bf;">{{ $t('appstore.application.appSize') }}:
                      {{ appVersionInfo.appSize + ' MB' }}  </p>-->
        </div>
      </el-col>
      <el-col :span="14">
        <div style="margin-top: 16px;">
          <el-row>
            <el-col :span="2">
              <div>&nbsp;</div>
            </el-col>
            <!--            <el-col :span="4">
                          <h2>{{ appInfo.scoreAverage }}&nbsp;<i class="el-icon-star-on" style="color: #ff9900"></i></h2>
                          <span
                            style="font-size: 14px; color: #99a9bf">{{
                              $t('appstore.application.scoreAverage', {appraiseCount: appInfo.appraiseCount})
                            }}</span>
                        </el-col>-->
            <el-col :span="2">
              <div class="separator"></div>
            </el-col>
            <el-col :span="4">
              <span style="font-size: 14px; color: #99a9bf">{{ $t('appstore.application.status') }}</span>
              <h2>{{ handleStatus(appInfo.status) }} </h2>
            </el-col>
            <el-col :span="2">
              <div class="separator">|</div>
            </el-col>
            <el-col :span="4">
              <span style="font-size: 14px; color: #99a9bf">{{ $t('appstore.application.downloadCount') }}</span>
              <h2>{{ appInfo.downloadCount }} </h2>
            </el-col>
            <el-col :span="2">
              <div class="separator">|</div>
            </el-col>
            <el-col :span="4">
              <span style="font-size: 14px; color: #99a9bf">{{ $t('appstore.application.appSize') }}</span>
              <h2>{{ appVersionInfo.appSize }} MB </h2>
            </el-col>
            <!--                  <el-col :span="2">
                                <div class="separator">|</div>
                              </el-col>
                              <el-col :span="4">
                                <h2 v-if="appVersionInfo.chargeStrategy == 1">{{ $t('appstore.application.chargeStrategyFree') }} </h2>
                                <h2 v-if="appVersionInfo.chargeStrategy == 2 || appVersionInfo.chargeStrategy == 3">
                                  {{ appVersionInfo.currency }} {{ appVersionInfo.amount }} </h2>
                                <span v-if="appVersionInfo.chargeStrategy == 1 || appVersionInfo.chargeStrategy == 2"
                                      style="font-size: 14px; color: #99a9bf">{{ $t('appstore.application.chargeStrategy') }}</span>
                                <span v-if="appVersionInfo.chargeStrategy == 3"
                                      style="font-size: 14px; color: #99a9bf">{{
                                    $t('appstore.application.chargeStrategySubscribe')
                                  }}</span>
                                <span v-if="appVersionInfo.chargeStrategy == 3 && appVersionInfo.subscribeType == 1"
                                      style="font-size: 14px; color: #99a9bf">{{ $t('appstore.application.subscribeTypeByYear') }}</span>
                                <span v-if="appVersionInfo.chargeStrategy == 3 && appVersionInfo.subscribeType == 3"
                                      style="font-size: 14px; color: #99a9bf">{{ $t('appstore.application.subscribeTypeByMonth') }}</span>
                                <span v-if="appVersionInfo.chargeStrategy == 3 && appVersionInfo.subscribeType == 5"
                                      style="font-size: 14px; color: #99a9bf">{{ $t('appstore.application.subscribeTypeByWeek') }}</span>
                              </el-col>-->
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('common.detail')" name="first">
        <el-descriptions v-loading="dataListLoading" direction="vertical" class="margin-top" title="" :column="12"
                         size="60" border>
          <template slot="extra"></template>
          <el-descriptions-item :label="$t('appstore.application.appName')" :span="3">
            {{ appInfo.appName }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('appstore.application.lastestVersionName')" :span="3">
            {{ appInfo.lastestVersionName }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('appstore.application.categoryName')" :span="3">
            {{ appInfo.categoryName }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('appstore.application.packageName')" :span="3">
            {{ appInfo.packageName }}
          </el-descriptions-item>
<!--          <el-descriptions-item :label="$t('appstore.application.releaseTarget')" :span="3">-->
<!--            <div v-if="appInfo.releaseTarget == 1">{{ $t('appstore.application.releaseTarget1') }}</div>-->
<!--            <div v-if="appInfo.releaseTarget == 2">{{ $t('appstore.application.releaseTarget2') }}</div>-->
<!--            <div v-if="appInfo.releaseTarget == 3">{{ $t('appstore.application.releaseTarget3') }}</div>-->
<!--          </el-descriptions-item>-->
          <el-descriptions-item :label="$t('appstore.application.developerName')" :span="3">
            {{ appInfo.keyName }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('appstore.application.supportDevice')" :span="3">
            <el-checkbox v-model="appInfo.portrait === 1" disabled>{{ $t('appstore.application.portrait') }}
            </el-checkbox>
            <el-checkbox v-model="appInfo.landscape === 1" disabled>{{ $t('appstore.application.landscape') }}
            </el-checkbox>
            <el-checkbox v-model="appInfo.autoFit === 1" disabled>{{ $t('appstore.application.autoFit') }}
            </el-checkbox>
          </el-descriptions-item>
<!--          <el-descriptions-item :label="$t('appstore.application.bankcardApp')" :span="3">-->
<!--            <el-checkbox v-model="appInfo.bankcardApp === 1" disabled>{{ $t('appstore.application.bankcardApp') }}-->
<!--            </el-checkbox>-->
<!--          </el-descriptions-item>-->
<!--          <el-descriptions-item :label="$t('appstore.application.highQuality')" :span="3">-->
<!--            <el-checkbox v-model="appInfo.highQuality === 1" disabled>{{ $t('appstore.application.highQuality') }}-->
<!--            </el-checkbox>-->
<!--          </el-descriptions-item>-->
          <el-descriptions-item :label="$t('appstore.application.mainLanguage')" :span="3">
            <el-select v-model="appInfo.mainLanguage" size="mini" disabled>
              <el-option
                v-for="lang in langList"
                :key="lang.val"
                :value="lang.val"
                :label="lang.label"
              />
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item :label="$t('appstore.application.supportLanguage')" :span="3">
            <el-select
              v-model="appInfo.supportLanguage"
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
          <el-descriptions-item :label="$t('appstore.application.creTime')" :span="3">
            {{ formatDate(appInfo.creTime) }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('appstore.application.updTime')" :span="3">
            {{ formatDate(appInfo.updTime) }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('appstore.application.appIntroduction')" :span="12">
<!--            {{ appInfo.appIntroduction }}-->
              <el-input
                      v-model="appVersionInfo.appIntroduction"
                      :maxlength=512
                      :rows="3"
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
                  :src="item.url"
                  :preview-src-list="tempEnlargedPicture">
                </el-image>
              </div>
            </el-carousel-item>
          </el-carousel>
          <el-carousel v-else-if="screenshotType == 2" :interval="4000" type="card" height="200px">
            <el-carousel-item v-for="item in screenshots_v" :key="item.appImagesId">
              <el-image
                @click="showEnlargedPicture(item.url)"
                :src="item.url"
                :preview-src-list="tempEnlargedPicture">
              </el-image>
            </el-carousel-item>
          </el-carousel>
          <div class="data-empty" v-else>
            <icon-svg class="data-empty-icon" name="chart-data-empty"></icon-svg>
            <div class="data-empty-text">{{ $t('common.noData') }}</div>
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane :label="$t('appstore.application.appVersionList')" name="second">
        <AppVersion ref="appVersion" @close="getData()" @refreshData="getData()"  />
      </el-tab-pane>
      <el-tab-pane :label="$t('appstore.application.appRevisionList')" name="third">
        <AppRevision ref="appRevision"/>
      </el-tab-pane>
      <el-tab-pane :label="$t('appstore.application.appDownloadList')" name="fourth">
        <AppDownload ref="appDownload"/>
      </el-tab-pane>
    </el-tabs>
    <!--    </el-drawer>-->
  </div>
</template>

<script>
import {getAppInfo, getAppVersionInfo, screenshotList, updateHighQualityStatus} from '@/api/developer-app'
import {formatDate} from '@/utils/formatDate'
import AppVersion from './app-version'
import AppRevision from './app-revision'
import AppDownload from './app-download'

export default {
  data () {
    return {
      appId: 0,
      appVersionId: 0,
      appInfo: null,
      appVersionInfo: null,
      appAgreement: '',
      screenshotType: 1,
      screenshots_h: [],
      screenshots_v: [],
      activeName: 'first',
      dataListLoading: false,
      agreementLoading: false,
      tempEnlargedPicture: [],
      langList: [
        { val: 'zh-CN', label: this.$t('language_list.zh') },
        { val: 'en-US', label: this.$t('language_list.en') },
        { val: 'ko', label: this.$t('language_list.ko') },
        { val: 'jp', label: this.$t('language_list.jp') },
        { val: 'pt', label: this.$t('language_list.pt') },
        { val: 'ru', label: this.$t('language_list.ru') },
        { val: 'fr', label: this.$t('language_list.fr') },
        { val: 'de', label: this.$t('language_list.de') },
        { val: 'es', label: this.$t('language_list.es') },
        { val: 'it', label: this.$t('language_list.it') },
        { val: 'ar', label: this.$t('language_list.ar') },
        { val: 'other', label: this.$t('language_list.other') }
      ]
    }
  },
  components: {
    AppVersion,
    AppRevision,
    AppDownload
  },
  activated () {
    this.activeName = 'first'
    this.dataListLoading = true
    this.appId = this.$route.query.appId
    this.appVersionId = this.$route.query.appVersionId
    this.getData()
    /*  this.agreementLoading = true
    getAppAgreement(this.appId).then(data => {
      this.appAgreement = data
      this.agreementLoading = false
    }).catch(e => {
      console.log(`err:${JSON.stringify(e)}`)
      this.agreementLoading = false
    }) */
    screenshotList(this.appId, {
      appVersionId: this.appVersionId,
      screenType: 1
    }).then(data => {
      this.screenshots_h = data
    }).catch(e => {
      console.log(`err:${JSON.stringify(e)}`)
    })
    screenshotList(this.appId, {
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
  },
  computed: {},
  methods: {
    showEnlargedPicture (url) {
      this.tempEnlargedPicture.length = 0
      this.tempEnlargedPicture.push(url)
    },
    handleStatus (status) {
      if (status === 11) {
        return this.$t('developer_app.status_option[0].label')
      } else if (status === 9) {
        return this.$t('developer_app.status_option[1].label')
      } else if (status === 7) {
        return this.$t('developer_app.status_option[2].label')
      } else if (status === 3) {
        return this.$t('developer_app.status_option[3].label')
      } else if (status === 1) {
        return this.$t('developer_app.status_option[4].label')
      } else if (status === 0) {
        return this.$t('developer_app.status_option[5].label')
      }
    },
    goToAppStore () {
      this.$router.push({path: 'dev-app'})
    },
    iconView (icon) {
      if (icon) {
        return process.env.ICON_API + icon
        // return icon
      }
      return 'static/img/Android.png'
    },
    updateHighQualityStatus () {
      let params = {}
      if (this.appInfo.highQuality === 1) {
        params = {'highQualityStatus': 0}
      } else if (this.appInfo.highQuality === 0) {
        params = {'highQualityStatus': 1}
      }
      updateHighQualityStatus(this.appId, params).then(data => {
        if (data && data === 1) {
          this.$message.success(this.$t('common.operate_success'))
          this.dataListLoading = true
          getAppInfo(this.appId).then(data => {
            this.appInfo = data
            this.dataListLoading = false
          }).catch(e => {
            console.log(`err:${JSON.stringify(e)}`)
            this.dataListLoading = false
          })
        } else {
          this.$message.error(data.message)
        }
      }).catch(e => {
        this.dataListLoading = false
        console.log(`err:${JSON.stringify(e)}`)
      })
    },
    errorHandler () {
      return true
    },
    handleClick (tab, event) {
      if (tab.name === 'first') {
        this.getData()
      } else if (tab.name === 'second') {
        this.$nextTick(() => {
          this.$refs.appVersion.init(this.appId)
        })
      } else if (tab.name === 'third') {
        this.$nextTick(() => {
          this.$refs.appRevision.init(this.appId)
        })
      } else if (tab.name === 'fourth') {
        this.$nextTick(() => {
          this.$refs.appDownload.init(this.appId)
        })
      } else if (tab.name === 'fifth') {
        this.$nextTick(() => {
          this.$refs.appPurchase.init(this.appId)
        })
      } else if (tab.name === 'sixth') {
        this.$nextTick(() => {
          this.$refs.appAppraise.init(this.appId)
        })
      }
    },
    formatDate (value) {
      return formatDate(value, 'yyyy-MM-dd hh:mm:ss')
    },
    getData () {
      getAppInfo(this.appId).then(data => {
        this.appInfo = data
        this.dataListLoading = false
      }).catch(e => {
        console.log(`err:${JSON.stringify(e)}`)
        this.dataListLoading = false
      })
      if (this.appVersionId !== 0 || this.appVersionId !== '0') {
        getAppVersionInfo(this.appId, this.appVersionId).then(data => {
          this.appVersionInfo = data
        }).catch(e => {
          this.dataListLoading = false
          console.log(`err:${JSON.stringify(e)}`)
        })
      }
    }
  }
}
</script>

<style lang="scss">
.separator {
  float: right;
  margin: 50%;
  font-weight: 700;
  color: #c0c4cc;
}
</style>
