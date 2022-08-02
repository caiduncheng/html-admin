<template>
  <div>

    <el-drawer
      size="50%"
      :with-header="false"
      v-loading="dataListLoading"
      custom-class="ding-el-dialog"
      :visible.sync="visible"
      direction="rtl"
      append-to-body
      destroy-on-close
      :before-close="cancel">

      <div class="ding-drawer-body detail">

        <el-tabs v-model="activeName" @tab-click="handleClick">

          <el-tab-pane :label="$t('merchant.merchantDetail')" name="first">
            <el-form :model="merchantInfo"
                     inline-message
                     label-position="top"
                     label-width="auto"
                     ref="dataForm">
              <el-descriptions direction="vertical" :column="12" border>
                <el-descriptions-item :label="$t('merchant.mrchId')" :span="4">{{ merchantInfo.mrchId }}</el-descriptions-item>
                <el-descriptions-item :label="$t('merchant.name')" :span="4">{{ merchantInfo.name }}</el-descriptions-item>
                <el-descriptions-item :label="$t('merchant.shortName')" :span="4">{{ merchantInfo.shortName }}</el-descriptions-item>
                <el-descriptions-item :label="$t('merchant.mrchNo')" :span="4">{{ merchantInfo.mrchNo }}</el-descriptions-item>
                <el-descriptions-item :label="$t('merchant.businessLicense')" :span="4">{{ merchantInfo.businessLicense }}</el-descriptions-item>
                <el-descriptions-item :label="$t('merchant.organization')" :span="4">{{ merchantInfo.organization }}</el-descriptions-item>
                <el-descriptions-item :label="$t('merchant.contactName')" :span="4">{{ merchantInfo.contactName }}</el-descriptions-item>
                <el-descriptions-item :label="$t('merchant.mobile')" :span="4">{{ merchantInfo.mobile }}</el-descriptions-item>
                <el-descriptions-item :label="$t('merchant.email')" :span="4">{{ merchantInfo.email }}</el-descriptions-item>
                <el-descriptions-item :label="$t('merchant.countryName')" :span="4">{{ formatCountry(merchantInfo.countryCode) }}</el-descriptions-item>
                <el-descriptions-item :label="$t('merchant.provName')" :span="4">{{ merchantInfo.provName }}</el-descriptions-item>
                <el-descriptions-item :label="$t('merchant.cityName')" :span="4">{{ merchantInfo.cityName }}</el-descriptions-item>
                <el-descriptions-item :label="$t('merchant.areaCode')" :span="4">{{ merchantInfo.areaCode }}</el-descriptions-item>
                <el-descriptions-item :label="$t('merchant.areaName')" :span="4">{{ merchantInfo.areaName }}</el-descriptions-item>
                <el-descriptions-item :label="$t('merchant.postCode')" :span="4">{{ merchantInfo.postCode }}</el-descriptions-item>
                <el-descriptions-item :label="$t('merchant.address')" :span="12">{{ merchantInfo.address }}</el-descriptions-item>
                <el-descriptions-item :label="$t('merchant.creTime')" :span="4">{{ formatDate('', '', merchantInfo.creTime) }}</el-descriptions-item>
                <el-descriptions-item :label="$t('merchant.updTime')" :span="4">{{ formatDate('', '', merchantInfo.updTime) }}</el-descriptions-item>
                <el-descriptions-item :label="$t('merchant.status')" :span="4">
                  <div v-if="merchantInfo.status == 1">{{$t('merchant.normal')}}</div>
                  <div v-if="merchantInfo.status == 0">{{$t('merchant.locked')}}</div>
                </el-descriptions-item>
                <el-descriptions-item :label="$t('merchant.remark')" :span="12">{{ merchantInfo.remark }}</el-descriptions-item>
              </el-descriptions>
            </el-form>
            <div style="padding: 20px" align="right">
              <el-button type="primary" v-if="merchantInfo.status == 1" @click="lockHandle(merchantInfo.mrchId)">
                {{ $t('merchant.lock') }}
              </el-button>
              <el-button type="primary" v-if="merchantInfo.status == 0" @click="unlockHandle(merchantInfo.mrchId)">
                {{ $t('merchant.unlock') }}
              </el-button>
            </div>
          </el-tab-pane>

          <el-tab-pane :label="$t('merchant.merchantDevice')" name="second">
            <el-table :data="deviceList" border style="width: 100%;">
              <el-table-column
                prop="devSn"
                header-align="center"
                align="center"
                width="150"
                :label="$t('merchant.devSn')">
              </el-table-column>
              <el-table-column
                prop="modelCode"
                header-align="center"
                align="center"
                width="120"
                :label="$t('merchant.modelCode')">
              </el-table-column>
              <el-table-column
                prop="creTime"
                :formatter="formatDate"
                header-align="center"
                align="center"
                width="120"
                :label="$t('merchant.intoTime')">
              </el-table-column>
              <el-table-column
                prop="activateTime"
                :formatter="formatDate"
                header-align="center"
                align="center"
                width="120"
                :label="$t('merchant.activateTime')">
              </el-table-column>
              <el-table-column
                prop="caCn"
                header-align="center"
                align="center"
                width="120"
                :label="$t('merchant.caCn')">
              </el-table-column>
              <el-table-column
                prop="status"
                header-align="center"
                align="center"
                width="120"
                :label="$t('merchant.status')">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.status === 1" size="small">{{$t('merchant.normal')}}</el-tag>
                  <el-tag v-if="scope.row.status === 0" size="small" type="info">{{$t('merchant.locked')}}</el-tag>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="deviceListSizeChangeHandle"
              @current-change="deviceListCurrentChangeHandle"
              :current-page="deviceListPageNo"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="deviceListPageSize"
              :total="deviceListTotalPage"
              layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </el-tab-pane>

          <el-tab-pane :label="$t('merchant.merchantBuyApp')" name="third">
            <el-table :data="buyAppList" border style="width: 100%;">
              <el-table-column
                prop="appName"
                header-align="center"
                align="center"
                :label="$t('merchant.appName')">
              </el-table-column>
              <el-table-column
                prop="keyName"
                header-align="center"
                align="center"
                :label="$t('merchant.developerName')">
              </el-table-column>
              <el-table-column
                prop="amount"
                header-align="center"
                align="center"
                :label="$t('merchant.amount')">
                <template slot-scope="scope">
                  <label type="text">{{scope.row.currency}}</label>
                  <label type="text">{{scope.row.amount}}</label>
                </template>
              </el-table-column>
              <el-table-column
                prop="devSn"
                header-align="center"
                align="center"
                :label="$t('merchant.devSn')">
              </el-table-column>
              <el-table-column
                prop="creTime"
                :formatter="formatDate"
                header-align="center"
                align="center"
                :label="$t('merchant.creTime')">
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="buyAppListSizeChangeHandle"
              @current-change="buyAppListCurrentChangeHandle"
              :current-page="buyAppListPageNo"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="buyAppListPageSize"
              :total="buyAppListTotalPage"
              layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </el-tab-pane>

          <el-tab-pane :label="$t('merchant.merchantSubscribeApp')" name="fourth">
            <el-table :data="subscribeAppList" border style="width: 100%;">
              <el-table-column
                prop="appName"
                header-align="center"
                align="center"
                :label="$t('merchant.appName')">
              </el-table-column>
              <el-table-column
                prop="keyName"
                header-align="center"
                align="center"
                :label="$t('merchant.developerName')">
              </el-table-column>
              <el-table-column
                prop="subscribeType"
                header-align="center"
                align="center"
                :label="$t('merchant.subscribeType')">
                <template slot-scope="scope">
                  <label type="text" v-if="scope.row.subscribeType == 1">{{$t('merchant.subscribeTypeByYear')}}</label>
                  <label type="text" v-if="scope.row.subscribeType == 3">{{$t('merchant.subscribeTypeByMonth')}}</label>
                  <label type="text" v-if="scope.row.subscribeType == 5">{{$t('merchant.subscribeTypeByWeek')}}</label>
                </template>
              </el-table-column>
              <el-table-column
                prop="amount"
                header-align="center"
                align="center"
                :label="$t('merchant.amount')">
                <template slot-scope="scope">
                  <label type="text">{{scope.row.currency}}</label>
                  <label type="text">{{scope.row.amount}}</label>
                </template>
              </el-table-column>
              <el-table-column
                prop="devSn"
                header-align="center"
                align="center"
                :label="$t('merchant.devSn')">
              </el-table-column>
              <el-table-column
                prop="startTime"
                :formatter="formatDate"
                header-align="center"
                align="center"
                :label="$t('merchant.startTime')">
              </el-table-column>
              <el-table-column
                prop="expireTime"
                :formatter="formatDate"
                header-align="center"
                align="center"
                :label="$t('merchant.expireTime')">
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="subscribeAppListSizeChangeHandle"
              @current-change="subscribeAppListCurrentChangeHandle"
              :current-page="subscribeAppListPageNo"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="subscribeAppListPageSize"
              :total="subscribeAppListTotalPage"
              layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </el-tab-pane>

          <el-tab-pane :label="$t('merchant.merchantFreeApp')" name="fifth">
            <el-table :data="freeAppList" border style="width: 100%;">
              <el-table-column
                prop="appName"
                header-align="center"
                align="center"
                :label="$t('merchant.appName')">
              </el-table-column>
              <el-table-column
                prop="keyName"
                header-align="center"
                align="center"
                :label="$t('merchant.developerName')">
              </el-table-column>
              <el-table-column
                prop="creTime"
                :formatter="formatDate"
                header-align="center"
                align="center"
                :label="$t('merchant.creTime')">
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="freeAppListSizeChangeHandle"
              @current-change="freeAppListCurrentChangeHandle"
              :current-page="freeAppListPageNo"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="freeAppListPageSize"
              :total="freeAppListTotalPage"
              layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </el-tab-pane>

          <el-tab-pane :label="$t('merchant.merchantTrialApp')" name="sixth">
            <el-table :data="trialAppList" border style="width: 100%;">
              <el-table-column
                min-width="120px"
                prop="appName"
                header-align="center"
                align="center"
                :label="$t('merchant.appName')">
              </el-table-column>
              <el-table-column
                min-width="120px"
                prop="keyName"
                header-align="center"
                align="center"
                :label="$t('merchant.developerName')">
              </el-table-column>
              <el-table-column
                min-width="100px"
                prop="appVersion"
                header-align="center"
                align="center"
                :label="$t('merchant.appVersion')">
              </el-table-column>
              <el-table-column
                min-width="100px"
                prop="devSn"
                header-align="center"
                align="center"
                :label="$t('merchant.devSn')">
              </el-table-column>
              <el-table-column
                min-width="140px"
                prop="subscribeType"
                header-align="center"
                align="center"
                :label="$t('appstore.application.chargeStrategy')">
                <template slot-scope="scope">
                  <label type="text" v-if="scope.row.chargeStrategy == '1'">
                    {{$t('appstore.application.chargeStrategyFree')}}
                  </label>
                  <label type="text" v-if="scope.row.chargeStrategy == '2'">
                    {{$t('appstore.application.chargeStrategyBuy')}}
                  </label>
                  <label type="text" v-if="scope.row.chargeStrategy == '3' && scope.row.subscribeType == '1'">
                    {{$t('appstore.application.chargeStrategySubscribe') + ' ' + $t('appstore.application.subscribeTypeByYear')}}
                  </label>
                  <label type="text" v-if="scope.row.chargeStrategy == '3' && scope.row.subscribeType == '3'">
                    {{$t('appstore.application.chargeStrategySubscribe') + ' ' + $t('appstore.application.subscribeTypeByMonth')}}
                  </label>
                  <label type="text" v-if="scope.row.chargeStrategy == '3' && scope.row.subscribeType == '5'">
                    {{$t('appstore.application.chargeStrategySubscribe') + ' ' + $t('appstore.application.subscribeTypeByWeek')}}
                  </label>
                </template>
              </el-table-column>
              <el-table-column
                prop="amount"
                min-width="110px"
                header-align="center"
                align="center"
                :label="$t('merchant.amount')">
                <template slot-scope="scope">
                  <label type="text">{{scope.row.currency}}</label>
                  <label type="text">{{scope.row.amount}}</label>
                </template>
              </el-table-column>
              <el-table-column
                min-width="100px"
                prop="purchaseNo"
                header-align="center"
                align="center"
                :label="$t('merchant.purchaseNo')">
              </el-table-column>
              <el-table-column
                min-width="110px"
                prop="startTime"
                :formatter="formatDate"
                header-align="center"
                align="center"
                :label="$t('merchant.startTime')">
              </el-table-column>
              <el-table-column
                min-width="110px"
                prop="endTime"
                :formatter="formatDate"
                header-align="center"
                align="center"
                :label="$t('merchant.endTime')">
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="trialAppListSizeChangeHandle"
              @current-change="trialAppListCurrentChangeHandle"
              :current-page="trialAppListPageNo"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="trialAppListPageSize"
              :total="trialAppListTotalPage"
              layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </el-tab-pane>

        </el-tabs>

      </div>
    </el-drawer>
  </div>
