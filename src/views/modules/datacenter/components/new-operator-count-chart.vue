<template>
  <div style="z-index:1;height: 500px; padding-top: 5px">
    <el-empty v-if="emptyVisible" :description="$t('common.empty_tip')"/>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import resize from '@/mixins/resize'
import {newOperatorCountTrend} from '../../../../api/statistic'

export default {
  name: 'newOperatorCountChart',
  mixins: [resize],
  data () {
    return {
      xAxisData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      series: [],
      seriesMrchData: [],
      seriesActiveMrchData: [],
      chart: null,
      emptyVisible: false,
      legend: []
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initData('Day', 7)
    })
  },
  methods: {
    initData (dateUnit, timeRange) {
      var params = {
        dateUnit: dateUnit,
        dateRange: timeRange
      }
      newOperatorCountTrend(params).then((res) => {
        var isEmpty = true
        for (var i = 0; i < res.yaxisData.length; i++) {
          if (res.yaxisData[i] !== 0) {
            isEmpty = false
            break
          }
        }
        if (isEmpty) {
          this.emptyVisible = true
        } else {
          this.initChart(res)
        }
      }).catch(e => {
      })
    },
    initChart (data) {
      this.chart = echarts.init(this.$el)
      this.option = {
        // title: {
        //   text: this.$t('dashboard.top_10_merchants_and_active_merchants'),
        //   subtext: '纯属虚构'
        // },

        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Number of new operators']
          // data: [this.$t('data_center.new_operator_count')]
        },
        toolbox: {
          show: true,
          feature: {
            mark: {show: true},
            dataView: {
              show: true,
              readOnly: true,
              title: 'Data View',
              lang: ['Data View', `<span id="${this.$options.name}">Close</span>`, 'Refresh'],
              optionToContent: function (opt) {
                var axisData = opt.xAxis[0].data
                var series = opt.series
                var tdHeads = '<td  style="padding:0 10px">Date</td>'
                series.forEach(function (item) {
                  tdHeads += '<td style="padding: 0 10px">' + item.name + '</td>'
                })
                var table = '<table id="dataView" border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center;width:95%;height:100%"><tbody><tr>' + tdHeads + '</tr>'
                var tdBodys = ''
                for (var i = 0, l = axisData.length; i < l; i++) {
                  for (var j = 0; j < series.length; j++) {
                    if (typeof (series[j].data[i]) === 'object') {
                      tdBodys += '<td>' + series[j].data[i].value + '</td>'
                    } else {
                      tdBodys += '<td>' + series[j].data[i] + '</td>'
                    }
                  }
                  table += '<tr><td style="padding: 0 10px">' + axisData[i] + '</td>' + tdBodys + '</tr>'
                  tdBodys = ''
                }
                table += '</tbody></table>'
                return table
              },
              contentToOption: function (opt) {
                console.log(opt)
              }

            },
            magicType: {
              show: true,
              title: {line: 'Toggle - Line Chart', bar: 'Toggle - Column Chart'},
              type: ['line', 'bar']
            },
            restore: {show: true, title: 'Restore'},
            saveAsImage: {show: true, title: 'Save Image'}
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: data.xaxisData
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Number of new operators',
            // name: this.$t('data_center.new_operator_count'),
            type: 'line',
            data: data.yaxisData
          }
        ]
      }
      this.chart.setOption(this.option, true)
    }
  }
}
</script>

<style>
</style>
