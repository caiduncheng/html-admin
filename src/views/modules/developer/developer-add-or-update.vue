<template>
  <div class="operator-add-or-update">
    <el-dialog
      :visible.sync="visible"
      width="35%"
      :title='title'
      @close="cancel">
      <el-form :model="dataForm" label-width="150px" style="padding: 0 10% 20px 5%">
        <el-form-item :label="$t('developer.name') + ':'">
          <label type="text" v-if="dataForm.developerType === 1">{{ dataForm.lastName }}</label>
          <label type="text">{{ dataForm.firstName }}</label>
        </el-form-item>
        <el-form-item :label="$t('developer.developerType') + ':'">
          <label type="text">{{ dataForm.developerType === 1 ? $t('developer.developerTypeOption[0].label') : $t('developer.developerTypeOption[1].label') }}</label>
        </el-form-item>
        <el-form-item :label="$t('developer.pidType') + ':'" prop="shortName" v-show="dataForm.developerType === 1">
          <label type="text">{{ dataForm.pidType === 1 ? $t('developer.id_card') : dataForm.pidType === 2 ? $t('developer.passport') : $t('developer.unknown') }}</label>
        </el-form-item>
        <el-form-item :label="$t('developer.pidNo') + ':'">
          <label type="text">{{ dataForm.pidNo }}</label>
        </el-form-item>
        <el-form-item :label="$t('developer.mobile') + ':'">
          <label type="text">{{ dataForm.mobile }}</label>
        </el-form-item>
        <el-form-item :label="$t('developer.email') + ':'">
          <label type="text">{{ dataForm.email }}</label>
        </el-form-item>
        <el-form-item :label="$t('developer.countryCode') + ':'">
          <label type="text">{{ formatCountry(dataForm.countryCode) }}</label>
        </el-form-item>
        <el-form-item :label="$t('developer.address') + ':'">
          <label type="text">{{ dataForm.address }}</label>
        </el-form-item>
        <el-form-item :label="$t('developer.status') + ' :'">
          <el-tag v-if="dataForm.status === 2" size="small" type="warning">{{
              $t('developer.statusOption[2].label')
            }}
          </el-tag>
          <el-tag v-if="dataForm.status === 1" size="small">{{ $t('developer.statusOption[1].label') }}</el-tag>
          <el-tag v-if="dataForm.status === 0" size="small" type="info">{{
              $t('developer.statusOption[0].label')
            }}
          </el-tag>
          <el-tag v-if="dataForm.status === 3" size="small" type="danger">{{
              $t('developer.statusOption[3].label')
            }}
          </el-tag>
          <el-tag v-if="dataForm.status === 9" size="small" type="info">{{
              $t('developer.statusOption[5].label')
            }}
          </el-tag>
        </el-form-item>
        <el-form-item :label="$t('developer.remark') + ':'" v-show="dataForm.status !== 2 || examineFlag">
          <label type="text">{{ dataForm.remark }}</label>
        </el-form-item>
        <el-form-item :label="$t('developer.creTime') + ':'">
          <label>{{ formatDate(dataForm.creTime, 'yyyy-MM-dd hh:mm:ss') }}</label>
        </el-form-item>
        <el-form-item :label="$t('developer.updTime') + ':'">
          <label>{{ formatDate(dataForm.updTime, 'yyyy-MM-dd hh:mm:ss') }}</label>
        </el-form-item>
        <el-form-item :label="$t('developer.renark') + ':'" v-show="dataForm.status === 2 && examineFlag">
          <el-input v-model="dataForm.remark"
                    :placeholder="this.$t('common.remark')"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    maxlength="512"
                    show-word-limit
                    @blur="() => dataForm.remark = dataForm.remark.trim()"></el-input>
        </el-form-item>
      </el-form>
      <div align="center" style="margin: 10px 0 10px 0">
      <span>
        <el-button type='danger' v-show="dataForm.status === 2 && examineFlag"
                   @click="reject">{{ $t('developer.reject') }}</el-button>
        <el-button type='primary' v-show="dataForm.status === 2 && examineFlag" :loading="loading"
                   @click="pass">{{ $t('developer.next') }}</el-button>
      </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {formatDate} from '@/utils/formatDate'
import {formatCountry} from '@/utils/formatCountry'

export default {
  data () {
    return {
      visibleField: false,
      disable: false,
      title: '',
      id: '',
      operateType: '',
      selectedOptions: '',
      visible: false,
      clickDisabled: true,
      examineFlag: false,
      loading: false,
      dataForm: {
        address: '',
        areaCode: '',
        areaName: '',
        cityName: '',
        companyRegDate: '',
        contactName: '',
        countryCode: '',
        creTime: null,
        developerId: null,
        developerType: null,
        email: '',
        firstName: '',
        lastName: '',
        legalPerson: '',
        mobile: '',
        pidNo: '',
        pidType: '',
        postCode: '',
        provName: '',
        status: '',
        remark: '',
        updTime: 0
      }
    }
  },
  computed: {
    options () {
    }
  },
  methods: {
    init (developer, operateType) {
      console.log(developer)
      this.examineFlag = operateType === 'examine'
      this.visible = true
      this.title = operateType === 'info' ? this.$t('developer.title_detail') : this.$t('develop.title_examine')
      this.operateType = operateType
      this.dataForm.address = developer.address
      this.dataForm.areaCode = developer.areaCode
      this.dataForm.areaName = developer.areaName
      this.dataForm.cityName = developer.cityName
      this.dataForm.companyRegDate = developer.companyRegDate
      this.dataForm.contactName = developer.contactName
      this.dataForm.countryCode = developer.countryCode
      this.dataForm.creTime = developer.creTime
      this.dataForm.developerId = developer.developerId
      this.dataForm.developerType = developer.developerType
      this.dataForm.email = developer.email
      this.dataForm.firstName = developer.firstName
      this.dataForm.lastName = developer.lastName
      this.dataForm.legalPerson = developer.legalPerson
      this.dataForm.mobile = developer.mobile
      this.dataForm.pidNo = developer.pidNo
      this.dataForm.pidType = developer.pidType
      this.dataForm.postCode = developer.postCode
      this.dataForm.provName = developer.provName
      this.dataForm.status = developer.status
      this.dataForm.updTime = developer.updTime
      this.dataForm.remark = developer.remark
      this.disable = true
    },
    cancel () {
      this.visible = false
      this.$emit('close')
    },
    formatCountry (value) {
      return formatCountry(value)
    },
    reject () {
      this.visible = false
      this.$emit('close')
    },
    pass () {
      this.clickDisabled = true
      this.cancel()
      this.$emit('refreshDataList')
    },
    changeRadio (value) {
      this.$refs['dataForm'].clearValidate()
    },
    formatDate (cellValue, fmt) {
      return formatDate(cellValue, fmt)
    }
  }
}
</script>

