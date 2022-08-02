<template>
  <div>
    <el-table v-loading="dataListLoading" :data="dataList" border style="width: 100%;">
      <el-table-column
        prop="appVersionId"
        header-align="center"
        align="center"
        min-width="80px"
        :label="$t('appstore.application.appVersionId')">
      </el-table-column>
      <el-table-column
        prop="appVersion"
        header-align="center"
        align="center"
        min-width="80px"
        :label="$t('appstore.application.appVersion')">
      </el-table-column>
      <el-table-column
        prop="revision"
        header-align="center"
        align="center"
        min-width="300px"
        :label="$t('appstore.application.revision')">
          <template slot-scope="scope">
              <el-input
                      v-model="scope.row.revision"
                      :maxlength=512
                      :rows="5"
                      type="textarea"
                      disabled
              />
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
  </div>
</template>
<script>
  import {appRevisionList} from '@/api/developer-app'
  import {HTMLDecode} from '../../../../utils'

  export default {
    data () {
      return {
        dataList: [],
        appId: 0,
        pageNo: 1,
        pageSize: 10,
        rows: 0,
        dataListLoading: false
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.appId = id
        this.getAppRevisionList()
      },
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageNo = 1
        this.getAppRevisionList()
      },
      currentChangeHandle (val) {
        this.pageNo = val
        this.getAppRevisionList()
      },
      getAppRevisionList () {
        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
        this.dataListLoading = true
        appRevisionList(this.appId, params).then(data => {
          this.dataList = data.data
          if (this.dataList.length > 0) {
            for (var i = 0, l = this.dataList.length; i < l; i++) {
              this.dataList[i].revision = HTMLDecode(this.dataList[i].revision)
            }
          }

          this.rows = data.rows
          this.dataListLoading = false
        }).catch(e => {
          this.dataListLoading = false
          console.log(`err:${JSON.stringify(e)}`)
        })
      }
    }
  }
</script>
<style lang="scss">
  .el-pagination {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
