<template>
  <el-container>
    <el-header>
      <el-divider content-position="left">{{ $t('device.fullView') }}</el-divider>
      <span style="display: none">{{ this.devId = this.$route.params.devId }}</span>
    </el-header>
    <el-main>

      <el-row class="row-style">
        <el-descriptions title="" :column="2" border>
          <!--          :labelStyle="{'width':'50%'}"-->
          <el-descriptions-item :label="$t('device.sn')">
            {{ deviceInfo.devSn }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.modelCode')">
            {{ deviceInfo.modelCode }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.status')">
            <el-tag size="mini" :class="'flow-state-tag-1'" v-if="deviceInfo.isOnline == 1">{{ $t('device.online') }}
            </el-tag>
            <el-tag size="mini" :class="'flow-state-tag-0'" v-if="deviceInfo.isOnline == 0">{{ $t('device.offline') }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.createTime')">
            {{ formatDate(deviceInfo.creTime) }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.bootTimes')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.powerOperationCounts }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.printMeters')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.printMetersCounts }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.usbTime')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.usbOperationCounts }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.storageTotal')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.storageTotal }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.storage')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.storageAvailable }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.memoryTimes')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.storageBrushCounts }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.powerKeyTimes')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.powerbuttonPressedCounts }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.screenTimes')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.screenTouchedCounts }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.cameraTimes')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.cameraOpenedCounts }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.chargeTimes')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.batteryOperationCounts }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.lockState')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.deviceLockStatus }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.softwareAttackCounts')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.softwareAttackCounts }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.softwareAttackTime')">
            {{ deviceInfo.statusDeviceVo === null ? null : formatDate(deviceInfo.statusDeviceVo.softwareAttackTime) }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.hardwareAttackCounts')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.hardwareAttackCounts }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.hardwareAttackTime')">
            {{ deviceInfo.statusDeviceVo === null ? null : formatDate(deviceInfo.statusDeviceVo.hardwareAttackTime) }}
          </el-descriptions-item>

          <el-descriptions-item :label="$t('device.imei')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.imei }}
          </el-descriptions-item>


          <el-descriptions-item :label="$t('device.wifiStatus')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.wifiStatus }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.bluetoothStatus')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.bluetoothStatus }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.latLng')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.latLng }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.hardwareConfig')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.hardwareConfig }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.hardwareId')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.hardwareId }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.basebankVersion')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.basebankVersion }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.secureAppVersion')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.secureAppVersion }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.secureBootVersion')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.secureBootVersion }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.sysFwId')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.sysFwId }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.deviceManufacturer')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.deviceManufacturer }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.secureFwVersion')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.secureFwVersion }}
          </el-descriptions-item>

          <el-descriptions-item :label="$t('device.cameraBackModel')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.cameraBackModel }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.cameraFrontModel')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.cameraFrontModel }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('device.currentRunTime')">
            {{ deviceInfo.statusDeviceVo === null ? null : deviceInfo.statusDeviceVo.deviceUpTime }}
          </el-descriptions-item>
        </el-descriptions>
      </el-row>
      <!--      <el-row class="row-style">
              <el-descriptions :title="$t('device.location')" :column="1" border>

              </el-descriptions>
            </el-row>-->

      <el-row class="row-style">
        <el-collapse v-model="cmdActive">
          <el-collapse-item :title="$t('device.cmdHistory')" name="cmd">
            <el-table
              :data="cmdPageInfo"
              v-loading="cmdPageInfo.dataListLoading"
              stripe
              border
              style="width: 100%;">
              <el-table-column prop="cmdTypeCode" :label="$t('device.platform')" header-align="center"
                               align="center">
                <template slot-scope="scope">
                  <span>{{ characterCodeFilter(scope.row.characterCode) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="cmdTypeCode" :label="$t('device.cmdType')" header-align="center"
                               align="center">
                <template slot-scope="scope">
                  <span>{{ cmdTypeFilter(scope.row.cmdTypeCode) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="cmdStatus" :label="$t('device.cmdStatus')" header-align="center" align="center">
                <template slot-scope="scope">
                  <span>{{ cmdStatusFilter(scope.row.cmdStatus) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="creTime" :label="$t('common.createTime')" header-align="center" align="center">
                <template slot-scope="scope">
                  <span>{{ formatDate(scope.row.creTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="updTime" :label="$t('common.updateTime')" header-align="center" align="center">
                <template slot-scope="scope">
                  <span>{{ formatDate(scope.row.updTime) }}</span>
                </template>
              </el-table-column>
            </el-table>
            <br>
            <el-pagination
              v-if="true"
              @size-change="cmdPageSizeChangeHandle"
              @current-change="cmdPageCurrentChangeHandle"
              :current-page="cmdPageIndex"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="cmdPageSize"
              :total="cmdTotalPage"
              layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="row-style">
        <el-collapse v-model="firmwareActive">
          <el-collapse-item :title="$t('device.firmwareInfo')" name="firmware">
            <el-descriptions title="" :column="2" border>
              <el-descriptions-item :label="$t('device.firmwareVersion')" :labelStyle="{'width':'200px'}">
                {{ deviceInfo.firmwareVersion }}
              </el-descriptions-item>
              <el-descriptions-item :label="$t('common.updateTime')" :labelStyle="{'width':'200px'}">
                {{ formatDate(deviceInfo.firmwareUpdTime) }}
              </el-descriptions-item>
            </el-descriptions>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="row-style">
        <el-collapse v-model="controlledActive">
          <el-collapse-item :title="$t('device.controlledApp')" name="controlled">
            <el-table
              :data="deviceInfo.appList"
              v-loading="controlledAppPageInfo.dataListLoading"
              stripe
              border
              style="width: 100%;">
              <el-table-column prop="appName" :label="$t('sysapp.appName')" header-align="center"
                               align="center"></el-table-column>
              <el-table-column prop="pkgName" :label="$t('sysapp.appPackageName')" header-align="center"
                               align="center"></el-table-column>
              <el-table-column prop="powerConsumptionRate" :label="$t('device.powerConsumptionRate')"
                               header-align="center" align="center"></el-table-column>
              <el-table-column prop="currentVersion" :label="$t('sysapp.version')" header-align="center"
                               align="center"></el-table-column>
              <el-table-column prop="updTime" :label="$t('common.updateTime')" header-align="center" align="center">
                <template slot-scope="scope">
                  <span>{{ formatDate(scope.row.updTime) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="row-style">
        <el-collapse v-model="thirdPartyActive">
          <el-collapse-item :title="$t('device.thirdPartyApp')" name="thirdParty">
            <el-table
              :data="deviceInfo.nstoreAppList"
              v-loading="thirdPartyAppPageInfo.dataListLoading"
              stripe
              border

              style="width: 100%;">
              <el-table-column prop="appName" :label="$t('sysapp.appName')" header-align="center"
                               align="center"></el-table-column>
              <el-table-column prop="pkgName" :label="$t('sysapp.appPackageName')" header-align="center"
                               align="center"></el-table-column>
              <el-table-column prop="powerConsumptionRate" :label="$t('device.powerConsumptionRate')"
                               header-align="center" align="center"></el-table-column>
              <el-table-column prop="currentVersion" :label="$t('sysapp.version')" header-align="center"
                               align="center"></el-table-column>
              <el-table-column prop="updTime" :label="$t('common.updateTime')" header-align="center" align="center">
                <template slot-scope="scope">
                  <span>{{ formatDate(scope.row.updTime) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="row-style">
        <el-collapse v-model="groupActive">
          <el-collapse-item :title="$t('device.groupApp')" name="group">
            <el-col :span="2" v-for="i in this.appList" :key="i.iconUrl" style="margin-bottom: 1%">
              <group-app
                :icon="iconView(i.iconUrl)"
                :version="i.versionName"
                :name="i.appName">
              </group-app>
<!--              <div slot="reference">
                <el-row type="flex" justify="center">
                  <img :src="i.iconUrl || 'static/img/Android.png'" class='icon' style="width: 100px;height: 100px"/>
                </el-row>
                <el-row type="flex" justify="center">
                  {{ i.appName }}
                </el-row>
                <el-row type="flex" justify="center">
                  {{ i.versionName }}
                </el-row>
              </div>-->
            </el-col>
<!--            <group-app
              :icon="'static/img/Android.png'"
              :version="'1.0.0'"
              :name="'tx qq'"
              @click="() => clickHandle()">
            </group-app>-->
          </el-collapse-item>
        </el-collapse>

      </el-row>

    </el-main>
  </el-container>
</template>
<script>
import {formatDate} from '@/utils/formatDate'
import {getDeviceDetail, getDeviceCmdHis} from '../../../api/device'
import GroupApp from './group-app'

export default {
  components: {GroupApp},
  data () {
    return {
      deviceInfo: {},
      cmdPageInfo: {},
      cmdPageIndex: 1,
      cmdPageSize: 10,
      cmdTotalPage: 0,
      appList: [],
      controlledAppPageInfo: {
        dataListLoading: false
      },
      thirdPartyAppPageInfo: {
        dataListLoading: false
      },
      groupActive: ['group'],
      thirdPartyActive: ['thirdParty'],
      controlledActive: ['controlled'],
      cmdActive: ['cmd'],
      firmwareActive: ['firmware'],
      devId: undefined
    }
  },
  watch: {
    devId (newVal, oldVal) {
      this.appList = null
      this.cmdPageInfo = null
      this.deviceInfo = null
      console.log('new:' + newVal)
      console.log('old:' + oldVal)
      if (typeof (newVal) !== 'undefined') {
        this.getDeviceDetails()

        this.getDeviceCmdHistory()
      }
    }
  },
  /* created() {
    this.getDeviceDetails()
    this.getDeviceCmdHistory()
  }, */
  methods: {
    iconView (icon) {
      if (icon) {
        return process.env.ICON_API + icon
      }
      return 'static/img/Android.png'
    },
    formatDate (timeStamp) {
      if (timeStamp !== undefined) {
        return formatDate(timeStamp, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    cmdPageSizeChangeHandle (val) {
      this.cmdPageSize = val
      this.getDeviceCmdHistory()
    },
    cmdPageCurrentChangeHandle (val) {
      this.cmdPageIndex = val
      this.getDeviceCmdHistory()
    },
    clickHandle () {
    },
    getDeviceDetails () {
      let param = {
        bindOperatorId: this.$route.params.bindOperatorId
      }
      getDeviceDetail(this.devId, param).then(data => {
        this.deviceInfo = data
        if (this.deviceInfo.group !== null) {
          console.log(this.deviceInfo.group.groupDeviceAppSelectVoList)
          this.appList = this.deviceInfo.group.groupDeviceAppSelectVoList
        }
      })
    },
    getDeviceCmdHistory () {
      getDeviceCmdHis(this.devId, Object.assign({
        pageNo: this.cmdPageIndex,
        pageSize: this.cmdPageSize
      })).then(data => {
        this.cmdPageInfo = data.data
        this.cmdPageIndex = data.pageNo
        this.cmdPageSize = data.pageSize
        this.cmdTotalPage = data.rows
      })
    },
    cmdTypeFilter (type) {
      var map = new Map()
      map.set('A0', this.$t('command.desc.A0'))
      map.set('A1', this.$t('command.desc.A1'))
      map.set('A2', this.$t('command.desc.A2'))
      map.set('A3', this.$t('command.desc.A3'))
      map.set('A4', this.$t('command.desc.A4'))
      map.set('A5', this.$t('command.desc.A5'))
      map.set('A6', this.$t('command.desc.A6'))
      map.set('A7', this.$t('command.desc.A7'))
      map.set('A8', this.$t('command.desc.A8'))
      map.set('A9', this.$t('command.desc.A9'))
      map.set('AA', this.$t('command.desc.AA'))
      map.set('AB', this.$t('command.desc.AB'))
      map.set('AC', this.$t('command.desc.AC'))
      map.set('AD', this.$t('command.desc.AD'))
      map.set('B1', this.$t('command.desc.B1'))
      map.set('B2', this.$t('command.desc.B2'))
      map.set('B3', this.$t('command.desc.B3'))
      map.set('B4', this.$t('command.desc.B4'))
      map.set('B5', this.$t('command.desc.B5'))
      map.set('B6', this.$t('command.desc.B6'))
      map.set('B8', this.$t('command.desc.B8'))
      map.set('B9', this.$t('command.desc.B9'))
      map.set('BA', this.$t('command.desc.BA'))
      map.set('BB', this.$t('command.desc.BB'))
      map.set('D0', this.$t('command.desc.D0'))
      map.set('D1', this.$t('command.desc.D1'))
      map.set('D2', this.$t('command.desc.D2'))
      if (map.has(type)) {
        return map.get(type)
      }
    },
    cmdStatusFilter (status) {
      // 0:未推送  1:推送中 2:执行中 3:推送失败 4:暂停 5:执行成功  6:执行失败 7:等待通知 8:终端不在线 9:指令超时
      const statusMap = {
        0: this.$t('command.status.un_push'),
        1: this.$t('command.status.pushing'),
        2: this.$t('command.status.executing'),
        3: this.$t('command.status.push_fail'),
        4: this.$t('command.status.pause'),
        5: this.$t('command.status.push_success'),
        6: this.$t('command.status.execution_failed'),
        7: this.$t('command.status.waiting_notification'),
        8: this.$t('command.status.terminal_not_online'),
        9: this.$t('command.status.timeout')
      }
      return statusMap[status]
    },
    characterCodeFilter (code) {
      var codeMap = new Map()
      codeMap.set('ADMIN', this.$t('common.platform.admin'))
      codeMap.set('OPERATOR', this.$t('common.platform.operator'))
      codeMap.set('DEV', this.$t('common.platform.dev'))
      codeMap.set('MERCHANT', this.$t('common.platform.merchant'))
      codeMap.set('GEO', this.$t('common.platform.geo'))
      if (codeMap.has(code)) {
        return codeMap.get(code)
      } else {
        return code
      }
    }
  }
}
</script>
<style>
.row-style {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}
</style>
