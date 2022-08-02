<template>
  <div class="app-container">
    <el-container>
      <el-header style="margin-right: 5%">
        <el-form :inline="true" :model="dataForm">
          <!--      <el-form-item :label="$t('operator.name')">
                  <el-input v-model="dataForm.name" :placeholder="$t('operator.name')" clearable></el-input>
                </el-form-item>-->
          <el-form-item>
            <el-input v-model="dataForm.operatorName"
                      maxlength="32"
                      @blur="() => dataForm.operatorName = dataForm.operatorName.trim()"
                      @keyup.enter.native="getDataList(pageNo = 1)"
                      :placeholder="$t('operator.name')" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="dataForm.operatorStatus" clearable :placeholder="$t('operator.status')">
              <el-option v-for="item in $t('operator.statusOption')" :key="item.value" :value="item.value"
                         :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getDataList(pageNo = 1)" icon="el-icon-search">
              {{ $t('common.query') }}
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-if="isAuth('10408200.MANAGE') && !this.demoAccountVisible" type="primary"
                       @click="createOperator"
                       icon="el-icon-plus">{{ $t('operator.createOperator') }}
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-if="isAuth('10408200.MANAGE') && this.demoAccountVisible" type="primary"
                       @click="createDemoOperator"
                       icon="el-icon-plus">{{ $t('operator.createDemoOperator') }}
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-if="isAuth('10408200.MANAGE')" type="primary"
                       @click="createLevelEmail"
                       icon="el-icon-plus">{{ $t('operator.level_expired_mail') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('operator.createOperator')" name="first">

          </el-tab-pane>
          <el-tab-pane :label="$t('operator.createDemoOperator')" name="second">

          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>

    <el-table
      :data="dataList"
      v-loading="dataListLoading"
      border
      :cell-style="cellStyle"
      height="calc(100vh - 300px)"
      style="width: 100%;">
      <el-table-column
        prop="operatorName"
        header-align="center"
        align="center"
        :label="$t('operator.name')">
      </el-table-column>
      <el-table-column
        prop="linkMan"
        header-align="center"
        align="center"
        :label="$t('operator.linkman')">
      </el-table-column>
      <el-table-column
        prop="caCn"
        header-align="center"
        align="center"
        min-width="100"
        :label="$t('operator.cn')">
      </el-table-column>
      <el-table-column
        prop="countryCode"
        :formatter="formatCountry"
        header-align="center"
        align="center"
        :label="$t('operator.country')"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        :label="$t('operator.status')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 2" size="small" type="warning">{{
              $t('operator.pendingReview')
            }}
          </el-tag>
          <el-tag v-if="scope.row.status === 1" size="small">{{ $t('operator.normal') }}</el-tag>
          <el-tag v-if="scope.row.status === 0" size="small" type="info">{{ $t('operator.locked') }}</el-tag>
          <el-tag v-if="scope.row.status === 3" size="small" type="danger">{{
              $t('operator.reject')
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="creTime"
        header-align="center"
        align="center"
        :label="$t('common.createTime')">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="bottom">
            <div slot="content">
              <span>{{ formatDate(scope.row.creTime, 'yyyy-MM-dd  hh:mm:ss') }}</span>
            </div>
            <label>{{ formatDate(scope.row.creTime, 'yyyy-MM-dd') }}</label>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="levelCode"
        header-align="center"
        align="center"
        style="margin: 20px"
        :label="$t('operator.level')">
        <template slot-scope="scope">
<!--          <el-tag v-if="scope.row.levelCode === 'FREE_LEVEL'" size="small">
            {{ $t('operator.level_list[0].label') }}
          </el-tag>
          <el-tag v-if="scope.row.levelCode === 'CHARGE_L2'" size="small">
            {{ $t('operator.level_list[1].label') }}
          </el-tag>-->
          <el-tag size="small" v-if="scope.row.levelCode === 'CHARGE_L2' || scope.row.levelCode === 'FREE_LEVEL'">
            {{ expirationHandler(scope.row.levelCode, scope.row.levelExpireTime) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        :label="$t('common.operate')">
        <template slot-scope="scope">

          <!--          <el-button type="warning" @click="leverChangeHandle(scope.row)">{{$t('operator.lever')}}</el-button>-->
          <el-tooltip class="item" effect="dark" :content="$t('common.detail')" placement="top">
            <el-button style="color: #8c939d" @click="showDetailHandle(scope.row.operatorId)"
                       icon="el-icon-info"></el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" :content="$t('operator.addResourceBtn')" placement="top">
            <el-button v-if="scope.row.status == 1" @click="addLicenseHandle(scope.row)">
              <icon-svg name="resource"/>
            </el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" :content="$t('operator.checkBtn')" placement="top">
            <el-button v-if="scope.row.status == 2" style="color: #cf9236" icon="el-icon-s-check"
                       @click="checkOperatorHandle(scope.row)">
            </el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" :content="$t('operator.resetPassBtn')" placement="top">
            <el-button @click="reset(scope.row.operatorId, scope.row.operatorType)">
              <icon-svg name="resetpassword"/>
            </el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" :content="$t('operator.permissionsBtn')" placement="top">
            <el-button v-if="scope.row.status == 1" @click="blackListHandle(scope.row)">
              <icon-svg name="permissions"/>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNo"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="rows"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <operator-detail v-if="operatorDetailVisible" ref="operatorDetail"
                     @close="operatorDetailVisible = false"></operator-detail>
    <check-operator v-if="checkOperatorVisible" ref="checkOperator" @refreshDataList="getDataList"
                    @close="checkOperatorVisible = false"></check-operator>
    <business v-if="addBusinessVisible" ref="business" @refreshDataList="getDataList"
              @close="addBusinessVisible = false"></business>
    <change-level v-if="changeLevelVisible" ref="changeLevel" @refreshDataList="getDataList"
                  @close="changeLevelVisible = false"></change-level>
    <add-operator v-if="addOperatorVisible" ref="addOperator" @refreshDataList="getDataList"
                  @close="addOperatorVisible = false"></add-operator>
    <add-demo-operator v-if="addDemoOperatorVisible" ref="addDemoOperator" @refreshDataList="getDataList"
                       @close="addDemoOperatorVisible = false"></add-demo-operator>
    <permissions v-if="permissionsVisible" ref="permissions" @refreshDataList="getDataList"
                 @close="permissions = false"></permissions>
    <resetpw-operator v-if="resetpwOperatorVisible" ref="resetpwOperator" @refreshDataList="getDataList"
                      @close="resetpwOperatorVisible = false"></resetpw-operator>
    <bind-operator v-if="addLevelEmailVisible" ref="addLevelEmail"
                      @close="addLevelEmailVisible = false"></bind-operator>
  </div>
</template>

<script>
import {formatDate} from '@/utils/formatDate'
import {formatCountry} from '@/utils/formatCountry'
import {
  operatorList,
  deleteOperator,
  operatorLevelList
} from '../../../api/operator'
import OperatorDetail from './components/operator-detail'
import CheckOperator from './components/check-operator'
import ResetpwOperator from './components/resetpw-operator'
import Business from './components/add-business'
import ChangeLevel from './components/change-level'
import AddOperator from './components/add-operator'
import AddDemoOperator from './components/add-demo-operator'
import Permissions from './components/permissions'
import BindOperator from './components/expired-level-email'

export default {
  components: {
    OperatorDetail,
    CheckOperator,
    Business,
    ChangeLevel,
    AddOperator,
    AddDemoOperator,
    Permissions,
    ResetpwOperator,
    BindOperator
  },
  data () {
    return {
      dataForm: {
        operatorName: '',
        operatorStatus: null
      },
      activeName: 'first',
      operatorDetailVisible: false,
      checkOperatorVisible: false,
      addBusinessVisible: false,
      changeLevelVisible: false,
      addOperatorVisible: false,
      addDemoOperatorVisible: false,
      addLevelEmailVisible: false,
      updateMapVisible: false,
      permissionsVisible: false,
      resetpwOperatorVisible: false,
      cardBindBankId: 0,
      dataList: [],
      pageNo: 1,
      pageSize: 10,
      rows: 0,
      dataListLoading: false,
      orderListLoading: false,
      agreementShowVisible: false,
      curOperator: {},
      operatorLeverList: [],
      demoAccountVisible: false
    }
  },
  activated () {
    this.init()
  },
  methods: {
    async init () {
      await this.getDataList()
      await this.getOperatorLevelLsit()
    },
    reset (operatorId, operatorType) {
      this.resetpwOperatorVisible = true
      this.$nextTick(() => {
        this.$refs.resetpwOperator.init(operatorId, operatorType)
      })
    },
    currentOperator (row) {
      this.curOperator = row
    },
    batchOperate (command) {
      this.changeLevelVisible = true
      this.$nextTick(() => {
        this.$refs.changeLevel.init(command, this.curOperator.operatorId)
      })
    },
    // 获取数据列表
    getDataList () {
      console.log(this.activeName)
      this.dataListLoading = true
      let params = {
        'pageNo': this.pageNo,
        'pageSize': this.pageSize,
        'operatorName': this.dataForm.operatorName,
        'operatorStatus': this.dataForm.operatorStatus,
        'operatorType': this.activeName === 'first' ? 1 : 0
      }
      operatorList(params).then(data => {
        this.dataList = data.data
        this.rows = data.rows
        this.dataListLoading = false
      }).catch(e => {
        // this.$message.error(e.message)
        console.log(`err:${JSON.stringify(e)}`)
      })
    },
    deleteHandle (row) {
      let param = {
        userId: row.loginUserId,
        username: row.loginUsername
      }
      this.$confirm(this.$t('operator.deleteConfirm'), '', {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        deleteOperator(param).then(data => {
          this.$message({
            type: 'success',
            message: this.$t('common.success')
          })
          this.getDataList()
        })
      })
      console.log(row)
    },
    getOperatorLevelLsit () {
      let param = {
        characterCode: 'OPERATOR'
      }
      operatorLevelList(param).then(data => {
        this.operatorLevelList = data
        console.log(this.operatorLevelList)
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageNo = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageNo = val
      this.getDataList()
    },
    showDetailHandle (id) {
      this.operatorDetailVisible = true
      this.$nextTick(() => {
        this.$refs.operatorDetail.init(id)
      })
    },
    checkOperatorHandle (row) {
      console.log(row)
      /* if (row.operatorType === 'DEMO') {
        // 服务调用失败的情况，才会出现
        this.checkDemoOperatorVisible = true
        this.$nextTick(() => {
          this.$refs.checkDemoOperator.init(row)
        })
      } else {
        this.checkOperatorVisible = true
        this.$nextTick(() => {
          this.$refs.checkOperator.init(row)
        })
      } */

      this.checkOperatorVisible = true
      this.$nextTick(() => {
        this.$refs.checkOperator.init(row)
      })
    },
    addLicenseHandle (row) {
      this.addBusinessVisible = true
      this.$nextTick(() => {
        this.$refs.business.init(row)
      })
    },
    resetMapHandle (row) {
      this.updateMapVisible = true
      this.$nextTick(() => {
        this.$refs.updateMap.init(row)
      })
    },
    blackListHandle (row) {
      this.permissionsVisible = true
      this.$nextTick(() => {
        this.$refs.permissions.init(row)
      })
    },
    formatDate (cellValue, fmt) {
      cellValue = new Date(cellValue).valueOf()
      return formatDate(cellValue, fmt)
    },
    formatCountry (row, column, cellValue, index) {
      return formatCountry(cellValue)
    },
    expirationHandler (levelCode, levelExpirationTime) {
      // eslint-disable-next-line no-unused-vars
      let levelName = ''
      if (levelCode === 'FREE_LEVEL') {
        levelName = this.$t('operator.level_list[0].label')
      } else if (levelCode === 'CHARGE_L2') {
        levelName = this.$t('operator.level_list[1].label')
      }
      console.log(levelExpirationTime)
      if (!levelExpirationTime || levelExpirationTime === undefined) {
        return levelName + ' | ' + this.$t('operator.leverExpireForever')
      }
      var date = formatDate(levelExpirationTime, 'yyyy-MM-dd')
      return levelName + ' | ' + date
    },
    cellStyle ({row, column, rowIndex, columnIndex}) {
      let value = row[column.property]
      if (value != null) {
        if (column.property === 'creTime') {
          value = this.formatDate(row[column.property], 'yyyy-MM-dd')
        }
        if (column.property === 'countryCode') {
          value = formatCountry(row[column.property])
        }
        if (value.length * 13 > column.width) {
          return 'font-size:' + (column.width * 0.95) / value.length + 'px'
        }
      }
      // console.log(rowIndex + ':' + JSON.stringify(row))
      //  console.log(columnIndex + ':' + JSON.stringify(column))
    },
    createOperator () {
      this.addOperatorVisible = true
      this.$nextTick(() => {
        this.$refs.addOperator.init()
      })
    },
    createDemoOperator () {
      this.addDemoOperatorVisible = true
      this.$nextTick(() => {
        this.$refs.addDemoOperator.init()
      })
    },
    handleClick (tab, event) {
      if (tab.name === 'second') {
        this.demoAccountVisible = true
      } else if (tab.name === 'first') {
        this.demoAccountVisible = false
      }
      this.getDataList()
    },
    createLevelEmail () {
      this.addLevelEmailVisible = true
      this.$nextTick(() => {
        this.$refs.addLevelEmail.init()
      })
    }
  }
}
</script>
<style lang="scss" scope>
.app-container {
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;

  &--border-none {
    border-radius: 0;
  }
}

.el-pagination {
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: right;
}
</style>
