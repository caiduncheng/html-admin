<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible="this.visible"
    :title=this.operator.operatorName
    width="40%"
    @close="cancel">
    <el-steps :active="active" align-center>
      <el-step :title="$t('operator.verify')" description=""></el-step>
      <el-step :title="$t('operator.process')" description=""></el-step>
      <el-step :title="$t('operator.checkComplete')" description=""></el-step>
    </el-steps>

    <div v-if="active === 0" class="stepContainer">
      <el-input type="textarea" class="center" disabled :rows="21" v-model="operatorCer"></el-input>
      <!--      <el-button type="primary" icon="el-icon-download" maxlength="10" size="medium" @click="downloadCertHandle">{{$t('operator.downloadCertBtn')}}</el-button>-->
      <el-button v-if="isAuth('10408200.MANAGE')" type="danger" size="medium" icon="el-icon-close" @click="rejectHandle">
        {{ $t('operator.checkFailed') }}
      </el-button>
      <el-button v-if="isAuth('10408200.MANAGE')" type="success" icon="el-icon-d-arrow-right" :disabled=this.nextStepVisible size="medium"
                 @click="nextStep">{{ $t('operator.checkSuccess') }}
      </el-button>
    </div>
    <div v-if="active === 1 && !reject">
      <el-form class="center" :model="form" :rules="dataRule" ref="form"  >
        <el-form-item :label="$t('operator.level')" prop="levelCode">
          <el-select v-model="form.levelCode" :placeholder="$t('operator.level')">
            <el-option v-for="item in levelList" :key="item.lable" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('operator.leverExpireTimeTip')" style="margin-top: 5px">
          <el-date-picker
            v-model="form.expireTime"
            type="date"
            value-format="timestamp"
            :placeholder="$t('operator.expireTimeTip')">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('operator.mapType')">
          <el-select v-model="form.mapType" @change="mapSelect">
            <el-option v-for="item in mapList" :key="item.mapType" :value="item.mapType" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('operator.mapKey')" prop="mapKey">
          <div>
            <el-tag
              size="small"
              @click="defaultKeyClick"
              style="cursor: pointer; margin-right: 10px;"
            >
              {{ $t('operator.defaulTag') }}
            </el-tag>
          </div>
          <el-input
            placeholder="key"
            v-model="form.mapKey" clearable>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('common.remark')" style="margin-bottom: 20px">
          <el-input type="textarea"
                    :placeholder="$t('operator.checkSuccessTip')"
                    v-model="form.reason"
                    :autosize="{ minRows: 4, maxRows: 10}">
          </el-input>
        </el-form-item>
        <el-form-item class="stepContainer">
          <el-upload
            ref="upload"
            action="#"
            accept=".crt"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :file-list="fileList"
            :auto-upload="false">
            <el-button slot="trigger" type="primary">{{ $t('operator.chooseFileBtn') }}</el-button>
            <el-button :disabled="this.fileList.length <= 0" style="margin-left: 10px;" type="success"
                       :loading="uploadCerLoading" @click="submitUpload" icon="el-icon-upload">
              {{ $t('operator.uploadFile') }}
            </el-button>
            <el-button type="warning" @click="preStep">{{ $t('common.back') }}</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="active === 1 && reject" style="text-align: center;">
      <el-input type="textarea"
                class="center"
                :placeholder="$t('operator.checkFailedReasonTip')"
                v-model="form.reason"
                :autosize="{ minRows: 4, maxRows: 10}">
      </el-input>
      <el-button type="primary" :loading="rejectLoading" @click="rejectConfirm">{{ $t('common.confirm') }}</el-button>
      <el-button type="warning" v-show="this.backVisible" @click="preStep">{{ $t('common.back') }}</el-button>
    </div>
    <div v-if="active === 2" class="stepContainer">
      <span style="font-size: 25px;color: #5daf34; margin: 10%">{{ $t('operator.checkComplete') }}!</span>
    </div>

  </el-dialog>
</template>
<script>
import {downloadCert, examineOperator} from '../../../../api/operator'
import http from '../../../../utils/httpRequest'
import {getMapList} from '@/utils'

