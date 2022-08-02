<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <div>
          <el-card>
            <div slot="header" style="font-size: 20px">
              <span>{{ $t('data_center.new_operator_count') }}</span>
              <chart-data-filter ref="chartDataFilter" @confirm="resetChartData" chartName="newOperatorCountChart"/>
            </div>
            <new-operator-count-chart ref="newOperatorCountChart"/>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div>

          <el-card>
            <div slot="header" style="font-size: 20px">
              <span>{{ $t('data_center.active_operator_count') }}</span>
              <chart-data-filter ref="chartDataFilter" @confirm="resetChartData" chartName="activeOperatorCountChart"/>
            </div>
            <active-operator-count-chart ref="activeOperatorCountChart"/>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div style="padding-top: 10px">

          <el-card>
            <div slot="header" style="font-size: 20px">
              <span>{{ $t('data_center.new_user_count') }}</span>
              <chart-data-filter ref="chartDataFilter" @confirm="resetChartData" chartName="newUserCountChart"/>
            </div>
            <new-user-count-chart ref="newUserCountChart"/>
          </el-card>
        </div>
      </el-col>

    </el-row>

  </div>
</template>
<script>
import NewOperatorCountChart from './components/new-operator-count-chart'
import ActiveOperatorCountChart from './components/active-operator-count-chart'
import NewUserCountChart from './components/new-user-count-chart'

import ChartDataFilter from './setting/chart-data-filter'

export default {
  components: {
    NewOperatorCountChart,
    ActiveOperatorCountChart,
    NewUserCountChart,
    ChartDataFilter
  },
  mounted () {

  },
  data () {
    return {}
  },
  methods: {
    init () {
      this.$refs.newOperatorCountChart.initData()
      this.$refs.activeOperatorCountChart.initData()
      this.$refs.newUserCountChart.initData()
    },
    resetChartData (dateUnit, timeRange, chartName) {
      if (chartName === 'newOperatorCountChart') {
        this.$refs.newOperatorCountChart.initData(dateUnit, timeRange)
      } else if (chartName === 'activeOperatorCountChart') {
        this.$refs.activeOperatorCountChart.initData(dateUnit, timeRange)
      } else if (chartName === 'newUserCountChart') {
        this.$refs.newUserCountChart.initData(dateUnit, timeRange)
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

