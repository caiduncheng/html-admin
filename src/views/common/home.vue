<template>
<!--  <div class="home">
&lt;!&ndash;     <ding-header>
        <template #title>
          <h2>He.</h2>
          <h3>Here’s what’s happening with your business today.</h3>
        </template>
        <template #operate> <span></span> </template>
     </ding-header>&ndash;&gt;
    <div class="title">
      <h2>{{ this.name }}</h2>
      <h3>Here’s what’s happening with your business today.</h3>
    </div>
     <el-row :gutter="10" class="line0">
       <el-col :span="16">
         <el-card>
            <div slot="header">Requirement List</div>
            <el-table
              v-loading="loading"
              :show-header="false"
              class="ding-el-table"
              :data="requirementList">
              <el-table-column width="60" align="left">
                <template slot-scope="scope">
                  <i @click="focusItem(scope.row.id)" :class="scope.row.focus ? 'el-icon-star-off' : 'el-icon-star-on'"></i>
                </template>
              </el-table-column>
              <el-table-column align="left" width="180">
                <template slot-scope="scope">
                  <h4 class="font-1-rem">{{scope.row.name}}</h4>
                  <p class="primary-text-sec">{{scope.row.createTime}}</p>
                </template>
              </el-table-column>
              <el-table-column align="left" show-overflow-tooltip>
                <template slot-scope="scope">
                  <h4 class="font-1-rem">{{scope.row.desc}}</h4>
                  <el-tooltip :content="scope.row.msg" placement="top">
                    <div style="-webkit-line-clamp: 1;width:100%">
                      <p class="primary-text-sec">{{scope.row.msg}}</p>
                    </div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column align="right" width="80">
                  <el-button icon="el-icon-more" circle></el-button>
              </el-table-column>
            </el-table>
          </el-card>
       </el-col>
       <el-col :span="8">
         <el-card class="line0_right">
           <div class="flex amount">
            <metrics :label="'Amount rest'" :value="'8888'" :icon="''"></metrics>
            <metrics :label="'History total'" :value="'123456111111111'">
              <template #icon>
                <icon-svg name="admin"></icon-svg>
              </template>
            </metrics>
           </div>
          <div class="amt-btn">
            <el-button type="success">Withdrawal</el-button>
          </div>
         </el-card>
       </el-col>
     </el-row>
     <el-col :span="24" class="line1">
       <el-card class="app-ver">
         <div slot="header">Nearly App Version Info</div>
          <div class="app-ver-item" v-for="appVer in appVerList" :key="appVer.id">
            <div class="flex">
              <div class="app-ver-item__left">
                <h4 class="font-500-w font-1-rem line-12-h">{{appVer.appName}}</h4>
                <p class="primary-text-sec font-75-rem line-12-h" style="margin: 10px 0">{{appVer.applyDate}}</p>
              </div>
              <div class="app-ver-item__right">
                <el-card>
                  <el-tag :type="appVer.status ? 'success' : 'warning'">{{appVer.status ? '已发布' : '待发布'}}</el-tag>
                  <el-progress v-if="appVer.percent" :percentage="appVer.percent" :stroke-width="3"></el-progress>
                </el-card>
              </div>
            </div>
          </div>
       </el-card>
     </el-col>
     <el-col :span="24" class="line2">
       <el-card>
         <div class="flex">
            <metrics :label="'Download Count'" :value="'123'" :icon="'el-icon-sold-out'"></metrics>
            <metrics :label="'Usage Count'" :value="'321'" :icon="'el-icon-cpu'"></metrics>
            <metrics :label="'Total Income'" :value="'$567'" :icon="'el-icon-coin'"></metrics>
            <metrics :label="'Current User'" :value="'99'" :icon="'el-icon-user'"></metrics>
         </div>
       </el-card>
     </el-col>
     <el-col :span="24" class="line3">
       <el-card>
         &lt;!&ndash; <div slot="header">
         </div> &ndash;&gt;
         <div class="flex">
          <div v-loading="loading" style="width:50%;height: 100%">
            <div style="height:300px; margin-top:20px;"  v-if="showChart">
              <charts height="100%" name="chartLine" ref="chartLine"></charts>
            </div>
            <div class="data-empty" v-else>
              <icon-svg class="data-empty-icon" name="chart-data-empty"></icon-svg>
              <div class="data-empty-text">{{$t('common.noData')}}</div>
            </div>
          </div>
          <div v-loading="loading" style="width:50%;height: 100%">
            <div style="height:300px; margin-top:20px;"  v-if="showChart">
              <charts height="100%" name="chartPie" ref="chartPie"></charts>
            </div>
            <div class="data-empty" v-else>
              <icon-svg class="data-empty-icon" name="chart-data-empty"></icon-svg>
              <div class="data-empty-text">{{$t('common.noData')}}</div>
            </div>
          </div>
         </div>
       </el-card>
     </el-col>
  </div>-->
  <div>
