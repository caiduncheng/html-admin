<template>
  <div class="container-fluid fty-box mt-6">
    <el-row :gutter="10">
      <el-col :span="22">
        <!--<div class="header px-6 mb-2">-->
        <!--<h2>-->
        <!--<span>Base Information</span>-->
        <!--</h2>-->
        <!--</div>-->
        <!--<hr class="mb-4 mx-2" />-->
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item :label="$t('page.operator')">
            <el-col :span="24">
              <el-input type="text" v-model="operator.name" style="width: 100%;" disabled></el-input>
            </el-col>
          </el-form-item>

          <el-form-item :label="$t('common.organization')">
            <el-col :span="24">
              <el-input type="text" v-model="operator.orgName" style="width: 100%;" disabled></el-input>
            </el-col>
          </el-form-item>

          <el-form-item :label="$t('common.user_name')">
            <el-col :span="10">
              <el-input
                type="text"
                maxlength="32"
                show-word-limit
                :placeholder="$t('common.user_name')"
                v-model="form.name"
                @blur="() => form.name = form.name.trim()"
                style="width: 100%;"
              ></el-input>
            </el-col>
            <el-col class="line text-right" :span="4">{{ $t('common.gender') }}</el-col>
            <el-col :span="10">
              <el-radio v-model="form.gender" label="1">{{ $t('common.male') }}</el-radio>
              <el-radio v-model="form.gender" label="0">{{ $t('common.female') }}</el-radio>
            </el-col>
          </el-form-item>

          <el-form-item :label="$t('common.phone')">
            <el-col :span="10">
              <el-input
                maxlength="16"
                show-word-limit
                v-model="form.mobile"
                @blur="() => form.mobile = form.mobile.trim()"
                :placeholder="$t('common.phone')"
              />
            </el-col>
            <el-col class="line text-right" :span="4">{{ $t('common.email') }}</el-col>
            <el-col :span="10">
              <el-input v-model="form.email" placeholder="xxxx@xxxx.xxx" disabled>
                <el-button slot="append" icon="el-icon-edit" @click="editEmailHandle"></el-button>
              </el-input>
            </el-col>
          </el-form-item>

          <el-form-item :label="$t('common.address')">
            <el-col :span="10">
              <el-select
                v-model="form.countryCode"
                filterable
                :placeholder="$t('common.country_or_region')"
                style="width: 100%"
              >
                <el-option
                  v-for="item in countries"
                  :key="item.countryCode3"
                  :label="$t('country_or_region.' + item.countryCode3)"
                  :value="item.countryCode3"
                ></el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item>
            <el-col :span="24">
              <el-input
                maxlength="128"
                show-word-limit
                :placeholder="$t('common.address')"
                v-model="form.address"
                @blur="() => form.address = form.address.trim()"
              />
            </el-col>
          </el-form-item>

          <el-form-item>
            <el-col :span="24">
              <el-button type="primary" @click="onSubmit">{{ $t('common.submit') }}</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <edit-email
      ref="emailDialog"
      @submit="getUserInfo"
      :visible.sync="editEmailVisible"
      :title="$t('system.user.profile.edit_email')"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getselfInfoFull, updateUserInfoFull } from '@/api/user'
import EditEmail from './edit-email'
export default {
  name: 'account-overview',
  components: { EditEmail },
  props: {
    logoUrl: String
  },
  data () {
    return {
      editEmailVisible: false,
      form: {
        name: '',
        mobile: '',
        countryCode: '',
        gender: '',
        email: '',
        address: '',
        desc: ''
      },
      operator: {}
    }
  },
  computed: {
    ...mapGetters(['countries'])
  },
  mounted () {
    this.getUserInfo()
  },
  methods: {
    onSubmit () {
      updateUserInfoFull({ ...this.form, logoUrl: this.logoUrl })
        .then((res) => {
          this.$message.success('Operated Successfully.')
          this.$store.commit('user/SET_LOGO_URL', this.logoUrl)
        })
        .catch(this.$confirmError)
    },
    getUserInfo () {
      getselfInfoFull().then((fullUserInfo) => {
        this.form.name = fullUserInfo.name
        this.form.countryCode = fullUserInfo.countryCode
        this.form.mobile = fullUserInfo.mobile
        this.form.gender = String(fullUserInfo.gender)
        this.form.email = fullUserInfo.email
        this.form.address = fullUserInfo.address
        this.operator.name = fullUserInfo.operatorName
        this.operator.orgName = fullUserInfo.orgName
      })
    },
    editEmailHandle () {
      this.editEmailVisible = true
      this.$nextTick(() => {
        console.log('email', this.form.email)
        this.$refs.emailDialog.init(this.form.email)
      })
    }
  }
}
</script>

<style scoped>
</style>
