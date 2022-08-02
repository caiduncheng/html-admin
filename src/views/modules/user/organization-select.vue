<template>
  <el-select :disabled="disabled" ref="selectOrganization" v-model="orgId" :placeholder="$t('user.organization')" :size="size">
    <el-option
      :label="selectedNodeName"
      :value="orgId"
      class="option-style"
    >
      <el-tree
        class="filter-tree"
        :data="orgList"
        :props="defaultPropsSelect"
        default-expand-all
        @node-click="nodeClickSelect"
        :expand-on-click-node="false"
        ref="selectOrgTree"
        node-key="orgId"
      ></el-tree>
    </el-option>
  </el-select>
</template>

<script>
  import { getCurrentOrgs } from '../../../api/org'

  export default {
    name: 'organization-select',
    props: {
      /**
       * 默认的OrgId
       */
      defaultOrgId: String | Number,
      /**
       * 上级机构的OrgId，当都没有 选择时，则默认用此orgId向后台提交。
       */
      parentOrgId: String | Number,
      /**
       * 是否页面初始化的时候自动加密
       */
      autoInit: {
        type: Boolean,
        default: true
      },
      /**
       * 是否为禁用
       */
      disabled: {
        type: Boolean,
        default: false
      },
      /**
       * 框体大小， 空为默认大小，large：大号，small： 小号， mimi： 最小
       */
      size: {
        type: String,
        default: ''
      },
      /**
       * 外部直接传入list对象（已经是树结构）
       */
      listData: Array
    },
    data () {
      return {
        orgId: null,
        selectedNodeName: '',
        defaultPropsSelect: {
          children: 'children',
          label: 'orgName',
          isLeaf: false
        },
        orgList: [],
        currentOrg: {}
      }
    },
    methods: {
      nodeClickSelect (obj) {
        this.selectedNodeName = obj.orgName
        this.orgId = obj.orgId
        this.$refs.selectOrganization.blur()
        this.$emit('update:selectedOrg', obj)
      },
      buildTree (orgList, parentOrgId) {
        var retList = []
        if (orgList === undefined || orgList.length < 1) { return retList }
        for (let org of orgList) {
          if (org.orgId === this.defaultOrgId) {
            this.nodeClickSelect(org)
          }
          if (org.parentOrgId === parentOrgId) {
            org.children = this.buildTree(orgList, org.orgId)
            retList.push(org)
          }
        }
        return retList.length < 1 ? undefined : retList
      },
      initData () {
        console.log('listData:', this.listData)
        if (this.listData !== undefined) {
          this.handleData(this.listData)
        } else {
          if (this.autoInit) {
            console.log('auto init')
            getCurrentOrgs().then((res) => {
              console.log('defaultOrgId', this.defaultOrgId)
              this.handleData(res)
            })
          }
        }
      },
      handleData (list) {
        for (let org of list) {
          if (org.orgId === this.parentOrgId) {
            this.currentOrg = org
            break
          }
        }
        if (this.currentOrg.orgId !== undefined) {
          this.currentOrg.children = this.buildTree(list, this.currentOrg.orgId)
          this.orgList = [this.currentOrg]
        } else {
          this.orgList = this.buildTree(list, this.currentOrg.orgId)
        }
      },
      reset () {
        this.orgId = null
        this.selectedNodeName = ''
        this.currentOrg = {}
      }
    },
    mounted () {
      this.initData()
    }
  }
</script>

<style scoped>

</style>
