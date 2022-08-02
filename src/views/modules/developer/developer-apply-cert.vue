<template>
  <el-dialog
    :visible.sync="visible"
    width="35%"
    :title="$t('developer.operate_apply_cert')"
    @close="cancel">
    <el-form label-position="right" :model="dataForm" ref='dataForm' label-width="200px" :rules="rules">
      <el-form-item :label="$t('developer.common_name') + ':'" prop='commonName'>
        <el-input v-model="dataForm.commonName" :maxlength="64" show-word-limit @blur="() => dataForm.commonName = dataForm.commonName.trim()"></el-input>
      </el-form-item>
      <el-form-item :label="$t('developer.province_name') + ':'" prop='provinceName'>
        <el-input v-model="dataForm.provinceName" :maxlength="64" show-word-limit @blur="() => dataForm.provinceName = dataForm.provinceName.trim()"></el-input>
      </el-form-item>
      <el-form-item :label="$t('developer.locality_name') + ':'" prop='localityName'>
        <el-input v-model="dataForm.localityName" :maxlength="64" show-word-limit @blur="() => dataForm.localityName = dataForm.localityName.trim()"></el-input>
      </el-form-item>
      <el-form-item :label="$t('developer.organization_name') + ':'" prop='organizationName'>
        <el-input v-model="dataForm.organizationName" :maxlength="64" show-word-limit @blur="() => dataForm.organizationName = dataForm.organizationName.trim()"></el-input>
      </el-form-item>
      <el-form-item :label="$t('developer.organization_unit_name') + ':'" prop='organizationUnitName'>
        <el-input v-model="dataForm.organizationUnitName" :maxlength="64" show-word-limit @blur="() => dataForm.organizationUnitName = dataForm.organizationUnitName.trim()"></el-input>
      </el-form-item>
      <el-form-item :label="$t('developer.email') + ':'">
        <el-input v-model="dataForm.emailAddress" :maxlength="64" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('developer.custom_name') + ':'">
        <el-input v-model="dataForm.cusName" :maxlength="128" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('developer.custom_desc') + ':'" prop='cusDesc'>
        <el-input v-model="dataForm.cusDesc" :maxlength="128" show-word-limit @blur="() => dataForm.cusDesc = dataForm.cusDesc.trim()"></el-input>
      </el-form-item>
    </el-form>
    <div align="center" style="margin: 10px 0 10px 0">
      <span>
        <el-button type='danger' @click="cancel">{{ $t('common.cancel') }}</el-button>
        <el-button type='primary' :loading="loading" @click="submit">{{ $t('common.submit') }}</el-button>
      </span>
    </div>
  </el-dialog>
</template>
<script>
import {formatDate} from '@/utils/formatDate'
import {formatCountry} from '@/utils/formatCountry'
import {applyCert} from '../../../api'

export default {
  data () {
    return {
      visible: false,
      loading: false,
      dataForm: {
        developerId: '',
        developerName: '',
        commonName: '',
        countryName: '',
        provinceName: '',
        localityName: '',
        organizationName: '',
        organizationUnitName: '',
        emailAddress: '',
        cusName: '',
        cusDesc: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        commonName: [
          {
            required: true,
            message: this.$t('developer.rule_tip.custom_name'),
            trigger: 'blur'
          }
        ],
        provinceName: [
          {
            required: true,
            message: this.$t('developer.rule_tip.province_name'),
            trigger: 'blur'
          }
        ],
        localityName: [
          {
            required: true,
            message: this.$t('developer.rule_tip.locality_name'),
            trigger: 'blur'
          }
        ],
        organizationName: [
          {
            required: true,
            message: this.$t('developer.rule_tip.organization_name'),
            trigger: 'blur'
          }
        ],
        organizationUnitName: [
          {
            required: true,
            message: this.$t('developer.rule_tip.organization_unit_name'),
            trigger: 'blur'
          }
        ],
        cusDesc: [
          {
            required: true,
            message: this.$t('developer.rule_tip.custom_desc'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    init (developer) {
      console.log(developer)
      this.visible = true
      this.dataForm.countryName = developer.countryCode
      this.dataForm.emailAddress = developer.email
      this.dataForm.cusName = developer.contactName
      this.dataForm.developerName = developer.contactName
      this.dataForm.developerId = developer.developerId
    },
    cancel () {
      this.visible = false
      this.$emit('close')
    },
    formatCountry (value) {
      return formatCountry(value)
    },
    submit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          applyCert(this.dataForm).then(data => {
            if (data) {
              this.loading = false
              if (data) {
                const link = document.createElement('a')
                link.style.display = 'none'
                link.setAttribute('target', 'tempframe')
                link.setAttribute('href', process.env.ICON_API + '/online/developer-admin/developer/' + this.dataForm.developerId + '/cert')
                link.click()
              } else {
                this.$message({
                  type: 'error',
                  message: this.$t('developer.cert_download_fail_tip')
                })
              }

              this.cancel()
              this.$emit('refreshDataList')
            }
          }).catch(e => {
            this.loading = false
          })
        }
      })
    },
    formatDate (cellValue, fmt) {
      return formatDate(cellValue, fmt)
    }
  }
}
</script>

