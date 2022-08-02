<template>
  <el-dialog :visible='visible' :close-on-click-modal="false" @close='handleClose' title='Add Operator' width='40%'>
    <div>
      <el-form :model='dataForm' :rules='dataRule' label-position="right" ref='dataForm' label-width="160px">
        <el-form-item :label="$t('operator.name')" prop='name'>
          <el-input v-model='dataForm.name' maxlength="128" placeholder='Operator Name' show-word-limit
                    clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('operator.username')" prop='username'>
          <el-input v-model='dataForm.username' maxlength="64" placeholder='username' show-word-limit
                    clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('operator.password')" prop='username'>
          <el-input type="password" maxlength="50" v-model='dataForm.password' show-password placeholder='password'
                    show-word-limit clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('operator.level')">
          <el-select v-model="dataForm.levelCode" prop='levelCode'>
            <el-option v-for="item in levelList" :key="item.lable" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('operator.levelExpirationTime')" prop="expireTime">
          <el-date-picker
            v-model="dataForm.expireTime"
            type="date"
            value-format="timestamp"
            :placeholder="$t('operator.expireTimeTip')">
          </el-date-picker>
          <span>
              <el-tooltip class="item" effect="dark" :content="$t('operator.leverExpireTimeTip')" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </span>
        </el-form-item>
        <el-form-item :label="$t('operator.mapType')">
          <el-select v-model="dataForm.mapType" @change="mapSelect">
            <el-option v-for="item in mapList" :key="item.mapType" :value="item.mapType"
                       :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('operator.mapKey')" prop='mapKey'>
          <div>
            <el-tag
              size="small"
              @click="defaultKeyClick"
              style="cursor: pointer; margin-right: 10px;">
              {{ $t('operator.defaulTag') }}
            </el-tag>
          </div>
          <el-input placeholder="key" maxlength="128" v-model="dataForm.mapKey" clearable>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('operator.country')" prop="countryCode">
          <el-select
            v-model="dataForm.countryCode"
            filterable
            :placeholder="$t('operator.country')">
            <el-option
              v-for="item in countryData"
              :key="item.countryCode3"
              :label="$t('country_or_region.' + item.countryCode3)"
              :value="item.countryCode3">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('operator.address')" prop='address'>
          <el-input v-model='dataForm.address' maxlength="128" show-word-limit clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('operator.contactName')" prop='address'>
          <el-input v-model='dataForm.contactName' maxlength="128" show-word-limit clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('operator.mobile')" prop='mobile'>
          <el-input v-model='dataForm.mobile' maxlength="20" placeholder='Mobile' show-word-limit clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('operator.email')" prop='email'>
          <el-input v-model='dataForm.email' maxlength="128" placeholder='E-mail' show-word-limit clearable>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('common.remark')" prop='remark'>
          <el-input v-model='dataForm.remark' maxlength="1024" show-word-limit clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
            ref="upload"
            action="#"
            accept=".crt"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :file-list="fileList"
            :auto-upload="false">
            <div class="el-upload__tip" slot="tip">Please select security certificate file</div>
            <el-button slot="trigger" type="primary">{{ $t('operator.chooseFileBtn') }}</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
    <div align="center" style="margin: 10px 0 10px 0">
      <span>
        <el-button type='danger' @click='visible = false'>Cancel</el-button>
        <el-button type='primary' :loading="dataListLoading" @click='dataFormSubmit()'>Confirm</el-button>
      </span>
    </div>
  </el-dialog>
</template>


<script>
import {getCountryList} from '../../../../api/operator'
import countryJson from '@/assets/static/country.json'
import http from '../../../../utils/httpRequest'
import {refreshTokenLogin, getMapList} from '@/utils'
// import {isEmail} from '@/utils/validate'

