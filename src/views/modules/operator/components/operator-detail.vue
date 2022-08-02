<template>
  <div class="operator-add-or-update">
<!-- :with-header="false"   -->
    <el-drawer
      :close-on-click-modal="false"
      custom-class="detail"
      :with-header="true"
      :title="dataForm.name"
      :visible.sync="visible"
      size="44%"
      v-loading="dataListLoading"
      @close="cancel">
      <el-descriptions direction="vertical" style="padding: 0 20px 0 20px" :size="size" :column="3" border>
        <el-descriptions-item :label="$t('operator.operatorNo')">{{ dataForm.operatorNo }}</el-descriptions-item>
        <el-descriptions-item :label="$t('operator.mobile')">{{ dataForm.mobile }}</el-descriptions-item>
        <el-descriptions-item :label="$t('operator.linkman')" :span="2">{{ dataForm.linkman }}</el-descriptions-item>
        <el-descriptions-item :label="$t('operator.operatorId')">{{ dataForm.operatorId }}</el-descriptions-item>
        <el-descriptions-item :label="$t('operator.oid')" :span="2">{{ dataForm.oid }}</el-descriptions-item>
        <el-descriptions-item :label="$t('operator.name')">{{ dataForm.name }}</el-descriptions-item>
        <el-descriptions-item :label="$t('operator.shortName')">{{ dataForm.shortName }}</el-descriptions-item>
        <el-descriptions-item :label="$t('operator.email')" :span="2">{{ dataForm.email }}</el-descriptions-item>
        <el-descriptions-item :label="$t('operator.country')">{{ formatCountry(dataForm.countryCode) }}</el-descriptions-item>
        <el-descriptions-item :label="$t('operator.provName')">{{ dataForm.provName }}</el-descriptions-item>
        <el-descriptions-item :label="$t('operator.cityName')" :span="2">{{ dataForm.cityName }}</el-descriptions-item>
        <el-descriptions-item :label="$t('operator.areaName')" :span="3">{{ dataForm.areaName }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>
<script>
import {getCostBillDate} from '@/utils/baseData'
import {formatCountry} from '@/utils/formatCountry'
import {getOperatorInfo} from '@/api/operator'

export default {
  data () {
    return {
      size: 'large',
      dataListLoading: false,
      disable: false,
      id: '',
      selectedOptions: '',
      visible: false,
      clickDisabled: true,
      dataForm: {
        appName: '',
        packageName: '',
        operatorId: 0,
        operatorNo: '',
        oid: '',
        name: '',
        shortName: '',
        address: '',
        countryCode: '',
        provName: '',
        cityName: '',
        areaName: '',
        linkman: '',
        mobile: '',
        email: '',
        license: '',
        status: 0
      }
    }
  },
  computed: {
    options () {
      return getCostBillDate()
    }
  },
  methods: {
    init (id) {
      this.visible = true
      this.dataListLoading = true
      this.dataForm.operatorId = id || 0
      if (this.dataForm.operatorId) {
        getOperatorInfo(this.dataForm.operatorId).then(data => {
          this.dataListLoading = false
          this.dataForm.operatorNo = data.operatorNo
          this.dataForm.operatorId = data.operatorId
          this.dataForm.name = data.name
          this.dataForm.shortName = data.shortName
          this.dataForm.oid = data.oid
          this.dataForm.countryCode = data.countryCode
          this.dataForm.license = data.license
          this.dataForm.status = data.status
          this.dataForm.address = data.address
          this.dataForm.countryCode = data.countryCode
          this.dataForm.areaCode = data.areaCode
          this.dataForm.provName = data.provName
          this.dataForm.cityName = data.cityName
          this.dataForm.areaName = data.areaName
          this.dataForm.linkman = data.linkman
          this.dataForm.mobile = data.mobile
          this.dataForm.email = data.email
          this.dataForm.license = data.license
          this.disable = true
        }).catch(e => {
          this.dataListLoading = false
          console.log(`err:${JSON.stringify(e)}`)
        })
      }
    },
    cancel () {
      this.visible = false
      this.$emit('close')
    },
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.clickDisabled = true
          this.cancel()
          this.$emit('refreshDataList')
        }
      })
    },
    changeRadio (value) {
      this.$refs['dataForm'].clearValidate()
    },
    formatCountry (value) {
      return formatCountry(value)
    }
  }
}
</script>

<style lang="scss">

</style>