<!--    <el-button @click='init'>dain</el-button>-->
    <chart ref="chart"/>
  </div>
</template>
<script>
// import {getHomeInfo} from '@/api'
import charts from '@/components/demo-components/chart'
// import charsoption from '@/assets/js/chartsOption.js'
import Chart from '../modules/dashboard/chart'

export default {
  components: {
    charts,
    Chart
  },
  data () {
    return {
      requirementList: [],
      appVerList: [],
      showChart: false,
      loading: false, // 加载中的样式
      name: 'dfsdf'
    }
  },
  computed: {

  },
  activated () {
    this.init()
  },
  methods: {
    init () {
      this.$refs.chart.init()
      this.name = this.$store.state.user.name
      // this.loading = true
      // this.loading = false
      // getHomeInfo().then(data => {
      //   this.requirementList = data.requirementList
      //   this.appVerList = data.appVerList
      //   return data.chartData
      // }).then((chartData) => {
      //   this.showChart = !!chartData
      //   this.$nextTick(() => {
      //     var lineOption = charsoption.getHomeLineOption()
      //     lineOption.xAxis.data = chartData.lineData.date
      //     lineOption.series[0].data = chartData.lineData.downloadCount
      //     lineOption.series[1].data = chartData.lineData.useCount
      //     this.$refs.chartLine.init(lineOption)
      //     //
      //     var pieOption = charsoption.getHomePieOption()
      //     this.$refs.chartPie.init(pieOption)
      //   })
      // }).finally(() => { this.loading = false })
    },
    iconType (type) {
      let iconType = ''
      if (type === 0) iconType = 'review-list'
      else if (type === 1) iconType = 'consult'
      else iconType = 'services'
      return iconType
    }
  }
}
</script>

<style lang="scss">
.home{
  h4,p {
    margin: 0
  }
  .el-card__header {font-weight: 700;padding:10px;}
  .title {
    h2,h3 {
      margin: 0;
      line-height: 1.5rem;
    }
    h3 {color: $--color-primary-text-sec;font-weight: 400;}
  }
  .el-col {margin: 10px 0}
  .el-icon-star-off,.el-icon-star-on {
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: 900;
  }
  .el-icon-star-off {color: $--color-primary-text}
  .el-icon-star-on {color: #f7c56c}
  .line0 {
    .el-card {
      height: 400px;
      overflow: auto;
      .el-card__body {height: 100%;position: relative;}
    }
    .amount {
      flex-direction: column;
    }
    .amt-btn {
      width: 100%;
      text-align: right;
      position: absolute;
      bottom: 0;
      padding: 10px
    }
    &_right {
      // background-size: 100% 100%;
      // background-image: url(~@/assets/img/huxian.png);
      background-color: $content--background-color;
      border: none;
      // box-shadow: none;
    }
  }
  .line1 {
    .app-ver {
      // background-color: #e7e8ed;
      box-shadow: none;
      // border: none;
      &-item {
        // margin: 10px;
        padding: 20px;
        border-bottom: 1px solid #ebeef5;
        &__left {
          width: 35%;
        }
        &__right {
          width: 65%;
          .el-card {padding: 20px}
        }
      }
    }
  }
}
</style>
