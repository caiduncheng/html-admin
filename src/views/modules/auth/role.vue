<template>
  <div>
    <div>
      <div>
        <h1>
          <i class="el-icon-user title-logo"/>
          Role
        </h1>
      </div>
      <div>
        <el-form :inline="true" :model="dataForm">
          <el-form-item>
            <el-input v-model="dataForm.groupName" placeholder='Role name' clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getDataList()" icon="el-icon-search"></el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="getDataList()" icon="el-icon-plus"></el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="dataList"
          v-loading="dataListLoading"
          border
          height="calc(100vh - 240px)"
          style="width: 100%;">
          <el-table-column
            prop="roleName"
            header-align="center"
            align="center"
            label="Role Name">
          </el-table-column>
          <el-table-column
            prop="remark"
            header-align="center"
            align="center"
            label="Remark">
          </el-table-column>
          <el-table-column label="Create Time" prop="creTime" align="center">
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            :label="$t('common.operate')">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="Modify" placement="top">
                <el-button style="color: #FF7F50"  @click="modifyHandle(scope.row.roleId)" icon="el-icon-edit" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="Delete Whitelist" placement="top">
                <el-button  style="color: #DC143C" @click="deleteHandle(scope.row.roleId)" icon="el-icon-delete"/>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageNo"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="rows"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data () {
    return {
      dataListLoading: false,
      dataList: [],
      dataForm: {},
      pageNo: 1,
      pageSize: 10,
      rows: 0
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    getDataList () {
      console.log(this.$store.state.common.menuFunctionList)
    },
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageNo = 1
      this.getDataList()
    },
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
