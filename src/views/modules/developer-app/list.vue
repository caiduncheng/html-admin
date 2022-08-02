<template>
  <div class="develop">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-input v-model="dataForm.appName" :placeholder="$t('appstore.application.appName')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.developerName" :placeholder="$t('appstore.application.developerName')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.status" clearable :placeholder="$t('developer_app.status')">
          <el-option v-for="item in $t('developer_app.status_option')" :key="item.value" :value="item.value"
                     :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.appCategoryId" clearable :placeholder="$t('developer_app.category')">
          <el-option v-for="item in categoryList" :key="item.categoryId" :value="item.categoryId"
                     :label="item.categoryName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getAppDataList(pageNo = 1)" icon="el-icon-search">{{ $t('common.query') }}</el-button>
      </el-form-item>
    <el-table :data="appList" v-loading="dataListLoading" border style="width: 100%;">
      <el-table-column
        prop="appIconUrl"
        header-align="center"
        align="center"
        :label="$t('developer_app.icon')">
        <template slot-scope="scope">
          <img :src="iconView(scope.row.appIconUrl)" style="height: 48px;width: 48px">
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
        prop="appVersionCode"
        header-align="center"
        align="center"
        :label="$t('developer_app.version_code')">
      </el-table-column>
      <el-table-column
        prop="creTime"
        header-align="center"
        align="center"
        :label="$t('developer_app.app_submit_time')">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="bottom">
            <div slot="content">
              <span>{{ formatDate(scope.row.creTime, 'yyyy-MM-dd hh:mm:ss') }}</span>
            </div>
            <label>{{ formatDate(scope.row.creTime, 'yyyy-MM-dd') }}</label>
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
          <el-tag v-if="scope.row.status === 11" size="small" type="warning">
            {{ $t('developer_app.status_option[0].label') }}
          </el-tag>
          <el-tag v-if="scope.row.status === 9" size="small">{{
              $t('developer_app.status_option[1].label')
            }}
          </el-tag>
          <el-tag v-if="scope.row.status === 7" size="small" type="info">
            {{  $t('developer_app.status_option[2].label') }}
          </el-tag>
          <el-tag v-if="scope.row.status === 6" size="small" type="warning">
            {{  $t('developer_app.status_option[3].label') }}
          </el-tag>
          <el-tag v-if="scope.row.status === 3" size="small" type="info">
            {{  $t('developer_app.status_option[4].label') }}
          </el-tag>
          <el-tag v-if="scope.row.status === 1" size="small" type="info">
            {{  $t('developer_app.status_option[5].label') }}
          </el-tag>
          <el-tag v-if="scope.row.status === 0" size="small" type="info">
            {{  $t('developer_app.status_option[6].label') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        min-width="95px"
        :label="$t('common.operate')">
        <template slot-scope="scope">
          <el-button type="text" @click="showDetailHandle(scope.row.appId, scope.row.appVersionId)">{{ $t('developer.operate_detail') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-form>

    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNo"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="rows"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
import {getSysAppList, getAppInfoPage} from '@/api/developer-app'
import {formatDate} from '@/utils/formatDate'
import {formatCountry} from '@/utils/formatCountry'

export default {
  components: {
  },
  data () {
    return {
      dataForm: {
        appName: '',
        developerName: '',
        chargeStrategy: '',
        status: null,
        appCategoryId: null
      },
      categoryList: [],
      appList: [],
      loading: false,
      dataListLoading: false,
      noMore: false,
      busy: false,
      pageNo: 1,
      pageSize: 10,
      rows: 0,
      clickCategoryId: null,
      clickAppId: 0
    }
  },
  computed: {
    colHeight () {
      return this.$store.state.common.documentClientHeight - 82 - 80
    },
    categoryTotal () {
      // eslint-disable-next-line no-return-assign
      return this.categoryList !== [] ? this.categoryList.reduce((total, category) => total += category.appCount, 0) : 0
    }
  },
  activated () {
    this.dataForm.status = null
    // this.colHeight = this.$store.state.common.documentClientHeight - 82 - 80
    this.getCategoryDataList()
    this.getAppDataList()
  },
  methods: {
    iconView (icon) {
      if (icon) {
        return process.env.ICON_API + icon
      }
      return 'static/img/Android.png'
    },
    getCategoryDataList () {
      getSysAppList().then(data => {
        this.categoryList = data
      })
      for (let i = 0; i < this.categoryList; i++) {
        this.categoryList.categoryIconUrl = '/res/apps/category/portrait/' + this.categoryList.categoryIconUrl
      }
    },
    getAppDataList () {
      this.dataListLoading = true
      getAppInfoPage({
        'pageNo': this.pageNo,
        'pageSize': this.pageSize,
        'appCategoryId': this.dataForm.clickCategoryId,
        'appName': this.dataForm.appName,
        'developerName': this.dataForm.developerName,
        'chargeStrategy': this.dataForm.chargeStrategy,
        'status': this.dataForm.status
      }).then(data => {
        this.appList = data.data
        this.rows = data.rows
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageNo = 1
      this.getAppDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageNo = val
      this.getAppDataList()
    },
    formatDate (cellValue, fmt) {
      return formatDate(cellValue, fmt)
    },
    formatCountry (row, column, cellValue, index) {
      return formatCountry(cellValue)
    },
    loadMore () {
      if (this.pageNo > this.rows / this.pageSize) {
        this.loading = false
        this.busy = true
        this.noMore = true
        return
      }
      this.loading = true
      this.busy = false
      this.pageNo = this.pageNo + 1
      getAppInfoPage({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        appCategoryId: this.clickCategoryId
      }).then(data => {
        if (this.appList.length >= this.rows) {
          this.loading = false
          this.busy = true
          this.noMore = true
        } else {
          setTimeout(() => {
            this.appList = this.appList.concat(data.data.data)
            this.loading = false
          }, 1000)
        }
      })
    },
    showDetailHandle (appId, appVersionId) {
      this.$router.push({
        path: 'dev-app-detail',
        query: {
          appId: appId,
          appVersionId: appVersionId
        }
      })
    }
  }
}
</script>


<style lang="scss" scoped>
.app-store {
  .loadTxt {
    text-align: center;
    width: 100%;
    color: $--color-primary-text-sec;
    // z-index: 99;
  }
  .leftPart {
    // border-right: 1px solid $--color-primary-text;
    overflow-y: auto;
    .el-card {
      text-align: center;
      width: 92%;
      margin: 0 0 10px;
      padding: 5px 0;
      box-shadow: none;
      cursor: pointer;
      // &:hover {
      //  transform: scale(1.1);
      //   box-shadow: 0 2px 12px 0 #0000001a;
      //   color: $--color-primary;
      // }
    }
  }
  .rightPart {
    flex-wrap: wrap;
    align-content: flex-start;
    overflow: auto;
    .app-item {
      height: 240px;
      .el-image {
        width: 100px;
        height: 100px;
        border-radius: 5px;
      }
      cursor: pointer;
      text-align: center;
      margin: 2px 0 10px;
      transition: all .5s;
      p {
        margin: 0;
        line-height: 1.2rem;
        font-size: small;
      }
      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
.active {
  background-color: #ffffff !important;
  border: 1px solid #409EFF;
}
.el-form-item {
  margin-bottom: 10px;
}
.el-form {
  margin-top: 10px;
}
</style>
