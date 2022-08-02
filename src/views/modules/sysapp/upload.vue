<template>
  <div>
    <header class="upload-header">
      <h1>{{ $t('sysapp.uploadTitle1') }}</h1>
      <h2 class="">{{ $t('sysapp.uploadTitle2') }}</h2>
    </header>
    <div justify="center">
      <el-steps
        class="steps"
        :active="active"
        finish-status="success"
        align-center
      >
        <el-step :title="$t('sysapp.uploadFileStep')"/>
        <el-step :title="$t('sysapp.verifyStep')"/>
        <el-step :title="$t('sysapp.successStep')"/>
      </el-steps>

      <div v-if="active === 0">
        <el-row
          type="flex"
          justify="center"
          align="middle"
          class="application-type"
        >
        </el-row>
        <el-row type="flex" justify="center" class="row">
          <el-upload
            v-if="!loading"
            ref="upload"
            drag
            action=""
            :auto-upload="false"
            :show-file-list="false"
            accept=".apk"
            :on-change="handleFileChange"
          >
            <i class="el-icon-upload"/>
            <div class="el-upload__text">
              {{ $t('sysapp.uploadTip1') }}<em>{{ $t('sysapp.uploadTip2') }}</em>
            </div>
            <div slot="tip" class="el-upload__tip">{{ $t('sysapp.uploadTip3') }}</div>
          </el-upload>
        </el-row>
        <el-row type="flex" justify="center" class="row">
          <el-progress
            type="circle"
            :percentage="percentState"
            v-if="uploading"
          ></el-progress>
        </el-row>
        <el-row type="flex" justify="center">
          <el-button type="warning" @click="back(false)">{{ $t('common.giveUp') }}</el-button>
        </el-row>
      </div>
      <div v-if="active === 1" style="text-align: center" v-loading="loading">
        <div style="width: 70%;display: inline-block">
          <br>
          <div>
            <span v-if="!isLatest" style="color: red">{{ this.errorMes }}</span>
          </div>
          <br>
          <el-descriptions class="margin-top" title="" :column="2" :size="size" border>
            <el-descriptions-item :label="$t('sysapp.appName')" :labelStyle="{'width': '165px','text-align':'center'}">
              {{ app.apkName }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('sysapp.supportDevice')" :labelStyle="{'width': '165px','text-align':'center'}">
              <el-checkbox v-model="portrait" @change="portraitCheck">{{$t('sysapp.handHeld')}}</el-checkbox>
              <el-checkbox v-model="landscape" @change="landscapeCheck">{{$t('sysapp.hd')}}</el-checkbox>
<!--              <el-radio-group v-model="confirmUploadData.modeHand">
                <el-radio :label="1">{{ $t('common.yes') }}</el-radio>
                <el-radio :label="0">{{ $t('common.no') }}</el-radio>
              </el-radio-group>-->
            </el-descriptions-item>
            <el-descriptions-item :label="$t('sysapp.appPackageName')"
                                  :labelStyle="{'width': '165px','text-align':'center'}">{{ app.packageName }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('sysapp.fileMd5')"
                                  :span="1"
                                  :labelStyle="{'width': '165px','text-align':'center'}">{{ app.fileMd5 }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('sysapp.version')" :labelStyle="{'width': '165px','text-align':'center'}">
              {{ app.versionName }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('sysapp.updateMode')"
                                  :labelStyle="{'width': '165px','text-align':'center'}">
              <el-radio-group v-model="confirmUploadData.forceUpdate">
                <el-radio :label="1">{{ $t('sysapp.silentUpdate') }}</el-radio>
                <el-radio :label="0">{{ $t('sysapp.normalUpdate') }}</el-radio>
              </el-radio-group>

            </el-descriptions-item>
            <el-descriptions-item :label="$t('sysapp.upload')" :labelStyle="{'width': '165px','text-align':'center'}">
              {{ uploadFormatDate(app.uploadTime) }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('sysapp.installMode')"
                                  :labelStyle="{'width': '165px','text-align':'center'}">
              <el-radio-group v-model="confirmUploadData.deleteUpdate">
                <el-radio :label="1">{{ $t('sysapp.deleteInstall') }}</el-radio>
                <el-radio :label="0">{{ $t('sysapp.patchInstall') }}</el-radio>
              </el-radio-group>

            </el-descriptions-item>
            <!--                <el-descriptions-item :label="$t('sysapp.updateToGroup')"
                                                  :contentStyle="{'width': '500px','height': '60px'}"
                                                  :labelStyle="{'width': '165px', 'text-align':'center'}">
                              <el-checkbox :label="$t('sysapp.syncAppTip')" name="type" :disabled="confirmUploadData.versionStyle == 0"></el-checkbox>
                            </el-descriptions-item>-->

            <el-descriptions-item :label="$t('sysapp.usage')" :labelStyle="{'width': '165px','text-align':'center'}">
              <el-radio-group v-model="confirmUploadData.versionStyle">
                <el-radio :label="1">{{ $t('sysapp.prodUsage') }}</el-radio>
                <el-radio :label="0">{{ $t('sysapp.testUsage') }}</el-radio>
              </el-radio-group>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('sysapp.remark')" :span="2"
                                  :labelStyle="{'width': '165px','text-align':'center'}">
              <el-input type="textarea" v-model="confirmUploadData.remark"></el-input>
            </el-descriptions-item>

            <el-descriptions-item v-if="confirmUploadData.versionStyle == 0"
                                  :label="$t('sysapp.bindSn')"
                                  :labelStyle="{'width': '80px','text-align':'center'}"
                                  :span="2">
              <el-table
                border
                :data="confirmUploadData.bindSn"
                style="width: 100%"
                :cell-style="{'text-align':'center'}"
                :header-cell-style="{'text-align':'center'}">
                <el-table-column :label="$t('sysapp.devSn')" prop="sn"></el-table-column>
                <el-table-column
                  align="right">
                  <template slot="header" slot-scope="scope">
                    <el-input style="display: inline-block;width: 60%" v-model="sn" clearable></el-input>
                    <el-button type="warning" @click="handleAddSn"
                               style="display: inline-block;width: 20%;margin-left: 5px">{{ $t('common.add') }}
                    </el-button>
                  </template>
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      @click="handleDelete(scope.$index, scope.row)" style="color: red">{{ $t('common.delete') }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div v-if="fileReady">
          <el-row type="flex" justify="center" class="row">
            <span style="margin-right: 20px">File Name: {{ fileName }}</span>
            <span>Size: {{ size }}</span>
          </el-row>
          <el-row type="flex" justify="center">
            <el-button type="warning" @click="back(false)">{{ $t('common.giveUp') }}</el-button>
            <el-button type="primary" @click="preStep">{{ $t('sysapp.preStep') }}</el-button>
            <el-button :disabled="!isLatest" :loading="loading" type="success" @click="confirmUpload">{{ $t('sysapp.upload') }}</el-button>
          </el-row>
        </div>
      </div>
      <!--      <div v-if="active == 2">
              <el-row type="flex" justify="center">
                <el-button type="warning" @click="back">{{$t('common.back')}}</el-button>
              </el-row>
            </div>-->
      <div v-if="active == 3">
        <el-row type="flex" justify="center">
          <el-button type="warning" @click="back(true)">{{ $t('common.back') }}</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import http from '../../../utils/httpRequest'
import {formatDate} from '@/utils/formatDate'
import {confirmAppVersion, releaseApk} from '../../../api/sysapp'
import {refreshTokenLogin} from '@/utils'
import {verifyDeviceSn} from '../../../api/device'

export default {
  props: {
    appTypeCode: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      radio: 'android',
      formData: new FormData(),
      fileName: '',
      fileReady: false,
      size: '',
      percentState: 0,
      uploading: false,
      active: 0,
      loading: false,
      app: {},
      sn: '',
      confirmUploadData: {
        appFileUuid: '',
        deleteUpdate: 0,
        forceUpdate: 0,
        modeHand: 1,
        modeHd: 0,
        remark: '',
        versionStyle: 1,
        syncToGroup: 0,
        bindSn: []
      },
      portrait: true,
      landscape: false,
      isLatest: false,
      errorMes: ''
    }
  },
  methods: {
    handleFileChange (file) {
      this.formData.delete('file')
      this.$refs.upload.clearFiles()
      this.uploading = false

      this.fileName = file.name
      this.size = (file.size / 1024 / 1024).toFixed(2) + 'MB'
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (extension !== 'apk') {
        return this.$message.warning('Only the suffix can be uploaded is apk')
      }
      this.formData.append('file', file.raw)
      this.uploadFile()
      this.fileReady = true
    },
    updateProgress (e) {
      this.percentState = parseInt((e.loaded / e.total) * 100)
      if (this.percentState === 100) {
      }
    },
    uploadFile () {
      this.loading = true
      this.uploading = true
      this.percentState = 0
      http({
        url: http.adornUrl('file-server/file/upload'),
        method: 'POST',
        data: this.formData,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            this.updateProgress(progressEvent)
          }
        }
      }).then((res) => {
        this.app = res.data
        this.confirmUploadData.appFileUuid = this.app.fileUuid
        this.loading = false
        this.uploading = false
        this.nextStep()
        this.confirmAppVersion(this.app.versionCode, this.app.packageName)
      }).catch(data => {
        if (data.response.data.code === '1092') {
          refreshTokenLogin()
        }
        this.loading = false
        this.uploading = false
        this.$message.error(data.response.data.message)
      })
      this.isLatest = false
    },
    confirmUpload () {
      if (!this.confirmUploadData.modeHand && !this.confirmUploadData.modeHd) {
        this.$message({
          type: 'warning',
          message: this.$t('sysapp.pleaseSelectSupportDevice')
        })
        return
      }
      this.loading = true
      let arrNew = []
      this.confirmUploadData.bindSn.forEach(item => {
        arrNew.push(item.sn)
      })
      if (this.confirmUploadData.versionStyle === 0 && arrNew.length === 0) {
        // this.$message.warning('')
        return this.$message.warning(this.$t('sysapp.grayscaleTip'))
      }
      let param = {
        appFileUuid: this.confirmUploadData.appFileUuid,
        deleteUpdate: this.confirmUploadData.deleteUpdate,
        forceUpdate: this.confirmUploadData.forceUpdate,
        modeHand: this.confirmUploadData.modeHand,
        modeHd: this.confirmUploadData.modeHd,
        remark: this.confirmUploadData.remark,
        versionStyle: this.confirmUploadData.versionStyle,
        syncToGroup: this.confirmUploadData.syncToGroup,
        appTypeCode: this.appTypeCode,
        bindSn: arrNew
      }
      console.log(param)
      releaseApk(param).then(data => {
        this.$message({
          type: 'success',
          message: this.$t('common.success')
        })
        this.loading = false
        this.nextStep()
        this.nextStep()
        this.loading = false
      }).catch(data => {
        this.loading = false
      })
    },
    handleAddSn () {
      this.confirmUploadData.bindSn.forEach(item => {
        if (this.sn === item.sn) {
          this.$message({
            type: 'error',
            message: this.$t('sysapp.duplicateSn')
          })
          throw new Error(this.$t('sysapp.duplicateSn'))
        }
      })
      verifyDeviceSn(this.sn).then(data => {
        this.confirmUploadData.bindSn.push({'sn': this.sn})
        this.sn = ''
      })
    },
    confirmAppVersion (versionCode, packageName) {
      let param = {
        versionCode: versionCode,
        packageName: packageName
      }
      confirmAppVersion(param).then(data => {
        this.isLatest = true
      }).catch(data => {
        this.errorMes = data
        this.isLatest = false
      })
    },
    handleDelete (index, row) {
      this.confirmUploadData.bindSn.splice(index, 1)
    },
    nextStep () {
      this.active++
    },
    preStep () {
      this.active--
    },
    back (refresh) {
      this.$emit('backHandle', refresh)
      this.isLatest = false
    },
    uploadFormatDate (timeStamp) {
      if (timeStamp !== null) {
        var date = new Date(timeStamp)
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    portraitCheck (value) {
      if (value) {
        this.confirmUploadData.modeHand = 1
      } else {
        this.confirmUploadData.modeHand = 0
      }
    },
    landscapeCheck (value) {
      if (value) {
        this.confirmUploadData.modeHd = 1
      } else {
        this.confirmUploadData.modeHd = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.row {
  margin-bottom: 20px;
}

.upload-header {
  width: 100%;
  font-weight: 300;
  margin-bottom: 20px;
  background-attachment: fixed, fixed;
  background-image: linear-gradient(
      -60deg,
      #bad994 0,
      #6fcbdc 60%,
      #32b5cd 100%
  );
  background-position: center center, center center;
  background-size: cover, cover;
  color: white;
  padding: 1% 0;
  text-align: center;
  position: relative;

  & h1 {
    margin: 1% 0;
    font-size: 2.3em;
  }

  & h2 {
    margin-bottom: 1%;
    font-weight: 300;
    font-size: 1.8em;
  }

  &:after {
    content: '';
    width: 0;
    height: 0;
    border: 16px solid transparent;
    border-bottom: 16px solid white;
    position: absolute;
    bottom: 0;
    left: 50%;
    margin-left: -20px;
  }
}


.application-type {
  margin-bottom: 40px;

  .label {
    line-height: 20px;
    font-weight: 400;
    padding: 9px 30px;
  }

  img {
    width: 40px;
  }
}

.el-upload__tip {
  text-align: center;
}
</style>
