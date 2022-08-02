<template>
  <el-dialog :visible='visible' @close='handleClose' title='Terminal list' width='20%'>
    <el-table
      :data="dataList"
      v-loading="dataListLoading"
      border
      ref="multipleTable"
      style="margin-top: 2%; width: 100%;"
      @selection-change="handleSelectionChange"
      >
      <el-table-column
        prop="devSn"
        header-align="center"
        align="center"
        :label="$t('device.sn')">
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
  </el-dialog>
</template>

<script>
import {grayscalePage} from '@/api/sysapp'

export default {
  data () {
    return {
      visible: false,
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
      this.id = id
      this.visible = true
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
    getDataList () {
      this.dataListLoading = true
      grayscalePage(this.id, {pageNo: this.pageNo, pageSize: this.pageSize}).then(data => {
        this.dataList = data.data
        console.log(this.dataList)
        this.rows = data.rows
      })
      this.dataListLoading = false
    },
    handleSelectionChange (val) {
      this.dataListSelections = val
    },
    handleClose () {
      this.visible = false
      this.$emit('close')
    }
  }
}
</script>
