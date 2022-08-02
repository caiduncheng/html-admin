<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.appName" :placeholder="$t('appstore.application.appName')" clearable></el-input>
        </el-form-item>
        <el-select v-model="dataForm.chargeStrategy" clearable :placeholder="$t('appstore.application.chargeStrategy')">
          <el-option v-for="item in $t('appstore.application.chargeStrategyOption')"
                     :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList(pageNo = 1)" icon="el-icon-search">{{ $t('common.query') }}</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      style="width: 100%;">
      <el-table-column
        prop="appName"
        header-align="center"
        align="center"
        min-width="150"
        :label="$t('appstore.application.appName')">
      </el-table-column>
      <el-table-column
        prop="appVersion"
        header-align="center"
        align="center"
        min-width="120"
        :label="$t('appstore.application.appVersion')">
      </el-table-column>
      <el-table-column
        prop="creTime"
        header-align="center"
        align="center"
        min-width="100"
        :label="$t('appstore.application.creTime')">
      </el-table-column>
      <el-table-column
        prop="developerType"
        header-align="center"
        align="center"
        min-width="120"
        :label="$t('appstore.application.developerName')">
        <template slot-scope="scope">
          <label type="text" v-if="scope.row.developerType == '1'">{{scope.row.developerLastName}}</label>
          <label type="text">{{scope.row.developerFirstName}}</label>
        </template>
      </el-table-column>
      <el-table-column
        prop="chargeStrategy"
        header-align="center"
        align="center"
        min-width="120"
        :label="$t('appstore.application.chargeStrategy')">
        <template slot-scope="scope">
          <label type="text"
                 v-if="scope.row.chargeStrategy == '1'">{{$t('appstore.application.chargeStrategyFree')}}</label>
          <label type="text"
                 v-if="scope.row.chargeStrategy == '2'">{{$t('appstore.application.chargeStrategyBuy')}}</label>
          <label type="text" v-if="scope.row.chargeStrategy == '3' && scope.row.subscribeType == '1'">{{$t('appstore.application.chargeStrategySubscribe')
          + ' ' + $t('appstore.application.subscribeTypeByYear')}}</label>
          <label type="text" v-if="scope.row.chargeStrategy == '3' && scope.row.subscribeType == '3'">{{$t('appstore.application.chargeStrategySubscribe')
          + ' ' + $t('appstore.application.subscribeTypeByMonth')}}</label>
          <label type="text" v-if="scope.row.chargeStrategy == '3' && scope.row.subscribeType == '5'">{{$t('appstore.application.chargeStrategySubscribe')
          + ' ' + $t('appstore.application.subscribeTypeByWeek')}}</label>
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        header-align="center"
        align="center"
        min-width="120"
        :label="$t('appstore.application.amount')">
        <template slot-scope="scope">
          <label type="text">{{scope.row.currency}}</label>
          <label type="text">{{scope.row.amount}}</label>
        </template>
      </el-table-column>
      <el-table-column
        prop="devCount"
        header-align="center"
        align="center"
        min-width="120"
        :label="$t('appstore.application.devCount')">
      </el-table-column>
      <el-table-column
        prop="buyCount"
        header-align="center"
        align="center"
        min-width="120"
        :label="$t('appstore.application.buyCount')">
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

    <app-detail v-if="appDetailVisible" ref="appDetail" @refreshDataList="getDataList"
                @close="appDetailVisible = false"/>
    <app-version v-if="appVersionVisible" ref="appVersion" @refreshDataList="getDataList"
                 @close="appVersionVisible = false"/>
    <app-revision v-if="appRevisionVisible" ref="appRevision" @refreshDataList="getDataList"
                  @close="appRevisionVisible = false"/>
    <app-download v-if="appDownloadVisible" ref="appDownload" @refreshDataList="getDataList"
                  @close="appDownloadVisible = false"/>
    <app-purchase v-if="appPurchaseVisible" ref="appPurchase" @refreshDataList="getDataList"
                  @close="appPurchaseVisible = false"/>

  </div>
</template>

<script>
import {formatDateTime} from '@/utils'
import {developerAppList} from '@/api'
import AddOrUpdate from './developer-add-or-update'

export default {
  components: {
    AddOrUpdate
  },
  data () {
    return {
      dataForm: {
        name: '',
        developerType: null,
        status: null
      },
      addOrUpdateVisible: false,
      cardBindBankId: 0,
      dataList: [],
      pageNo: 1,
      pageSize: 10,
      rows: 0,
      dataListLoading: false,
      orderListLoading: false,
      agreementShowVisible: false
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      let params = {
        'pageNo': this.pageNo,
        'pageSize': this.pageSize,
        'developerType': this.dataForm.developerType,
        'status': this.dataForm.status,
        'name': this.dataForm.name
      }
      developerAppList(params).then(data => {
        this.dataList = data.data
        this.rows = data.rows
        this.dataListLoading = false
      }).catch(e => {
        // this.$message.error(e.message)
      })
    },
    creTimeFormat (row) {
      if (row && row.creTime) {
        var date = new Date(row.creTime)
        return formatDateTime(date, 'yyyy-MM-dd hh:mm:ss')
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
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    }
  }
}
</script>

<style lang="scss">
.develop-app {

}
</style>
