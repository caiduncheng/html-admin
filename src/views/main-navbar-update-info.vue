<template>
<div class="main-navbar-user-info">
  <el-dialog
    :title="$t('userAddUpdate.modify')"
    :append-to-body="true"
    :visible.sync="visible">
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      label-width="135px"
    >
      <el-form-item :label="$t('userAddUpdate.loginName')" prop="username">
        <el-input maxlength="50" :disabled="true" v-model.trim="dataForm.username" :placeholder="$t('userAddUpdate.loginAccount')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('userAddUpdate.usernameCh')" prop="chName">
        <el-input maxlength="50" v-model.trim="dataForm.chName" :placeholder="$t('userAddUpdate.usernameCh')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('userAddUpdate.usernameEN')" prop="enName">
        <el-input maxlength="50" v-model.trim="dataForm.enName" :placeholder="$t('userAddUpdate.usernameEN')"></el-input>
      </el-form-item>
      <el-form-item v-if="isShow" :label="$t('userAddUpdate.staffNo')" prop="jobNum">
        <el-input maxlength="30" v-model.trim="dataForm.jobNum" :placeholder="$t('userAddUpdate.staffNo')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('userAddUpdate.email')" prop="email">
        <!-- <el-input :disabled="!isShow" maxlength="50" v-model.trim="dataForm.email" :placeholder="$t('userAddUpdate.email')"></el-input> -->
        <el-input maxlength="50" v-model.trim="dataForm.email" :placeholder="$t('userAddUpdate.email')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('userAddUpdate.mobile')" prop="mobile" >
        <el-input v-model="dataForm.mobile" :placeholder="$t('userAddUpdate.mobile')" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item v-if="isShow" :label="$t('userAddUpdate.passNum')" prop="passNum">
        <el-input maxlength="30" v-model="dataForm.passNum" :placeholder="$t('userAddUpdate.passNum')"></el-input>
      </el-form-item>
      <el-form-item v-if="isShow" :label="$t('userAddUpdate.passExpDate')" prop="passExpDate">
        <el-date-picker
        :editable="false"
        v-model="dataForm.passExpDate" class="timeDiv"
        type="date"
        :placeholder="$t('userAddUpdate.passExpDate')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item v-if="!isShow" class="marginRight" :label="$t('serProAddOrUpdate.serviceProvider')" prop="parentName">
        <el-input v-model="dataForm.parentName" readonly disabled :placeholder="$t('serProAddOrUpdate.serviceProvider')"></el-input>
      </el-form-item>
            <el-form-item v-if="isShow" :label="$t('userAddUpdate.AffiliatedOrganization')" prop="groupName" class="kk">
              <div v-if="editTree" >
        <el-popover ref="menuListPopover" placement="bottom-start" trigger="click" v-model="visible2" >
          <el-tree :data="GroupingList" :props="GroupingListTreeProps" node-key="orgId"  ref="menuListTree" @current-change="menuListTreeCurrentChangeHandle"
            :default-expand-all="true" :highlight-current="true" :expand-on-click-node="false" >
          </el-tree>

        </el-popover>
        <el-input v-model="dataForm.groupName" v-popover:menuListPopover @clear="clear" clearable :readonly="true" :placeholder="$t('resClassifyAddUpdate.clickHighClassify')"
          class="menu-list__input" ></el-input>
          </div>
          <span v-show="ifShow" v-for="(element, index) in dataForm.editShow" :key="index" style="margin-right:5px"  >
             <span>{{ element }}</span><span v-if="index < dataForm.editShow.length - 1">,&nbsp;</span>
          </span>
      </el-form-item>
      <el-form-item v-if="isShow" :label="$t('userAddUpdate.groupName')">
        <span>{{dataForm.groupNameList}}</span>
      </el-form-item>
      <el-form-item v-if="!isShow" class="marginRight" :label="$t('userAddUpdate.AssignmentCommissioner')" prop="agentName">
          <el-input v-model="dataForm.agentName" readonly disabled :placeholder="$t('userAddUpdate.AssignmentCommissioner')"></el-input>
      </el-form-item>
      <!-- <el-form-item :label="$t('userAddUpdate.receiveType')" size="mini" prop="receiveType" :class="{ 'is-required': true }">
        <el-radio-group v-model="dataForm.receiveType">
          <el-radio :label="1">{{$t('userAddUpdate.receiveMsg')}}</el-radio>
          <el-radio :label="2">{{$t('userAddUpdate.receiveEmail')}}</el-radio>
          <!-- <el-radio :label="3">{{$t('userAddUpdate.unable')}}</el-radio> -->
          <!-- <el-radio :label="3">{{$t('userAddUpdate.both')}}</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item v-if="dataForm.techLv && isShow" :label="$t('user.level')">
        <el-tag v-if="dataForm.techLv === 1" size="small" type="primary">{{$t('user.low')}}</el-tag>
        <el-tag v-else-if="dataForm.techLv === 2" size="small" type="warning">{{$t('user.middle')}}</el-tag>
        <el-tag v-else-if="dataForm.techLv === 3" size="small" type="danger">{{$t('user.high')}}</el-tag>
      </el-form-item>

      <el-form-item :label="$t('userAddUpdate.language')" prop="languageType">
        <el-select v-model="dataForm.languageType" :placeholder="$t('userAddUpdate.pSelectLang')">
          <el-option
            v-for="item in lang"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('userAddUpdate.cancel')}}</el-button>
      <el-button type="primary" :disabled="clickDisabled" @click="dataFormSubmit()">{{$t('userAddUpdate.confirm')}}</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
  import { isEmail, isMobile, formatDate } from '@/utils/validate'
  // import { treeDataTranslate } from '@/utils'

  export default {
    data () {
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error(this.$t('userAddUpdate.emailError')))
        } else {
          callback()
        }
      }
      var validateMobile = (rule, value, callback) => {
        if (value && !isMobile(value)) {
        // if (!isMobile(value)) { 手机号非必填，若填了则检验
          callback(new Error(this.$t('userAddUpdate.mobileError')))
        } else {
          callback()
        }
      }
      return {
        languageType: this.$cookie.get('languageType'),
        isShow: window.localStorage.getItem('userType') !== '2',
        GroupingList: [],
        GroupingListTreeProps: {
          label: 'orgName',
          children: 'children'
        },
        clickDisabled: false,
        flag: false,
        editTree: true,
        visible: false,
        visible2: false,
        paginationShow: true,
        Commissioner: '',
        roleList: [],
        issUserList: [],
        issUserId: '',
        issUserPageIndex: 1,
        issUserPageSize: 10,
        issUserTotalCount: 0,
        issUserDialogTableVisible: false,
        issUserRadio: '',
        lang: [{
          value: 0,
          label: this.$t('userAddUpdate.zh')
        }, {
          value: 1,
          label: this.$t('userAddUpdate.en')
        }],
        ifShow: false,
        dataForm: {
          techLv: 0,
          editShow: [],
          id: 0,
          username: '',
          salt: '',
          email: '',
          mobile: '',
          roleIdList: [],
          // receiveType: 1,
          parentName: '',
          groupName: '',
          groupParentId: [],
          languageType: null,
          passNum: '',
          passExpDate: '',
          issUserId: [],
          Commissioner: '',
          jobNum: 0,
          groupNameList: ''
        },
        disabled: false,
        dataRule: {
          username: [
            { required: true, message: this.$t('userAddUpdate.usernameEmpty'), trigger: 'change' }
          ],
          email: [
            { required: true, message: this.$t('userAddUpdate.emailEmpty'), trigger: 'change' },
            { validator: validateEmail, trigger: 'change' }
          ],
          mobile: [
            // { required: true, message: this.$t('userAddUpdate.phoneEmpty'), trigger: 'change' },
            { validator: validateMobile, trigger: 'change' }
          ],
          roleIdList: [
            { required: true, message: this.$t('userAddUpdate.roleEmpty'), trigger: 'change' }
          ],
          // receiveType: [
          //   { required: true, message: this.$t('userAddUpdate.receiveTypeEmpty'), trigger: 'change' }
          // ],
          languageType: [
            { required: true, message: this.$t('userAddUpdate.langEmpty'), trigger: 'change' }
          ],
          issUserId: [
            { required: true, message: this.$t('userAddUpdate.langEmpty'), trigger: 'change' }
          ],
          groupName: [
            { required: true, message: this.$t('userAddUpdate.AffiliatedOrganizationEmpty'), trigger: 'change' }
          ]
          // jobNum: [
          //   { required: true, message: this.$t('userAddUpdate.staffNoEmpty'), trigger: 'change' }
          // ]
        },
        menuList: [],
        menuListTreeProps: {
          label: 'spName',
          children: 'children'
        }
      }
    },
    computed: {
      departIssType () {
        return this.$store.getters['common/departIssType']
      },
      userName: {
        get () { return this.$store.state.user.name },
        set (val) { this.$store.commit('user/updateName', val) }
      }
    },
    methods: {
       // 菜单树选中
      menuListTreeCurrentChangeHandle (data, node) {
        this.dataForm.groupParentId = data.orgId
        this.dataForm.groupName = data.orgName
        this.visible2 = false
      },
      // 菜单树设置当前选中节点
      menuListTreeSetCurrentNode () {
        this.$refs.menuListTree.setCurrentKey(this.dataForm.groupParentId)
        this.dataForm.groupName = (this.$refs.menuListTree.getCurrentNode() || {})['orgName']
      },
      // 获取可指派人员end
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        if (!this.dataForm.id) {
          // 新增
          this.editTree = true
          this.ifShow = false
          this.disabled = false
          // this.menuListTreeSetCurrentNode()
        } else {
          this.editTree = false
          this.ifShow = true
          this.disabled = true
          this.$http({
            url: this.$http.adornUrl(`/sys/user/info`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.techLv = data.user.techLv
              this.dataForm.username = data.user.username
              this.dataForm.salt = data.user.salt
              this.dataForm.email = data.user.email
              this.dataForm.mobile = data.user.mobile
              // this.dataForm.receiveType = data.user.receiveType
              this.dataForm.agentName = this.departIssType === 0 ? this.getChEnName(data.user.agentNameEn, data.user.agentNameCh) : this.getChEnName(data.user.serviceAgentNameCh, data.user.serviceAgentNameEn)
              // this.dataForm.agentName = data.user.agentNameEn && data.user.agentNameCh ? data.user.agentNameEn + ' / ' + data.user.agentNameCh : data.user.agentNameEn || data.user.agentNameCh
              this.dataForm.parentName = data.user.spName
              this.dataForm.parentId = data.user.spId
              this.dataForm.agentId = data.user.agentId
              this.dataForm.groupNameList = (data.user.groupNameList && data.user.groupNameList.join(',')) || ''
              switch (this.languageType) {
                case '0':
                  // locale = 'zh-CN'
                  if (data.user.orgNameList) {
                    this.dataForm.editShow = data.user.orgNameList
                  } else {
                    this.dataForm.editShow = []
                  }
                  this.dataForm.groupName = 1
                  break
                case '1':
                  // locale = 'en-US'
                  if (data.user.orgNameList) {
                    this.dataForm.editShow = data.user.orgNameEnList
                  } else {
                    this.dataForm.editShow = []
                  }
                  this.dataForm.groupName = 1
                  break
              }
              this.dataForm.groupParentId = data.user.orgIdList
              this.dataForm.languageType = data.user.languageType
              this.dataForm.passNum = data.user.passNum
              this.dataForm.passExpDate = data.user.passExpDate && data.user.passExpDate.replace(/-/g, '/')
              this.dataForm.chName = data.user.chName
              this.dataForm.enName = data.user.enName
              this.dataForm.jobNum = data.user.jobNum
            } else {
              this.$message.error(data.msg)
            }
          }).catch((e) => {
            if (e.code === 'ECONNABORTED') {
              this.$message.error(e.message)
            }
          })
        }
      },
      // 输入框清空事件
      clear () {
        this.dataForm.parentId = 0
        this.visible2 = false
      },
      // 表单提交
      dataFormSubmit () {
        if (!this.dataForm.chName && !this.dataForm.enName) {
          this.$message.warning(this.$t('userAddUpdate.chNameOrEnname'))
          return
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.clickDisabled = true
            this.$http({
              url: this.$http.adornUrl(`/sys/user/${!this.dataForm.id ? 'save' : 'infoupdate'}`),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.dataForm.id || undefined,
                'username': this.dataForm.username,
                'agentId': this.dataForm.agentId,
                'salt': this.dataForm.salt,
                'email': this.dataForm.email,
                'mobile': this.dataForm.mobile,
                // 'receiveType': this.dataForm.receiveType,
                'status': 1, // 页面不显示修改状态，若不传会报错，所以传1
                'techLv': this.dataForm.techLv,
                'roleIdList': this.dataForm.roleIdList.length > 0 ? this.dataForm.roleIdList : [7], // 创建的新用户默认拥有普通用户权限
                'spId': this.dataForm.parentId,
                'orgIdList': !this.dataForm.id ? [this.dataForm.groupParentId] : [],
                'spName': this.dataForm.parentName,
                'languageType': this.dataForm.languageType,
                'passNum': this.dataForm.passNum,
                'passExpDate': (this.dataForm.passExpDate && formatDate('yyyy-MM-dd hh:mm:ss', this.dataForm.passExpDate)) || null,
                'type': 1,
                'chName': this.dataForm.chName,
                'enName': this.dataForm.enName,
                'jobNum': this.dataForm.jobNum
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: this.$t('userAddUpdate.success'),
                  type: 'success',
                  duration: 500,
                  onClose: () => {
                    this.visible = false
                    this.clickDisabled = false
                    this.$emit('refreshDataList')
                    if (this.dataForm.id && (Number(this.$cookie.get('loginUserId')) === this.dataForm.id)) {
                      this.userName = this.getChEnName(this.dataForm.enName, this.dataForm.chName)
                    }
                  }
                })
              } else {
                this.$message.error(data.msg)
                this.clickDisabled = false
              }
            }).catch((e) => {
              if (e.code === 'ECONNABORTED') {
                this.$message.error(e.message)
              }
              this.clickDisabled = false
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss" >
.el-popover{
  width: 35%;
  overflow: auto;
  height: 304px;
}
// 日期控件样式问题修改
.main-navbar-user-info{
  .el-date-editor--date>input{padding-left:33px  }
 .el-form-item--medium .el-form-item__content{margin-left:156px!important}
 .el-form-item--medium .el-form-item__label{width:156px!important}
  .radio {
    display: block;
    margin-top: 5px;
    margin-left: 0 !important;
  }
  .radio_style {
    width: 100%;
  }

  .radio_style .el-radio {
    width: 100%;
    height: 45px;
    line-height: 45px;
    border-bottom: 1px solid #e3e3e3;
  }

  .radio_style .el-radio:first-child {
    border-top: 1px solid #e3e3e3
  }
  .timeDiv>input{padding-left:33px }
}


</style>
