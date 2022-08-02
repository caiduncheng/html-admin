<template>
  <div class="app-container">
    <el-form :inline="true" :model="dataForm">
<!--      <el-form-item>
        <el-input v-model="dataForm.operatorName" placeholder="Operator Name" clearable></el-input>
      </el-form-item>-->
      <el-form-item>
        <el-input v-model="dataForm.appPkgName" :placeholder="$t('white_list.application')"
                  maxlength="100"
                  @blur="() => dataForm.appPkgName = dataForm.appPkgName.trim()"
                  @keyup.enter.native="getDataList(pageNo = 1, dataForm.appPkgName.trim())"
                  clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList(pageNo = 1)" icon="el-icon-search" >{{ $t('common.query') }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border style="width: 100%;">
      <el-table-column
        prop="operatorName"
        header-align="center"
        align="center"
        min-width="80px"
        :label="$t('white_list.operatorName')"
      >
      </el-table-column>
      <el-table-column
        prop="appPkgName"
        header-align="center"
        align="center"
        min-width="80px"
        :label="$t('white_list.application')">
      </el-table-column>
      <el-table-column
        prop="creTime"
        header-align="center"
        :formatter="formatDate"
        align="center"
        min-width="80px"
        :label="$t('group.operator.bindTime')">
      </el-table-column>
      <el-table-column
        v-if="isAuth('10401000.MANAGE')"
        header-align="center"
        align="center"
        width="315"
        :label="$t('common.operate')">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="UnBind Operator" placement="top">
            <el-button style="color: #DC143C" @click="unBindHandle(scope.row.id, scope.row.operatorName)" icon="el-icon-delete"></el-button>
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
</template>
<script>
import {formatDate} from '@/utils/formatDate'
import {bindOperatorPage, appUnBindOperator} from '@/api/whitelist'

export default {
  data () {
    return {
      dataForm: {
        appPkgName: '',
        operatorName: ''
      },
      dataList: [],
      appId: 0,
      pageNo: 1,
      pageSize: 10,
      rows: 0,
      dataListLoading: false
    }
  },
  methods: {
    init () {
      this.dataList = []
      this.pageNo = 1
      this.getDataList()
    },
    formatDate (row, column, cellValue, index) {
      // return formatDate(row.creTime, 'yyyy-MM-dd  hh:mm:ss')
      return formatDate(cellValue, 'yyyy-MM-dd  hh:mm:ss')
    },
    getDataList (x, y) {
      if (y) {
        console.log('y:' + y.length)
        this.dataForm.appPkgName = y
      }
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        operatorName: this.dataForm.operatorName,
        appPkgName: this.dataForm.appPkgName
      }
      this.dataListLoading = true
      bindOperatorPage(params).then((data) => {
        this.dataList = data.data
        this.rows = data.rows
        this.dataListLoading = false
      }).catch(e => {
        this.dataListLoading = false
        console.log(`err:${JSON.stringify(e)}`)
      })
    },
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageNo = 1
      console.log('sizeChangeHandle')
      this.getDataList()
    },
    currentChangeHandle (val) {
      this.pageNo = val
      console.log('currentChangeHandle')
      this.getDataList()
    },
    unBindHandle (id, operatorName) {
      this.$confirm(this.$t('white_list.tipDeleteOperator', {operatorName: operatorName}), '', {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        appUnBindOperator(id).then((data) => {
          this.getDataList()
        }).catch(e => {
          this.dataListLoading = false
          console.log(`err:${JSON.stringify(e)}`)
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-pagination {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
