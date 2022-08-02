<template>
  <div class="sign-up" >
    <div class="bg-image"></div>
    <el-container >
      <el-header>
        <p>{{hasAccount ? "Don't have a account? " : 'Already have an account? please ' }}<a @click="$router.push('/login')">{{hasAccount ? 'Create One' : 'Sign In'}}</a></p>
      </el-header>
      <el-main>
        <el-card>
          <div slot="header">
            <el-steps :active="activeStep" simple process-status="finish">
              <el-step title="账号信息"><span slot="icon">1</span></el-step>
              <el-step title="用户信息"><span slot="icon">2</span></el-step>
              <el-step title="注册成功"><span slot="icon">3</span></el-step>
            </el-steps>
          </div>
          <el-form
            v-if="activeStep < 2"
            ref="dataForm"
            class="login-form"
            :model="dataForm"
            :rules="rules"
            label-position="left"
            label-width="auto"
            @submit.native.prevent>
            <!-- ############# stpe0 ##################-->
            <div v-show="activeStep === 0">
              <el-form-item label="Email" prop="email">
                <el-input v-model="dataForm.email" size="large" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="Mobile" prop="mobile">
                <el-input v-model="dataForm.mobile" size="large" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="Username" prop="username">
                <el-input v-model="dataForm.username" size="large" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="Password" prop="password">
                <el-input v-model="dataForm.password" size="large" placeholder=""></el-input>
              </el-form-item>

              <div class="flex" style="gap:20px;">
                <el-form-item label="DeveloperType" prop="developerType" class="width50">
                  <el-select v-model="dataForm.developerType" class="width100">
                    <el-option :value="1" label="个人"></el-option>
                    <el-option :value="2" label="公司"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="AuthCodeType" prop="authCodeType" class="width50">
                  <el-select v-model="dataForm.authCodeType" class="width100">
                    <el-option value="EMAIL" label="Email" :disabled="!dataForm.email"></el-option>
                    <el-option value="MOBILE" label="Mobile" :disabled="!dataForm.mobile"></el-option>
                  </el-select>
                </el-form-item>
              </div>

              <el-form-item label="AuthCode" prop="authCode">
                <el-col :span="19" style="padding-right:20px">
                  <el-input size="large" v-model="dataForm.authCode" :placeholder="$t('login.verifyCode')"></el-input>
                </el-col>
                <el-col :span="5" class="login-captcha">
                  <el-button :disabled="!dataForm.authCodeType" :loading="btnLoading" type="primary" class="width100" style="height:40px" @click="getAuthCode()">{{btnLoading ? `${secondDown}s` : 'Get authCode'}}</el-button>
                </el-col>
              </el-form-item>
            </div>
            <!-- ############# stpe1 ##################-->
            <div v-show="activeStep === 1">
              <div class="flex">
                <el-form-item :label="personalAccount ? 'Firstname' : 'Company'" prop="firstName" :class="personalAccount ? 'width50' : 'width100'">
                  <el-input v-model="dataForm.firstName" size="large" placeholder=""></el-input>
                </el-form-item>
                <el-form-item v-if="personalAccount" label="Lastname" prop="lastName" class="width50">
                  <el-input v-model="dataForm.lastName" size="large" placeholder=""></el-input>
                </el-form-item>
              </div>

              <div class="flex" style="gap:0px;">
                <el-form-item label="Pid Type" prop="pidType" style="width:50%">
                  <el-select v-if="personalAccount" v-model="dataForm.pidType" class="width100">
                    <el-option :value="1" label="身份证"></el-option>
                    <el-option :value="2" label="护照"></el-option>
                  </el-select>
                  <el-select v-else v-model="dataForm.pidType" class="width100">
                    <el-option :value="3" label="公司编码"></el-option>
                    <el-option :value="4" label="公司上市代码"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Pid" prop="pid" style="width:50%">
                  <el-input v-model="dataForm.pid" size="large" placeholder=""></el-input>
                </el-form-item>
              </div>

              <div class="flex" style="gap:0px;">
                <el-form-item label="Language" prop="lang" class="width50">
                  <el-select v-model="dataForm.lang" class="width100">
                    <el-option value="zh_CN" label="Chinese"></el-option>
                    <el-option value="en_US" label="English"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="UtcTime" prop="utcTime" class="width50">
                  <el-input v-model="dataForm.utcTime" size="large" placeholder=""></el-input>
                </el-form-item>
              </div>

              <div class="flex" style="gap:0px;">
                <!--<el-form-item label="Country" prop="countryCode" class="width50">
                  <el-select v-model="dataForm.countryCode" class="width100">
                    <el-option value="CHN" label="中国"></el-option>
                  </el-select>
                </el-form-item>-->
                <el-form-item label="Country" prop="countryCode" class="width50">
                  <el-select
                  filterable
                  v-model="dataForm.countryCode"
                  class="width100">
                    <el-option
                    v-for="item in countryArr"
                    :key="item.countryId"
                    :value="item.countryCode3"
                    :label="item.countryNameEn"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Area" prop="areaCode" class="width50">
                  <el-input :disabled="dataForm.countryCode !== 'CHN'" v-model="dataForm.areaCode" size="large" placeholder=""></el-input>
                </el-form-item>
              </div>
              <div class="flex" style="gap:10px;">
                <el-form-item label="Postcode" prop="postCode" class="width50">
                  <el-input v-model="dataForm.postCode" size="large" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="Contact Name" prop="contactName" class="width50">
                  <el-input v-model="dataForm.contactName" size="large" placeholder=""></el-input>
                </el-form-item>
              </div>
              <div class="flex" style="gap:0px;">
                <el-form-item label="Provice" prop="provName" style="width:33%">
                  <el-input v-model="dataForm.provName"></el-input>
                </el-form-item>
                <el-form-item label="City" prop="cityName" style="width:33%">
                  <el-input v-model="dataForm.cityName" size="large" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="Area" prop="areaName" style="width:33%">
                  <el-input v-model="dataForm.areaName" size="large" placeholder=""></el-input>
                </el-form-item>
              </div>
              <el-form-item label="Address" prop="address">
                <el-input v-model="dataForm.address" size="large" placeholder=""></el-input>
              </el-form-item>
            </div>

            <div class="flex" style="margin-bottom:5px">
              <el-button v-show="activeStep < 2" @click="nextStep" size="large" type="primary" style="width:100%">{{'Next Step'}}</el-button>
              <el-button v-show="activeStep === 1" @click="preStep" size="large" type="danger" style="width:100%">{{'Pre Step'}}</el-button>
            </div>
            <!-- <div>
            </div> -->
          </el-form>

          <div v-if="activeStep === 2" class="well-done">
            <p>Register Success</p>
          </div>
        </el-card>
      </el-main>
      <!-- <el-footer>

      </el-footer> -->
    </el-container>

    <div style="position:absolute;top:0;z-index:1;width:100%;height:100vh;">
      <vue-particles
        style="height:100%"
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
import {dataformMixins} from '@/mixins/dataform-mixins'
import {register} from '@/api'
import countryParams from '@/assets/static/country.json'

