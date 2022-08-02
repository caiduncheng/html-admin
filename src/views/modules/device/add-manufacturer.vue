<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="this.visible"
    :title="title"
    width="30%"
    @close="cancel">
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" style="padding: 0 10% 20px 5%">
      <el-form-item v-if="visibleField" :label="$t('manufacturer.account')" style="margin-bottom:30px" prop="username">
        <el-input  v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item :label="$t('manufacturer.name')" style="margin-bottom:30px" prop="name">
        <el-input  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('manufacturer.shortName')" style="margin-bottom:30px" prop="shortName">
        <el-input  v-model="form.shortName"></el-input>
      </el-form-item>
      <el-form-item :label="$t('manufacturer.manufacturerCode')" style="margin-bottom:30px" prop="manufacturerCode">
        <el-input  :disabled="!visibleField" maxlength="4" show-word-limit v-model="form.manufacturerCode" placeholder='code cannot exceed 4 characters'></el-input>
      </el-form-item>
      <el-form-item :label="$t('manufacturer.address')" style="margin-bottom:30px">
        <el-input  v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item :label="$t('manufacturer.email')" style="margin-bottom:10px" prop="email">
        <el-input  v-model="form.email"></el-input>
      </el-form-item>
    </el-form>
    <div align="center" style="margin: 10px 0 10px 0">
      <span>
        <el-button type='danger'  @click="cancel">{{$t('common.cancel')}}</el-button>
        <el-button type='primary' :loading="loading" @click="dataFormSubmit">{{$t('common.confirm')}}</el-button>
      </span>
    </div>
  </el-dialog>
</template>
<script>
import {addManufacturer} from '../../../api/device'
import {queryManufacturer, updateManufacturer} from '../../../api/manufacturer'
export default {
  data () {
    return {
      loading: false,
      id: null,
      form: {
        name: '',
        manufacturerCode: '',
        address: '',
        email: '',
        shortName: '',
        username: ''
      },
      imgPath: '',
      fileList: [],
      hideUpload: false,
      rules: {
        name: [
          {
            required: true,
            message: this.$t('common.nullInputTip'),
            trigger: 'change'
          }
        ],
        email: [
          {
            required: true,
            message: this.$t('common.nullInputTip'),
            trigger: 'change'
          }
        ],
        shortName: [
          {
            required: true,
            message: this.$t('common.nullInputTip'),
            trigger: 'change'
          }
        ],
        username: [
          {
            required: true,
            message: this.$t('common.nullInputTip'),
            trigger: 'change'
          }
        ],
        manufacturerCode: [
          {
            required: true,
            message: this.$t('common.nullInputTip'),
            trigger: 'change'
          }
        ]
      },
      visible: false,
      visibleField: true,
      title: '',
      operation: ''
    }
  },
  methods: {
    dataFormSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.id) {
          //  Update Manufacturer
            console.log(this.form)
            updateManufacturer(this.id, this.form).then(data => {
              this.$message({
                type: 'success',
                message: this.$t('common.success')
              })
              this.cancel()
              this.$emit('refreshDataList')
            }).catch((e) => {
              this.loading = false
            })
          } else {
            // Add Manufacturer
            this.$confirm(this.$t('manufacturer.addConfirm'), '', {
              confirmButtonText: this.$t('common.confirm'),
              cancelButtonText: this.$t('common.cancel'),
              type: 'warning'
            }).then(() => {
              this.loading = true
              addManufacturer(this.form).then(data => {
                this.$message({
                  type: 'success',
                  message: this.$t('common.success')
                })
                this.cancel()
                this.$emit('refreshDataList')
              }).catch((e) => {
                this.loading = false
              })
              console.log(this.form)
            })
          }
        }
      })
    },
    init (id) {
      this.loading = false
      this.visible = true
      if (id) {
        this.title = this.$t('manufacturer.updateBtn')
        this.id = id
        this.visibleField = false
        queryManufacturer(id).then(result => {
          console.log(result)
          this.form = result
        })
      } else {
        this.title = this.$t('manufacturer.addBtn')
      }
    },
    cancel () {
      this.loading = false
      this.visible = false
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">

  .same{
    padding: 0;text-align:center;
    margin: 0 auto;
    height: 47px;vertical-align: middle;font-size:0px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 140px;
    height: 140px;
    line-height: 140px;
    text-align: center;
  }
  .avatar {
    width: 140px;
    height: 140px;
    display: block;
  }
</style>
