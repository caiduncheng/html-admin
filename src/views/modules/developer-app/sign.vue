<template>
  <div class="develop">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-input v-model="dataForm.appName"
                  maxlength="32"
                  @blur="() => dataForm.appName = dataForm.appName.trim()"
                  @keyup.enter.native="getDataList(pageNo = 1)"
                  :placeholder="$t('developer_app.app_name')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.status" clearable :placeholder="$t('developer.status')">
          <el-option v-for="item in $t('developer_app.sign.status_option')" :key="item.value" :value="item.value"
                     :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList(pageNo = 1)" icon="el-icon-search">{{
            $t('common.query')
          }}
        </el-button>
      </el-form-item>

    </el-form>
    <el-table :data="dataList" v-loading="dataListLoading" border style="width: 100%;">
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
        :label="$t('developer_app.app_name')">
      </el-table-column>
      <el-table-column
        prop="appVersion"
        header-align="center"
        align="center"
        :label="$t('developer_app.version')">
      </el-table-column>
      <el-table-column
        prop="submitTime"
        header-align="center"
        align="center"
        :label="$t('developer_app.app_submit_time')">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="bottom">
            <div slot="content">
              <span>{{ formatDate(scope.row.submitTime, 'yyyy-MM-dd hh:mm:ss') }}</span>
            </div>
            <label>{{ formatDate(scope.row.submitTime, 'yyyy-MM-dd') }}</label>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        min-width="100"
        :label="$t('developer.status')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 2" size="small" type="warning">
            {{ $t('developer_app.sign.status_option[2].label') }}
          </el-tag>
          <el-tag v-if="scope.row.status === 1" size="small">{{
              $t('developer_app.sign.status_option[1].label')
            }}
          </el-tag>
          <el-tag v-if="scope.row.status === 0" size="small" type="info">
            {{ $t('developer_app.sign.status_option[0].label') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="signName"
        header-align="center"
        align="center"
        min-width="100"
        :label="$t('developer_app.signer')">
        <template slot-scope="scope">
          {{ getSigner(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        min-width="95px"
        :label="$t('common.operate')">
        <template slot-scope="scope">
          <el-button type="text" @click="infoHandle(scope.row.appId, scope.row.appVersionId)">{{ $t('developer.operate_detail') }}</el-button>
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

    <app-version-detail v-if="appVersionDetailVisible" ref="appVersionDetail" @close="appVersionDetailVisible = false"></app-version-detail>
  </div>
</template>

<script>
import {formatDate} from '@/utils/formatDate'
import {formatCountry} from '@/utils/formatCountry'
import { signAppList } from '../../../api/developer-app'
import AppVersionDetail from './components/app-version-detail'
export default {
  components: {
    AppVersionDetail
  },
  data () {
    return {
      dataForm: {
        appName: '',
        developerType: null,
        status: null
      },
      appVersionDetailVisible: false,
      dataList: [],
      pageNo: 1,
      pageSize: 10,
      rows: 0,
      dataListLoading: false
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    iconView (icon) {
      console.log(icon)
      if (icon) {
        return process.env.ICON_API + icon
        // return icon
      }
      return 'static/img/Android.png'
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      let params = {
        'pageNo': this.pageNo,
        'pageSize': this.pageSize,
        'status': this.dataForm.status,
        'appName': this.dataForm.appName
      }
      signAppList(params).then(data => {
        this.dataList = data.data
        this.rows = data.rows
        this.dataListLoading = false
      }).catch(e => {
        // this.$message.error(e.message)
        this.dataListLoading = false
        console.log(`err:${JSON.stringify(e)}`)
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
    formatDate (cellValue, fmt) {
      return formatDate(cellValue, fmt)
    },
    formatCountry (row, column, cellValue, index) {
      return formatCountry(cellValue)
    },
    getSigner (row) {
      console.log(row)
      if (row.signer) {
        return row.signer + ': ' + this.formatDate(row.signTime, 'yyyy-MM-dd hh:mm:ss')
      }
      return ''
    },
    infoHandle (appId, appVersionId) {
      this.appVersionDetailVisible = true
      console.log('appId', appId)
      console.log('appVersionId', appVersionId)
      this.$nextTick(() => {
        this.$refs.appVersionDetail.init(appId, appVersionId)
      })
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
  text-align: right;
}
</style>
