<template>
  <el-dialog
    :title="!dataForm.id ? $t('projectAddUpdate.add')  : $t('projectAddUpdate.modify')"
    :close-on-click-modal="false"
    @close="visible=false;$emit('close')"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm">
      <el-row :gutter="10">
        <el-col :span="8" v-if="!ifNPI">
          <el-form-item :label="$t('cusModule.cusName')" prop="cusName" class="select-block" >
            <el-input readonly @keydown.native.prevent @click.native="getCusName()" v-model="dataForm.cusName" :placeholder="$t('cusModule.cusName')"></el-input>
          </el-form-item>
          <!-- 通用获取radio组件 -->
            <common-radio-dialog
              v-if="cusVisible"
              ref="cusRadio"
              @confirm="getCusId"
              @cancel="cusVisible=false"
              :title="$t('cusModule.cusName')"
              :searchKey="['name', 'province']"
              :placeholderList="['', $t('cusModule.province')]"
              :forListParams="['scId', 'cusName', 'cusAbbrName']"
            ></common-radio-dialog>
        </el-col>
        <el-col :span="8" v-else>
          <el-form-item :label="$t('demand.customerSp')" prop="spName" >
            <el-input readonly @click.native="$refs.spChekbox.getCheckList()" v-model="dataForm.spName" :placeholder="$t('demand.customerSp')"></el-input>
          </el-form-item>
          <specific-checkbox
            ref="spChekbox"
            :checkboxType="'sp'"
            @confirm="getSpId">
          </specific-checkbox>
        </el-col>

        <el-col :span="8">
          <el-form-item :label="$t('projectAddUpdate.proName')" prop="proName">
            <el-input maxlength="80" v-model.trim="dataForm.proName" :placeholder="$t('projectAddUpdate.proName')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="!ifNPI">
          <el-form-item :label="$t('issueSplitAdd.applyPerson')" prop="applyPerson">
            <el-input :placeholder="$t('issueSplitAdd.applyPerson')" v-model.trim="dataForm.applyPerson"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('projectAddUpdate.proLeader')" prop="taskUserName">
            <el-input v-model="dataForm.taskUserName" readonly @keydown.native.prevent :placeholder="$t('projectAddUpdate.proLeader')" @click.native="getLeader()"></el-input>
          </el-form-item>
           <!-- 通用获取radio组件 -->
            <common-radio-dialog
              v-if="leaderVisible"
              ref="leaderRadio"
              @confirm="getLeaderId"
              @cancel="leaderVisible=false"
              :title="$t('projectAddUpdate.proLeader')"
              :searchKey="['username']"
              :placeholderList="[]"
              :forListParams="['userId', 'enName', 'chName']"
            ></common-radio-dialog>
            <!--  -->
        </el-col>
      <!-- </el-row> -->

      <!-- <el-row :gutter="10"> -->
        <!-- scategory -->
        <el-col :span="8" v-if="!ifNPI">
          <el-form-item :label="$t('projectAddUpdate.scategory')" prop="scategory">
            <el-select :popper-append-to-body="false" :placeholder="$t('projectAddUpdate.scategory')" v-model="dataForm.scategory" @click.native="getInfoParams('scategory')"  class="width100 timeDiv scategory-select">
              <el-option v-for="item in paranmsList" :key="item.id" :label="item.childParamName" :value="item.childParamNameChEn"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 关联客户模块 -->

        <el-col :span="8">
          <el-form-item :label="$t('issueSplitAdd.refArea')" prop="areaName">
            <!-- <el-select @change="setAreaId" :placeholder="$t('issueSplitAdd.refArea')" v-model="dataForm.areaName" @click.native="getInfoParams('region')"  class="width100 timeDiv">
              <el-option v-for="item in paranmsList" :key="item.id" :label="item.childParamName" :value="item.childParamCode"></el-option>
            </el-select> -->
            <el-input disabled :placeholder="$t('issueSplitAdd.refArea')" v-model="cusInfo.areaName"></el-input>
          </el-form-item>
        </el-col>
      <!-- </el-row> -->
      <!-- <el-row :gutter="10"> -->
        <el-col :span="8">
          <el-form-item :label="$t('areaConfig.country')" prop="countryName">
            <el-input disabled :placeholder="$t('areaConfig.country')" v-model="cusInfo.countryName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="!ifNPI">
          <el-form-item :label="$t('issueSplitAdd.province')" prop="province">
            <!-- <el-select :placeholder="$t('issueSplitAdd.province')" v-model="dataForm.province" @click.native="getInfoParams('province')"  class="width100 timeDiv">
              <el-option v-for="item in paranmsList" :key="item.id" :label="item.childParamName" :value="item.childParamName"></el-option>
            </el-select> -->
            <el-input disabled :placeholder="$t('issueSplitAdd.province')" v-model="cusInfo.province"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="!ifNPI">
          <el-form-item :label="$t('issueSplitAdd.industry')" prop="industry">
            <!-- <el-select :placeholder="$t('issueSplitAdd.industry')" v-model="dataForm.industry" @click.native="getInfoParams('industry')"  class="width100 timeDiv">
              <el-option v-for="item in paranmsList" :key="item.id" :label="item.childParamName" :value="item.childParamName"></el-option>
            </el-select> -->
            <el-input disabled :placeholder="$t('issueSplitAdd.industry')" v-model="cusInfo.cusIndustry"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10" v-if="!ifNPI">
        <el-col :span="8">
          <el-form-item :label="$t('issueSplitAdd.applyDate')" prop="applyDate">
            <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" :clearable="false" :disabled="!!dataForm.iterId" v-model="dataForm.applyDate" :placeholder="$t('issueSplitAdd.applyDate')" class="width100 timeDiv">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item :label="$t('projectAddUpdate.cusBusContact')" prop="cusBusContact">
            <el-input :placeholder="$t('projectAddUpdate.cusBusContact')" v-model.trim="dataForm.cusBusContact"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('projectAddUpdate.cusBusContactTel')" prop="cusBusContactTel">
            <el-input :placeholder="$t('projectAddUpdate.cusBusContactTel')" v-model.trim="dataForm.cusBusContactTel"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10" v-if="!ifNPI">
        <el-col :span="8">
          <el-form-item :label="$t('projectAddUpdate.cusTecContact')" prop="cusTecContact">
            <el-input :placeholder="$t('projectAddUpdate.cusTecContact')" v-model.trim="dataForm.cusTecContact"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('projectAddUpdate.cusTecContactTel')" prop="cusTecContactTel">
            <el-input :placeholder="$t('projectAddUpdate.cusTecContactTel')" v-model.trim="dataForm.cusTecContactTel"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="$t('projectAddUpdate.proDesc')" prop="proDesc">
        <el-input type="textarea" :rows="4" maxlength="200" v-model.trim="dataForm.proDesc" :placeholder="$t('projectAddUpdate.proDesc')"></el-input>
      </el-form-item>
      <!-- 建议执行方案 -->
      <el-form-item v-if="!ifNPI" :label="$t('projectAddUpdate.suggestMethod')" prop="suggestMethod">
        <el-input type="textarea" :rows="2" maxlength="200" v-model.trim="dataForm.suggestMethod" :placeholder="$t('projectAddUpdate.suggestMethod')"></el-input>
      </el-form-item>
      <!-- <el-form-item :label="$t('projectAddUpdate.proAddress')" prop="proRespository">
        <el-input maxlength="200" v-model.trim="dataForm.proRespository" :placeholder="$t('projectAddUpdate.proAddress')"></el-input>
      </el-form-item> -->

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible=false;$emit('close')">{{$t('projectAddUpdate.cancel')}}</el-button>
      <el-button type="primary" :disabled="clickDisabled" @click="dataFormSubmit()">{{$t('projectAddUpdate.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { getChildParamsDataNoPage, customerModuleApi, getProInfo } from '@/api'
  import commonRadioDialog from '@/components/dialogs/common-radio-dialog'
  import SpecificCheckbox from '@/components/checkbox/specific-checkbox'

  export default {
    components: {
      commonRadioDialog,
      SpecificCheckbox
    },
    data () {
      return {
        leaderVisible: false,
        cusVisible: false,
        cusInfo: {},
        paranmsList: [],
        clickDisabled: false,
        paginationShow: true,
        visible: false,
        leafnode: [],
        userList: [],
        taskUserName: '',
        dataForm: {
          id: 0,
          proName: '',
          proDesc: '',
          proRespository: '',
          proManager: '',
          taskUserName: '',
          applyPerson: '',
          areaId: '',
          areaName: '',
          industry: '',
          province: '',
          applyDate: '',
          scategory: '',
          scategoryOri: '',
          cusBusContact: '',
          cusBusContactTel: '',
          cusTecContact: '',
          cusTecContactTel: '',
          suggestMethod: '',
          cusName: '',
          cusId: '',
          spName: '',
          spId: ''
        },
        dataRule: {
          proName: [
            { required: true, message: this.$t('projectAddUpdate.proNameNull'), trigger: 'change' }
          ],
          proDesc: [
            { required: true, message: this.$t('projectAddUpdate.proDescNull'), trigger: 'change' }
          ],
          taskUserName: [
            { required: true, message: this.$t('projectAddUpdate.SelecProLeader'), trigger: 'change' }
          ],
          cusName: [
            { required: true, message: this.$t('common.isRequired', {msg: this.$t('cusModule.cusName')}), trigger: 'change' }
          ],
          spName: [
            { required: true, message: this.$t('common.isRequired', {msg: this.$t('cusModule.cusName')}), trigger: 'change' }
          ],
          // areaName: [{ required: true, message: this.$t('common.isRequired', {msg: this.$t('issueSplitAdd.refArea')}), trigger: 'change' }],
          scategory: [{ required: true, message: this.$t('common.isRequired', {msg: this.$t('projectAddUpdate.scategory')}), trigger: 'change' }],
          applyPerson: [{ required: true, message: this.$t('common.isRequired', {msg: this.$t('issueSplitAdd.applyPerson')}), trigger: 'change' }]
        },
        languageType: this.$cookie.get('languageType')
      }
    },
    computed: {
      ifNPI () {
        return this.$envirVersion === 'npi'
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.dataForm.taskUserName = ''
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        if (this.dataForm.id) {
          getProInfo(this.dataForm.id).then((data) => {
            const project = data.project
            this.dataForm.proName = project.proName
            this.dataForm.proDesc = project.proDesc
            // this.dataForm.proRespository = data.project.proRespository
            this.dataForm.taskUserName = this.getChEnName(project.proManagerNameEn, project.proManagerNameCh)
            this.dataForm.proManager = project.proManager
            this.dataForm.applyPerson = project.applyPerson
            this.dataForm.applyDate = project.applyDate
            // this.dataForm.scategory = project.scategory
            this.dataForm.scategoryOri = project.scategory
            // 处理支持类别 中/英
            if (project.scategory) {
              switch (this.languageType) {
                case '0':
                  // locale = 'zh-CN'
                  this.dataForm.scategory = project.scategory.split('/')[0]
                  break
                case '1':
                  // locale = 'en-US'
                  this.dataForm.scategory = project.scategory.split('/')[1]
                  break
              }
            }
            this.dataForm.cusBusContact = project.businessLinkman
            this.dataForm.cusBusContactTel = project.businessLinkmanTel
            this.dataForm.cusTecContact = project.techLinkman
            this.dataForm.cusTecContactTel = project.techLinkmanTel
            this.dataForm.suggestMethod = project.suggestMethod
            this.dataForm.cusId = project.scId
            this.dataForm.cusName = project.cusName
            this.dataForm.spId = project.spId
            this.dataForm.spName = project.spName
            //
            this.cusInfo.areaId = project.areaId
            this.cusInfo.areaName = project.areaName
            this.cusInfo.countryName = project.countryName
            this.cusInfo.countryId = project.countryId
            this.cusInfo.cusIndustry = project.industry
            this.cusInfo.province = project.province
          })
        }
      },
      getInfoParams (type) {
        getChildParamsDataNoPage({ 'parentCode': type }).then((data) => {
          this.paranmsList = data.list
          this.paranmsList.map((item) => {
            item.childParamNameChEn = item.childParamName + '/' + item.childParamNameEn
            switch (this.languageType) {
              case '0':
                // locale = 'zh-CN'
                item.childParamName = item.childParamName
                break
              case '1':
                // locale = 'en-US'
                item.childParamName = item.childParamNameEn || item.childParamName
                break
            }
          })
        })
      },
      //
      getCusName () {
        this.cusVisible = true
        this.$nextTick(() => {
          this.$refs.cusRadio.init({'url': '/sys/customer/list'})
        })
      },
      getCusId (name, id, info) {
        this.dataForm.cusId = id
        this.dataForm.cusName = name
        customerModuleApi(`detail/${id}`).then((data) => {
          this.cusInfo = data.cusDetail
          this.cusInfo.areaId = this.cusInfo.regionChildParamCode
          this.cusInfo.areaName = this.cusInfo.regionName
        }).catch(() => {
          this.cusInfo = {}
        })
      },
      getSpId ({name, id, singleObj}) {
        this.dataForm.spName = name
        this.dataForm.spId = id
        this.cusInfo.areaId = singleObj.areaCode
        this.cusInfo.areaName = singleObj.areaName
        this.cusInfo.countryId = singleObj.countryId
        this.cusInfo.countryName = singleObj.countryName
        this.dataForm.proName = singleObj.spName + '_'
      },
      getLeader () {
        this.leaderVisible = true
        this.$nextTick(() => {
          this.$refs.leaderRadio.init({'url': '/sys/user/usermanalist'}, {'proId': this.dataForm.id})
        })
      },
      getLeaderId (name, id, info) {
        this.dataForm.taskUserName = name
        this.dataForm.proManager = id
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.clickDisabled = true
            this.$http({
              url: this.$http.adornUrl(`/issue/project/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'proId': this.dataForm.id || undefined,
                'proName': this.dataForm.proName,
                'proDesc': this.dataForm.proDesc,
                // 'proRespository': this.dataForm.proRespository,
                'proManager': this.dataForm.proManager,
                'applyPerson': this.dataForm.applyPerson,
                'areaId': this.cusInfo.areaId,
                'industry': this.cusInfo.cusIndustry,
                'province': this.cusInfo.province,
                'countryId': this.cusInfo.countryId,
                'scId': this.dataForm.cusId,
                'spId': this.dataForm.spId,
                'applyDate': this.dataForm.applyDate,
                'scategory': this.dataForm.scategory.indexOf('/') > -1 ? this.dataForm.scategory : this.dataForm.scategoryOri,
                'businessLinkman': this.dataForm.cusBusContact,
                'businessLinkmanTel': this.dataForm.cusBusContactTel,
                'techLinkman': this.dataForm.cusTecContact,
                'techLinkmanTel': this.dataForm.cusTecContactTel,
                'suggestMethod': this.dataForm.suggestMethod
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: this.$t('projectAddUpdate.success'),
                  type: 'success',
                  duration: 500,
                  onClose: () => {
                    this.visible = false
                    this.clickDisabled = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                // this.$message.error(data.msg)
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

<style scoped>
  .width100{margin-left: 0 !important;width:100% !important}
</style>
<style lang="scss">
.scategory-select{
    .el-scrollbar__wrap {
        // overflow: scroll;
    }
    .el-select-dropdown__wrap {
      max-height: 500px;
      padding-bottom: 10px;
    }
  }
</style>
