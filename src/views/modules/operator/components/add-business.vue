<template>
<!--  :close-on-click-modal="false"-->
  <el-dialog
    :visible="this.visible"
    title=""
    width="35%"
    height="50%"
    @close="cancel">
    <br>
    <el-tabs v-model="activeName" @tab-click="handleClick">
<!--      <el-tab-pane :label="$t('operator.license')" name="first">
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-form-item :label="$t('operator.license_type')" style="margin: 20px;" prop="license">
            <el-radio-group v-model="form.radio">
              <el-radio v-for="item in licenseList" :label="item" :key="item.resType" style="margin: 10px">{{ $t('operator.' + item.resType)}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('operator.quantity')" style="margin: 20px;width: 50%" prop="quantity">
            <el-input v-model="form.quantity"></el-input>
          </el-form-item>
          <el-form-item :label="$t('operator.effectDate')" style="margin: 20px" prop="effectTimestamp">
            <el-date-picker
              v-model="form.effectTimestamp"
              type="date"
              :placeholder="$t('operator.selectEffectTip')"
              format="yyyy-MM-dd"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('operator.remark')" style="margin: 20px">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 10}"
              v-model="form.remark">
            </el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>-->
      <el-tab-pane :label="$t('operator.channel')" name="second">
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-form-item :label="$t('operator.remainingTime')" style="margin: 20px;">
            <span>{{this.remainTime}} {{this.$t('common.time.minutes')}} / {{this.remainChnl}} {{ $t('operator.remainingChnl') }}</span>
            &nbsp;&nbsp;
            <el-popover
              placement="right"
              width="700"
              trigger="click">
              <el-table :data="flyKeyData">
                <el-table-column prop="resType" :label="$t('operator.channel_type')">
                  <template slot-scope="scope">
                    <span v-if="scope.row.resType === 'TIME'" size="small">{{ $t('operator.res_unit_time') }}</span>
                    <span v-if="scope.row.resType === 'CHNL'" size="small">{{ $t('operator.res_unit_chnnel') }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="resRemain" :label="$t('operator.res_remain')"></el-table-column>
                <el-table-column prop="resEffectTime" :formatter="formatDate" :label="$t('operator.effectDate')"></el-table-column>
                <el-table-column prop="resExpireTime" :formatter="formatDate" :label="$t('operator.expireDate')"></el-table-column>
              </el-table>
              <el-button v-if="flyKeyData.length > 0" slot="reference" type="info" icon="el-icon-more-outline" size="small" circle></el-button>
            </el-popover>
          </el-form-item>
          <el-form-item :label="$t('operator.channel_type')" style="margin: 20px;" prop="radio">
            <el-radio-group v-model="form.radio">
              <el-radio v-for="item in channelList" :label="item" :key="item.resType" style="margin: 10px">{{ $t('operator.' + item.resType)}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('operator.quantity')" style="margin: 20px; width: 80%" prop="quantity">
            <el-input v-model="form.quantity"  show-word-limit clearable></el-input>
          </el-form-item>
          <el-form-item :label="$t('operator.effectDate')" style="margin: 20px; width: 80%" prop="effectTimestamp">
            <el-date-picker
              v-model="form.effectTimestamp"
              type="date"
              :placeholder="$t('operator.selectEffectTip')"
              format="yyyy-MM-dd"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('operator.remark')" style="margin: 20px ;width: 80%">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 10}"
              v-model="form.remark"
              maxlength="1024" show-word-limit clearable>
            </el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="$t('operator.resetMapBtn')" name="three">
        <el-form class="center" :model='mapForm' ref='dataForm' label-width='120px'>
          <el-form-item label="Map type" style="margin: 20px; width: 80%">
            <el-select v-model="mapForm.mapType" prop='mapType' @change="mapSelect">
              <el-option v-for="item in mapList" :key="item.mapType" :value="item.mapType" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Key" prop='mapKey' style="margin: 20px; width: 80%">
            <div>
              <el-tag
                size="small"
                @click="defaultKeyClick"
                style="cursor: pointer; margin-right: 10px;">
                {{ $t('operator.defaulTag') }}
              </el-tag>
            </div>
            <el-input placeholder="key" v-model="mapForm.mapKey" maxlength="128" show-word-limit clearable></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="$t('operator.level')" name="fourth">
        <el-form class="center" :model='levelForm' ref='dataForm' label-width='120px'>
          <el-form-item :label="$t('operator.level')" style="margin: 20px; width: 80%">
            <el-select v-model="levelForm.levelCode" prop='levelCode'>
              <el-option v-for="item in levelList" :key="item.lable" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('operator.expireDate')" prop="expireTime"  style="margin: 20px; width: 80%">
            <el-date-picker
              v-model="levelForm.expireTime"
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
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div align="center" style="margin: 10px 0 10px 0">
      <span>
        <el-button v-if="isAuth('10408200.MANAGE')" type='danger'  @click="cancel">{{$t('common.cancel')}}</el-button>
        <el-button v-if="isAuth('10408200.MANAGE')" type='primary' :loading="dataListLoading" @click="submit">{{$t('common.confirm')}}</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import {
  getLicenseList,
  addLicense,
  configureMap,
  getFlyDeskRemainTime,
  operatorLevelUpdate
} from '../../../../api/operator'
import {getMapList} from '@/utils'
import {formatDate} from '@/utils/formatDate'

export default {
  data () {
    let licenseValidate = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        return callback(new Error(this.$t('operator.licenseEmptyCheck')))
      } else {
        callback()
      }
    }
    let quantityValidate = (rule, value, callback) => {
      console.log(value)
      if (value <= 0) {
        return callback(new Error(this.$t('operator.quantityCheck')))
      } else {
        callback()
      }
    }
    let effectTimeValidate = (rule, value, callback) => {
      console.log(value)
      if (value <= 0) {
        return callback(new Error(this.$t('operator.effectTimeCheck')))
      } else {
        callback()
      }
    }
    return {
      flyKeyData: [
        {
          'platform': 'TOMS',
          'subjectId': '131',
          'bizCode': 'BIZ-FLY-DESKTOP',
          'bizName': '远程桌面',
          'resType': 'TIME',
          'resRemain': 0,
          'resEffectTime': 1652752777,
          'resExpireTime': 1684288777
        }],
      visible: false,
      dataListLoading: false,
      licenseList: [],
      channelList: [],
      bizCode: 'BIZ-FLY-DESKTOP',
      activeName: 'second',
      remainTime: 0,
      remainChnl: 0,
      form: {
        radio: {},
        quantity: 0,
        effectTimestamp: '',
        remark: ''
      },
      mapForm: {
        mapType: '',
        mapKey: ''
      },
      levelForm: {
        operatorId: '',
        levelCode: '',
        expireTime: null
      },
      mapList: [],
      levelList: [],
      operator: {},
      rules: {
        license: [
          { required: true, validator: licenseValidate, trigger: 'change' }
        ],
        quantity: [
                { required: true, validator: quantityValidate, trigger: 'change' }
        ],
        effectTimestamp: [
                { required: true, validator: effectTimeValidate, trigger: 'change' }
        ],
        radio: [
          { required: true, validator: licenseValidate, trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.mapList = getMapList()
    this.levelList = this.$t('operator.level_list')
    this.getLicenses()
  },
  methods: {
    formatDate (row, column, cellValue, index) {
      return formatDate(cellValue, 'yyyy-MM-dd')
    },
    defaultKeyClick () {
      if (this.mapForm.mapType === 'MAP_BOX') {
        this.mapForm.mapKey = this.mapList[0].mapKey
      } else if (this.mapForm.mapType === 'GOOGLE') {
        this.mapForm.mapKey = this.mapList[1].mapKey
      } else if (this.mapForm.mapType === 'BAIDU') {
        this.mapForm.mapKey = this.mapList[2].mapKey
      }
    },
    handleClick (tab, event) {
      if (tab.name === 'second') {
        this.bizCode = 'BIZ-FLY-DESKTOP'
      } else if (tab.name === 'first') {
        this.bizCode = 'BIZ-TOMS-LICENSE'
      } else if (tab.name === 'third') {

      }
    },
    mapSelect () {
      this.mapForm.mapKey = ''
    },
    cancel () {
      this.$emit('close')
      this.visible = false
    },
    init (operator) {
      this.operator = operator
      console.log(this.operator)
      this.visible = true
      this.mapForm.mapType = operator.mapType
      this.mapForm.mapKey = operator.mapKey
      this.levelForm.operatorId = this.operator.operatorId
      this.levelForm.levelCode = this.operator.levelCode
      this.levelForm.expireTime = this.operator.levelExpireTime === null ? null : this.operator.levelExpireTime * 1000
      this.dataListLoading = false
      // 获取flyDesk余额
      this.flyDeskRemainTime()
    },
    getLicenses () {
      getLicenseList().then(data => {
        this.licenseList = data.slice(2)
        this.channelList = data.slice(0, 2)
      })
    },
    flyDeskRemainTime () {
      console.log(this.operator)
      getFlyDeskRemainTime(this.operator.operatorId).then(res => {
        this.remainTime = res.time
        this.remainChnl = res.channel
        this.flyKeyData = res.flyKeyList
        console.log(this.flyKeyData)
      })
    },
    submit () {
      console.log(this.activeName)
      if (this.activeName === 'three') {
        let operatorId = this.operator.operatorId
        this.dataListLoading = true
        configureMap(operatorId, this.mapForm).then(data => {
          this.$message({
            type: 'success',
            message: this.$t('common.success')
          })
          this.dataListLoading = false
          this.visible = false
          this.$emit('refreshDataList')
        }).catch((e) => {
          this.dataListLoading = false
        })
      } else if (this.activeName === 'fourth') {
        console.log(this.levelForm)
        this.dataListLoading = true
        operatorLevelUpdate(this.levelForm).then(data => {
          this.dataListLoading = false
          this.visible = false
          this.$emit('refreshDataList')
        }).catch((e) => {
          this.dataListLoading = false
        })
      } else {
        let param = {
          platform: 'toms',
          subjectType: this.operator.operatorName,
          subjectId: this.operator.operatorId,
          resType: this.form.radio.resType,
          resPackageCode: this.form.radio.resPackageCode,
          effectTime: this.form.effectTimestamp / 1000,
          quantity: this.form.quantity,
          totalAmount: 0,
          orderRemark: this.form.remark
        }
        if (param.resType == null || param.resPackageCode == null) {
          this.$message({
            type: 'error',
            message: this.$t('operator.licenseEmptyCheck')
          })
          return
        }
        if (param.quantity === 0) {
          this.$message({
            type: 'error',
            message: this.$t('operator.quantityCheck')
          })
          return
        }
        if (param.effectTime === 0) {
          this.$message({
            type: 'error',
            message: this.$t('operator.effectTimeCheck')
          })
          return
        }
        console.log(param)
        this.$confirm(this.$t('operator.addLicenseConfirm'), '', {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          this.dataListLoading = true
          addLicense(param, this.bizCode).then(data => {
            this.dataListLoading = false
            this.$message({
              type: 'success',
              message: this.$t('common.success')
            })
            this.cancel()
          }).catch((e) => {
            this.dataListLoading = false
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin: 10px;
}
</style>
