<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-input v-model="dataForm.appName" :placeholder="$t('appstore.application.appName')" clearable></el-input>
      </el-form-item>
<!--      <el-form-item>-->
<!--        <el-input v-model="dataForm.developerName" :placeholder="$t('appstore.application.developerName')" clearable></el-input>-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-select v-model="dataForm.operatorStatus" clearable :placeholder="$t('operator.status')">
          <el-option v-for="item in $t('appstore.examine.statusOption')" :key="item.value" :value="item.value"
                     :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList(pageNo = 1)" icon="el-icon-search">{{ $t('common.query') }}</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="appIcon"
        header-align="center"
        align="center"
        :label="$t('developer_app.icon')">
        <template slot-scope="scope">
          <img :src="iconView(scope.row.appIcon)" style="height: 48px;width: 48px">
        </template>
      </el-table-column>
      <el-table-column
        prop="appName"
        header-align="center"
        align="center"
        min-width="150"
        :label="$t('appstore.application.appName')">
      </el-table-column>
      <el-table-column
        prop="appVersionName"
        header-align="center"
        align="center"
        min-width="120"
        :label="$t('appstore.application.appVersion')">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        min-width="120"
        :label="$t('appstore.application.status')">
        <template slot-scope="scope">

          <el-tag v-if="scope.row.status === 0" size="small" type="info">{{ $t('appstore.examine.status0') }}</el-tag>
          <el-tag v-if="scope.row.status === 1" size="small">{{ $t('appstore.examine.status1') }}</el-tag>
          <el-tag v-if="scope.row.status === 2" size="small" type="danger">{{ $t('appstore.examine.status2') }}</el-tag>
          <el-tag v-if="scope.row.status === 3" size="small" type="warning">{{ $t('appstore.examine.status3') }}</el-tag>
          <el-tag size="small" >({{scope.row.tested}}/{{scope.row.totalModelCode}})</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="submitTime"
        :formatter="formatDate"
        header-align="center"
        align="center"
        min-width="100"
        :label="$t('appstore.examine.submitTime')">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        min-width="120"
        :label="$t('common.remark')">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        min-width="110px"
        :label="$t('common.operate')">
        <template slot-scope="scope">
          <el-button type="text" @click="showDetailHandle(scope.row.appId, scope.row.appVersionId)">{{ $t('developer.operate_detail') }}</el-button>
          <el-button v-show="scope.row.showCompleteFlag==1 && (scope.row.status === 0 || scope.row.status === 3)" type="text" @click="complete(scope.row)">{{ $t('operator.verify') }}</el-button>
          <!--          <el-button v-show="scope.row.showCompleteFlag==1 && (scope.row.status === 0 || scope.row.status === 3)" type="text" @click="complete(scope.row.appId, scope.row.appVersionId, 1, scope.row)">{{ $t('appstore.examine.reject') }}</el-button>-->
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

    <el-dialog
      :close-on-click-modal="false"
      :visible="this.visible"
      :title="$t('operator.verify')"
      width="40%"
      @close="cancel">
      <div class="stepContainer">
        <el-form :model='testForm' ref='testForm' >
          <el-row style="margin: 20px 0px">
            <el-col :span="10">
              <span style="font-size: 20px; color: #99a9bf">{{ $t('appstore.examine.tested_tip') }} </span>
              <span style="font-size: 20px; color: #99a9bf">{{testForm.tested}} </span>
            </el-col>
            <el-col :span="10">
              <span style="font-size: 20px; color: #99a9bf">{{ $t('appstore.examine.testing_tip') }} </span>
              <span style="font-size: 20px; color: #99a9bf">{{testForm.testing}} </span>
            </el-col>
          </el-row>

          <el-row style="margin: 20px 0px">
            <el-col :span="10">
              <span style="font-size: 20px; color: #99a9bf">{{ $t('appstore.examine.passed_tip') }} </span>
              <span style="font-size: 20px; color: #99a9bf">{{testForm.passed}} </span>

            </el-col>
            <el-col :span="10">
              <span style="font-size: 20px; color: #99a9bf">{{ $t('appstore.examine.rejected_tip') }} </span>
              <span style="font-size: 20px; color: #99a9bf">{{testForm.rejected}} </span>

            </el-col>
          </el-row>
        </el-form>
        <div align="center" style="margin: 10px 0 10px 0">
        <span>
          <el-button  type='danger' size="small" @click="realComplete(1, row)">{{$t('appstore.examine.reject')}}</el-button>
          <el-button  type='primary' size="small"  @click="realComplete(0, row)">{{$t('appstore.examine.pass')}}</el-button>
        </span>
        </div>

      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :visible="this.visible2"
      :title="$t('contact.edit_remark')"
      width="40%"
      @close="cancel1">
      <div class="stepContainer">
        <el-input type="textarea" class="center" :rows="10" :maxlength="512" v-model="remark"></el-input>
        <div style="padding-left: 40%;margin-top: 1%">
          <el-button type="success"  size="medium" :loading="rejectLoading"
                     @click="reject(1, row)">{{ $t('common.submit') }}
          </el-button>
        </div>

      </div>

    </el-dialog>

  </div>
