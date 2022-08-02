/* eslint-disable */
class ChartOption {
  getHomeLineOption () {
    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#f7f8f9',
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
        textStyle: {
          color: '#778ca2'
        },
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: '#346cb01a'
          }
        }
      },
      grid: {
        left: 70,
        right: 70
      },
      legend: {
        data: ['下载次数', '使用次数']
      },
      // x轴
      xAxis: {
        type: 'category', // 坐标轴类型
        // name: '日期',
        data: [],
        axisPointer: {
          label: {
            backgroundColor: '#6e7079'
          },
          lineStyle: {
            color: '#6e7079'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#ccc'
          }
        },
        boundaryGap: false
      },
      yAxis: [
        {
          type: 'value',
          name: 'count',
          splitNumber: 4,
          // max: 10000,
          // interval: 2000,
          axisLine: {
            show: false
          },
          axisLabel: {
            color: '#ccc',
            formatter: '{value}'
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#eee'
            }
          },
          nameTextStyle: {
            color: '#778ca2'
          }
        }
      ],
      // 折线数据
      series: [
        {
          name: '下载次数',
          data: [],
          type: 'line',
          smooth: true,
          stack: '下载次数',
          itemStyle: {
            color: '#00a28a'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#00a28a' // 0% 处的颜色
              }, {
                offset: 1, color: '#00a28a1a' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        },
        {
          name: '使用次数',
          data: [],
          type: 'line',
          smooth: true,
          stack: '使用次数',
          itemStyle: {
            color: '#5f4b8b'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#5f4b8b' // 0% 处的颜色
              }, {
                offset: 1, color: '#5f4b8b24' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        }
      ]
    }
    return option
  }

  getHomePieOption () {
    var option = {
      backgroundColor: '#fff',
      title: {
          left: 'center',
          top: 20,
          textStyle: {
              color: '#ccc'
          }
      },
  
      tooltip: {
          trigger: 'item'
      },
  
      visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
              colorLightness: [0, 1]
          }
      },
      series: [
          {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data: [
                  {value: 335, name: '购买'},
                  {value: 310, name: '订阅'},
                  {value: 274, name: '预约'},
                  {value: 235, name: '退货'},
                  {value: 400, name: '搜索引擎'}
              ].sort(function (a, b) { return a.value - b.value; }),
              roseType: 'radius',
              label: {
                  color: ''
              },
              labelLine: {
                  lineStyle: {
                      color: ''
                  },
                  smooth: 0.2,
                  length: 10,
                  length2: 20
              },
              itemStyle: {
                  color: '',
                  shadowBlur: 200,
                  shadowColor: '#fff'
              },
              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                  return Math.random() * 200;
              }
          }
      ]
  }
  return option
  }
}
export default new ChartOption()
