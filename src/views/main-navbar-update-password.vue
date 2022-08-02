<template>
  <el-dialog
    :title="$t('bar.changePsw')"
    :visible.sync="visible"
    :append-to-body="true"
    :close-on-click-modal="false">
    <el-form label-position="top" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
<!--      <el-form-item :label="$t('bar.username')">
        <span>{{ userName }}</span>
      </el-form-item>-->
      <el-form-item :label="$t('bar.oriPsw')" prop="password">
        <el-input type="password" v-model="dataForm.password"></el-input>
      </el-form-item>
      <el-form-item :label="$t('bar.newPsw')" prop="newPassword">
        <el-input type="password" v-model="dataForm.newPassword"></el-input>
      </el-form-item>
      <el-form-item :label="$t('bar.conPsw')" prop="confirmPassword">
        <el-input type="password" v-model="dataForm.confirmPassword"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('bar.cancel')}}</el-button>
      <el-button type="primary" :disabled="clickDisabled" @click="dataFormSubmit()">{{$t('bar.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { clearLoginInfo, getRsaPublicKey } from '@/utils'
  import {changePsw, timestamp} from '@/api'
  import { JSEncrypt } from 'jsencrypt'

  export default {
    data () {
      var validateConfirmPassword = (rule, value, callback) => {
        if (this.dataForm.newPassword !== value) {
          callback(new Error(this.$t('bar.inconsistentPsw')))
        } else {
          callback()
        }
      }
      var validatePasswordLenght = (rule, value, callback) => {
        if (value.length < 8 || value.length > 19) {
          callback(new Error(this.$t('bar.newpassword_tip')))
        } else {
          callback()
        }
      }
      return {
        clickDisabled: false,
        visible: false,
        dataForm: {
          password: '',
          newPassword: '',
          confirmPassword: ''
        },
        password: '',
        newPassword: '',
        dataRule: {
          password: [
            { required: true, message: this.$t('bar.oriPswNull'), trigger: 'change' }
          ],
          newPassword: [
            { required: true, message: this.$t('bar.newPswNull'), trigger: 'change' },
            { validator: validatePasswordLenght, trigger: 'change' }
          ],
          confirmPassword: [
            { required: true, message: this.$t('bar.conPswNull'), trigger: 'change' },
            { validator: validateConfirmPassword, trigger: 'change' }
          ]
        }
      }
    },
    computed: {
      userName: {
        get () { return this.$store.state.user.account }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      }
    },
    methods: {
      // 初始化
      init () {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            timestamp().then((res) => {
              const { timestamp } = res
              const passwordJson = JSON.stringify({
                timestamp: timestamp,
                password: this.dataForm.password
              })
              const encryptedPassword = this.encryptionPassword(passwordJson)

              let newPasswordJson = JSON.stringify({
                timestamp,
                password: this.dataForm.newPassword
              })
              const encryptedNewPassword = this.encryptionPassword(newPasswordJson)
              this.clickDisabled = true
              const params = {
                'oldPassword': encryptedPassword,
                'newPassword': encryptedNewPassword
              }
              changePsw(params).then(data => {
                this.$message({
                  message: this.$t('bar.operateSucc'),
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.clickDisabled = false
                    this.visible = false
                    this.$nextTick(() => {
                      this.mainTabs = []
                      clearLoginInfo()
                      window.location.href = window.SITE_CONFIG['loginUrl']
                    })
                  }
                })
              }).catch((e) => {
                this.clickDisabled = false
              })
            })
          }
        })
      },
      // 加密
      encryptionPassword (json) {
        var encryptor = new JSEncrypt()
        let publicKey = getRsaPublicKey()
        encryptor.setPublicKey(publicKey)
        var rsaPassWord = encryptor.encrypt(json)
        return rsaPassWord
      }
    }
  }
</script>

