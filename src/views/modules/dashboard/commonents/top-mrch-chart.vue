<template>
  <div style="width: 1200px; height: 500px; padding-top: 5px">
    <el-empty v-if="emptyVisible" :description="$t('common.empty_tip')"/>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import resize from '@/mixins/resize'
import {operatortopMerchant} from '../../../../api'

export default {
  mixins: [resize],
  data () {
    return {
      xAxisData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      series: [],
      seriesMrchData: [],
      seriesActiveMrchData: [],
      chart: null,
      emptyVisible: false,
      legend: [],
      nameA: '商户数'
    }
  },
  mounted () {
    // this.devSn = this.$route.params.sn
    /* this.$nextTick(() => {
      this.initData()
    }) */
  },
  methods: {
    initData () {
      operatortopMerchant().then((res) => {
        this.xAxisData = res.xaxisData
        console.log(this.xAxisData)
        if (this.xAxisData) {
          this.seriesMrchData = res.seriesMrchData
          this.seriesActiveMrchData = res.seriesActiveMrchData
          this.initChart()
        } else {
          this.emptyVisible = true
        }
      }).catch(e => {

      })
      this.initChart()
    },
    initChart () {
      this.chart = echarts.init(this.$el)
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Number of merchants', 'Active merchants']
        },

        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: this.xAxisData
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Number of merchants',
            type: 'bar',
            data: this.seriesMrchData
          },
          {
            name: 'Active merchants',
            type: 'bar',
            data: this.seriesActiveMrchData
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
