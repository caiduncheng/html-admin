<template>
  <el-dialog :visible='visible' @close='handleClose' :title="id ? 'Update Application' : 'Add Application'" width="40%" >
    <el-form :model='dataForm' :rules='dataRule' ref='dataForm' label-width="220px">
      <el-form-item :label="$t('white_list.appPackageName')" prop='appPkgName' style="margin: 20px; width: 90%">
        <el-input maxlength='100'
                  v-model='dataForm.appPkgName'
                  @blur="() => dataForm.appPkgName = dataForm.appPkgName.trim()"
                  placeholder='application package name'></el-input>
      </el-form-item>
      <el-form-item :label="$t('white_list.pubKey')" prop='pubKey' style="margin: 20px; width: 90%">
        <el-input type='textarea'
                  :autosize="{ minRows: 4, maxRows: 10}"
                  v-model='dataForm.pubKey'
                  @blur="() => dataForm.pubKey = dataForm.pubKey.trim()"
                  placeholder='pubKey contnet'
                  maxlength="1024"
                  show-word-limit
                  clearable></el-input>
      </el-form-item>
    </el-form>
    <div align="center" style="margin: 10px 0 10px 0">
      <span>
        <el-button type='danger'  @click="handleClose">{{$t('common.cancel')}}</el-button>
        <el-button type='primary' :loading="loading" @click="dataFormSubmit">{{$t('common.confirm')}}</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import {addApp, getApp} from '@/api/whitelist'
import {updateApp} from '../../../../api/whitelist'

export default {
  props: {
    visible: Boolean
  },
  data () {
    return {
      loading: false,
      clickDisabled: true,
      dataForm: {
        appPkgName: '',
        pubKey: ''
      },
      id: null,
      cmdTypeCodeList: [],
      dataRule: {
        appPkgName: [{
          required: true,
          message: 'appPkgName cannot be empty',
          trigger: 'blur'
        }],
        pubKey: [{
          required: true,
          message: 'pubKey cannot be empty',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    init (id) {
      // this.dataForm.pubKey = ''
      // this.dataForm.appPkgName = ''
      this.clickDisabled = true
      if (id) {
        this.id = id
        getApp(id).then(result => {
          this.dataForm.appPkgName = result.appPkgName
          this.dataForm.pubKey = result.pubKey
        })
      }
    },
    handleClose () {
      this.$refs.dataForm.resetFields()
      this.$emit('close')
    },
    dataFormSubmit () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.loading = true
          const params = {
            'appPkgName': this.dataForm.appPkgName,
            'pubKey': this.dataForm.pubKey
          }
          // 新增
          if (!this.id) {
            addApp(params).then(result => {
              this.loading = false
              this.$emit('close')
              this.$emit('refreshDataList')
            }).catch((e) => {
              this.loading = false
              this.clickDisabled = true
            })
          } else {
            updateApp(this.id, params).then(result => {
              this.loading = false
              this.$emit('close')
              this.$emit('refreshDataList')
            }).catch((e) => {
              this.loading = false
              this.clickDisabled = true
            })
          }
        }
      })
    }
  }
}
</script>

