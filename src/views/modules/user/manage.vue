<template>
  <div class="fty-box">
    <div style="margin-top: 10px">
      <el-form inline>
        <el-form-item>
          <el-input
            maxlength="64"
            v-model="condition"
            @blur="() => condition = condition.trim()"
            :placeholder="$t('user.query_condition')"
            size="small"
            style="width: 250px"
            clearable
            @clear="fetchData"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="p-1.5 align-middle" size="small" @click="fetchData(pageIndex = 1)">
            {{$t('common.query')}}
          </el-button>
          <el-button v-if="isAuth('10408000.MANAGE')" type="primary" @click="handleAdd()" size="small" class="p-1.5 align-middle">
            {{$t('common.add')}}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
      <el-table :show-overflow-tooltip="true" v-loading="listLoading" :data="tableData" height="calc(100vh - 220px)" border>
<!--        <el-table-column prop="username" align="left" width="70px">-->
<!--          <template slot-scope="{ row }">-->
<!--            <div-->
<!--              class="user-list-avatar"-->
<!--            >-->
<!--              <img-->
<!--                :src="getLogo(row.logoUrl)"-->
<!--              />-->
<!--            </div>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column :label="$t('user.username')" prop="username" align="center" />
        <el-table-column :label="$t('user.user_type')" prop="characterCode" align="center"/>
        <el-table-column :label="$t('user.contact_name')" prop="name" align="center" />
        <el-table-column :label="$t('user.organization')" prop="orgName" align="center" />
        <el-table-column :label="$t('user.status')" prop="status" align="center">
          <template slot-scope="{ row }">
            <el-tag type="warning" v-if="row.status === 0">{{ row.status | statusFilter }}</el-tag>
            <el-tag type="success" v-if="row.status === 1">{{ row.status | statusFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.createTime')" prop="creTime" align="center">
          <template slot-scope="{ row }">
            <div :title="row.creTime | timeFilter">{{ row.creTime | dateFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('user.last_login_time')"
          prop="lastLoginTime"
          align="center"
        >
          <template slot-scope="{ row }">
            <div :title="row.lastLoginTime | timeFilter">{{ row.lastLoginTime | dateFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="isAuth('10408000.MANAGE')"
          header-align="center"
          align="center"
          min-width="95px"
          :label="$t('common.operate')">
          <template slot-scope="scope">

            <el-tooltip class="item" effect="dark" :content="$t('common.modify')" placement="top">
              <el-button style="color: #FF7F50"  v-if="scope.row.userId !== 1" @click="handleEdit(scope.row)" icon="el-icon-edit" />
            </el-tooltip>

            <el-tooltip class="item" effect="dark" :content="$t('user.lock')" placement="top">
              <el-button  v-if="scope.row.status === 1 && scope.row.userId !== 1" @click="handleLock(scope.row)" icon="el-icon-lock"/>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" :content="$t('user.unlock')" placement="top">
              <el-button style="color: #409EFF"  v-if="scope.row.status === 0 && scope.row.userId !== 1" @click="handleUnlock(scope.row)" icon="el-icon-unlock" />
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
    <user-add
      ref="userDialog"
      :type="operationType"
      :user-id="editUserId"
      @submit="fetchData"
      :visible.sync="addUserVisible"
      :title="editUserId ? $t('user.edit_user_title') : $t('user.add_user_title')"
    ></user-add>
  </div>
</template>

<script>
import { getUserPage, lockUser, unlockUser } from '../../../api/user'
import { timeFilter, dateFilter } from '../../../filters/index'
import UserAdd from './user-add'

export default {
  filters: {
    statusFilter (status) {
      const statusMap = {
        0: 'Locked',
        1: 'Valid'
      }
      return statusMap[status]
    },
    timeFilter,
    dateFilter
  },
  components: {
    UserAdd
  },
  data () {
    return {
      loginUserName: '',
      tableData: [],
      listLoading: false,
      selectedData: [],
      paginationShow: true,
      condition: '',
      pageIndex: 1,
      pageSize: 15,
      totalPage: 0,
      operationType: '',
      editUserId: '',
      addUserVisible: false
    }
  },
  activated () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.listLoading = true
      getUserPage({
        pageNo: this.pageIndex,
        pageSize: this.pageSize,
        status: '',
        condition: this.condition
      }).then((res) => {
        this.listLoading = false
        this.tableData = res.data
        this.totalPage = res.rows
      }).catch((e) => {
        this.listLoading = false
      })
    },
    handleLock (row) {
      this.$confirm(
        this.$t('user.sure_to_lock_user') +
          `[${row.email}]?`,
        this.$t('common.tips'),
        {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }
      ).then(() => {
        lockUser(row.userId).then((res) => {
          this.$message({
            message: this.$t('user.lock_success'),
            type: 'success'
          })
          this.fetchData()
        }).catch(this.$confirmError)
      })
    },
    handleUnlock (row) {
      this.$confirm(
        this.$t('user.sure_to_unlock_user') +
          `[${row.email}]?`,
        this.$t('common.tips'),
        {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }
      ).then(() => {
        unlockUser(row.userId).then((res) => {
          this.$message({
            message: this.$t('user.unlock_success'),
            type: 'success'
          })
          this.fetchData()
        }).catch(this.$confirmError)
      })
    },
    handleClick (val) {
      let command = val.command
      let row = val.row
      if (command === 'edit') {
        this.handleEdit(row)
      } else if (command === 'lock') {
        this.handleLock(row)
      } else if (command === 'unlock') {
        this.handleUnlock(row)
      }
    },
    beforeHandleCommand (command, row) {
      return {
        row: row,
        command: command
      }
    },
    handleEdit (row) {
      this.operationType = 'Update'
      this.editUserId = row.userId
      this.addUserVisible = true
      this.$refs.userDialog.init(row.userId)
    },
    handleAdd () {
      this.addUserVisible = true
      this.$refs.userDialog.init('')
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
.user-list-avatar {
  width: 43.8px;
  height: 43.8px;
  border-radius: 60px;
  overflow: hidden;
  margin: 5px;
  img {
    margin-right: 5px;
    border-radius: 50%;
  }
}
.pagination-wrapper {
  text-align: right;
}
</style>
