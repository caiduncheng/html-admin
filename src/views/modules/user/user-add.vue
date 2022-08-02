<template>
  <el-dialog v-bind="$attrs" @close="handleClose" v-on="$listeners">
    <div class="m-center w-10/12">
      <el-form label-width="150px" :model="form" ref="userForm" :rules="rules">
        <el-form-item :label="$t('user.username')" prop="username" style="margin-bottom: 20px">
          <el-input
            :disabled="usernameDisabled"
            maxlength="64"
            show-word-limit
            v-model="form.username"
            @blur="() => form.username = form.username.trim()"
            :placeholder="$t('user.username')"
          ></el-input>
        </el-form-item>

        <el-form-item :label="$t('user.contact_name')" prop="name" style="margin-bottom: 20px">
          <el-input
            maxlength="32"
            show-word-limit
            v-model="form.name"
            @blur="() => form.name = form.name.trim()"
            :placeholder="$t('user.contact_name')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.phone')" prop="mobile" style="margin-bottom: 20px">
          <el-input
            maxlength="16"
            show-word-limit
            v-model="form.mobile"
            @blur="() => form.mobile = form.mobile.trim()"
            :placeholder="$t('user.phone')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.country_or_region')" prop="countryCode" style="margin-bottom: 20px">
          <el-select
            v-model="form.countryCode"
            filterable
            :placeholder="$t('user.country_or_region')"
            style="width: 100%"
          >
            <el-option
              v-for="item in countryData"
              :key="item.countryCode3"
              :label="$t('country_or_region.' + item.countryCode3)"
              :value="item.countryCode3"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="this.form.userId" :label="$t('user.status')" prop="status" style="margin-bottom: 20px">
          <el-radio v-model="form.status" :label="1">{{ $t('user.unlocked') }}</el-radio>
          <el-radio v-model="form.status" :label="0">{{ $t('user.locked') }}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('role.role_label')" prop="roleIds" style="margin-bottom: 20px">
          <el-checkbox-group v-if="roleData && roleData.length > 0" v-model="form.roleIds">
            <el-checkbox
              v-for="role in roleData"
              :key="role.roleId"
              :label="role.roleId"
            >{{ role.roleName }}</el-checkbox>
          </el-checkbox-group>
          <div style="color: red" v-if="!roleData || roleData.length == 0">
            {{ $t('role.role_create_tip') }}
          </div>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">{{ $t('common.cancel') }}</el-button>
      <el-button
        size="small"
        type="primary"
        :loading="confirmLoading"
        @click="saveUser()"
      >{{ $t('common.confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { addUser, editUser, getUser } from '../../../api/user'
import { listRole } from '@/api/role'
import OrganizationSelect from './organization-select'
import { checkPhoneNum } from '@/utils/validate'
import countryJson from '@/assets/static/country.json'

export default {
  components: { OrganizationSelect },
  inheritAttrs: false,
  data () {
    return {
      countryData: countryJson,
      confirmLoading: false,
      usernameDisabled: false,
      roleData: [],
      orgId: null,
      form: {
        userId: '',
        queryOrg: {},
        createType: 0,
        orgId: null,
        username: '',
        name: '',
        email: null,
        mobile: '',
        countryCode: '',
        status: 1,
        roleList: [],
        roleIds: []
      }
    }
  },
  computed: {
    ...mapGetters(['orgs', 'countries']),
    rules () {
      return {
        queryOrg: [
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
            trigger: 'blur'
          },
          {
            type: 'email',
            message: this.$t('user.email_format_error'),
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('common.nullInputTip'),
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: this.$t('common.nullInputTip'),
            trigger: 'blur'
          },
          {
            type: 'email',
            message: this.$t('common.nullInputTip'),
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            validator: checkPhoneNum,
            trigger: 'blur'
          }
        ],
        countryCode: [
          {
            required: true,
            message: this.$t('common.nullInputTip'),
            trigger: 'change'
          }
        ],
        status: [
          {
            required: true,
            message: this.$t('common.nullInputTip'),
            trigger: 'change'
          }
        ],
        roleIds: [
          {
            required: true,
            message: this.$t('user.select_role_tip'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    init (id) {
      this.form.userId = id
      this.form.roleIds = []
      if (id) {
        this.usernameDisabled = true
        this.getEditUserInfo(this.form.userId)
      } else {
        this.usernameDisabled = false
      }
      this.getAllRoles()
    },
    handleClose () {
      /* this.$nextTick(() => {
        this.$refs.organizationTree.reset()
      }) */
      this.$refs['userForm'].resetFields()
      this.form.queryOrg = {}
      this.orgId = ''
      this.$emit('update:visible', false)
    },
    saveUser () {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          if (this.form.roleIds.length > 5) {
            console.log(this.form.roleIds)
            this.$message.error(
              this.$t('user.max_role_error')
            )
            return
          }
          this.confirmLoading = true
          // role info
          this.form.roleList = []
          this.form.roleIds.forEach((roleId) => {
            this.form.roleList.push({ roleId: roleId })
          })
          if (this.form.userId) {
            editUser(this.form)
              .then(() => {
                this.confirmLoading = false
                this.$message({
                  message: this.$t('common.success'),
                  type: 'success'
                })
                this.$emit('submit')
                this.handleClose()
              })
              .catch((e) => {
                this.confirmLoading = false
                this.$confirmError(e)
              })
          } else {
            this.form.orgId = Number.parseInt(window.localStorage.getItem('orgId'))
            this.form.email = this.form.username
            this.form.contactName = this.form.name
            this.form.platCode = ['TOMS']
            addUser(this.form)
              .then(() => {
                this.confirmLoading = false
                this.$message({
                  message: this.$t('common.success'),
                  type: 'success'
                })
                this.$emit('submit')
                this.handleClose()
              })
              .catch((e) => {
                this.confirmLoading = false
              })
          }
        } else {
          return false
        }
      })
    },
    getEditUserInfo (userId) {
      getUser(userId).then((res) => {
        this.form.username = res.username
        this.form.orgId = res.orgId
        this.form.name = res.name
        this.form.email = res.email
        this.form.mobile = res.mobile
        this.form.countryCode = res.countryCode
        this.form.status = res.status
        if (res.roleList) {
          res.roleList.forEach((role) => {
            this.form.roleIds.push(role.roleId)
          })
        }
        /* this.$nextTick(() => {
          this.$refs.organizationTree.initData()
        }) */
      }).catch(this.$confirmError)
    },
    getAllRoles () {
      listRole().then((res) => {
        this.roleData = res
      }).catch(this.$confirmError)
    }
  },
  mounted () {}
}
</script>

<style>
</style>
