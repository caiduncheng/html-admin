<template>
  <el-dialog :visible='visible' @close='handleClose' title='Reset Password' width='50%'>
<!--    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-input v-model="dataForm.operatorName" placeholder='username' clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getDataList(pageNo = 1)"></el-button>
      </el-form-item>
    </el-form>-->
    <el-table
      :data="dataList"
      v-loading="dataListLoading"
      border
      ref="multipleTable"
      style="margin: 2% 0 2% 0"
      >
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="name">
      </el-table-column>
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="username">
      </el-table-column>
      <el-table-column
        prop="email"
        header-align="center"
        align="center"
        :label="$t('group.operator.email')">
      </el-table-column>
      <el-table-column
        prop="creTime"
        header-align="center"
        align="center"
        :label="$t('group.operator.creTime')">
        <template slot-scope="scope">
          <label>{{formatDate(scope.row.creTime, 'yyyy-MM-dd  hh:mm:ss')}}</label>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        :label="$t('common.operate')">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="$t('operator.resetPassBtn')" placement="top">
            <el-button v-if="isAuth('10408200.MANAGE')" @click="reset(scope.row.userId)">
              <icon-svg name="resetpassword"/>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

<!--    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNo"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="rows"
      style="margin-left: 2%; margin-top: 1%"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>-->
  </el-dialog>
</template>

<script>
import {formatDate} from '@/utils/formatDate'
import {getaccountList, resetPassword} from '../../../../api/operator'

export default {
  data () {
    return {
      visible: false,
      comfirmLoading: false,
      operatorId: 0,
      operatorType: '',
      dataForm: {
        operatorName: '',
        appPkgName: '',
        pubKey: '',
        remark: ''
      },
      dataList: [],
      dataListSelections: [],
      dataListLoading: false,
      pageNo: 1,
      pageSize: 10,
      rows: 0
    }
  },
  created () {

  },
  methods: {
    init (id, operatorType) {
      this.operatorType = operatorType
      this.operatorId = id
      this.visible = true
      this.dataList = []
      this.pageNo = 1
      this.getDataList()
    },
    cancel () {
      this.visible = false
      this.$emit('close')
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageNo = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      console.log(val)
      this.pageNo = val
      this.getDataList()
    },
    formatDate (cellValue, fmt) {
      cellValue = new Date(cellValue).valueOf()
      return formatDate(cellValue, fmt)
    },
    getDataList () {
      this.dataListLoading = true
      getaccountList({'characterCode': 'OPERATOR', 'keyId': this.operatorId}).then(data => {
        console.log(data)
        this.dataListLoading = false
        this.dataList = data
      }).catch((e) => {
        this.loading = false
        this.dataListLoading = false
      })
    },
    handleClose () {
      this.visible = false
      this.comfirmLoading = false
    },
    reset (userId) {
      if (this.operatorType === 'DEMO') {
        console.log(this.operatorType)
        this.$confirm(this.$t('operator.resetDefaultConfirm'), '', {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          this.resetPasswordHanle(userId)
        })
      } else {
        this.$confirm(this.$t('operator.resetConfirm'), '', {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          this.resetPasswordHanle(userId)
        })
      }
    },
    resetPasswordHanle (userId) {
      resetPassword(userId).then(data => {
        this.$message({
          type: 'success',
          message: this.$t('common.success')
        })
      })
    }
  }
}
</script>
