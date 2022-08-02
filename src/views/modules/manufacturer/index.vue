<template>
  <div class="app-container">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-input v-model="dataForm.name"
                  maxlength="32"
                  @blur="() => dataForm.name = dataForm.name.trim()"
                  @keyup.enter.native="getDataList(pageNo = 1)"
                  :placeholder="$t('manufacturer.name')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.manufacturerCode"
                  maxlength="4"
                  @blur="() => dataForm.manufacturerCode = dataForm.manufacturerCode.trim()"
                  @keyup.enter.native="getDataList(pageNo = 1)"
                  :placeholder="$t('manufacturer.manufacturerCode')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList(pageNo = 1)" icon="el-icon-search">{{$t('common.query') }}</el-button>
        <el-button type="primary"
                   @click="addHandle"
                   style="margin: 5px 10px 5px 0px"
                   v-if="isAuth('10401200.MANAGE')"
                   icon="el-icon-circle-plus-outline">{{$t('manufacturer.addBtn')}}
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      v-loading="dataListLoading"
      border
      :cell-style="cellStyle"
      height="calc(100vh - 190px)"
      style="width: 100%;">
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        :label="$t('manufacturer.name')">
      </el-table-column>
      <el-table-column
        prop="shortName"
        header-align="center"
        align="center"
        :label="$t('manufacturer.shortName')">
      </el-table-column>
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        :label="$t('manufacturer.account')">
      </el-table-column>
      <el-table-column
        prop="manufacturerCode"
        header-align="center"
        align="center"
        :label="$t('manufacturer.manufacturerCode')">
      </el-table-column>
      <el-table-column
        prop="email"
        header-align="center"
        align="center"
        :label="$t('manufacturer.email')">
      </el-table-column>
      <el-table-column
        prop="address"
        header-align="center"
        align="center"
        :label="$t('manufacturer.address')">
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
        v-if="isAuth('10401200.MANAGE')"
        header-align="center"
        align="center"
        :label="$t('common.operate')">
        <template slot-scope="scope">

          <el-tooltip class="item" effect="dark" content="Modify" placement="top">
            <el-button style="color: #FF7F50"  @click="updateHandle(scope.row.manufacturerId)" icon="el-icon-edit" />
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

    <add-manufacturer v-if="addManufacturerVisible" ref="addManufacturer" @refreshDataList="getDataList"
              @close="addManufacturerVisible = false"></add-manufacturer>
  </div>
</template>

<script>
import {formatDate} from '@/utils/formatDate'
import {formatCountry} from '@/utils/formatCountry'
import AddManufacturer from '../../../views/modules/device/add-manufacturer'
import {
  page
} from '../../../api/manufacturer'

export default {
  components: {
    AddManufacturer
  },
  data () {
    return {
      addManufacturerVisible: false,
      dataForm: {
        name: '',
        manufacturerCode: ''
      },
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
    // 获取数据列表
    getDataList () {
      console.log('刷新数据')
      this.dataListLoading = true
      let params = {
        'pageNo': this.pageNo,
        'pageSize': this.pageSize,
        'manufacturerCode': this.dataForm.manufacturerCode,
        'name': this.dataForm.name
      }
      page(params).then(data => {
        this.dataList = data.data
        this.rows = data.rows
        this.dataListLoading = false
      }).catch(e => {
        // this.$message.error(e.message)
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
      cellValue = new Date(cellValue).valueOf()
      return formatDate(cellValue, fmt)
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
    addHandle () {
      this.addManufacturerVisible = true
      this.$nextTick(() => {
        this.$refs.addManufacturer.init()
      })
    },
    updateHandle (id) {
      this.addManufacturerVisible = true
      this.$nextTick(() => {
        this.$refs.addManufacturer.init(id)
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
