<template>
  <el-popover
    ref="popover"
    placement="bottom"
    :popper-options="{ boundariesElement: 'viewport', removeOnDestroy: true }"
    popper-class="setting_popover"
    width="500"
    trigger="click"
    v-model="visible">
    <div slot="reference" style="float: right; cursor:pointer;">
      <span style="font-size: 3px">{{this.timeRange + '' + this.dateUnit}}</span>
      <svg style="width:15px" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-funnel"
           viewBox="0 0 16 16" id="icon-funnel">
        <path
          d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z"></path>
      </svg>

    </div>
    <h2 class="mb-3 mt-2" style="width: 100%; font-size: 1.2em; text-align: center;">Filter Settings</h2>

    <div class="filter-title flex justify-between">
      <span>Date Unit: </span>
      <div style="float: right;position: absolute; right: 12px;">
        <template>
          <el-radio v-model="dateUnit" label="Day" @change="changeDateUnit"> Day</el-radio>
          <el-radio v-model="dateUnit" label="Month" @change="changeDateUnit">Month</el-radio>

        </template>

      </div>
    </div>

    <div v-show="this.dateUnit === 'Day'" class="filter-title flex justify-between">
      <span>Time Range: </span>
      <div style="float: right;position: absolute; right: 12px;">
        <template>
          <el-radio v-model="timeRange" label="7" @change="changeTimeRange"> 7 Day</el-radio>
          <el-radio v-model="timeRange" label="14" @change="changeTimeRange">14 Day</el-radio>
        </template>
      </div>
    </div>

    <div v-show="this.dateUnit === 'Month'" class="filter-title flex justify-between">
      <span>Time Range: </span>
      <div style="float: right;position: absolute; right: 12px;">
        <template>
          <el-radio v-model="timeRange" label="3" @change="changeTimeRange"> 3 Month</el-radio>
          <el-radio v-model="timeRange" label="6" @change="changeTimeRange">6 Month</el-radio>
          <el-radio v-model="timeRange" label="12" @change="changeTimeRange">12 Month</el-radio>
        </template>
      </div>
    </div>

    <div style="float: right; margin-top: 10px;">
      <el-button size="small" type="primary" @click="returnConfig()">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-popover>
</template>

<script>
// import { getDomainValue, setDomainValue } from './local-storage-util'
// import {
//   selectAllModel
// } from '@/api/datacenter'

export default {
  name: 'ChartDataFilter',
  props: {
    models: Array,
    chartName: String
  },

  component: [
    // setDomainValue,
    // getDomainValue
  ],
  data () {
    return {
      visible: false,
      dateUnit: 'Day',
      timeRange: '7'
    }
  },
  computed: {
    dateFilterData () {
      return [
        {
          'label': this.$t('common.day'),
          'value': 'Day',
          'range': [7, 14]
        },
        {
          'label': this.$t('common.month'),
          'value': 'Month',
          'range': [3, 6, 12]
        }
      ]
    }
  },
  mounted () {
  },
  methods: {
    changeDateUnit (dateUnit) {
      console.log(666, dateUnit)
      if (dateUnit === 'Day') {
        this.timeRange = '7'
      } else if (dateUnit === 'Month') {
        this.timeRange = '3'
      }
      this.dateUnit = dateUnit
    },
    changeTimeRange (timeRange) {
      console.log(777, timeRange)
      this.timeRange = timeRange
    },
    returnConfig () {
      this.$emit('confirm', this.dateUnit, this.timeRange, this.chartName)
      this.visible = false
    }
  }
}
</script>
<style scoped lang="scss">

.filter-title {
  padding: 12px 5px;
  border-bottom: 1px solid #edf2f9;
  font-weight: 500;
}
</style>

<style>
.setting_popover {

  z-index: 2;
  position: absolute;
  right: 0px;
}
</style>