export default {
  data () {
    /* var validateEmail = (rule, value, callback) => {
      if (!isEmail(value.trim())) {
        callback(new Error(this.$t('user.emailError')))
      } else {
        callback()
      }
    } */
    /* var validateMobile = (rule, value, callback) => {
      if (!isMobile(value) && value) {
        callback(new Error(this.$t('userAddUpdate.mobileError')))
      } else {
        callback()
      }
    } */
    return {
      visible: false,
      dataListLoading: false,
      clickDisabled: true,
      countryData: countryJson,
      fileList: [],
      levelList: [],
      dataForm: {
        username: '',
        name: '',
        contactName: '',
        password: '',
        email: '',
        address: '',
        gmtTime: '',
        lang: '',
        mobile: '',
        remark: '',
        countryCode: '',
        levelCode: 'FREE_LEVEL',
        expireTime: null,
        mapType: 'MAP_BOX',
        mapKey: ''
      },
      id: null,
      cmdTypeCodeList: [],
      mapList: [],
      langList: [
        {value: 'en_US', lable: 'English'},
        {value: 'zh_CN', lable: 'Simplified Chinese'},
        {value: 'zh_HK', lable: 'Traditional Chinese'},
        {value: 'pt_BR', lable: 'Portuguese'},
        {value: 'ru_RU', lable: 'Russian'},
        {value: 'tr_TR', lable: 'Turkish'},
        {value: 'hi_IN', lable: 'Hindi'},
        {value: 'uk_UA', lable: 'Ukrainian'},
        {value: 'vi_VN', lable: 'Vietnamese'},
        {value: 'tl_PH', lable: 'Tagalog'},
        {value: 'ar_EG', lable: 'Arabic'},
        {value: 'th_TH', lable: 'Thai'}
      ],
      gmtTimeList: [
        {val: 'GMT+00:00', label: 'GMT+00:00'},
        {val: 'GMT+01:00', label: 'GMT+01:00'},
        {val: 'GMT+02:00', label: 'GMT+02:00'},
        {val: 'GMT+03:00', label: 'GMT+03:00'},
        {val: 'GMT+04:00', label: 'GMT+04:00'},
        {val: 'GMT+05:00', label: 'GMT+05:00'},
        {val: 'GMT+06:00', label: 'GMT+06:00'},
        {val: 'GMT+07:00', label: 'GMT+07:00'},
        {val: 'GMT+08:00', label: 'GMT+08:00'},
        {val: 'GMT+09:00', label: 'GMT+09:00'},
        {val: 'GMT+10:00', label: 'GMT+10:00'},
        {val: 'GMT+11:00', label: 'GMT+11:00'},
        {val: 'GMT-12:00', label: 'GMT-12:00'},
        {val: 'GMT-11:00', label: 'GMT-11:00'},
        {val: 'GMT-10:00', label: 'GMT-10:00'},
        {val: 'GMT-09:00', label: 'GMT-09:00'},
        {val: 'GMT-08:00', label: 'GMT-08:00'},
        {val: 'GMT-07:00', label: 'GMT-07:00'},
        {val: 'GMT-06:00', label: 'GMT-06:00'},
        {val: 'GMT-05:00', label: 'GMT-05:00'},
        {val: 'GMT-04:00', label: 'GMT-04:00'},
        {val: 'GMT-03:00', label: 'GMT-03:00'},
        {val: 'GMT-02:00', label: 'GMT-02:00'},
        {val: 'GMT-01:00', label: 'GMT-01:00'}
      ],
      dataRule: {
        username: [{required: true, message: this.$t('common.nullInputTip'), trigger: 'blur'}],
        name: [{required: true, message: this.$t('common.nullInputTip'), trigger: 'blur'}],
        contactName: [{required: true, message: this.$t('common.nullInputTip'), trigger: 'blur'}],
        password: [{required: true, message: this.$t('common.nullInputTip'), trigger: 'blur'}],
        email: [{required: true, message: this.$t('common.nullInputTip'), trigger: 'blur'},
          {type: 'email', required: true, message: this.$t('common.email_format_error'), trigger: 'blur'}],
        /* address: [{required: true, message: 'Address be empty', trigger: 'change'}], */
        gmtTime: [{required: true, message: this.$t('common.nullInputTip'), trigger: 'blur'}],
        lang: [{required: true, message: this.$t('common.nullInputTip'), trigger: 'blur'}],
        /* mobile: [{required: true, message: 'Mobile be empty', trigger: 'change'},
                  {validator: validateMobile, trigger: 'change'}], */
        countryCode: [{required: true, message: this.$t('common.nullInputTip'), trigger: 'blur'}],
        mapKey: [{required: true, message: this.$t('common.nullInputTip'), trigger: 'blur'}]
      }
    }
  },
  created () {
    this.mapList = getMapList()
    this.levelList = this.$t('operator.level_list')
  },
  methods: {
    init () {
      getCountryList().then(data => {
        this.countryData = data
      })
      this.visible = true
      this.clickDisabled = true
      this.dataListLoading = false
    },
    mapSelect () {
      this.dataForm.mapKey = ''
    },
    defaultKeyClick () {
      if (this.dataForm.mapType === 'MAP_BOX') {
        this.dataForm.mapKey = this.mapList[0].mapKey
      } else if (this.dataForm.mapType === 'GOOGLE') {
        this.dataForm.mapKey = this.mapList[1].mapKey
      } else if (this.dataForm.mapType === 'BAIDU') {
        this.dataForm.mapKey = this.mapList[2].mapKey
      }
    },
    dataFormSubmit () {
      console.log(this.dataForm)
      if (this.fileList.length === 0) {
        return this.$message.error('Please select security certificate file')
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dataListLoading = true
          const formData = new FormData()
          formData.append('file', this.fileList[0].raw)
          formData.append('username', this.dataForm.username)
          formData.append('name', this.dataForm.name)
          formData.append('contactName', this.dataForm.contactName)
          formData.append('password', this.dataForm.password)
          formData.append('email', this.dataForm.email)
          formData.append('address', this.dataForm.address)
          formData.append('gmtTime', this.dataForm.gmtTime)
          formData.append('lang', this.dataForm.lang)
          formData.append('mobile', this.dataForm.mobile)
          formData.append('remark', this.dataForm.remark)
          formData.append('countryCode', this.dataForm.countryCode)
          formData.append('levelCode', this.dataForm.levelCode)
          if (this.dataForm.expireTime !== null) {
            formData.append('expireTime', this.dataForm.expireTime)
          }
          formData.append('mapType', this.dataForm.mapType)
          formData.append('mapKey', this.dataForm.mapKey)
          http({
            method: 'POST',
            url: http.adornCoreUrl(`online/management/admin/operator/cert-file`),
            data: formData
          }).then((res) => {
            this.dataListLoading = false
            console.log(res)
            this.visible = false
            this.$emit('refreshDataList')
          }).catch(data => {
            this.dataListLoading = false
            console.log(data.response.data)
            this.$message.error(data.response.data.message)
            if ((data.response && data.response.status === 401) || data.response.data.code === '1092') {
              refreshTokenLogin()
            }
            this.fileList = []
            this.uploadCerLoading = false
          })
        }
      })
    },
    handleClose () {
      this.$emit('close')
    },
    handleFileChange (file, fileList) {
      this.$refs.upload.clearFiles()
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (extension !== 'crt') {
        return this.$message.warning('Only the suffix can be uploaded is crt')
      }
      if (fileList.length > 1) {
        fileList.shift()
      }
      this.fileList = fileList
    },
    handleRemove (file, fileList) {
      fileList.shift()
      console.log(file, fileList)
    },
    handlePreview (file) {
    },
    handleChange (file, fileList) {
      if (fileList.length > 1) {
        fileList.shift()
      }
      this.fileList = fileList
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (extension !== 'crt') {
        fileList.shift()
        return this.$message.warning('Only the suffix can be uploaded is crt')
      }
      console.log(this.fileList)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 15px;
  width: 80%;
}
</style>
