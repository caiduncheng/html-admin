<template>
  <div class="">
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      stripe
      style="width: 100%">
        <el-table-column
          prop="appVersionId"
          header-align="center"
          align="center"
          min-width="110px"
          :label="$t('appstore.application.appVersionId')">
        </el-table-column>
        <el-table-column
          prop="appVersion"
          header-align="center"
          align="center"
          min-width="110px"
          :label="$t('appstore.application.appVersion')">
        </el-table-column>
        <el-table-column
          prop="submitTime"
          :formatter="formatDate"
          header-align="center"
          align="center"
          min-width="120px"
          :label="$t('appstore.application.submitTime')">
        </el-table-column>
        <el-table-column
          prop="releaseTime"
          :formatter="formatDate"
          header-align="center"
          align="center"
          min-width="120px"
          :label="$t('appstore.application.releaseTime')">
        </el-table-column>
        <el-table-column
          prop="releaseType"
          header-align="center"
          align="center"
          min-width="120px"
          :label="$t('appstore.application.releaseType')">
          <template slot-scope="scope">
            <label type="text" v-if="scope.row.releaseType === 1">{{$t('appstore.application.releaseType1')}}</label>
            <label type="text" v-if="scope.row.releaseType === 2">{{$t('appstore.application.releaseType2')}}</label>
            <label type="text" v-if="scope.row.releaseType === 3">{{$t('appstore.application.releaseType3')}}</label>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          header-align="center"
          align="center"
          min-width="140px"
          :label="$t('appstore.application.status')">
          <template slot-scope="scope">
            <label type="text">{{ handleStatus(scope.row.status) }}</label>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          min-width="100px"
          fixed="right"
          :label="$t('common.operate')">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="$t('common.detail')" placement="top">
              <el-button type="text" @click="showDetailHandle(scope.row.appId, scope.row.appVersionId)"><i class="el-icon-info"></i></el-button>
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
    <app-version-detail v-if="appVersionDetailVisible" ref="appVersionDetail" @close="appVersionDetailVisible = false" @refreshDataList='refreshData'></app-version-detail>
  </div>
</template>
<script>
  import {appVersionList} from '@/api/developer-app'
  import appVersionDetail from './app-version-detail'
  import {formatDate} from '@/utils/formatDate'

  export default {
    data () {
      return {
        dataList: [],
        appId: 0,
        pageNo: 1,
        pageSize: 10,
        rows: 0,
        appVersionDetailVisible: false,
        dataListLoading: false
      }
    },
    components: {
      appVersionDetail
    },
    methods: {
      init (id) {
        this.visible = true
        this.appId = id
        this.getAppVersionList()
      },
      refreshData () {
        this.getAppVersionList()
        this.$emit('refreshData')
      },
      handleStatus (status) {
        if (status === 9) {
          return this.$t('developer_app.version_status_option[0].label')
        } else if (status === 7) {
          return this.$t('developer_app.version_status_option[1].label')
        } else if (status === 6) {
          return this.$t('developer_app.version_status_option[2].label')
        } else if (status === 5) {
          return this.$t('developer_app.version_status_option[3].label')
        } else if (status === 2) {
          return this.$t('developer_app.version_status_option[4].label')
        } else if (status === 1) {
          return this.$t('developer_app.version_status_option[5].label')
        } else if (status === 0) {
          return this.$t('developer_app.version_status_option[6].label')
        }
      },
      getAppVersionList () {
        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
        this.dataListLoading = true
        appVersionList(this.appId, params).then(data => {
          console.log('versionList', data.data)
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
        this.getAppVersionList()
      },
      currentChangeHandle (val) {
        this.pageNo = val
        this.getAppVersionList()
      },
      showDetailHandle (appId, appVersionId) {
        this.appVersionDetailVisible = true
        this.$nextTick(() => {
          this.$refs.appVersionDetail.init(appId, appVersionId)
        })
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
