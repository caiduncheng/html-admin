<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="this.visible"
    :title= '$t("operator.level")'
    width="40%"
    height="50%"
    @close="cancel">
    <el-descriptions title="" :column="1" border>
    <el-descriptions-item :label="$t('operator.lever')">{{ leverInfo.levelCode }}</el-descriptions-item>
    <el-descriptions-item :label="$t('operator.expireDate')">
      <el-date-picker
        v-model="leverInfo.expireTime"
        type="date"
        value-format="timestamp"
        :placeholder="$t('operator.expireTimeTip')">
      </el-date-picker>
    </el-descriptions-item>
    </el-descriptions>

    <div align="center" style="margin: 15px 0 10px 0">
      <span>
        <el-button type='danger'  @click="cancel">{{$t('common.cancel')}}</el-button>
        <el-button type='primary' :loading="loading" @click="changeLevel">{{$t('common.confirm')}}</el-button>
      </span>
    </div>
  </el-dialog>
 </template>

<script>
import {operatorLevelUpdate} from '../../../../api/operator'
export default {
  data () {
    return {
      leverInfo: {
        operatorId: '',
        levelCode: '',
        expireTime: null
      },
      visible: false,
      loading: false
    }
  },
  methods: {
    changeLevel () {
      console.log(this.leverInfo)
      this.loading = true
      operatorLevelUpdate(this.leverInfo).then(data => {
        this.$message({
          type: 'success',
          message: this.$t('common.success')
        })
        this.cancel()
      }).catch((e) => {
        this.loading = false
      })
    },
    init (levelCode, operatorId) {
      console.log(levelCode + '*' + operatorId)
      this.visible = true
      this.leverInfo.operatorId = operatorId
      this.leverInfo.levelCode = levelCode
    },
    cancel () {
      this.loading = false
      this.visible = false
      this.$emit('close')
      this.$emit('refreshDataList')
    }
  }
}
</script>
