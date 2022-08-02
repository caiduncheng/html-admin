<template>
  <div class="wrapper">
    <div class="bg-image"></div>
    <el-container>
      <el-header>
        <h1>TOMS</h1>
        <!-- <p>{{hasAccount ? "Don't have a account? " : 'Already have an account? please ' }}<a @click="hasAccount = !hasAccount">{{hasAccount ? 'Create One' : 'Sign In'}}</a></p> -->
        <!--        <p>{{hasAccount ? "Don't have a account? " : 'Already have an account? please ' }}<a target="_blank" @click="$router.push({ name: 'signUp' })">{{hasAccount ? 'Create One' : 'Sign In'}}</a></p>-->
      </el-header>
      <el-main>
        <el-card>
          <el-form class="login-form" :model="dataForm" :rules="dataRule" ref="dataForm"
                   @keyup.enter.native="toLogin()">
            <!--<el-form-item v-show="!hasAccount" prop="email">
              <el-input v-model="dataForm.email" size="large" placeholder="Email"></el-input>
            </el-form-item>-->
            <el-form-item prop="userName">
              <el-input v-model="dataForm.userName" size="large" placeholder="Username"
                        tabindex="1"
                        @blur='getCaptcha'
                        auto-complete="on"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" size="large" placeholder="Password" type="password"></el-input>
            </el-form-item>

            <el-form-item v-show="hasAccount" prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input size="large" v-model="dataForm.captcha" :placeholder="$t('login.verifyCode')">
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha" v-loading="captchaLoading">
                  <img style="height: 40px" ref="captcha" @click="getCaptcha" alt/>
                </el-col>
              </el-row>
            </el-form-item>

            <div>
              <el-button @click="toLogin()" size="large" type="primary" style="width:100%">
                {{ hasAccount ? 'Sign In' : 'Sign Up' }}
              </el-button>
            </div>
            <p v-show="!hasAccount">
              <el-checkbox style="color:#000"> Read and agree to the terms of registration</el-checkbox>
            </p>
            <p v-show="!hasAccount">
              By creating an account you agree to the <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
            </p>
            <!--            <p v-show="hasAccount"><a href="#">Forgot Username?</a> &nbsp;&nbsp;.&nbsp;&nbsp; <a href="#">Forgot
                          Password?</a></p>-->
          </el-form>
        </el-card>
      </el-main>
      <el-footer>
        <p>&copy; 2018 All Rights Reserved.
          <span v-show="hasAccount"><a href="#">Privacy </a>and <a href="#">Terms</a></span>
        </p>
      </el-footer>
    </el-container>

    <div style="position:absolute;top:0;z-index:1;width:100%;height:260px;">
      <vue-particles
        style="height:260px"
        color="#fff"
        :particleOpacity="0.7"
        :particlesNumber="80"
        shapeType="circle"
        :particleSize="2"
        linesColor="#fff"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="2"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
      ></vue-particles>
    </div>

  </div>
</template>

<script>
import {menuDataTranslate, getRsaPublicKey} from '@/utils'
import {JSEncrypt} from 'jsencrypt'
import {login, timestamp} from '@/api'
import {mapMutations} from 'vuex'
// import { generateTimeReqestNumber } from '@/utils/validate'
// import Sha256 from 'js-sha256'
export default {
  components: {},
  data () {
    return {
      captchaLoading: false,
      hasAccount: false,
      dataForm: {
        // email: '',
        userName: '',
        password: '',
        uuid: '',
        captcha: ''
      },
      dataRule: {
        // email: [
        //   { required: true, message: this.$t('login.emailEmpty'), trigger: 'change' }
        // ],
        userName: [
          {required: true, message: this.$t('login.accountEmpty'), trigger: 'change'}
        ],
        password: [
          {required: true, message: this.$t('login.passwordEmpty'), trigger: 'change'}
        ],
        captcha: [
          {required: true, message: this.$t('login.verifyEmpty'), trigger: 'change'}
        ]
      },
      captchaPath: '',
      clickDisabled: false
    }
  },
  mounted () {
    this.getCaptcha()
  },
  methods: {
    // 提交表单
    ...mapMutations({
      updateUserName (commit, name) {
        commit('user/updateName', name)
      }
    }),
    // 获取验证码
    getCaptcha () {
      this.hasAccount = true
      this.$refs.captcha.src = process.env.LOGIN_API + 'online/authorization/auth/verify/code?time=' + new Date().getTime() + '&username=' + this.dataForm.userName
    },
    encryptionPassword (json) {
      var encryptor = new JSEncrypt()
      let publicKey = getRsaPublicKey()
      encryptor.setPublicKey(publicKey)
      var rsaPassWord = encryptor.encrypt(json)
      return rsaPassWord
    },
    toLogin () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          timestamp().then((res) => {
            const {timestamp} = res
            console.log(timestamp)
            const json = JSON.stringify({
              timestamp: timestamp,
              code: this.dataForm.captcha,
              password: this.dataForm.password
            })
            let params = {
              'username': this.dataForm.userName,
              'password': this.encryptionPassword(json),
              'code': this.dataForm.captcha
            }
            login(params).then(data => {
              console.log(data.username)
              this.updateUserName(data.username)
              let menuList = menuDataTranslate(data.platformInfoList[0].menuList, 'menuId', 'parentMenuId')
              sessionStorage.setItem('menuList', JSON.stringify(menuList || '[]'))
              this.$cookie.set('TOMS_TOKEN', data.token)
              this.$router.replace({name: 'home'})
            }).catch(e => {
              this.$refs.captcha.src = window.SITE_CONFIG['baseUrl'] + '/online/authorization/auth/verify/code?time=' + new Date().getTime() + '&username=' + this.data.dataForm.username
            })
          }).catch(e => {
          })
        } else {
          console.log('登录失败!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.wrapper {
  height: 100vh;
  // width: 100%;
  // justify-content: space-between;
  // .el-header{
  //   height: 100vh !important;
  //   text-align: center;
  //   line-height: 60px;
  // }
  .el-container {
    position: relative;
    top: -200px;
    z-index: 100000;
    width: 50%;
    margin: auto;

    .el-header {
      text-align: center;
      color: #fff;
      height: 84px !important;
      margin-bottom: 1rem;

      h1 {
        font-size: 2.5rem;
        margin: .5rem
      }

      p {
        margin: 0;
      }

      a {
        color: #f7c46c;
        text-decoration: underline;
      }
    }

    .el-main {
      padding-top: 0;

      .el-card {
        width: 420px;
        margin: auto;

        &__body {
          padding: 3rem 2rem 1rem;
        }
      }

      p {
        text-align: center;
        margin: 1rem;
      }
    }

    .el-footer {
      p {
        text-align: center;
        color: $--color-primary-text-sec
      }
    }
  }

  .bg-image {
    height: 300px !important;
    background-image: url(~@/assets/img/img-1.png);
    width: 100%;
    background-color: #346cb0;
    background-size: cover;
  }

  .login-svg-icon {
    font-size: 700px;
  }

  .login-btn-submit {
    width: 100%;
    height: 6vh;
  }

  .login-captcha {
    overflow: hidden;

    > img {
      width: 100%;
      cursor: pointer;
    }
  }

  .card-login {
    width: 300px;

  }
}
</style>
