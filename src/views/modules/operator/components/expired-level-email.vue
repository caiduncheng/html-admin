<template>
  <el-dialog :visible='visible' @close='handleClose' :title="$t('operator.level_expired_mail')" width='30%'>
    <el-form :inline="true" :model="dataForm">
      <!--      <el-form-item>
              <el-input v-model="dataForm.operatorName" placeholder='E-mail' clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="getDataList(pageNo = 1)"></el-button>
            </el-form-item>-->
      <el-popover
        placement="right"
        width="300"
        v-model="addEmailVisible">
        <div style="text-align: left; margin: 0">
          <el-form :model="dataForm" @close="cancelEmailHandle">
            <el-input v-model="dataForm.email" :placeholder="$t('common.email')" style="width: 250px; padding: 8px"
                      maxlength="120"
                      @blur="() => dataForm.email = dataForm.email.trim()"
                      clearable></el-input>

            <div align="center" style="margin: 10px 0 10px 0">
                <span>
                  <el-button size="mini" type="danger"
                             @click="cancelEmailHandle">{{ $t('common.cancel') }}</el-button>
                <el-button type="primary" size="mini" :loading="addEmailLoading"
                           @click="addEmailHandle()">{{ $t('common.confirm') }}</el-button>
                </span>
            </div>
          </el-form>
        </div>
        <el-button v-if="isAuth('10408200.MANAGE')" type="success" slot="reference" icon="el-icon-plus"></el-button>
      </el-popover>
    </el-form>
    <el-table
      :data="dataList"
      v-loading="dataListLoading"
      border
      ref="multipleTable"
      style="margin: 2% 0 2% 0; width: 100%;"
    >
      <el-table-column
        prop="configValue"
        header-align="center"
        align="center"
        :label="$t('operator.email')">
      </el-table-column>
      <el-table-column
        prop="creTime"
        header-align="center"
        align="center"
        :label="$t('group.operator.creTime')">
        <template slot-scope="scope">
          <label>{{ formatDate(scope.row.creTime, 'yyyy-MM-dd  hh:mm:ss') }}</label>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        :label="$t('common.operate')">
        <template slot-scope="scope">

          <!--          <el-tooltip class="item" effect="dark" :content="$t('common.updateBtn')" placement="top">
                      <el-button @click="updateHandle(scope.row.configId)" style="color: #f8ae01" icon="el-icon-edit"></el-button>
                    </el-tooltip>-->
          <el-tooltip class="item" effect="dark" :content="$t('common.deleteBtn')" placement="top">
            <el-button style="color: #DC143C" @click="deleteHandle(scope.row.configId, scope.row.configValue)"
                       icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import {formatDate} from '@/utils/formatDate'
import {getRemindEmail, saveRemindEmail, deleteRemindEmail} from '@/api/operator'

export default {
  data () {
    return {
      visible: false,
      comfirmLoading: false,
      addEmailVisible: false,
      addEmailLoading: false,
      dataForm: {
        email: ''
      },
      dataList: [],
      dataListLoading: false,
      pageNo: 1,
      pageSize: 10,
      rows: 0
    }
  },
  created () {

  },
  methods: {
    init () {
      this.visible = true
      this.dataList = []
      this.pageNo = 1
      this.getDataList()
    },
    cancel () {
      this.visible = false
      this.$emit('close')
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageNo = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      console.log(val)
      this.pageNo = val
      this.getDataList()
    },
    formatDate (cellValue, fmt) {
      cellValue = new Date(cellValue).valueOf()
      return formatDate(cellValue, fmt)
    },
    getDataList () {
      this.dataListLoading = true
      let params = {
        operatorName: this.dataForm.operatorName,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      console.log(params)
      this.dataListLoading = true
      getRemindEmail().then(data => {
        this.dataListLoading = false
        console.log(data)
        this.dataList = data
        this.rows = data.rows
      }).catch((e) => {
        this.loading = false
        this.dataListLoading = false
      })
    },
    handleClose () {
      this.dataForm.email = ''
      this.visible = false
      this.comfirmLoading = false
    },
    addEmailHandle () {
      const entity = {
        'configValue': this.dataForm.email
      }
      this.addEmailLoading = true
      saveRemindEmail(entity).then(data => {
        this.getDataList()
        this.addEmailLoading = false
        this.addEmailVisible = false
        this.dataForm.email = ''
      }).catch((e) => {
        this.addEmailLoading = false
      })
    },
    cancelEmailHandle () {
      this.addEmailVisible = false
      this.dataForm.email = ''
    },
    updateHandle (id) {
    },
    deleteHandle (id, email) {
      this.$confirm(this.$t('operator.tipDeleteEmail', {email: email}), '', {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel')
      }).then(() => {
        deleteRemindEmail(id).then(data => {
          this.getDataList()
        })
      })
    }
  }
}
</script>
