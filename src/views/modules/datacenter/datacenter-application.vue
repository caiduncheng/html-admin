<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <div>
          <el-card>
            <div slot="header" style="font-size: 20px">
              <span>{{ $t('data_center.appstore_new_app_version_count') }}</span>
              <chart-data-filter ref="chartDataFilter" @confirm="resetChartData"
                                 chartName="appstoreNewApplicationVersionCountChart"/>
            </div>
            <appstore-new-application-version-count-chart ref="appstoreNewApplicationVersionCountChart"/>
          </el-card>
        </div>
      </el-col>

      <el-col :span="12">
        <div>
          <el-card>
            <div slot="header" style="font-size: 20px">
              <span>{{ $t('data_center.new_app_version_count') }}</span>
              <chart-data-filter ref="chartDataFilter" @confirm="resetChartData"
                                 chartName="newApplicationVersionCountChart"/>
            </div>
            <new-application-version-count-chart ref="newApplicationVersionCountChart"/>
          </el-card>
        </div>
      </el-col>

      <el-col :span="12">
        <div style="padding-top: 10px">

          <el-card>
            <div slot="header" style="font-size: 20px">
              <span>{{ $t('data_center.appstore_new_app_download_trend') }}</span>
              <chart-data-filter ref="chartDataFilter" @confirm="resetChartData"
                                 chartName="appstoreNewApplicationDownloadCountChart"/>
            </div>
            <appstore-new-application-download-trend-chart ref="appstoreNewApplicationDownloadCountChart"/>
          </el-card>
        </div>
      </el-col>

      <el-col :span="12">
            <div style="padding-top: 10px">
                <el-card>
                    <div slot="header" style="font-size: 20px">
                        <span>{{$t('data_center.toms_app_new_download_trend') }}</span>
<!--                        <chart-data-filter ref="chartDataFilter" @confirm="resetChartData"
                                           chartName="tomsNewApplicationDownloadTrendChart"/>-->
                    </div>
                    <toms-new-application-download-trend-chart ref="tomsNewApplicationDownloadTrendChart"/>
                </el-card>
            </div>
        </el-col>

      <el-col :span="12">
            <div style="padding-top: 10px">
                <el-card>
                    <div slot="header" style="font-size: 20px">
                        <span>{{ $t('data_center.appstore_app_total_count') }}</span>
                    </div>
                    <appstore-application-total-count-chart ref="appstoreApplicationTotalCountChart"/>
                </el-card>
            </div>
        </el-col>

      <el-col :span="12">
        <div style="padding-top: 10px">

          <el-card>
            <div slot="header" style="font-size: 20px">
              <span>{{ $t('data_center.toms_app_total_count') }}</span>
            </div>
            <toms-application-total-count-chart ref="tomsApplicationTotalCountChart"/>
          </el-card>
        </div>
      </el-col>

      <el-col :span="12">
            <div style="padding-top: 10px">
                <el-card>
                    <div slot="header" style="font-size: 20px">
                        <span>{{ $t('data_center.appstore_app_download_total_count') }}</span>
                    </div>
                    <appstore-application-download-total-count-chart ref="appstoreApplicationDownloadTotalCountChart"/>
                </el-card>
            </div>
        </el-col>

      <el-col :span="12">
        <div style="padding-top: 10px">

          <el-card>
            <div slot="header" style="font-size: 20px">
              <span>{{ $t('data_center.toms_app_download_total_count') }}</span>
            </div>
            <toms-application-download-total-count-chart ref="tomsApplicationDownloadTotalCountChart"/>
          </el-card>
        </div>
      </el-col>

    </el-row>

  </div>
</template>
<script>
import NewApplicationVersionCountChart from './components/new-application-version-count-chart'
import AppstoreNewApplicationVersionCountChart from './components/appstore-new-application-version-count-chart'
import AppstoreNewApplicationDownloadTrendChart from './components/appstore-new-application-download-trend-chart'
import TomsNewApplicationDownloadTrendChart from './components/toms-new-application-download-trend-chart'

import TomsApplicationTotalCountChart from './components/toms-application-total-count-chart'
import TomsApplicationDownloadTotalCountChart from './components/toms-application-download-total-count-chart'
import AppstoreApplicationTotalCountChart from './components/appstore-application-total-count-chart'
import AppstoreApplicationDownloadTotalCountChart from './components/appstore-application-download-total-count-chart'

import ChartDataFilter from './setting/chart-data-filter'

export default {
  components: {
    NewApplicationVersionCountChart,
    AppstoreNewApplicationVersionCountChart,
    AppstoreNewApplicationDownloadTrendChart,
    TomsNewApplicationDownloadTrendChart,
    TomsApplicationDownloadTotalCountChart,
    AppstoreApplicationTotalCountChart,
    TomsApplicationTotalCountChart,
    AppstoreApplicationDownloadTotalCountChart,
    ChartDataFilter
  },
  mounted () {

  },
  data () {
    return {}
  },
  methods: {
    init () {
      this.$refs.newApplicationVersionCountChart.initData()
      this.$refs.appstoreNewApplicationVersionCountChart.initData()
      this.$refs.appstoreNewApplicationDownloadCountChart.initData()
      this.$refs.tomsNewApplicationDownloadTrendChart.initData()
      this.$refs.tomsApplicationTotalCountChart.initData()
      this.$refs.tomsApplicationDownloadTotalCountChart.initData()
      this.$refs.appstoreApplicationTotalCountChart.initData()
      this.$refs.appstoreApplicationDownloadTotalCountChart.initData()
    },
    resetChartData (dateUnit, timeRange, chartName) {
      if (chartName === 'newApplicationVersionCountChart') {
        this.$refs.newApplicationVersionCountChart.initData(dateUnit, timeRange)
      } else if (chartName === 'appstoreNewApplicationVersionCountChart') {
        this.$refs.appstoreNewApplicationVersionCountChart.initData(dateUnit, timeRange)
      } else if (chartName === 'appstoreNewApplicationDownloadCountChart') {
        this.$refs.appstoreNewApplicationDownloadCountChart.initData(dateUnit, timeRange)
      } else if (chartName === 'tomsNewApplicationDownloadTrendChart') {
        this.$refs.tomsNewApplicationDownloadTrendChart.initData(dateUnit, timeRange)
      } else if (chartName === 'tomsApplicationTotalCountChart') {
        this.$refs.tomsApplicationTotalCountChart.initData(dateUnit, timeRange)
      } else if (chartName === 'tomsApplicationDownloadTotalCountChart') {
        this.$refs.tomsApplicationDownloadTotalCountChart.initData(dateUnit, timeRange)
      } else if (chartName === 'appstoreApplicationTotalCountChart') {
        this.$refs.appstoreApplicationTotalCountChart.initData(dateUnit, timeRange)
      } else if (chartName === 'appstoreApplicationDownloadTotalCountChart') {
        this.$refs.appstoreApplicationDownloadTotalCountChart.initData(dateUnit, timeRange)
      }
      if (document.getElementById(chartName) !== null) {
        document.getElementById(chartName).parentNode.click()
      }
    }
  }
}
</script>
<style lang="scss" scoped>


</style>

