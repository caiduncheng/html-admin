<template>
  <el-dialog :visible='visible' @close='handleClose' :title="$t('group.bindOperator')" width='50%'>
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-input v-model="dataForm.operatorName" :placeholder="$t('operator.name')" clearable></el-input>
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
        prop="operatorName"
        header-align="center"
        align="center"
        :label="$t('group.operator.name')">
      </el-table-column>
      <el-table-column
        prop="linkMan"
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
          <el-button type='danger'  @click='visible = false'>{{$t('common.cancel')}}</el-button>
          <el-button type='primary' :loading="loading" @click="dataFormSubmit">{{$t('common.confirm')}}</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import {formatDate} from '@/utils/formatDate'
import {unBindOperatorPage, addgroupOperator} from '@/api/group'

export default {
  props: {
    visible: Boolean
  },
  data () {
    return {
      groupId: '',
      dataForm: {
        operatorName: '',
        appPkgName: '',
        pubKey: '',
        radio: {},
        quantity: 0,
        effectTimestamp: '',
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
      this.groupId = id
      this.dataForm.operatorName = ''
      this.visible = true
      this.loading = false
      this.dataListLoading = false
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
      this.pageNo = val
      this.getDataList()
    },
    formatDate (cellValue, fmt) {
      cellValue = new Date(cellValue).valueOf()
      return formatDate(cellValue, fmt)
    },
    getDataList () {
      this.loading = true
      let params = {
        operatorName: this.dataForm.operatorName,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      unBindOperatorPage(params).then(data => {
        console.log(data.data)
        this.dataList = data.data
        this.rows = data.rows
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
      this.dataListLoading = false
    },
    handleSelectionChange (val) {
      this.dataListSelections = val
    },
    handleClose () {
      this.$emit('close')
    },
    dataFormSubmit () {
      this.dataListLoading = true
      let operatorIds = []
      this.dataListSelections.map(i => {
        operatorIds.push(i.operatorId)
      })
      if (operatorIds.length === 0) {
        this.$message.error('Please select an operator')
        return false
      }
      let param = {
        operatorIds: operatorIds
      }
      addgroupOperator(this.groupId, param).then(data => {
        this.dataListLoading = false
        this.$emit('close')
        this.$emit('refreshDataList')
      }).catch((e) => {
        this.dataListLoading = false
        this.visible = true
      })
    }
  }
}
</script>
