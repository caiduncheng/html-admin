<template>
  <el-dialog :visible='visible' @close='handleClose' width='30%'>
    <!--    <el-tabs v-model="activeName" >
          <el-tab-pane label='黑名单' name="first">

          </el-tab-pane>
          <el-tab-pane label='配置' name="second">
            <el-form :model='dataForm' :rules='dataRule' ref='dataForm' label-width="50px"
                     v-loading="dataListLoading">
              <el-form-item prop="treeData">
                <el-tree
                  ref="tree"
                  node-key="menuId"
                  show-checkbox
                  :data="treeData"
                  v-model="node"
                  :props="defaultProps"
                  :default-checked-keys="defaultKeys"
                >
                  <div class="custom-tree-node" slot-scope="{ node, data }">
                    <span class="label">{{ node.label }}</span>
                  </div>
                </el-tree>
              </el-form-item>
              <span slot='footer' class='dialog-footer'>
              <el-button type='danger' @click='handleClose'>Cancel</el-button>
              <el-button type='primary' @click='dataFormSubmit()'>Confirm</el-button>
            </span>
            </el-form>
          </el-tab-pane>
        </el-tabs>-->
    <el-form :model='dataForm'  ref='dataForm' label-width="50px"
             v-loading="dataListLoading">
      <el-divider content-position="left">{{ $t('operator.blacklist') }}</el-divider>
      <el-form-item prop="treeData">
        <el-tree
          ref="tree"
          node-key="menuId"
          show-checkbox
          :data="treeData"
          v-model="node"
          :props="defaultProps"
          :default-checked-keys="defaultKeys"
        >
        </el-tree>
      </el-form-item>
      <el-divider content-position="left">{{ $t('operator.functionalConfiguration') }}</el-divider>
      <el-form-item>
        <el-switch v-model="dataForm.sysAppautoUpdateSwitch" :active-text="$t('operator.config.sysAppAutoUpdate')" :active-value='0' :inactive-value='1'></el-switch>
      </el-form-item>
      <el-form-item>
        <el-switch v-model="dataForm.checkAppSignSwitch" :active-text="$t('operator.config.appSign')" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-switch v-model="dataForm.geoTraceSwitch" :active-text="$t('operator.config.geoTrace')" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
    </el-form>
    <div align="center" style="margin: 10px 0 10px 0">
      <span>
        <el-button v-if="isAuth('10408200.MANAGE')" type='danger'  @click="handleClose">{{$t('common.cancel')}}</el-button>
        <el-button v-if="isAuth('10408200.MANAGE')" type='primary' :loading="dataListLoading" @click="dataFormSubmit">{{$t('common.confirm')}}</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import {getOperatorMenuList, postBlackList, getBlackList, configure, getConfigure} from '../../../../api'
import {menuDataTransform} from '@/utils/index'

export default {
  data () {
    return {
      visible: false,
      dataListLoading: false,
      activeName: 'first',
      notConfigured: false,
      operator: {},
      dataForm: {
        sysAppautoUpdateSwitch: 1,
        checkAppSignSwitch: 1,
        geoTraceSwitch: 0
      },
      preData: {
        sysAppautoUpdateSwitch: 1,
        checkAppSignSwitch: 1,
        geoTraceSwitch: 0
      },
      treeData: [],
      node: [],
      defaultKeys: [],
      defaultProps: {
        children: 'list',
        label: 'menuTitle'
      }
    }
  },
  mounted () {
    console.log('mounted')
  },
  created () {
    console.log('created')
  },
  watch: {
    visible (value) {
      console.log(JSON.stringify(this.dataForm))
    }
  },
  methods: {
    async init (operator) {
      this.dataListLoading = false
      this.visible = true
      this.operator = operator
      this.defaultKeys = []
      let params = {
        'characterCode': 'OPERATOR',
        'keyId': operator.operatorId
      }
      await getBlackList(params).then(data => {
        if (data && data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            this.defaultKeys.push(data[i].menuId)
          }
        }
      }).catch(e => {
        // this.$message.error(e.message)
        console.log(`err:${JSON.stringify(e)}`)
      })
      await getOperatorMenuList(params).then(data => {
        this.treeData = menuDataTransform(data, 'menuId', 'parentMenuId')
      }).catch(e => {
        // this.$message.error(e.message)
        console.log(`err:${JSON.stringify(e)}`)
        console.log(e)
      })
      await getConfigure(this.operator.operatorId).then(data => {
        console.log(data)
        if (!data) {
          // 运营商未配置
          this.notConfigured = true
          this.dataForm.sysAppautoUpdateSwitch = this.preData.sysAppautoUpdateSwitch = 1
          this.dataForm.checkAppSignSwitch = this.preData.checkAppSignSwitch = 1
          this.dataForm.geoTraceSwitch = this.preData.geoTraceSwitch = 0
        } else {
          this.dataForm.sysAppautoUpdateSwitch = this.preData.sysAppautoUpdateSwitch = data.sysAppautoUpdateSwitch === null ? 1 : Number(data.sysAppautoUpdateSwitch)
          this.dataForm.checkAppSignSwitch = this.preData.checkAppSignSwitch = data.checkAppSignSwitch === null ? 1 : Number(data.checkAppSignSwitch)
          this.dataForm.geoTraceSwitch = this.preData.geoTraceSwitch = data.geoTraceSwitch === null ? 0 : Number(data.geoTraceSwitch)
        }
      }).catch(e => {
        // this.$message.error(e.message)
        console.log(`err:${JSON.stringify(e)}`)
        console.log(e)
      })
    },
    handleClose () {
      this.visible = false
      this.$emit('close')
    },
    dataFormSubmit () {
      this.dataListLoading = true
      const list = this.$refs.tree.getCheckedNodes().map((node) => ({menuId: node.menuId}))
      postBlackList(this.operator.operatorId, {characterMenuBlacklistList: list}).then(data => {
        // 修改配置
        if (this.comparedConfig()) {
          configure(this.operator.operatorId, this.dataForm).then(data => {
          }).catch(e => {
            console.log(`err:${JSON.stringify(e)}`)
          })
        }
        this.dataListLoading = false
        this.handleClose()
      }).catch(e => {
        this.dataListLoading = false
        console.log(`err:${JSON.stringify(e)}`)
      })
    },
    comparedConfig () {
      // && this.dataForm.extractingFilesSwitch === this.preData.extractingFilesSwitch
      if (!this.notConfigured && this.dataForm.sysAppautoUpdateSwitch === this.preData.sysAppautoUpdateSwitch && this.dataForm.checkAppSignSwitch === this.preData.checkAppSignSwitch && this.dataForm.geoTraceSwitch === this.preData.geoTraceSwitch) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style scoped>
.center {
  margin: 15px
}

.custom-tree-node {
  /* flex: 1; */
  width: 300px;
  /* display: flex; */
  align-items: center;
  font-size: 14px;
  padding-right: 8px;

.label {
  margin-right: 20px;
}

}
</style>
