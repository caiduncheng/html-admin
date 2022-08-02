<template>
  <el-dialog :visible='visible' @close='handleClose' title='Bind Operator' width='50%'>
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-input v-model="dataForm.operatorName" placeholder='operator name' clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getDataList(pageNo = 1)"></el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      v-loading="dataListLoading"
      border
      ref="multipleTable"
      style="margin-top: 2%; width: 100%;"
      @selection-change="handleSelectionChange"
      >
      <el-table-column
        type="selection"
        width="40">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        :label="$t('group.operator.name')">
      </el-table-column>
      <el-table-column
        prop="linkman"
        header-align="center"
        align="center"
        :label="$t('group.operator.linkMan')">
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
    </el-table>

    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNo"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="rows"
      style="margin-left: 2%; margin-top: 1%"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <div align="center" style="margin: 10px 0 10px 0">
      <span>
        <el-button type='danger'  @click="handleClose">{{$t('common.cancel')}}</el-button>
        <el-button type='primary' :loading="comfirmLoading" @click="dataFormSubmit">{{$t('common.confirm')}}</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import {formatDate} from '@/utils/formatDate'
import {unBindOperatorPage, appBindOperator} from '@/api/whitelist'

export default {
  data () {
    return {
      visible: false,
      comfirmLoading: false,
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
    init (id) {
      console.log(id)
      this.id = id
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
      let params = {
        operatorName: this.dataForm.operatorName,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      console.log(params)
      unBindOperatorPage(this.id, params).then(data => {
        this.dataListLoading = false
        console.log(data.data)
        this.dataList = data.data
        this.rows = data.rows
      }).catch((e) => {
        this.loading = false
        this.dataListLoading = false
      })
    },
    handleSelectionChange (val) {
      this.dataListSelections = val
    },
    handleClose () {
      this.visible = false
      this.comfirmLoading = false
    },
    dataFormSubmit () {
      let operatorIds = []
      this.dataListSelections.map(i => {
        operatorIds.push(i.operatorId)
      })
      if (operatorIds.length === 0) {
        this.$message.error(this.$t('white_list.tipSelectOper'))
        return false
      }
      let param = {
        operatorIds: operatorIds
      }
      this.comfirmLoading = true
      appBindOperator(this.id, param).then(data => {
        this.comfirmLoading = false
        this.cancel()
        this.$emit('refreshDataList')
      }).catch((e) => {
        this.comfirmLoading = false
        this.visible = true
      })
    }
  }
}
</script>
