<template>
  <div>
    <el-card >
      <div slot="header" style="width: 1200px; font-size: 20px" >
        <span>{{ this.$t('dashboard.number_of_new_operators_in_the_last_30_days') }}</span>
      </div>
      <new-operator-linechart ref="newOperatorLinechart"/>
    </el-card>
    <el-card >
      <div slot="header" style="width: 1200px; font-size: 20px" >
        <span>{{ this.$t('dashboard.top_10_merchants_and_active_merchants') }}</span>
      </div>
      <top-mrch-chart ref="topMrchChart"/>
    </el-card>
  </div>
</template>
<script>
import NewOperatorLinechart from './commonents/new-operator-chart'
import TopMrchChart from './commonents/top-mrch-chart'

export default {
  components: {
    NewOperatorLinechart,
    TopMrchChart
  },
  data () {
    return {
      statusList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      dataForm: {
        appPkgName: '',
        operatorName: ''
      },
      dataList: [],
      appId: 0,
      pageNo: 1,
      pageSize: 10,
      rows: 0,
      dataListLoading: false
    }
  },
  methods: {
    init () {
      this.$refs.newOperatorLinechart.initData()
      this.$refs.topMrchChart.initData()
    }
  }
}
</script>
<style lang="scss" scoped>
.el-pagination {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