</template>

<script>
  import {getMerchantInfo, lockMerchant, unlockMerchant, merchantDeviceList, merchantAppList, merchantAppTrialList} from '@/api/merchant'
  import {formatCountry} from '@/utils/formatCountry'
  import {formatDate} from '@/utils/formatDate'

  export default {
    data () {
      return {
        dataListLoading: false,
        disable: false,
        mrchId: 0,
        visible: false,
        merchantInfo: '',
        deviceList: [],
        deviceListPageNo: 1,
        deviceListPageSize: 10,
        deviceListTotalPage: 0,
        buyAppList: [],
        buyAppListPageNo: 1,
        buyAppListPageSize: 10,
        buyAppListTotalPage: 0,
        subscribeAppList: [],
        subscribeAppListPageNo: 1,
        subscribeAppListPageSize: 10,
        subscribeAppListTotalPage: 0,
        freeAppList: [],
        freeAppListPageNo: 1,
        freeAppListPageSize: 10,
        freeAppListTotalPage: 0,
        trialAppList: [],
        trialAppListPageNo: 1,
        trialAppListPageSize: 10,
        trialAppListTotalPage: 0,
        activeName: 'first'
      }
    },
    methods: {
      init (id) {
        this.mrchId = id
        this.visible = true
        this.dataListLoading = true
        this.getMerchantInfo()
        this.getDeviceList()
        this.getBuyAppList()
        this.getSubscribeAppList()
        this.getFreeAppList()
        this.getTrialAppList()
        this.dataListLoading = false
      },
      handleClick (tab, event) {
      },
      getMerchantInfo () {
        getMerchantInfo(this.mrchId).then(data => {
          this.merchantInfo = data
        }).catch(e => {
          console.log(`err:${JSON.stringify(e)}`)
        })
      },
      lockHandle (id) {
        this.$confirm(this.$t('merchant.msgConfirmLock'), '', {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          this.dataListLoading = true
          lockMerchant(id).then(data => {
            this.$message.success(this.$t('common.operate_success'))
            this.getMerchantInfo()
            this.dataListLoading = false
          })
        }).catch(e => {
          console.log(`err:${JSON.stringify(e)}`)
          this.dataListLoading = false
        })
      },
      unlockHandle (id) {
        this.$confirm(this.$t('merchant.msgConfirmUnlock'), '', {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          this.dataListLoading = true
          unlockMerchant(id).then(data => {
            this.$message.success(this.$t('common.operate_success'))
            this.getMerchantInfo()
            this.dataListLoading = false
          })
        }).catch(e => {
          this.dataListLoading = false
          console.log(`err:${JSON.stringify(e)}`)
        })
      },
      getDeviceList () {
        let params = {
          'pageNo': this.deviceListPageNo,
          'pageSize': this.deviceListPageSize
        }
        merchantDeviceList(this.mrchId, params).then(data => {
          this.deviceList = data.data
          this.deviceListTotalPage = data.rows
        }).catch(e => {
          console.log(`err:${JSON.stringify(e)}`)
        })
      },
      deviceListSizeChangeHandle (val) {
        this.deviceListPageSize = val
        this.deviceListPageNo = 1
        this.getDeviceList()
      },
      deviceListCurrentChangeHandle (val) {
        this.deviceListPageNo = val
        this.getDeviceList()
      },
      getBuyAppList () {
        let params = {
          'pageNo': this.buyAppListPageNo,
          'pageSize': this.buyAppListPageSize,
          'chargeStrategy': 2
        }
        merchantAppList(this.mrchId, params).then(data => {
          this.buyAppList = data.data
          this.buyAppListTotalPage = data.rows
        }).catch(e => {
          console.log(`err:${JSON.stringify(e)}`)
        })
      },
      buyAppListSizeChangeHandle (val) {
        this.buyAppListPageSize = val
        this.buyAppListPageNo = 1
        this.getBuyAppList()
      },
      buyAppListCurrentChangeHandle (val) {
        this.buyAppListPageNo = val
        this.getBuyAppList()
      },
      getSubscribeAppList () {
        let params = {
          'pageNo': this.subscribeAppListPageNo,
          'pageSize': this.subscribeAppListPageSize,
          'chargeStrategy': 3
        }
        merchantAppList(this.mrchId, params).then(data => {
          this.subscribeAppList = data.data
          this.subscribeAppListTotalPage = data.rows
        }).catch(e => {
          console.log(`err:${JSON.stringify(e)}`)
        })
      },
      subscribeAppListSizeChangeHandle (val) {
        this.subscribeAppListPageSize = val
        this.subscribeAppListPageNo = 1
        this.getSubscribeAppList()
      },
      subscribeAppListCurrentChangeHandle (val) {
        this.subscribeAppListPageNo = val
        this.getSubscribeAppList()
      },
      getFreeAppList () {
        let params = {
          'pageNo': this.freeAppListPageNo,
          'pageSize': this.freeAppListPageSize,
          'chargeStrategy': 1
        }
        merchantAppList(this.mrchId, params).then(data => {
          this.freeAppList = data.data
          this.freeAppListTotalPage = data.rows
        }).catch(e => {
          console.log(`err:${JSON.stringify(e)}`)
        })
      },
      freeAppListSizeChangeHandle (val) {
        this.freeAppListPageSize = val
        this.freeAppListPageNo = 1
        this.getFreeAppList()
      },
      freeAppListCurrentChangeHandle (val) {
        this.freeAppListPageNo = val
        this.getFreeAppList()
      },
      getTrialAppList () {
        let params = {
          'pageNo': this.trialAppListPageNo,
          'pageSize': this.trialAppListPageSize
        }
        merchantAppTrialList(this.mrchId, params).then(data => {
          this.trialAppList = data.data
          this.trialAppListTotalPage = data.rows
        }).catch(e => {
          console.log(`err:${JSON.stringify(e)}`)
        })
      },
      trialAppListSizeChangeHandle (val) {
        this.trialAppListPageSize = val
        this.trialAppListPageNo = 1
        this.getTrialAppList()
      },
      trialAppListCurrentChangeHandle (val) {
        this.trialAppListPageNo = val
        this.getTrialAppList()
      },
      cancel () {
        this.visible = false
        this.$emit('refreshDataList')
      },
      formatCountry (value) {
        return formatCountry(value)
      },
      formatDate (row, column, cellValue, index) {
        return formatDate(cellValue, 'yyyy-MM-dd hh:mm:ss')
      }
    }
  }
</script>
<style lang="scss">
  .detail {

    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 10px;

    .el-popover {
      width: 35%;
      overflow: auto;
      height: 304px;
    }

    .el-select {
      width: 100%;
    }

    .el-input.is-disabled .el-input__inner {
      background-color: white;
      color: black;
    }

    .timeDiv {
      width: 100%;
    }

    .el-col {
      text-align: center;
      border: 1px solid #ddd;
    }

    .table {
      .el-col {
        text-align: center;
        border: 1px solid #ddd;
        padding: 5px;
      }
    }

    .table-head {
      background: #eee;
    }
  }
</style>
