<template>
  <div class="fty-box">
      <div class="search-box" style="margin-top: 10px">
        <el-form inline>
          <el-form-item>
            <el-input
              maxlength="64"
              v-model="condition"
              @blur="() => condition = condition.trim()"
              :placeholder="$t('role.role_label')"
              size="small"
              style="width: 250px"
              clearable
              @clear="fetchData(pageIndex = 1)"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="fetchData(pageIndex = 1)" class="p-1.5 align-middle" size="small">
              {{$t('common.query')}}
            </el-button>
            <el-button v-if="isAuth('10408004.MANAGE')" type="primary" @click="handleAdd()" class="p-1.5 align-middle" size="small">
              {{$t('common.add')}}
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :show-overflow-tooltip="true" v-loading="listLoading" :data="tableData" height="calc(100vh - 220px)" border>
        <el-table-column :label="$t('role.role_label')" prop="roleName" align="center" />

        <el-table-column header-align="center" :label="$t('role.role_user_amount')" align="center" prop="userCounts">
<!--          <template slot-scope="scope">1</template>-->
        </el-table-column>
        <el-table-column :label="$t('common.createTime')" prop="creTime" align="center">
          <template slot-scope="{ row }">
            <div :title="row.creTime | timeFilter">{{ row.creTime | dateFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="isAuth('10408004.MANAGE')"
          header-align="center"
          align="center"
          min-width="95px"
          :label="$t('common.operate')">
          <template slot-scope="scope">

            <el-tooltip class="item" effect="dark" :content="$t('common.modify')" placement="top">
              <el-button style="color: #FF7F50"  @click="handleEdit(scope.row)" icon="el-icon-edit" />
            </el-tooltip>


            <el-tooltip class="item" effect="dark" :content="$t('common.delete')" placement="top">
              <el-button  style="color: #DC143C" @click="handleDelete(scope.row)" icon="el-icon-delete"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <br>
      <el-pagination
        v-if="paginationShow"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10,15,30]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>

    <role-add
      :type="operationType"
      :role-id="editRoleId"
      @submit="fetchData"
      :visible.sync="addRoleVisible"
      :title="editRoleId ? $t('role.edit_role_title') : $t('role.add_role_title')"
    ></role-add>
  </div>
</template>

<script>
import { getRoleList, deleteRole } from '../../../api/role'
import { timeFilter, dateFilter } from '@/filters'
import RoleAdd from './role-add'
import { parseTime } from '@/utils'

export default {
  filters: {
    statusFilter (status) {
      const statusMap = {
        0: 'Invalid',
        1: 'Valid'
      }
      return statusMap[status]
    },
    timeFilter,
    dateFilter
  },
  components: {
    RoleAdd
  },
  data () {
    return {
      tableData: [],
      listLoading: false,
      selectedData: [],
      paginationShow: true,
      condition: '',
      pageIndex: 1,
      pageSize: 15,
      totalPage: 0,
      addRoleVisible: false,
      operationType: '',
      editRoleId: ''
    }
  },
  activated () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.listLoading = true
      getRoleList({
        pageNo: this.pageIndex,
        pageSize: this.pageSize,
        condition: this.condition
      }).then((res) => {
        this.listLoading = false
        this.tableData = res.data
        this.totalPage = res.rows
      }).catch((e) => {
        this.listLoading = false
        this.$confirmError(e)
      })
    },
    handleClick (val) {
      let command = val.command
      let row = val.row
      if (command === 'edit') {
        this.handleEdit(row)
      } else if (command === 'delete') {
        this.handleDelete(row)
      }
    },
    beforeHandleCommand (command, row) {
      return {
        row: row,
        command: command
      }
    },
    handleEdit (row) {
      this.editRoleId = row.roleId
      this.operationType = 'update'
      this.addRoleVisible = true
    },
    handleAdd () {
      this.editRoleId = ''
      this.operationType = 'add'
      this.addRoleVisible = true
    },
    handleDelete (row) {
      this.$confirm(
        this.$t('role.role_delete_confirm') +
          `[${row.roleName}]?`,
        this.$t('common.tips'),
        {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }
      ).then(() => {
        deleteRole(row.roleId).then(() => {
          this.$message({
            message: this.$t('role.delete_success'),
            type: 'success'
          })
          this.fetchData()
        }).catch(this.$confirmError)
      })
    },
    formatDate (row, column, cellValue, index) {
      return parseTime(cellValue, '{y}-{m}-{d}')
    },
    sizeChangeHandle (val) {
      this.pageSize = val
      this.fetchData()
    },
    currentChangeHandle (val) {
      this.pageIndex = val
      this.fetchData()
    }
  }
}
</script>

<style lang="scss">
.terminal-list {
  .el-table .cell {
    /* height: 30px !important; */
  }
}
</style>

<style lang="scss" scoped>
.query-button {
  margin-left: 30px;
}
.svg-container {
  cursor: pointer;
  margin-top: 6px;
  margin-left: 20px;
  font-size: 24px;
  display: inline-block;
}

.pagination-wrapper {
  text-align: right;
}
</style>
