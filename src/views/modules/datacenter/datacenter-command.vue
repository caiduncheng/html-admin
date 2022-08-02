<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <div>
          <el-card>
            <div slot="header" style="font-size: 20px">
              <span>{{ $t('data_center.flydesk_cmd_new_usage_times') }}</span>
              <chart-data-filter ref="chartDataFilter" @confirm="resetChartData"
                                 chartName="flydeskCommandNewUsageTimesChart"/>
            </div>
            <flydesk-command-new-usage-times-chart ref="flydeskCommandNewUsageTimesChart"/>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div>

          <el-card>
            <div slot="header" style="font-size: 20px">
              <span>{{ $t('data_center.flykey_cmd_new_usage_times') }}</span>
              <chart-data-filter ref="chartDataFilter" @confirm="resetChartData"
                                 chartName="flykeyCommandNewUsageTimesChart"/>
            </div>
            <flykey-command-new-usage-times-chart ref="flykeyCommandNewUsageTimesChart"/>
          </el-card>
        </div>
      </el-col>
    </el-row>

  </div>
</template>
<script>
import FlydeskCommandNewUsageTimesChart from './components/flydesk-command-new-usage-times-chart'
import FlykeyCommandNewUsageTimesChart from './components/flykey-command-new-usage-times-chart'

import ChartDataFilter from './setting/chart-data-filter'

export default {
  components: {
    FlydeskCommandNewUsageTimesChart,
    FlykeyCommandNewUsageTimesChart,
    ChartDataFilter
  },
  mounted () {

  },
  data () {
    return {}
  },
  methods: {
    init () {
      this.$refs.flydeskCommandNewUsageTimesChart.initData()
      this.$refs.flykeyCommandNewUsageTimesChart.initData()
    },
    resetChartData (dateUnit, timeRange, chartName) {
      if (chartName === 'flydeskCommandNewUsageTimesChart') {
        this.$refs.flydeskCommandNewUsageTimesChart.initData(dateUnit, timeRange)
      } else if (chartName === 'flykeyCommandNewUsageTimesChart') {
        this.$refs.flykeyCommandNewUsageTimesChart.initData(dateUnit, timeRange)
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

