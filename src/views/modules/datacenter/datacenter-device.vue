<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <div>
          <el-card>
            <div slot="header" style="font-size: 20px">
              <span>{{ $t('data_center.new_terminal_count') }}</span>
              <chart-data-filter ref="chartDataFilter" @confirm="resetChartData" chartName="newTerminalCountChart"/>
            </div>
            <new-terminal-count-chart ref="newTerminalCountChart"/>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div>

          <el-card>
            <div slot="header" style="font-size: 20px">
              <span>{{ $t('data_center.active_terminal_count') }}</span>
              <chart-data-month-filter ref="chartDataFilter" @confirm="resetChartData" chartName="activeTerminalCountChart"/>
            </div>
            <active-terminal-count-chart ref="activeTerminalCountChart"/>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div style="padding-top: 10px">

          <el-card>
            <div slot="header" style="font-size: 20px">
              <span>{{ $t('data_center.terminal_total_count') }}</span>
<!--              <chart-data-filter ref="chartDataFilter" @confirm="resetChartData" chartName="terminalTotalCountChart"/>-->
            </div>
            <terminal-total-count-chart ref="terminalTotalCountChart"/>
          </el-card>
        </div>
      </el-col>

    </el-row>

  </div>
</template>
<script>
import NewTerminalCountChart from './components/new-terminal-count-chart'
import ActiveTerminalCountChart from './components/active-terminal-count-chart'
import TerminalTotalCountChart from './components/terminal-total-count-chart'

import ChartDataFilter from './setting/chart-data-filter'
import ChartDataMonthFilter from './setting/chart-data-month-filter'

export default {
  components: {
    NewTerminalCountChart,
    ActiveTerminalCountChart,
    TerminalTotalCountChart,
    ChartDataFilter,
    ChartDataMonthFilter
  },
  mounted () {

  },
  data () {
    return {}
  },
  methods: {
    init () {
      this.$refs.newTerminalCountChart.initData()
      this.$refs.activeTerminalCountChart.initData()
      this.$refs.terminalTotalCountChart.initData()
    },
    resetChartData (dateUnit, timeRange, chartName) {
      if (chartName === 'newTerminalCountChart') {
        this.$refs.newTerminalCountChart.initData(dateUnit, timeRange)
      } else if (chartName === 'activeTerminalCountChart') {
        this.$refs.activeTerminalCountChart.initData(dateUnit, timeRange)
      } else if (chartName === 'terminalTotalCountChart') {
        this.$refs.terminalTotalCountChart.initData(dateUnit, timeRange)
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

