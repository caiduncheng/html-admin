<template>
  <el-dialog
    :visible.sync="visible"
    width="500px"
    class="issue-task-dialog"
    @close="close">
    <div slot="title" :style="`color:${tabItem.color}`">
      <span>{{tabItem.label}}</span>
      <span class="number-badge" :style="`background:${tabItem.color}`">{{totalPage}}</span>

    </div>
    <div class="content">
      <div v-if="dataList.length > 0">
      <div v-for="(item,index) in dataList" :key="index" class="issue-div" @click="goToDetail(item[itemKey[itemType].id], item)">
        <div class="flex">
          <div  class="one-line">
            <el-tag size="mini" v-if="item[itemKey[itemType].priority]" :type="$t(`common.priorityLevel[${item[itemKey[itemType].priority] - 1}].type`)">{{$t(`common.priorityLevel[${item[itemKey[itemType].priority] - 1}].label`)}}</el-tag>
            <span v-else style="width: 36px"></span>
            #{{item[itemKey[itemType].id]}}
            <span>{{item[itemKey[itemType].title]}}</span>
          </div>
        </div>
        <div v-if="itemType === 1 || itemType === 2" style="font-size:12px;color: #bbb;">{{item[itemKey[itemType].startDate] ? item[itemKey[itemType].startDate].substr(0, 10) : ''}} -- {{item[itemKey[itemType].endDate] ? item[itemKey[itemType].endDate].substr(0, 10) : ''}}</div>
        <!-- <div>
          <div class="one-line" style="font-size:16px;">{{item[itemKey[itemType].title]}}</div>
        </div> -->
      </div></div>
      <div v-else>{{$t('common.noData')}}</div>
    </div>
    <el-pagination
      small
      layout="total, prev, pager, next"
      :page-size="pageSize"
      :total="totalPage"
      :current-page="pageIndex"
      @current-change="currentChangeHandle">
    </el-pagination>
  </el-dialog>
</template>

<script>
import { commonApi } from '@/api'
import { pageMixins } from '@/mixins/pagination-mixins'

export default {
  mixins: [pageMixins],
  props: {
    orgId: {
      type: Number,
      default: null
    },
    orgName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      visible: false,
      tabItem: {},
      itemType: 0,
      dataList: [],
      itemKey: [
        {title: 'issTitle', id: 'issId', priority: 'issPriority', endDate: 'endDate', startDate: 'startDate'},
        {title: 'taskName', id: 'taskId', priority: 'taskPriority', endDate: 'expeEndDate', startDate: 'expeStartDate'},
        {title: 'issName', id: 'issId', priority: 'taskPriority', endDate: 'expeEndDate', startDate: 'expeStartDate'}
      ],
      pageSize: 15
    }
  },
  computed: {
    departIssType () {
      return this.$store.getters['common/departIssType']
    }
  },
  methods: {
    // 显示详情
    getDataList (tabItem, itemType) {
      this.visible = true
      this.tabItem = tabItem || this.tabItem
      this.itemType = itemType || this.itemType
      let params = {}
      let method = ''
      switch (this.itemType) {
        case 0:
          params = {
            'page': this.pageIndex,
            'limit': this.pageSize,
            'clickType': 1,
            'tabIndex': this.orgId ? 7 : ([4, 5].includes(this.tabItem.value) ? 5 : 1),
            'state': this.tabItem.value,
            'orgId': this.orgId,
            'sort': 0,
            'departIssType': this.orgId ? this.departIssType : '', // 跳到所有需要departIssType
            'inside': 0,
            'isList': 1
          }
          method = '/issue/issueinfo/list'
          break
        case 1:
          params = {
            'page': this.pageIndex,
            'limit': this.pageSize,
            'myTask': 1,
            'taskState': this.tabItem.value
          }
          method = '/issue/task/list'
          break
        case 2:
          params = {
            'type': this.tabItem.type,
            'page': this.pageIndex,
            'limit': this.pageSize
          }
          method = '/issue/iterate/home/list'
          break
      }
      commonApi(method, params).then(data => {
        this.dataList = data.page.list
        this.totalPage = data.page.totalCount
      })
    },
    goToDetail (id, item) {
      switch (this.itemType) {
        case 0:
          if (!this.isAuth('issue:issueinfo:count')) return this.$message.warning(this.$t('homeCard.noToIssue'))
          this.$router.push({
            path: '/issue-reply',
            query: {
              replyInfo: this.$Base64.encode(JSON.stringify({
                issId: id
              }))
            }
          })
          break
        case 1:
          this.$store.commit('common/saveHomeToTask', {id: id})
          this.$router.push('/issue-myTask')
          break
        case 2:
          this.$store.commit('common/updataInfoiterationName', item.issName)
          this.$store.commit('common/updataIterationUserId', item.issUserId)
          this.$router.push({
            path: '/proManagement-detail',
            query: {
              info: this.$Base64.encode(JSON.stringify({
                proId: Number(item.proId),
                proName: item.proName,
                proManager: item.proManager,
                iterId: id,
                underPro: false,
                issueReply: true
              }))
            }
          })
          break
      }
      this.close()
    },
    close () {
      this.visible = false
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
  .issue-task-dialog{
    .one-line{
      white-space: nowrap;
      overflow: hidden;
      text-overflow:ellipsis;
    }
    .content{
      overflow-y: auto;
      max-height:calc(100vh - 300px);
      width: 460px;
    }
    .issue-div{
      margin-top: 5px;
      padding: 5px 0;
    &:first-child{
      padding-top: 0;
    }
      .at-time{
        display: inline-flex;
        align-items: center;
        font-size: 14px;
        color: #bbb;
      }
      &:hover{
        cursor: pointer;
        // box-shadow: 0px 8px 8px -8px rgba(0, 0, 0, 0.1);
        // transition: box-shadow 1s;
        color: #17b3a3;
      }
    }
  }
</style>
<style lang="scss" scoped>
.issue-task-dialog .el-dialog__header{
  font-weight:bold;
  padding-top:20px!important;
  display:flex;
  align-items: center;
  .number-badge{
    display: inline-block;
    margin-left: 5px;
    padding: 1px 8px;
    font-size:12px;
    // font-weight:600;
    color: #fff;
    border-radius: 10px;
  }
}
</style>
