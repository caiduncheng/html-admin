<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-select v-model="dataForm.status" :placeholder="$t('merchant.status')" clearable>
          <el-option :label="$t('merchant.normal')" value="1"></el-option>
          <el-option :label="$t('merchant.locked')" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.condition" :placeholder="$t('merchant.condition')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList(pageNo = 1)" icon="el-icon-search">{{ $t('common.query') }}</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      v-loading="dataListLoading"
      border
      style="width: 100%;">
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        min-width="120px"
        :label="$t('merchant.name')">
      </el-table-column>
      <el-table-column
        prop="keyName"
        header-align="center"
        align="center"
        min-width="120px"
        :label="$t('merchant.operator')">
      </el-table-column>
      <el-table-column
        prop="countryCode"
        :formatter="formatCountry"
        header-align="center"
        align="center"
        min-width="100px"
        :label="$t('merchant.countryName')">
      </el-table-column>
      <el-table-column
        prop="cityName"
        header-align="center"
        align="center"
        min-width="100px"
        :label="$t('merchant.cityName')">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        min-width="85px"
        :label="$t('merchant.status')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" size="small">{{$t('merchant.normal')}}</el-tag>
          <el-tag v-if="scope.row.status === 0" size="small" type="info">{{$t('merchant.locked')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="creTime"
        header-align="center"
        align="center"
        min-width="110px"
        :label="$t('merchant.creTime')">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="bottom">
            <div slot="content">
              <span>{{formatDate(scope.row.creTime, 'yyyy-MM-dd hh:mm:ss')}}</span>
            </div>
            <label>{{formatDate(scope.row.creTime, 'yyyy-MM-dd')}}</label>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('merchant.StatisticsOnApp')">
        <el-table-column
          prop="buyCount"
          header-align="center"
          align="center"
          min-width="80px"
          :label="$t('merchant.buyCount')">
        </el-table-column>
        <el-table-column
          prop="subscribeCount"
          header-align="center"
          align="center"
          min-width="100px"
          :label="$t('merchant.subscribeCount')">
        </el-table-column>
        <el-table-column
          prop="appCount"
          header-align="center"
          align="center"
          min-width="80px"
          :label="$t('merchant.appCount')">
        </el-table-column>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        min-width="95px"
        :label="$t('common.operate')">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="$t('common.detail')" placement="top">
            <el-button type="text" @click="showDetailHandle(scope.row.mrchId)"><i class="el-icon-info"></i></el-button>
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
    <detail v-if="detailVisible" ref="detail" @refreshDataList="getDataList"></detail>
  </div>
</template>

<script>
import {merchantList} from '@/api/merchant'
import {formatDate} from '@/utils/formatDate'
import {formatCountry} from '@/utils/formatCountry'
import detail from './detail'

export default {
  data () {
    return {
      dataForm: {
        status: '',
        isChina: 1,
        condition: '',
        countryCode: ''
      },
      dataList: [],
      pageNo: 1,
      pageSize: 10,
      rows: 0,
      orderListLoading: false,
      detailVisible: false,
      dataListLoading: false
    }
  },
  components: {
    detail
  },
  activated () {
    this.getDataList()
  },
  methods: {
    getDataList () {
      this.dataListLoading = true
      let params = {
        'pageNo': this.pageNo,
        'pageSize': this.pageSize,
        'status': this.dataForm.status,
        'condition': this.dataForm.condition
      }
      merchantList(params).then(data => {
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
      this.getDataList()
    },
    currentChangeHandle (val) {
      this.pageNo = val
      this.getDataList()
    },
    showDetailHandle (id) {
      this.detailVisible = true
      this.$nextTick(() => {
        this.$refs.detail.init(id)
      })
    },
    cancel () {
      this.visible = false
      this.$emit('close')
    },
    formatDate (cellValue, fmt) {
      cellValue = new Date(cellValue).valueOf()
      return formatDate(cellValue, fmt)
    },
    formatCountry (row, column, cellValue, index) {
      return formatCountry(cellValue)
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-form-item {
    margin-bottom: 10px;
  }
  .el-form {
    margin-top: 10px;
  }
  .el-pagination {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