export default {

  data () {
    return {
      rejectLoading: false,
      visible: false,
      nextStepVisible: false,
      backVisible: true,
      reject: false,
      active: 0,
      fileList: [],
      levelList: [],
      operatorCer: '',
      operator: {},
      form: {
        reason: '',
        levelCode: 'FREE_LEVEL',
        expireTime: null,
        mapType: 'MAP_BOX',
        mapKey: ''
      },
      uploadCerLoading: false,
      mapList: [],
      dataRule: {
        mapType: [{required: true, message: this.$t('common.nullInputTip'), trigger: 'change'}],
        mapKey: [{required: true, message: this.$t('common.nullInputTip'), trigger: 'blur'}],
        levelCode: [{required: true, message: this.$t('common.nullInputTip'), trigger: 'blur'}]
      }
    }
  },
  created () {
    this.levelList = this.$t('operator.level_list')
  },
  methods: {
    init (row) {
      console.log(new Date().getTimezoneOffset())
      this.rejectLoading = false
      this.visible = true
      this.mapList = getMapList()
      this.operator = row
      if (this.operator.operatorCertId === null) {
        this.backVisible = false
        this.nextStepVisible = true
      }
      this.form.mapType = this.operator.mapType === null ? this.form.mapType : this.operator.mapType
      this.form.mapKey = this.operator.mapKey === null ? this.form.mapKey : this.operator.mapKey
      this.downloadCertHandle()
    },
    mapSelect () {
      this.form.mapKey = ''
    },
    defaultKeyClick () {
      if (this.form.mapType === 'MAP_BOX') {
        this.form.mapKey = this.mapList[0].mapKey
      } else if (this.form.mapType === 'GOOGLE') {
        this.form.mapKey = this.mapList[1].mapKey
      } else if (this.form.mapType === 'BAIDU') {
        this.form.mapKey = this.mapList[2].mapKey
      }
    },
    cancel () {
      this.visible = false
      this.$emit('close')
    },
    nextStep () {
      this.active++
    },
    preStep () {
      this.reject = false
      this.active--
    },
    rejectHandle (id) {
      this.reject = true
      this.nextStep()
    },
    rejectConfirm () {
      this.rejectLoading = true
      let params = {
        operatorId: this.operator.operatorId,
        remark: this.form.reason,
        operatorCerId: this.operator.operatorCertId,
        operatorCerStatus: 3,
        levelCode: 'FREE_LEVEL'
      }
      examineOperator(params).then(data => {
        this.$message({
          type: 'success',
          message: this.$t('operator.checkComplete')
        })
        this.$emit('refreshDataList')
        this.rejectLoading = false
        this.nextStep()
      })
    },
    submitUpload () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.uploadCerLoading = true
          const formData = new FormData()
          console.log(this.fileList)
          formData.append('file', this.fileList[0].raw)
          http({
            method: 'POST',
            url: http.adornCoreUrl(`/online/management/admin/operator/${this.operator.operatorCertId}/cert-file`),
            data: formData
          }).then((res) => {
            console.log(res)
            let params = {
              operatorCerId: this.operator.operatorCertId,
              operatorId: this.operator.operatorId,
              remark: this.form.reason,
              operatorCerStatus: 1,
              levelCode: this.form.levelCode,
              expireTime: this.form.expireTime,
              mapType: this.form.mapType,
              mapKey: this.form.mapKey,
              mapToken: this.form.mapToken
            }
            examineOperator(params).then(data => {
              this.$message({
                type: 'success',
                message: this.$t('operator.checkComplete')
              })
              this.uploadCerLoading = false
              this.$emit('refreshDataList')
              this.nextStep()
              this.nextStep()
            }).catch(e => {
              this.uploadCerLoading = false
              console.log(`err:${JSON.stringify(e)}`)
            })
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
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleChange (file, fileList) {
      if (fileList.length > 1) {
        fileList.shift()
      }
      this.fileList = fileList
      console.log(this.fileList)
    },
    downloadCertHandle () {
      let operatorId = this.operator.operatorId
      downloadCert(operatorId).then(data => {
        this.operatorCer = data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.stepContainer {
  text-align: center;
  margin-bottom: 10px;
}

.center {
  width: 80%;
  margin: 15px 15% 15px 15%
}
</style>

