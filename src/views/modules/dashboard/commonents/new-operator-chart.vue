<template>
  <div style="width: 1200px; height: 500px; padding-top: 5px">
    <el-empty v-if="emptyVisible" :description="$t('common.empty_tip')"/>
  </div>

</template>

<script>
import echarts from 'echarts'
import resize from '@/mixins/resize'
import {newOperatorCount} from '../../../../api'

export default {
  mixins: [resize],
  data () {
    return {
      xAxisData: [],
      series: [],
      chart: null,
      emptyVisible: false,
      legend: []
    }
  },
  mounted () {
  },
  methods: {
    initData () {
      newOperatorCount().then((res) => {
        this.xAxisData = res.xaxisData
        this.series = res.seriesData
        if (this.series != null && this.series.length > 0) {
          this.initChart()
        } else {
          this.emptyVisible = true
        }
      }).catch(e => {})
      // this.initChart()
    },
    initChart () {
      this.chart = echarts.init(this.$el)
      const option = {
        /* title: {
          text: this.$t('dashboard.number_of_new_operators_in_the_last_30_days')
          // subtext: '纯属虚构'
        }, */
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          // data: this.legend
          data: [this.$t('dashboard.number_of_merchants')]
        },
        /* toolbox: {
          show: true,
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {show: true, title: {line: 'Toggle - Line Chart', bar: 'Toggle - Column Chart'}, type: ['line', 'bar']},
            restore: {show: true, title: 'Restore'},
            saveAsImage: {show: true, title: 'Save Image'}
          }
        }, */
        calculable: true,
        xAxis: {
          axisLine: false,
          boundaryGap: false,
          axisLabel: {show: true, color: '#000000'},
          type: 'category',
          data: this.xAxisData
          // data: ['20220316', '20220317', '20220318', '20220319', '20220320', '20220321', '20220322', '20220323', '20220324', '20220325', '20220326', '20220327', '20220328', '20220329', '20220330', '20220331', '20220401', '20220402', '20220403', '20220404', '20220405', '20220406', '20220407', '20220408', '20220409', '20220410', '20220411', '20220412', '20220413', '20220414', '20220415']
        },
        yAxis: {
          type: 'value',
          minInterval: 1
          // axisLabel: {show: true, color: '#e0c009', formatter: '{value}'}
        },
        // series: this.series
        series: [
          {
            name: this.$t('dashboard.number_of_new_operators'),
            type: 'line',
            // data: [0, 0, 2, 0, 0, 0, 1, 34, 0, 0, 0, 22, 0, 0, 0, 0, 12, 0, 9, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            data: this.series
            /* markLine: {
              // axisLabel: {show: true, color: '#1241eb'},
              data: [
                {type: 'average', name: '平均值'}
              ]
            } */
          }
        ]
      }
      this.chart.setOption(option, true)
    }
  }
}
</script>

<style>
</style>
