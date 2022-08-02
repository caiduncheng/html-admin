<template>
    <div class="develop">
        <el-form :inline="true" :model="dataForm">
            <!--      <el-form-item>
                    <el-input v-model="dataForm.name" :placeholder="$t('developer.name')" clearable></el-input>
                  </el-form-item>-->
            <el-form-item>
                <el-select v-model="dataForm.status" clearable :placeholder="$t('developer.status')">
                    <el-option v-for="item in $t('developer.statusOption')" :key="item.value" :value="item.value"
                               :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="dataForm.developerType" clearable :placeholder="$t('developer.developerType')">
                    <el-option v-for="item in $t('developer.developerTypeOption')" :key="item.value" :value="item.value"
                               :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getDataList(pageNo = 1)" icon="el-icon-search">{{ $t('common.query') }}</el-button>
            </el-form-item>

        </el-form>
        <el-table :data="dataList" v-loading="dataListLoading" border style="width: 100%;">
            <el-table-column
                    prop="name"
                    header-align="center"
                    align="center"
                    :label="$t('developer.name')">
              <template slot-scope="scope">
                <label type="text" v-if="scope.row.developerType === 1">{{ scope.row.lastName }}</label>
                <label type="text">{{ scope.row.firstName }}</label>
              </template>
            </el-table-column>
          <el-table-column
            prop="developerType"
            header-align="center"
            align="center"
            :label="$t('developer.developerType')">
            <template slot-scope="scope">
              <el-tag type="text" v-if="scope.row.developerType === 1">
                {{ $t('developer.developerTypeOption[0].label') }}
              </el-tag>
              <el-tag type="text" v-if="scope.row.developerType === 2">
                {{ $t('developer.developerTypeOption[1].label') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="pidType"
            header-align="center"
            align="center"
            :label="$t('developer.pidType')">
            <template slot-scope="scope">
              <el-tag type="text" v-if="scope.row.developerType === 1">
                {{ scope.row.pidType === 1 ? $t('developer.id_card') : scope.row.pidType === 2 ? $t('developer.passport') : $t('developer.unknown')}}
              </el-tag>
            </template>
          </el-table-column>
            <el-table-column
                    prop="pidNo"
                    header-align="center"
                    align="center"
                    :label="$t('developer.pidNo')">
            </el-table-column>
            <el-table-column
                    prop="email"
                    header-align="center"
                    align="center"
                    :label="$t('developer.email')">
            </el-table-column>
          <el-table-column
            prop="status"
            header-align="center"
            align="center"
            min-width="100"
            :label="$t('developer.status')">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 2" size="small" type="warning">
                {{ $t('developer.statusOption[2].label') }}
              </el-tag>
              <el-tag v-if="scope.row.status === 1" size="small">{{
                  $t('developer.statusOption[1].label')
                }}
              </el-tag>
              <el-tag v-if="scope.row.status === 0" size="small" type="info">
                {{ $t('developer.statusOption[0].label') }}
              </el-tag>
              <el-tag v-if="scope.row.status === 3" size="small" type="danger">
                {{ $t('developer.statusOption[3].label') }}
              </el-tag>
              <el-tag v-if="scope.row.status === 9" size="small" type="info">
                {{ $t('developer.statusOption[5].label') }}
              </el-tag>
            </template>
          </el-table-column>
            <el-table-column
                    prop="creTime"
                    header-align="center"
                    align="center"
                    min-width="100"
                    :label="$t('developer.creTime')">
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
                    header-align="center"
                    align="center"
                    min-width="95px"
                    :label="$t('common.operate')">
                <template slot-scope="scope">
                    <el-button type="text" v-if="isAuth('10400000.QUERY')" @click="addOrUpdateHandle(scope.row, 'info')">{{ $t('developer.operate_detail') }}</el-button>
                    <el-button type="text" v-if="scope.row.status === 2 && isAuth('10400000.MANAGE')" @click="applyCert(scope.row)">{{ $t('developer.operate_apply_cert') }}</el-button>
                    <el-button type="text" v-if="scope.row.status === 9 && isAuth('10400000.MANAGE')" @click="download(scope.row)">{{ $t('developer.operate_download_cert') }}</el-button>
                    <el-button type="text" v-if="scope.row.status === 1 && isAuth('10400000.MANAGE')" @click="handleLock(scope.row.developerId)">{{ $t('developer.operate_lock') }}
                    </el-button>
                    <el-button type="text" v-if="scope.row.status === 0 && isAuth('10400000.MANAGE')" @click="handleUnLock(scope.row.developerId)">
                      {{ $t('developer.operate_unlock') }}
                    </el-button>
<!--                    <el-button type="text" v-if="scope.row.status === 1 || scope.row.status === 0"
                               @click="handleDelete(scope.row.developerId)">{{ $t('developer.operate_delete') }}
                    </el-button>-->
                    <el-button type="text" v-if="scope.row.status === 9 && isAuth('10400000.MANAGE')" @click="checkDeveloper(scope.row)">{{ $t('developer.operate_examine') }}</el-button>
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

        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"
                       @close="addOrUpdateVisible = false"></add-or-update>
        <check-developer v-if="checkDeveloperVisible" ref="checkDeveloper" @refreshDataList="getDataList"
                       @close="checkDeveloperVisible = false"></check-developer>
        <developer-apply-cert v-if="applyCertVisible" ref="applyCert" @refreshDataList="getDataList"
                     @close="applyCertVisible = false"></developer-apply-cert>
    </div>
</template>

<script>
import {formatDate} from '@/utils/formatDate'
import {formatCountry} from '@/utils/formatCountry'
import {developerList, lockDeveloper, unlockDeveloper, deleteDeveloper} from '../../../api/developer'
import AddOrUpdate from './developer-add-or-update'
import DeveloperApplyCert from './developer-apply-cert'
import CheckDeveloper from './check-developer'

export default {
  components: {
    AddOrUpdate,
    DeveloperApplyCert,
    CheckDeveloper
  },
  data () {
    return {
      dataForm: {
        name: '',
        developerType: null,
        status: null
      },
      addOrUpdateVisible: false,
      applyCertVisible: false,
      checkDeveloperVisible: false,
      cardBindBankId: 0,
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
      this.dataListLoading = true
      let params = {
        'pageNo': this.pageNo,
        'pageSize': this.pageSize,
        'developerType': this.dataForm.developerType,
        'status': this.dataForm.status,
        'name': this.dataForm.name
      }
      developerList(params).then(data => {
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
    addOrUpdateHandle (developer, operateType) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(developer, operateType)
      })
    },
    applyCert (developer) {
      this.applyCertVisible = true
      this.$nextTick(() => {
        this.$refs.applyCert.init(developer)
      })
    },
    download (developer) {
      if (developer) {
        const link = document.createElement('a')
        link.style.display = 'none'
        link.setAttribute('target', 'tempframe')
        link.setAttribute('href', process.env.ICON_API + '/online/developer-admin/developer/' + developer.developerId + '/cert')
        link.click()
      }
    },
    checkDeveloper (developer) {
      this.checkDeveloperVisible = true
      this.$nextTick(() => {
        this.$refs.checkDeveloper.init(developer)
      })
    },
    formatDate (cellValue, fmt) {
      return formatDate(cellValue, fmt)
    },
    formatCountry (row, column, cellValue, index) {
      return formatCountry(cellValue)
    },
    handleLock (developerId) {
      this.$confirm(this.$t('developer.comfirm_lock'), '', {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.dataListLoading = true
        lockDeveloper(developerId).then(data => {
          this.dataListLoading = false
          this.getDataList()
        }).catch(e => {
          this.dataListLoading = false
          console.log(`err:${JSON.stringify(e)}`)
        })
      })
    },
    handleUnLock (developerId) {
      this.$confirm(this.$t('developer.comfirm_unlock'), '', {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.dataListLoading = true
        unlockDeveloper(developerId).then(data => {
          this.dataListLoading = false
          this.getDataList()
        }).catch(e => {
          this.dataListLoading = false
          console.log(`err:${JSON.stringify(e)}`)
        })
      })
    },
    handleDelete (developerId) {
      this.$confirm(this.$t('developer.comfirm_delete'), '', {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.dataListLoading = true
        deleteDeveloper(developerId).then(data => {
          this.dataListLoading = false
          this.getDataList()
        }).catch(e => {
          this.dataListLoading = false
          console.log(`err:${JSON.stringify(e)}`)
        })
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
