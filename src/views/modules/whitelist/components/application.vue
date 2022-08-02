<template>
  <div class="app-container">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-input v-model="dataForm.appPkgName" :placeholder="$t('white_list.application')"
                  maxlength="100"
                  @blur="() => dataForm.appPkgName = dataForm.appPkgName.trim()"
                  @keyup.enter.native="getDataList(pageNo = 1)"
                  clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList(pageNo = 1)" icon="el-icon-search">{{ $t('common.query') }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border style="width: 100%;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-descriptions>
            <el-descriptions-item :label="$t('white_list.pubKey')">{{ props.row.pubKey }}</el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column
        prop="appPkgName"
        header-align="center"
        align="center"
        min-width="80px"
        :label="$t('white_list.application')">
      </el-table-column>
      <el-table-column
        prop="creTime"
        header-align="center"
        align="center"
        :formatter="formatDate"
        min-width="80px"
        :label="$t('group.operator.bindTime')">
      </el-table-column>
      <el-table-column
        prop="updTime"
        header-align="center"
        align="center"
        :formatter="formatDate"
        min-width="80px"
        :label="$t('common.updateTime')">
      </el-table-column>
      <el-table-column
        v-if="isAuth('10401000.MANAGE')"
        header-align="center"
        align="center"
        width="315"
        :label="$t('common.operate')">
        <template slot-scope="scope">
<!--          <el-button type="primary" @click="bindHandle(scope.row.id)">Bind</el-button>-->
          <el-tooltip class="item" effect="dark" content="Bind Operator" placement="top">
            <el-button  @click="bindHandle(scope.row.id)">
              <icon-svg name="bind"></icon-svg>
            </el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="Modify" placement="top">
            <el-button style="color: #FF7F50"  @click="modifyHandle(scope.row.id)" icon="el-icon-edit" />
          </el-tooltip>


          <el-tooltip class="item" effect="dark" content="Delete Whitelist" placement="top">
            <el-button  style="color: #DC143C" @click="deleteHandle(scope.row.id, scope.row.appPkgName)" icon="el-icon-delete"/>
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

    <add-or-update-application :visible.sync='visible' @close='visible = false' ref="addOrUpdate" @refreshDataList='init'> </add-or-update-application>
    <bind-operator :visible.sync='bindOperatorVisible' @close='bindOperatorVisible = false' ref="bind" @refreshDataList='init'> </bind-operator>

<!--    <bind-operator v-if="bindOperatorVisible" :visible.sync="bindOperatorVisible" :child-data="{id: this.id}"/>-->
  </div>
</template>

<script>
import {formatDate} from '@/utils/formatDate'
import {whiteListPage, deleteApp} from '../../../../api/whitelist'
import AddOrUpdateApplication from './add-or-update-application'
import BindOperator from './bind-operator'

export default {
  components: {
    AddOrUpdateApplication,
    BindOperator
  },
  data () {
    return {
      dataForm: {
        appPkgName: ''
      },
      visible: false,
      bindOperatorVisible: false,
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
      this.bindOperatorVisible = false
      this.pageNo = 1
      this.getDataList()
    },
    formatDate (row, column, cellValue, index) {
      return formatDate(cellValue, 'yyyy-MM-dd  hh:mm:ss')
    },
    getDataList () {
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        appPkgName: this.dataForm.appPkgName
      }
      console.log(params)
      this.dataListLoading = true
      whiteListPage(params).then((data) => {
        console.log(data)
        this.dataList = data.data
        this.rows = data.rows
        this.dataListLoading = false
      }).catch(e => {
        this.dataListLoading = false
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
    deleteHandle (id, appPkgName) {
      this.$confirm(this.$t('white_list.tipDeleteApplication', {appPkgName: appPkgName}), '', {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.dataListLoading = true
        deleteApp(id).then((data) => {
          this.getDataList()
        }).catch(e => {
        })
        this.dataListLoading = false
      })
    },
    modifyHandle (id) {
      this.visible = true
      console.log(id)
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    bindHandle (id) {
      this.bindOperatorVisible = true
      this.$nextTick(() => {
        this.$refs.bind.init(id)
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
