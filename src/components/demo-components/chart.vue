<template>
  <div class="report-bar" :style="{height: height}">
    <div :id="'chart_bar_' + name" :style="{width: '100%', height: '100%'}"></div>
  </div>
</template>

<script>
export default {
  props: ['name', 'height'],
  data () {
    return {
      dom: null,
      chart: null,
      timer: null
    }
  },
  methods: {
    waitLoadedEchart () {
      console.log('setinterval')
      if (this.$echarts) {
        console.log('echarts')
        clearInterval(this.timer)
        this.chart = this.$echarts.init(document.getElementById(`chart_bar_${this.name}`))
        let vm = this
        this.chart.on('click', function (params) { // 点击图表向外传点击数据
          vm.$emit('clickToGetParams', params)
        })
        this.drawCharts()
      }
    },
    init (option) {
      this.option = option
      // Object.assign(this.option, option)
      // debugger
      if (!this.chart) {
        this.dom = document.getElementById(`chart_bar_${this.name}`)
        this.timer = setInterval(() => {
          this.waitLoadedEchart()
        }, 1000)
      } else {
        this.clearCharts()
        this.drawCharts()
      }
    },
    drawCharts () {
      this.chart.setOption(this.option)
    },
    // 销毁实例
    disposeCharts () {
      this.$echarts.dispose(this.dom)
    },
    // 清空图表
    clearCharts () {
      // window.removeEventListener('resize', this.chartResize)
      if (this.chart) {
        this.chart.clear()
      }
    },
    chartResize () {
      this.chart.resize()
    }
  },
  mounted () {
  },
  beforeDestroy () {
    // window.removeEventListener('resize', this.chartResize)
  }
}
</script>

<style lang="scss" scoped>
.report-bar{
}
</style>