</template>

<script>
    import {examList, examListComplete} from '@/api/developer-app'
    import {formatDate} from '@/utils/formatDate'

    export default {
      data () {
        return {
          dataForm: {
            appName: '',
            developerName: '',
            chargeStrategy: ''
          },
          dataList: [],
          pageNo: 1,
          pageSize: 10,
          rows: 0,
          examineDetailVisible: false,
          dataListLoading: false,
          rejectLoading: false,
          showCompleteFlag: 0,
          visible: false,
          visible2: false,
          row: {},
          testForm: {
            tested: 0,
            testing: 0,
            passed: 0,
            rejected: 0
          },
          remark: ''
        }
      },
      activated () {
        this.getDataList()
      },
      methods: {
        iconView (icon) {
          if (icon) {
            return process.env.ICON_API + icon
          }
          return 'static/img/Android.png'
        },
        getDataList () {
          this.dataListLoading = true
          let params = {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            appName: this.dataForm.appName,
            status: this.dataForm.operatorStatus
            // developerName: this.dataForm.developerName
          }
          examList(params).then(data => {
            this.dataList = data.data
            this.rows = data.rows
            this.dataListLoading = false
          }).catch(e => {
            console.log(`err:${JSON.stringify(e)}`)
          })
        },
        sizeChangeHandle (val) {
          this.pageSize = val
          this.pageNo = 1
          this.getDataList()
        },
        currentChangeHandle (val) {
          this.pageNo = val
          this.getDataList()
        },
        showDetailHandle (appId, appVersionId) {
          this.$router.push({
            name: 'test-detail',
            query: {
              appId: appId,
              appVersionId: appVersionId
            }
          })
        },
        showExamineDetail () {
          this.$router.push({
            name: 'examine-record'
          })
        },
        formatDate (row, column, cellValue, index) {
          return formatDate(cellValue, 'yyyy-MM-dd hh:mm:ss')
        },

        complete (row) {
          this.visible = true
          this.testForm.tested = row.tested
          this.testForm.testing = row.testing
          this.testForm.passed = row.passed
          this.testForm.rejected = row.rejected
          this.row = row
        },
        realComplete (completeFlag, row) {
          if (completeFlag === 0) {
            this.$confirm(
                  this.$t('appstore.examine.comfirm_pass'),
                  this.$t('common.tip'),
              {
                confirmButtonText: this.$t('bar.confirm'),
                cancelButtonText: this.$t('bar.cancel'),
                type: 'warning'
              }
              ).then(() => {
                examListComplete({appId: row.appId, appVersionId: row.appVersionId, completeFlag: completeFlag}).then(data => {
                  this.getDataList()
                  this.visible = false
                }).catch(e => {
                  console.log(`err:${JSON.stringify(e)}`)
                })
              })
          } else {
            this.visible = false
            this.visible2 = true
          }
        },
        reject (completeFlag, row) {
          this.rejectLoading = true
          examListComplete({appId: row.appId, appVersionId: row.appVersionId, completeFlag: completeFlag, remark: this.remark}).then(data => {
            this.getDataList()
            this.visible2 = false
            this.remark = ''
            this.rejectLoading = false
          }).catch(e => {
            this.rejectLoading = false
            console.log(`err:${JSON.stringify(e)}`)
          })
        },
        cancel () {
          this.visible = false
          this.$emit('close')
        },
        cancel1 () {
          this.visible2 = false
          this.$emit('close')
        }

      }
    }
</script>
<style lang="scss">
  .el-form-item {
    margin-bottom: 10px;
  }
  .el-form {
    margin-top: 10px;
  }
  .el-pagination {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
