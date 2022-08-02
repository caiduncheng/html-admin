<template>
  <el-dialog :visible='visible' :close-on-click-modal="false" @close='handleClose' title='Add Operator' width='40%'>
    <div>
      <el-form :model='dataForm' :rules='dataRule' label-position="right" ref='dataForm' label-width="150px" v-loading="dataListLoading">
        <el-form-item :label="$t('operator.contactName')">
          <el-input v-model='dataForm.contactName' maxlength="64" placeholder='Contactname' show-word-limit clearable></el-input>
        </el-form-item>
        <el-form-item  :label="$t('operator.mapType')" prop='mapType'>
          <el-select v-model="dataForm.mapType" @change="mapSelect">
            <el-option v-for="item in mapList" :key="item.mapType" :value="item.mapType" :label="item.label"></el-option>
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
          <el-input placeholder="key" v-model="dataForm.mapKey" maxlength="128" show-word-limit clearable>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('common.remark')" prop='remark'>
          <el-input v-model='dataForm.remark' maxlength="1024" :placeholder="$t('common.remark')" show-word-limit clearable></el-input>
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
import {systemRegisterDemoOperator} from '../../../../api/operator'
import countryJson from '@/assets/static/country.json'
import {getMapList} from '@/utils'

export default {
  data () {
    return {
      visible: false,
      dataListLoading: false,
      clickDisabled: true,
      countryData: countryJson,
      dataForm: {
        contactName: '',
        levelCode: 'CHARGE_L2',
        mapType: 'MAP_BOX',
        mapKey: '',
        remark: ''
      },
      id: null,
      cmdTypeCodeList: [],
      mapList: [],
      dataRule: {
        contactName: [{
          required: true,
          message: this.$t('common.nullInputTip'),
          trigger: 'change'
        }],
        mapKey: [{
          required: true,
          message: this.$t('common.nullInputTip'),
          trigger: 'change'
        }]
      }
    }
  },
  methods: {
    init () {
      this.mapList = getMapList()
      this.visible = true
      this.dataListLoading = false
    },
    mapSelect () {
      this.dataForm.mapKey = ''
    },
    defaultKeyClick () {
      console.log(this.mapList)
      if (this.dataForm.mapType === 'MAP_BOX') {
        this.dataForm.mapKey = this.mapList[0].mapKey
      } else if (this.dataForm.mapType === 'GOOGLE') {
        this.dataForm.mapKey = this.mapList[1].mapKey
      } else if (this.dataForm.mapType === 'BAIDU') {
        this.dataForm.mapKey = this.mapList[2].mapKey
      }
    },
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dataListLoading = true
          systemRegisterDemoOperator(this.dataForm).then(data => {
            this.dataListLoading = false
            console.log(data)
            this.visible = false
            this.$emit('refreshDataList')
          }).catch(e => {
            this.dataListLoading = false
            this.$emit('refreshDataList')
            this.handleClose()
          })
        }
      })
    },
    handleClose () {
      this.visible = false
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item{
  margin-bottom: 25px;
  width: 90%;
}
</style>
