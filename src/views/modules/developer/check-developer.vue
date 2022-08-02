<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible="this.visible"
    :title="$t('developer.operate_examine')"
    width="55%"
    @close="cancel">
    <el-steps :active="active" align-center>
      <el-step :title="$t('operator.verify')" description=""></el-step>
      <el-step :title="$t('operator.process')" description=""></el-step>
      <el-step :title="$t('operator.checkComplete')" description=""></el-step>
    </el-steps>
    <div v-if="active === 1" class="stepContainer">
      <el-descriptions :title="$t('developer.developer_info')" direction="vertical" :column="4" border style="margin-top: 15px">
        <el-descriptions-item :label="$t('developer.name')">{{ developer.contactName }}</el-descriptions-item>
        <el-descriptions-item :label="$t('developer.developerType')">
          <el-tag v-if="developer.developerType === 1" size="small">{{ $t('developer.developerTypeOption[0].label') }}</el-tag>
          <el-tag v-if="developer.developerType === 2" size="small">{{ $t('developer.developerTypeOption[1].label') }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('developer.pidType')" v-show="developer.developerType === 1">
          <el-tag v-if="developer.pidType === 1" size="small">{{ $t('developer.id_card') }}</el-tag>
          <el-tag v-if="developer.pidType === 2" size="small">{{ $t('developer.passport') }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('developer.email')">{{ developer.email }}</el-descriptions-item>
        <el-descriptions-item :label="$t('developer.mobile')">{{ developer.mobile }}</el-descriptions-item>
        <el-descriptions-item :label="$t('developer.pidNo')">{{ developer.pidNo }}</el-descriptions-item>
        <el-descriptions-item :label="$t('developer.creTime')">{{ formatDate(developer.creTime, 'yyyy-MM-dd hh:mm:ss') }}</el-descriptions-item>
        <el-descriptions-item :label="$t('developer.status')">
          <el-tag v-if="developer.status === 2" size="small" type="warning">{{ $t('developer.statusOption[2].label') }}</el-tag>
          <el-tag v-if="developer.status === 1" size="small">{{ $t('developer.statusOption[1].label') }}</el-tag>
          <el-tag v-if="developer.status === 0" size="small" type="info">{{ $t('developer.statusOption[0].label') }}</el-tag>
          <el-tag v-if="developer.status === 3" size="small" type="danger">{{ $t('developer.statusOption[3].label') }}</el-tag>
          <el-tag v-if="developer.status === 9" size="small" type="warning">{{$t('developer.statusOption[5].label') }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('developer.countryCode')">{{ formatCountry(developer.countryCode) }}</el-descriptions-item>
        <el-descriptions-item :label="$t('developer.address')" :span="2">{{ developer.address }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions :title="$t('developer.csr_info')" direction="vertical" :column="4" border style="margin-top: 15px">
        <el-descriptions-item :label="$t('developer.common_name')">{{ csr.cn }}</el-descriptions-item>
        <el-descriptions-item :label="$t('developer.organization_name')">{{ csr.o }}</el-descriptions-item>
        <el-descriptions-item :label="$t('developer.organization_unit_name')">{{ csr.ou }}</el-descriptions-item>
        <el-descriptions-item :label="$t('developer.sha_1')" :span="3"> {{ csr.sha1 }}</el-descriptions-item>
        <el-descriptions-item :label="$t('developer.public_key')" :span="3">{{ csr.pubKey }}</el-descriptions-item>
      </el-descriptions>
      <div style="text-align: center; margin-top: 10px">
        <el-button type="danger" size="medium" icon="el-icon-close" @click="rejectHandle">
          {{ $t('operator.checkFailed') }}
        </el-button>
        <el-button type="success" icon="el-icon-d-arrow-right" :disabled=this.nextStepVisible size="medium"
                   @click="nextStep">{{ $t('operator.checkSuccess') }}
        </el-button>
      </div>
    </div>
    <div v-if="active === 2 && !reject">
      <el-form class="center" :model="form" :rules="dataRule" ref="form"  >
        <el-form-item :label="$t('common.remark')" style="margin-bottom: 20px">
          <el-input type="textarea"
                    :placeholder="$t('operator.checkSuccessTip')"
                    v-model="form.remark"
                    :autosize="{ minRows: 4, maxRows: 10}">
          </el-input>
        </el-form-item>
        <el-form-item class="stepContainer" style="text-align: center">
          <el-upload
            ref="upload"
            action="#"
            accept=".crt"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :file-list="fileList"
            :auto-upload="false">
            <el-button slot="trigger" type="primary">{{ $t('developer.btn_developer_cert') }}</el-button>
            <el-button :disabled="this.fileList.length <= 0" type="success" :loading="uploadCerLoading"
                       @click="submitUpload" icon="el-icon-upload">{{ $t('operator.uploadFile') }}</el-button>
            <el-button type="warning" @click="preStep">{{ $t('common.back') }}</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="active === 2 && reject" style="text-align: center;">
      <el-input type="textarea"
                class="center"
                :placeholder="$t('operator.checkFailedReasonTip')"
                v-model="form.remark"
                :autosize="{ minRows: 4, maxRows: 10}">
      </el-input>
      <el-button type="warning" v-show="this.backVisible" @click="preStep">{{ $t('common.back') }}</el-button>
      <el-button type="primary" :loading="rejectLoading" @click="rejectConfirm">{{ $t('common.confirm') }}</el-button>
    </div>
    <div v-if="active === 3" style="text-align: center; margin: 50px 0 50px 0">
      <span style="font-size: 25px;color: #5daf34; margin: 30%">{{ $t('operator.checkComplete') }}!</span>
    </div>
  </el-dialog>
</template>
<script>
import http from '../../../utils/httpRequest'
import {formatDate} from '@/utils/formatDate'
import {formatCountry} from '@/utils/formatCountry'
import {getCsrInfo} from '../../../api'

export default {

  data () {
    return {
      rejectLoading: false,
      visible: false,
      nextStepVisible: false,
      backVisible: true,
      reject: false,
      active: 1,
      fileList: [],
      developer: {},
      csr: {},
      form: {
        remark: ''
      },
      uploadCerLoading: false,
      mapList: [],
      dataRule: {
      }
    }
  },
  methods: {
    init (developer) {
      this.rejectLoading = false
      this.visible = true
      this.developer = developer
      this.getCsrInfo(developer.developerId)
    },
    getCsrInfo (developerId) {
      getCsrInfo(developerId).then(data => {
        if (data) {
          this.csr = data
          console.log(this.csr)
        }
      }).catch(e => {
        console.log(`err:${JSON.stringify(e)}`)
      })
    },
    formatCountry (value) {
      return formatCountry(value)
    },
    mapSelect () {
      this.form.mapKey = ''
    },
    cancel () {
      this.visible = false
      this.$emit('close')
    },
    nextStep () {
      this.active++
    },
    preStep () {
      this.form.remark = ''
      this.reject = false
      this.active--
    },
    rejectHandle (id) {
      this.reject = true
      this.nextStep()
    },
    rejectConfirm () {
      if (!this.form.remark) {
        this.$message.warning(this.$t('developer.error_tip.reject_remark'))
        return
      }
      const formData = new FormData()
      formData.append('remark', this.form.remark)
      formData.append('examineStatus', 3)
      this.rejectLoading = true
      http({
        method: 'POST',
        url: http.adornDeveloperAdminUrl(`online/developer-admin/developer/${this.developer.developerId}/examine`),
        data: formData
      }).then((res) => {
        this.$message({
          type: 'success',
          message: this.$t('operator.checkComplete')
        })
        this.rejectLoading = false
        this.$emit('refreshDataList')
        this.nextStep()
      }).catch(data => {
        console.log(data.response.data)
        this.$message.error(data.response.data.message)
        this.fileList = []
        this.rejectLoading = false
      })
    },
    submitUpload () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.uploadCerLoading = true
          const formData = new FormData()
          formData.append('file', this.fileList[0].raw)
          formData.append('remark', this.form.remark)
          formData.append('examineStatus', 1)
          http({
            method: 'POST',
            url: http.adornDeveloperAdminUrl(`online/developer-admin/developer/${this.developer.developerId}/examine`),
            data: formData
          }).then((res) => {
            this.$message({
              type: 'success',
              message: this.$t('operator.checkComplete')
            })
            this.uploadCerLoading = false
            this.$emit('refreshDataList')
            this.nextStep()
          }).catch(data => {
            console.log(data.response.data)
            this.$message.error(data.response.data.message)
            this.fileList = []
            this.uploadCerLoading = false
          })
        }
      })
    },
    handleRemove (file, fileList) {
      fileList.shift()
    },
    handlePreview (file) {
    },
    handleChange: function (file, fileList) {
      if (fileList.length > 1) {
        fileList.shift()
      }
      this.fileList = fileList

      var fileNameSplit = this.fileList[0].name.split('.')
      var suffix = fileNameSplit[fileNameSplit.length - 1]
      if (!(fileNameSplit.length === 2 && suffix === 'crt')) {
        fileList.shift()
        this.$message.error('invalid file')
      }
    },
    formatDate (cellValue, fmt) {
      return formatDate(cellValue, fmt)
    }
  }
}
</script>
<style lang="scss" scoped>
.stepContainer {
  margin-bottom: 10px;
}

.center {
  width: 80%;
  margin: 15px 15% 15px 10%
}
</style>
