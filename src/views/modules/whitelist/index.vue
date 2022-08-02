<template>
  <div>
      <el-container>
          <el-header style="margin-right: 5%">
              <div>
                  <span>{{$t('white_list.title')}}</span>
                  <el-button v-if="isAuth('10401000.MANAGE')"  style="float: right;" type="success" @click="addAppHandle" icon="el-icon-circle-plus-outline">{{this.$t('white_list.addAppBtn')}}</el-button>
              </div>
          </el-header>
          <el-main>
              <el-tabs v-model="activeName" @tab-click="handleClick">
                  <el-tab-pane :label="$t('white_list.application')" name="first">
                      <Application ref="application"/>
                  </el-tab-pane>
                  <el-tab-pane :label="$t('white_list.bindRecord')" name="second">
                      <BingRecord ref="bingRecord"/>
                  </el-tab-pane>
              </el-tabs>
          </el-main>
      </el-container>

    <add-or-update-application :visible.sync='visible' @close='visible = false' ref="addOrUpdate" @refreshDataList='refresh'> </add-or-update-application>
  </div>
</template>

<script>
import BingRecord from './components/bind-record'
import Application from './components/application'
import AddOrUpdateApplication from './components/add-or-update-application'

export default {
  components: {
    BingRecord,
    Application,
    AddOrUpdateApplication
  },
  data () {
    return {
      activeName: 'first',
      dataForm: {
        operatorName: '',
        operatorStatus: null
      },
      visible: false,
      operatorDetailVisible: false,
      checkOperatorVisible: false,
      addLicenseVisible: false,
      cardBindBankId: 0,
      dataList: [],
      pageNo: 1,
      pageSize: 10,
      rows: 0,
      dataListLoading: false,
      orderListLoading: false,
      agreementShowVisible: false
    }
  },
  activated () {
    this.$nextTick(() => {
      this.$refs.application.init()
    })
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'second') {
        console.log('second')
        this.$nextTick(() => {
          this.$refs.bingRecord.init()
        })
      } else if (tab.name === 'first') {
        this.$nextTick(() => {
          this.$refs.application.init()
        })
      }
    },
    refresh () {
      this.$refs.application.init()
    },
    addAppHandle () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init()
      })
    }
  }
}
</script>
<style>
.el-container {
  margin-top: 20px;
}

.el-header, .el-footer {
  color: #333;
  text-align: left;
  line-height: 60px;
}

</style>