export default {
  mixins: [dataformMixins],
  computed: {
    personalAccount () {
      return this.dataForm.developerType === 1
    },
    documentClientHeight () {
      return document.body.scrollHeight + 'px'
    }
  },
  data () {
    return {
      countryArr: [],
      activeStep: 0,
      showBtn: true,
      btnLoading: false,
      secondDown: 5,
      hasAccount: false,
      dataForm: {
        email: '1@qq.com',
        mobile: '',
        username: '',
        password: '',
        developerType: 1, // 1,personal 2,company
        authCodeType: '',
        authCode: '',
        firstName: '',
        lastName: '',
        pidType: '',
        pid: '',
        countryCode: '',
        lang: '',
        utcTime: '',
        areaCode: '',
        address: '',
        provName: '',
        cityName: '',
        areaName: '',
        postCode: '',
        contactName: ''
      },
      mixinsPropsRulesList: [
        {
          key: 'email',
          slefDefined: [
            { required: true, message: '请输入邮箱地址', trigger: 'change' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ]
        },
        {key: 'username', value: 'username', trigger: 'change'},
        {key: 'password', value: 'password', trigger: 'change'},
        {key: 'developerType', value: 'developerType', trigger: 'change'},
        {key: 'firstName', value: 'first'},
        {key: 'countryCode', value: 'countryCode', trigger: 'change'},
        {key: 'lang', value: 'language', trigger: 'change'},
        {key: 'utcTime', value: 'utcTime', trigger: 'change'},
        {key: 'authCodeType', value: 'authCodeType', trigger: 'change'},
        {key: 'authCode', value: 'authCode', trigger: 'change'}
      ],
      validateListStep0: ['email', 'username', 'password', 'developerType', 'authCodeType', 'authCode'],
      validateListStep1: ['firstName', 'lang', 'countryCode', 'utcTime'],
      captchaPath: '',
      clickDisabled: false
    }
  },
  created () {
    this.getParams()
  },
  methods: {
    nextStep () {
      // validateField: 表单部分验证 validateField(Arrar|String, callback(errorMsg))
      let validaAll = true
      // console.log(this.activeStep)
      if (this.activeStep === 0) {
        this.$refs.dataForm.validateField(this.validateListStep0, err => {
          if (err) {
            validaAll = validaAll && false
          } else {
            validaAll = validaAll && true
          }
        })
      } else if (this.activeStep === 1) {
        this.$refs.dataForm.validateField(this.validateListStep1, err => {
          console.log(err)
          // debugger
          if (err) {
            validaAll = validaAll && false
          } else {
            validaAll = validaAll && true
          }
        })
      }
      // 由于validateField方法callback是分布多次执行，所以不可在validateField里面直接操作
      // 需要先判断是否全部验证通过
      if (this.activeStep === 0 && validaAll) {
        this.activeStep ++
      } else if (this.activeStep === 1 && validaAll) {
        // console.log('Register Succ')
        // this.activeStep ++
        // 发起注册请求
        register(this.dataForm).then(data => {
          this.$message.success(this.$t('common.operate_success'))
          this.activeStep ++
        }).catch(e => {
          this.$message.error(e.message)
        })
      }
    },
    preStep () {
      if (this.activeStep === 1) {
        this.activeStep = 0
      }
    },
    getAuthCode () {
      this.btnLoading = true
      var timeInterval = setInterval(() => {
        this.secondDown --
        if (this.secondDown === 0) {
          clearInterval(timeInterval)
          this.btnLoading = false
          this.secondDown = 5
        }
      }, 1000)
    },
    getParams () {
      this.countryArr = countryParams
    }
  }
}
</script>

<style lang="scss">
  .sign-up {
    height: 100vh;
    // overflow-y: auto;
    position: relative;
    // width: 100%;
    // justify-content: space-between;
    // .el-header{
    //   height: 100vh !important;
    //   text-align: center;
    //   line-height: 60px;
    // }
    .el-container {
      top: 40px;
      position: absolute;
      z-index: 2;
      width: 100%;
      margin: auto;
      .el-header {
        width: 80%;
        margin: auto;
        text-align: left;
        color: #fff;
        height: 20px !important;
        margin-bottom: 1rem;
        h1 {
          font-size: 2.5rem;
          margin: .5rem
        }
        p {margin: 0;}
        a {
          color:#f7c46c;
          text-decoration: underline;
        }
      }
      .el-main {
        padding-top:0;
        .el-card {
          width: 80%;
          margin: auto;
          &__body {
            padding: 3rem 2rem 1rem;
          }
          .el-steps {
            // margin: 0 0 10px 0;
          }
        }
        p {
          text-align:center;
          margin:1rem;
        }
      }
      .el-footer {
        p {text-align: center;color:$--color-primary-text-sec}
      }
    }
    .bg-image {
      height: 100% !important;
      background-image: url(~@/assets/img/img-1.png);
      width: 100%;
      background-color: $--color-primary;
      background-size: cover;
    }
    .well-done {
      height: 500px;
      background-image: url(~@/assets/img/well_done.png);
      width: 100%;
      background-size: auto 100%;
      background-repeat: no-repeat;
      background-position: center;
      position: relative;
      margin-top: -40px;
      p {
        position: absolute;
        font-size: 3rem;
        // font-weight: bold;
        color: $--color-primary;
        width: 100%;
        text-align: center;
        margin: 1rem 0 !important;
      }
    }
    .login-svg-icon{
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
      .card-login{
        width: 300px;

      }
  }
</style>

