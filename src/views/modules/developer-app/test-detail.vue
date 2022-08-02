<template>
  <div class="app-detail" v-if="appInfo != null">
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

        </div>
      </el-col>
      <el-col :span="14">
        <div style="margin-top: 16px;">
          <el-row>
            <el-col :span="2">
              <div>&nbsp;</div>
            </el-col>

            <el-col :span="2">
              <div class="separator"></div>
            </el-col>
            <el-col :span="6">
              <span style="font-size: 14px; color: #99a9bf">{{ $t('appstore.application.status') }}</span>
              <h2>{{ handleStatus(appInfo.status) }} </h2>
            </el-col>
            <el-col :span="2">
              <div class="separator">|</div>
            </el-col>
            <el-col :span="6">
              <span style="font-size: 14px; color: #99a9bf">{{ $t('appstore.application.downloadCount') }}</span>
              <h2>{{ appInfo.downloadCount }} </h2>
            </el-col>
<!--            <el-col :span="2">-->
<!--              <div class="separator">|</div>-->
<!--            </el-col>-->
            <!--            <el-col :span="4">-->
            <!--              <h2>{{ appVersionInfo.appSize }} MB </h2>-->
            <!--              <span style="font-size: 14px; color: #99a9bf">{{ $t('appstore.application.appSize') }}</span>-->
            <!--            </el-col>-->

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
            {{ appInfo.appIntroduction }}
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
      <el-tab-pane :label="$t('appstore.examine.modelList')" name="second">
        <!--        <AppVersion ref="appVersion" @close="getData()" />-->
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading2"
          style="width: 100%;">
          <el-table-column
            prop="modelCode"
            header-align="center"
            align="center"
            min-width="150"
            :label="$t('appstore.examine.modelCode')">
          </el-table-column>
          <el-table-column
            prop="status"
            header-align="center"
            align="center"
            min-width="120"
            :label="$t('appstore.application.status')">
            <template slot-scope="scope">

              <el-tag v-if="scope.row.status === 0" size="small" type="info">{{
                  $t('appstore.examine.status0')
                }}
              </el-tag>
              <el-tag v-if="scope.row.status === 1" size="small">{{ $t('appstore.examine.status1') }}</el-tag>
              <el-tag v-if="scope.row.status === 2" size="small" type="danger">{{
                  $t('appstore.examine.status2')
                }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="examiner"
            header-align="center"
            align="center"
            min-width="120"
            :label="$t('appstore.application.examiner')">
          </el-table-column>
          <el-table-column
            prop="updTime"
            :formatter="formatDate"
            header-align="center"
            align="center"
            min-width="100"
            :label="$t('appstore.examine.testTime')">
          </el-table-column>
          <el-table-column
            prop="remark"
            header-align="center"
            align="center"
            min-width="120"
            :label="$t('common.remark')">
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            width="100"
            fixed="right"
            :label="$t('common.operate')">>
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="$t('contact.edit_remark')" placement="top">
                <el-button type="text" @click="showDetailHandle(scope.row)"><i class="el-icon-info"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageNo"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="rows"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-tab-pane>

      <el-dialog
        :close-on-click-modal="false"
        :visible="this.visible"
        :title="$t('contact.edit_remark')"
        width="40%"
        @close="cancel">

        <div class="stepContainer">
          <el-input type="textarea" class="center" :rows="10" :maxlength="512" v-model="remark"></el-input>
          <el-form :model='dataForm' ref='dataForm' :rules="rules">
            <el-form-item class="support-device"
                          prop='supportDeviceType'>
              <div class="upload-field">
                <el-row type="flex" class="mb-5" v-if='landscape'>
                  <el-upload
                    class="picture-uploader--landscape"
                    action
                    list-type="picture-card"
                    :auto-upload="false"
                    :file-list="landscapeImageFileList"
                    :on-change="uploadLandscapeFile"
                    :on-remove="handleLandscapeImageFileRemove"
                    accept=".png, .jpg">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </el-row>
                <el-row type="flex" v-if='portrait'>
                  <el-upload
                    class="picture-uploader--portrait"
                    action
                    list-type="picture-card"
                    :auto-upload="false"
                    :file-list="portraitImageFileList"
                    :on-change="uploadPortraitFile"
                    :on-remove="handlePortraitImageFileRemove"
                    accept=".png, .jpg">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </el-row>
                <p>{{ $t('appstore.examine.screenshots_tip') }}</p>
              </div>
            </el-form-item>
          </el-form>
          <div style="padding-left: 40%">
            <el-button type="success" size="medium"
                       @click="submitInfo">{{ $t('common.submit') }}
            </el-button>
          </div>

        </div>

      </el-dialog>
    </el-tabs>
  </div>
</template>

<script>
import {getAppInfo, screenshotList, updateHighQualityStatus, examListDetail, examListRemark} from '@/api/developer-app'
import {formatDate} from '@/utils/formatDate'
import AppVersion from './components/app-version'
import AppRevision from './components/app-revision'
import AppDownload from './components/app-download'
import http from '../../../utils/httpRequest'

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
      pageNo: 1,
      pageSize: 10,
      dataList: [],
      rows: 0,
      dataListLoading2: false,
      visible: false,
      remark: '',
      editForm: {},
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
      ],

      releaseLoading: false,
      showProgressPercent: false,
      showUploadErrorInfo: false,
      supportDeviceRuleFlag: false,
      progressPercent: 0,
      file: '',
      step: 0,
      fileList: [
        {
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        },
        {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        },
        {
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        },
        {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        },
        {
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        },
        {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        },
        {
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        },
        {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }
      ],
      landscapeImageFileList: [],
      portraitImageFileList: [],
      imageFileUuidList: [],
      categories: [],
      landscape: false,
      portrait: true,
      source: undefined,
      uploadStatus: 0,
      dataForm: {
        appId: '',
        appVersionId: '',
        uploadErrorInfo: '',
        apkFileUuid: '',
        appIconUrl: '',
        appName: '',
        packageName: '',
        versionName: '',
        versionCode: '',
        landscape: 0,
        portrait: 1,
        appIntroduction: '',
        revision: '',
        categoryId: 1,
        mainLanguage: '',
        supportLanguage: '',
        testAccount: '',
        testPassword: '',
        releaseType: 1
      }
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
  computed: {
    rules () {
      return {
        supportDeviceType: [
          {
            required: true,
            message: this.$t('appstore.examine.support_device_type'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    uploadPortraitFile (file, fileList) {
      if (!this.portrait) {
        this.$message.warning(this.$t('appstore.examine.select_support_portrait_device'))
        return
      }
      if (fileList.length > 9) {
        fileList.splice(fileList.length - 1)
        this.$message.warning(this.$t('appstore.examine.screenshots_lenght_limit_tip'))
        return
      }
      const screenType = 2 // 1横屏2竖屏
      this.uploadImg(file, screenType, fileList)
    },
    uploadLandscapeFile (file, fileList) {
      if (!this.landscape) {
        this.$message.warning(this.$t('appstore.examine.select_support_landscape_device'))
        return
      }
      if (fileList.length > 9) {
        fileList.splice(fileList.length - 1)
        this.$message.warning(this.$t('appstore.examine.screenshots_lenght_limit_tip'))
        return
      }
      const screenType = 1 // 1横屏2竖屏
      this.uploadImg(file, screenType, fileList)
    },
    uploadImg (file, type, fileList) {
      const size = (file.size / 1024).toFixed(2)
      if (size > 500) {
        fileList.splice(fileList.length - 1)
        this.$message({
          type: 'warning',
          message: this.$t('appstore.examine.screenshots_tip')
        })
        return
      }
      const formdata = new FormData()
      formdata.append('file', file.raw)
      // appImageUpload(formdata).
      http({
        method: 'POST',
        url: http.adornDeveloperAdminUrl(`online/developer-admin/app/upload/screenshot`),
        data: formdata
      }).then(res => {
        if (res) {
          const fileUuidObj = {
            'screenType': type,
            'fileUuid': `${res.data.fileUuid}`,
            'fileName': file.name,
            'url': ''
          }
          if (type === 1) {
            this.landscapeImageFileList.push({
              fileUuid: `${res.data.fileUuid}`,
              file: file,
              name: file.name,
              url: URL.createObjectURL(file.raw)
            })
          } else if (type === 2) {
            this.portraitImageFileList.push({
              fileUuid: `${res.data.fileUuid}`,
              file: file,
              name: file.name,
              url: URL.createObjectURL(file.raw)
            })
          }
          console.log(this.portraitImageFileList)
          this.imageFileUuidList.push(fileUuidObj)
          this.$message({
            message: this.$t('appstore.examine.image_added_successfully'),
            type: 'success'
          })
        }
      }).catch(e => {
        fileList.splice(fileList.length - 1)
        this.$confirmError(e)
      })
    },
    handleLandscapeImageFileRemove (file, fileList) {
      this.landscapeImageFileList.forEach((item) => {
        if (item.name === file.name) {
          this.imageFileUuidList = this.imageFileUuidList.filter(
            (item) => item.fileName !== file.name
          )
        }
      })
      this.landscapeImageFileList = this.landscapeImageFileList.filter(
        (item) => item.name !== file.name
      )
    },
    handlePortraitImageFileRemove (file, fileList) {
      this.portraitImageFileList.forEach((item) => {
        if (item.name === file.name) {
          this.imageFileUuidList = this.imageFileUuidList.filter(
            (item) => item.fileName !== file.name
          )
        }
      })
      this.portraitImageFileList = this.portraitImageFileList.filter(
        (item) => item.name !== file.name
      )
    },

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
      this.$router.push({path: 'dev-app-test'})
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
            this.dataListLoading = false
          })
        } else {
          this.$message.error(data.message)
        }
      }).catch(e => {
        this.dataListLoading = false
      })
    },
    errorHandler () {
      return true
    },
    handleClick (tab, event) {
      if (tab.name === 'first') {
        this.getData()
      } else if (tab.name === 'second') {
        // this.$nextTick(() => {
        //   this.$refs.appVersion.init(this.appId)
        // })
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
        this.dataListLoading = false
      })
      if (this.appVersionId !== 0 || this.appVersionId !== '0') {
        // getAppVersionInfo(this.appId, this.appVersionId).then(data => {
        //   this.appVersionInfo = data
        // }).catch(e => {
        //   this.dataListLoading = false
        // })

        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          appId: this.appId,
          appVersionId: this.appVersionId
          // developerName: this.dataForm.developerName
        }
        examListDetail(params).then(data => {
          this.dataList = data.data
          this.rows = data.rows
          this.dataListLoading2 = false
        }).catch(e => {
        })
      }
    },
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageNo = 1
      this.getData()
    },
    currentChangeHandle (val) {
      this.pageNo = val
      this.getData()
    },
    showDetailHandle (scope) {
      this.visible = true
      this.remark = scope.remark
      this.editForm = scope
      this.portraitImageFileList = []
      this.landscapeImageFileList = []
      this.imageFileUuidList = []
      if (scope.modelType === 2) {
        this.portrait = true
        this.landscape = false
        this.dataForm.portrait = 1
      }
      if (scope.modelType === 1) {
        this.landscape = true
        this.portrait = false
        this.dataForm.landscape = 1
      }
      if (scope.testScreenshotList) {
        this.dataForm.landscape = 0
        this.dataForm.portrait = 0
        // this.landscape = false
        // this.portrait = false
        scope.testScreenshotList.forEach((item) => {
          if (scope.modelType === 2) {
            // this.portrait = true
            // this.dataForm.portrait = 1
            this.portraitImageFileList.push({fileUuid: '', file: '', name: item.sortIndex, url: item.url})
          }
          if (scope.modelType === 1) {
            // this.landscape = true
            // this.dataForm.landscape = 1
            this.landscapeImageFileList.push({fileUuid: '', file: '', name: item.sortIndex, url: item.url})
          }
          const fileUuidObj = {
            'screenType': item.modelType,
            'fileUuid': '',
            'fileName': item.sortIndex,
            'url': item.url
          }
          this.imageFileUuidList.push(fileUuidObj)
        })
      }
      // this.portraitImageFileList = scope.testScreenshotList
      // this.fileList.forEach(item => {
      //     this.portraitImageFileList.push(item)
      // })
    },
    cancel () {
      this.visible = false
      this.$emit('close')
      this.portraitImageFileList = []
      this.landscapeImageFileList = []
    },
    submitInfo () {
      this.visible = false
      this.$emit('close')
      const params = {
        appId: this.appId,
        appVersionId: this.appVersionId,
        status: this.editForm.status,
        remark: this.remark,
        modelCode: this.editForm.modelCode,
        testScreenshot: this.imageFileUuidList
      }

      examListRemark(params).then(data => {
        this.visible = false
        this.portraitImageFileList = []
        this.landscapeImageFileList = []
        this.getData()
      }).catch(e => {
      })
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

.new-app {
  .el-form-item.support-device > .el-form-item__label {
    float: none;
  }

  .picture-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background-color: rgb(225, 235, 255);
  }

  .picture-uploader-icon {
    font-size: 28px;
    color: #ffffff;
    text-align: center;
  }

  .picture-uploader--landscape .el-upload--picture-card,
  .picture-uploader--landscape .el-upload-list__item {
    width: 300px;
    height: 200px;
    line-height: 200px;
  }

  .picture-uploader--portrait .el-upload--picture-card,
  .picture-uploader--portrait .el-upload-list__item {
    width: 200px;
    height: 300px;
    line-height: 300px;
  }
}
</style>
