<template>
  <div>
    <el-table v-loading="dataListLoading" :data="dataList" border style="width: 100%;">
      <el-table-column
        prop="devSn"
        header-align="center"
        align="center"
        min-width="130px"
        :label="$t('appstore.application.devSn')">
      </el-table-column>
      <el-table-column
        prop="appVersion"
        header-align="center"
        align="center"
        min-width="120px"
        :label="$t('appstore.application.appVersion')">
      </el-table-column>
      <el-table-column
        prop="appVersionCode"
        header-align="center"
        align="center"
        min-width="120px"
        :label="$t('appstore.application.appVersionCode')">
      </el-table-column>
      <el-table-column
        prop="downloadTime"
        :formatter="formatDate"
        header-align="center"
        align="center"
        min-width="140px"
        :label="$t('appstore.application.downloadTime')">
      </el-table-column>
      <el-table-column
        prop="installTime"
        :formatter="formatDate"
        header-align="center"
        align="center"
        min-width="190px"
        :label="$t('appstore.application.installTime')">
      </el-table-column>
      <el-table-column
        prop="reason"
        header-align="center"
        align="center"
        min-width="170px"
        :label="$t('appstore.application.downloadReason')">
        <template slot-scope="scope">
          <label type="text" v-if="scope.row.reason === '1'">{{ $t('appstore.application.downloadReason1') }}</label>
          <label type="text" v-if="scope.row.reason === '2'">{{ $t('appstore.application.downloadReason2') }}</label>
        </template>
      </el-table-column>
      <el-table-column
        prop="oldAppVersion"
        header-align="center"
        align="center"
        min-width="140px"
        :label="$t('appstore.application.oldAppVersion')">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        min-width="165px"
        :label="$t('appstore.application.downloadStatus')">
        <template slot-scope="scope">
          <label type="text" v-if="scope.row.status === '1'">{{ $t('appstore.application.downloadStatus1') }}</label>
          <label type="text" v-if="scope.row.status === '2'">{{ $t('appstore.application.downloadStatus2') }}</label>
          <label type="text" v-if="scope.row.status === '3'">{{ $t('appstore.application.downloadStatus3') }}</label>
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
import {appDownloadList} from '@/api/developer-app'
import {formatDate} from '@/utils/formatDate'

export default {
  data () {
    return {
      dataList: [],
      appId: 0,
      pageNo: 1,
      pageSize: 10,
      rows: 0,
      dataListLoading: false
    }
  },
  methods: {
    init (id) {
      this.appId = id
      this.getAppDownloadList()
    },
    getAppDownloadList () {
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      this.dataListLoading = true
      appDownloadList(this.appId, params).then(data => {
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
      this.getAppDownloadList()
    },
    currentChangeHandle (val) {
      this.pageNo = val
      this.getAppDownloadList()
    },
    formatDate (row, column, cellValue, index) {
      return formatDate(cellValue, 'yyyy-MM-dd hh:mm:ss')
    }
  }
}
</script>
<style lang="scss">
.el-pagination {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
