<template>
  <div>
    <el-card>
      <el-form :inline="true" :model="dataForm">
        <el-form-item style="margin-left: 2%">
          <el-input v-model="dataForm.operatorName" :placeholder="$t('operator.name')"
                    maxlength="32"
                    @blur="() => dataForm.operatorName = dataForm.operatorName.trim()"
                    @keyup.enter.native="getDataList(pageNo = 1)"
                    clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getDataList(pageNo = 1)"></el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="success" icon="el-icon-plus"  v-if="this.currentGroupId !== 1 && isAuth('10400800.MANAGE')" @click="bindOperatorHandle()">
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="dataList"
        v-loading="dataListLoading"
        border
        :cell-style="cellStyle"
        style="margin-left: 2%; width: 100%;">
        <el-table-column
          prop="operatorName"
          header-align="center"
          align="center"
          :label="$t('group.operator.name')">
        </el-table-column>
<!--        <el-table-column
          prop="creTime"
          header-align="center"
          align="center"
          :label="$t('group.operator.creTime')">
        </el-table-column>-->
        <el-table-column
          prop="creTime"
          header-align="center"
          align="center"
          :label="$t('group.operator.bindTime')">
          <template slot-scope="scope">
            <label>{{formatDate(scope.row.creTime, 'yyyy-MM-dd  hh:mm:ss')}}</label>
          </template>
        </el-table-column>
        <el-table-column
          v-if="this.currentGroupId !== 1 && isAuth('10400800.MANAGE')"
          header-align="center"
          align="center"
          :label="$t('common.operate')">
          <template slot-scope="scope">
            <el-button style="color: #DC143C" @click="deleteHandle(scope.row.operatorId, scope.row.operatorName)" icon="el-icon-delete"></el-button>
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
    </el-card>
    <add-operator :visible.sync='visible' @close='visible = false' ref="addOperator" @refreshDataList='refresh'> </add-operator>
  </div>
</template>

<script>
import {formatDate} from '@/utils/formatDate'
import {groupOperatorPage, delgroupOperator} from '@/api/group'
import AddOperator from './add-operator'

export default {
  props: [`groupId`],
  components: {
    AddOperator
  },
  data () {
    return {
      dataForm: {
        operatorName: ''
      },
      visible: false,
      currentGroupId: '',
      dataList: [],
      dataListLoading: false,
      pageNo: 1,
      pageSize: 10,
      rows: 0
    }
  },
  methods: {
    formatDate (cellValue, fmt) {
      cellValue = new Date(cellValue).valueOf()
      return formatDate(cellValue, fmt)
    },
    cellStyle ({row, column, rowIndex, columnIndex}) {
      let value = row[column.property]
      if (value != null) {
        if (column.property === 'creTime') {
          value = this.formatDate(row[column.property], 'yyyy-MM-dd hh:mm:ss')
        }
        if (value.length * 13 > column.width) {
          return 'font-size:' + (column.width * 0.95) / value.length + 'px'
        }
      }
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
    refresh () {
      this.pageNo = 1
      this.getDataList()
    },
    getDataList () {
      this.dataListLoading = true
      let params = {
        operatorName: this.dataForm.operatorName,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      groupOperatorPage(this.currentGroupId, params).then(data => {
        this.dataList = data.data
        this.rows = data.rows
        this.dataListLoading = false
      })
    },
    deleteHandle (operatorId, operatorName) {
      this.$confirm(this.$t('group.tipDeleteOperator', {operatorName: operatorName}), '', {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.dataListLoading = true
        delgroupOperator(this.groupId, operatorId).then(data => {
          this.getDataList()
        })
        this.dataListLoading = false
      })
    },
    bindOperatorHandle () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.addOperator.init(this.currentGroupId)
      })
    }
  },
  watch: {
    'groupId' (value) {
      if (value) {
        this.currentGroupId = value
        this.getDataList()
      }
    }
  }
}
</script>
