<template>
<div class="app-container">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-input v-model="dataForm.name"
                  maxlength="32"
                  @blur="() => dataForm.name = dataForm.name.trim()"
                  @keyup.enter.native="getDataList(pageNo = 1)"
                  :placeholder="$t('contact.name')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.company"
                  maxlength="32"
                  @blur="() => dataForm.company = dataForm.company.trim()"
                  @keyup.enter.native="getDataList(pageNo = 1)"
                  :placeholder="$t('contact.company')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.content"
                  maxlength="32"
                  @blur="() => dataForm.content = dataForm.content.trim()"
                  @keyup.enter.native="getDataList(pageNo = 1)"
                  :placeholder="$t('contact.content')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.type" clearable :placeholder="$t('contact.type')">
          <el-option
            v-for="type in typeList"
            :key="type.val"
            :value="type.val"
            :label="type.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.role" clearable :placeholder="$t('contact.role')">
          <el-option
            v-for="role in roleList"
            :key="role.val"
            :value="role.val"
            :label="role.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.status" clearable :placeholder="$t('contact.status')">
          <el-option
            v-for="status in statusList"
            :key="status.val"
            :value="status.val"
            :label="status.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.remark"
                  maxlength="32"
                  @blur="() => dataForm.remark = dataForm.remark.trim()"
                  @keyup.enter.native="getDataList(pageNo = 1)"
                  :placeholder="$t('contact.remark')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList(pageNo = 1)" icon="el-icon-search">{{$t('common.query') }}</el-button>
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
        :label="$t('contact.name')">
      </el-table-column>
      <el-table-column
        prop="email"
        header-align="center"
        align="center"
        :label="$t('contact.email')">
      </el-table-column>
      <el-table-column
        prop="company"
        header-align="center"
        align="center"
        min-width="100"
        :label="$t('contact.company')">
      </el-table-column>
      <!-- <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        min-width="100"
        :label="$t('contact.mobile')">
      </el-table-column> -->
      <el-table-column
        prop="countryCode"
        header-align="center"
        align="center"
        min-width="120"
        :label="$t('contact.country_or_region')"
      >
      </el-table-column>
      <!-- <el-table-column
        prop="utcTime"
        header-align="center"
        align="center"
        min-width="100"
        label="UTC Time">
      </el-table-column>
      <el-table-column
        prop="language"
        header-align="center"
        align="center"
        min-width="100"
        label="language">
      </el-table-column> -->
      <el-table-column
        prop="content"
        header-align="center"
        align="center"
        min-width="150"
        :label="$t('contact.content')">
      </el-table-column>

      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        min-width="120"
        :label="$t('contact.type')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small" type="warning">{{  $t('contact.bank_or_acquirer')  }}</el-tag>
          <el-tag v-if="scope.row.type === 1" size="small">{{  $t('contact.distributor_or_reseller')  }}</el-tag>
          <el-tag v-if="scope.row.type === 2" size="small" type="info">{{  $t('contact.psp')  }}</el-tag>
          <el-tag v-if="scope.row.type === 3" size="small" type="success">{{  $t('contact.isv')  }}</el-tag>
          <el-tag v-if="scope.row.type === 4" size="small" type="danger">{{  $t('contact.others')  }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="role"
        header-align="center"
        align="center"
        :label="$t('contact.role')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.role === 0" size="small" type="warning">{{  $t('contact.manager')  }}</el-tag>
          <el-tag v-if="scope.row.role === 1" size="small">{{  $t('contact.marketing')  }}</el-tag>
          <el-tag v-if="scope.row.role === 2" size="small" type="info">{{  $t('contact.developer')  }}</el-tag>
          <el-tag v-if="scope.row.role === 3" size="small" type="danger">{{  $t('contact.others_role')  }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        min-width="80"
        :label="$t('contact.status')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" size="small">{{ $t('contact.handled') }}</el-tag>
          <el-tag v-if="scope.row.status === 0" size="small" type="info">{{ $t('contact.unhandled') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="creTime"
        header-align="center"
        align="center"
        min-width="95"
        :label="$t('common.createTime')">
      </el-table-column>
      <el-table-column
        prop="updTime"
        header-align="center"
        align="center"
        min-width="95"
        :label="$t('contact.handling_time')">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        min-width="100"
        :label="$t('contact.remark')">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        :label="$t('contact.operation')">
        <template slot-scope="scope">

          <el-tooltip class="item" effect="dark" :content="$t('contact.edit_remark')" placement="top">
            <el-button style="color: #8c939d" @click="manageHandle(scope.row.messageRecordId)"
                       icon="el-icon-info"></el-button>
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

    <el-dialog
      :visible="this.visible"
      :title="$t('contact.edit_remark')"
      width="35%"
      height="50%"
      @close="cancel">
      <br>
      <el-form ref="editForm" :rules="rules" :model="form" label-width="150px">
        <el-form-item :label="$t('contact.name')" style="margin: 20px; width: 80%" prop="name">
          <el-input v-model="form.name"  disabled show-word-limit clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('contact.content')" style="margin: 20px; width: 80%" prop="content">
          <el-input v-model="form.content"  disabled show-word-limit clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('contact.remark')" style="margin: 20px ;width: 80%" prop="remark">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 10}"
            v-model="form.remark"
            @blur="() => form.remark = form.remark.trim()"
            maxlength="1024" show-word-limit clearable>
          </el-input>
        </el-form-item>
      </el-form>
      <div align="center" style="margin: 10px 0 10px 0">
        <span>
          <el-button  v-if="isAuth('10408204.MANAGE')" type='danger'  @click="cancel">{{$t('common.cancel')}}</el-button>
          <el-button  v-if="isAuth('10408204.MANAGE')" type='primary' :loading="dataListLoading" @click="submit(form)">{{$t('common.confirm')}}</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {formatDate} from '@/utils/formatDate'
import {getMessageRecords, addRemark} from '../../../api/contact'
export default {
  components: {
  },
  computed: {
    statusList () {
      return [
        { val: 0, label: this.$t('contact.unhandled') },
        { val: 1, label: this.$t('contact.handled') }
      ]
    },
    typeList () {
      return [
        { val: 0, label: this.$t('contact.bank_or_acquirer') },
        { val: 1, label: this.$t('contact.distributor_or_reseller') },
        { val: 2, label: this.$t('contact.psp') },
        { val: 3, label: this.$t('contact.isv') },
        { val: 4, label: this.$t('contact.others') }
      ]
    },
    roleList () {
      return [
        { val: 0, label: this.$t('contact.manager') },
        { val: 1, label: this.$t('contact.marketing') },
        { val: 2, label: this.$t('contact.developer') },
        { val: 3, label: this.$t('contact.others_role') }
      ]
    },
    rules () {
      return {
        remark: [
          {
            required: true,
            message: this.$t('contact.remark_not_null_tip'),
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  data () {
    return {
      dataForm: {
        name: '',
        company: '',
        content: '',
        remark: ''
      },
      dataList: [],
      pageNo: 1,
      pageSize: 10,
      rows: 0,
      dataListLoading: false,
      visible: false,
      form: {
        name: '',
        content: '',
        remark: '',
        messageRecordId: ''
      }
    }
  },
  activated () {
    this.init()
  },
  methods: {
    async init () {
      await this.getDataList()
    },

    getDataList () {
      this.dataListLoading = true
      let params = {
        'pageNo': this.pageNo,
        'pageSize': this.pageSize,
        'status': this.dataForm.status,
        'type': this.dataForm.type,
        'role': this.dataForm.role,
        'name': this.dataForm.name,
        'company': this.dataForm.company,
        'content': this.dataForm.content,
        'remark': this.dataForm.remark
      }
      getMessageRecords(params).then(data => {
        this.dataList = data.list
        this.rows = data.total
        this.dataListLoading = false
        for (var i = 0; i < data.list.length; i++) {
          if (data.list[i].countryCode !== null && data.list[i].countryCode !== '') {
            this.dataList[i].countryCode = this.$t('country_or_region.' + data.list[i].countryCode)
          }
          this.dataList[i].creTime = formatDate(data.list[i].creTime, 'yyyy-MM-dd  hh:mm:ss')
          this.dataList[i].updTime = formatDate(data.list[i].updTime, 'yyyy-MM-dd  hh:mm:ss')
        }
      }).catch(e => {
        // this.$message.error(e.message)
        console.log(`err:${JSON.stringify(e)}`)
      })
    },
    cellStyle ({row, column, rowIndex, columnIndex}) {
      let value = row[column.property]
      if (value != null) {
        if (column.property === 'creTime') {
          value = formatDate(row[column.property], 'yyyy-MM-dd')
        }
        if (value.length * 13 > column.width) {
          return 'font-size:' + (column.width * 0.95) / value.length + 'px'
        }
      }
      // console.log(rowIndex + ':' + JSON.stringify(row))
      //  console.log(columnIndex + ':' + JSON.stringify(column))
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
    manageHandle (messageRecordId) {
      this.visible = true
      let params = {
        'messageRecordId': messageRecordId
      }
      getMessageRecords(params).then(data => {
        this.form.name = data.list[0].name
        this.form.content = data.list[0].content
        this.form.remark = data.list[0].remark
        this.form.messageRecordId = messageRecordId
      })
    },
    cancel () {
      this.$emit('close')
      this.visible = false
    },
    submit (form) {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          let params = {
            'messageRecordId': form.messageRecordId,
            'remark': form.remark
          }
          addRemark(params).then(data => {
            this.$message.success(this.$t('common.success'))
            this.getDataList()
            this.visible = false
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scope>

</style>
