<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" @open="open" @close="close">
    <el-form label-width="100px" ref="form" :model="dataForm" :rules="rules" v-loading="loading">
      <el-form-item :label="$t('role.role_label')" prop="roleName" style="margin-bottom: 20px">
        <el-input
          maxlength="64"
          show-word-limit
          v-model="dataForm.roleName"
          @blur="() => dataForm.roleName = dataForm.roleName.trim()"
          :placeholder="$t('role.role_label')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('role.permission')" prop="node">
        <el-tree
          ref="tree"
          node-key="menuId"
          show-checkbox
          :data="treeData"
          v-model="dataForm.node"
          :props="defaultProps"
          @check-change="handleTreeNodeCheck"
        >
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <span
              class="label"
            >{{ data.list ? $t('menuList.' + data.menuId) : $t('func.' + node.label) }}</span>
          </div>
        </el-tree>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="small" @click="$emit('update:visible', false)">{{ $t('common.cancel') }}</el-button>
      <el-button
        size="small"
        type="primary"
        :loading="confirmLoading"
        @click="submit"
      >{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listAllMenu, listAllFunctions } from '../../../api/menu'
import { newRole, roleInfo, updateRole, getRoleMenuFunctions } from '../../../api/role'
import { menuDataTranslate } from '@/utils'

let functions
let tree

export default {
  inheritAttrs: false,
  props: ['roleData', 'type', 'roleId'],
  data () {
    var validatePermission = (rule, value, callback) => {
      let checkedNodes = this.$refs.tree
        .getCheckedNodes()
        .filter((node) => !node.list)
        .map((node) => ({ menuFuncCode: node.menuId }))
      if (!checkedNodes || checkedNodes.length === 0) {
        callback(new Error(this.$t('role.permission_select_tip')))
      } else {
        callback()
      }
    }
    return {
      confirmLoading: false,
      loading: false,
      treeData: [],
      dataForm: {
        node: [],
        roleName: '',
        roleFunctionList: []
      },
      defaultProps: {
        children: 'list',
        label: 'menuTitle'
      },
      rules: {
        roleName: [
          {
            required: true,
            message: this.$t('common.nullInputTip'),
            trigger: 'blur'
          }
        ],
        node: [
          {
            required: true,
            validator: validatePermission,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    // reportMenuId() {
    //   return REPORT_MENU_ID
    // }
  },
  methods: {
    open () {
      if (this.type === 'update') {
        this.loading = true
        getRoleMenuFunctions(this.roleId)
          .then((data) => {
            const checkedArray = data.map((v) => v.menuFuncCode)

            this.$refs.tree.setCheckedKeys(checkedArray)

            // 找出menuId只出现一次的元素，只出现一次说明该menu为只读
            // const singleArr = singles(data.map((v) => v.menuId))

            // checkReadOnlyNodes(this.treeData, singleArr)
          })
          .catch(this.$confirmError)
        roleInfo(this.roleId)
          .then((data) => {
            this.loading = false
            this.dataForm.roleName = data.roleName
          })
          .catch((e) => {
            this.loading = false
            this.$confirmError(e)
          })
      }
    },

    close () {
      this.$refs.form.resetFields()
      this.$refs.tree.setCheckedKeys([])
      // checkTreeData(this.treeData, false)
    },

    submit () {
      console.log('node', this.dataForm.node)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const checkedNodes = this.$refs.tree
            .getCheckedNodes()
            .filter((node) => !node.list)
            .map((node) => ({ menuFuncCode: node.menuId }))
          this[this.type](checkedNodes)
        }
      })
    },

    handleTreeNodeCheck (data, checked) {
      // if (!checked && data.readOnly && data.menuId !== REPORT_MENU_ID) {
      //   data.readOnly = false
      // }
    },

    // read-only 复选框被勾选的话，它所属的权限也要被勾选
    readOnlyCheckBoxOnChange (checked, node) {
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      if (checked) {
        this.$refs.tree.setCheckedKeys([...checkedKeys, node.menuId])
      }
    },

    add (codes) {
      this.confirmLoading = true
      newRole({
        roleName: this.dataForm.roleName,
        roleFunctionList: codes
      })
        .then(() => {
          this.confirmLoading = false
          this.$message({
            message: this.$t('common.success'),
            type: 'success'
          })
          this.$emit('update:visible', false)
          this.$emit('submit')
        })
        .catch((e) => {
          this.confirmLoading = false
          this.$confirmError(e)
        })
    },

    update (roleFunctionList) {
      this.confirmLoading = true
      updateRole({
        roleId: this.roleId,
        roleName: this.dataForm.roleName,
        roleFunctionList,
        status: 1
      })
        .then(() => {
          this.confirmLoading = false
          this.$message({
            message: this.$t('common.success'),
            type: 'success'
          })
          this.$emit('update:visible', false)
          this.$emit('submit')
        })
        .catch((e) => {
          this.confirmLoading = false
          this.$confirmError(e)
        })
    },
    _getFunctionList (functionList, defaultFunctionList) {
      for (let fun of functionList) {
        for (let defFun of defaultFunctionList) {
          if (fun.menuFuncCode === defFun.menuFuncCode) {
            fun.checked = true
          }
        }
      }
      return functionList
    },
    /**
     * 将功能权限当作菜单加入菜单的Tree中
     * @param menuList
     * @param functionList 功能列表
     */
    initMenuFunctionTree (menuList, functionList) {
      for (let menu of menuList) {
        if (menu.list && menu.list.length > 0) {
          this.initMenuFunctionTree(menu.list, functionList)
        } else {
          for (let fun of functionList) {
            if (menu.menuId === fun.menuId) {
              if (menu.list === undefined) {
                menu.list = []
              }
              var newObj = {
                menuId: fun.menuFuncCode,
                menuTitle: fun.funName
              }
              menu.list.push(newObj)
            }
          }
        }
      }
    }
  },
  mounted () {
    listAllFunctions().then((res) => {
      functions = res
      console.log('functions', functions)
      this.loading = true
      listAllMenu()
        .then((data) => {
          this.loading = false
          let plateMenu = data.filter(item => { return item.platCode === 'TOMS' })
          this.treeData = tree = menuDataTranslate(
            plateMenu,
            'menuId',
            'parentMenuId'
          )
          console.log(this.treeData)
          this.initMenuFunctionTree(tree, functions)
        })
        .catch((e) => {
          this.loading = false
          this.$confirmError(e)
        })
    })
  }
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  /* flex: 1; */
  width: 300px;
  /* display: flex; */
  align-items: center;
  font-size: 14px;
  padding-right: 8px;

  .checkbox {
    float: right;
  }

  .label {
    margin-right: 20px;
  }
}
</style>
