<template>
  <el-dialog width="600px" v-bind="$attrs" @close="handleClose" @open="handleOpen">
    <div class="m-center w-10/12">
      <el-form label-width="100px" :model="form" ref="emailForm" :rules="rules">
        <el-form-item :label="$t('system.user.email')" prop="email">
          <el-input
            maxlength="64"
            show-word-limit
            v-model="form.email"
            @blur="() => form.email = form.email.trim()"
            @input="emailChange"
            :placeholder="$t('system.user.email')"
          >
            <el-tooltip slot="append" class="item" effect="dark" :content="$t('system.user.profile.send_tip')" placement="top-start">
              <el-button :disabled="verifyCodeSendDisabled" :loading="emailSendLoading"  icon="el-icon-s-promotion" @click="sendEmailVerifyCode">{{ countDown }}</el-button>
            </el-tooltip>

          </el-input>
        </el-form-item>
        <el-form-item :label="$t('cmp.reg_getverify')" prop="verifyCode">
          <el-input
            maxlength="4"
            show-word-limit
            v-model="form.verifyCode"
            @blur="() => form.verifyCode = form.verifyCode.trim()"
            :placeholder="$t('cmp.reg_getverify')"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">{{ $t('page.cancel') }}</el-button>
      <el-button
        :disabled="form.email && oldEmail === form.email"
        size="small"
        type="primary"
        :loading="confirmLoading"
        @click="editEmail()"
      >{{ $t('common.confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { editUserEmail, sendVerifyCode } from '../../../../../api/user'
export default {
  inheritAttrs: false,
  data () {
    return {
      confirmLoading: false,
      verifyCodeSendDisabled: true,
      emailSendLoading: false,
      oldEmail: '',
      countDown: '',
      timer: null,
      form: {
        email: '',
        verifyCode: ''
      },
      rules: {
        email: [
          {
            required: true,
            message: 'Please input email',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: 'Email format error',
            trigger: 'blur'
          }
        ],
        verifyCode: [
          {
            required: true,
            message: 'Please input verify code',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    init (email) {
      console.log('email', email)
      this.oldEmail = email
      if (this.form.email && this.oldEmail !== this.form.email) {
        this.verifyCodeSendDisabled = false
      } else {
        this.verifyCodeSendDisabled = true
      }
    },
    emailChange (value) {
      if (value && this.oldEmail !== value) {
        this.verifyCodeSendDisabled = false
      } else {
        this.verifyCodeSendDisabled = true
      }
    },
    handleClose () {
      this.$refs['emailForm'].resetFields()
      this.timer && this.clearTimer()
      this.$emit('update:visible', false)
      this.$emit('submit')
    },
    editEmail () {
      this.$refs['emailForm'].validate((valid) => {
        if (valid) {
          this.confirmLoading = true
          editUserEmail(this.form).then((res) => {
            this.handleClose()
            this.confirmLoading = false
            this.$message.success(this.$t('common.operated_successfully'))
          }).catch((e) => {
            this.confirmLoading = false
            this.$confirmError(e)
          })
        } else {
          return false
        }
      })
    },
    handleOpen () {

    },
    clearTimer () {
      clearInterval(this.timer)
      this.countDown = ''
      this.verifyCodeSendDisabled = false
    },
    sendEmailVerifyCode () {
      this.emailSendLoading = true

      sendVerifyCode({email: this.form.email}).then((res) => {
        this.$message.success(this.$t('system.user.profile.send_success_tip'))
        this.emailSendLoading = false
        this.countDown = 60
        this.verifyCodeSendDisabled = true
        this.timer = setInterval(() => {
          this.countDown--
          if (this.countDown === 0) {
            this.timer && this.clearTimer()
          }
        }, 1000)
      }).catch((e) => {
        this.$confirmError(e)
        this.emailSendLoading = false
      })
    }
  },
  mounted () {}
}
</script>

<style>
</style>
