<template>
  <div class="home-card" v-loading="warnLoading" :style="`max-height:${clientHeight > 670 ? clientHeight-80 + 'px' : '670px'}`">
    <div class="left border flex-column">
      <div class="container issue-div border" :style="showIssue ? 'display:block;' : 'display:none;'" style="height:270px">
        <div class="title">{{$t('homeCard.issue')}}</div>
        <div class="container-issue flex">
          <div v-for="(item, index) in issueTab" @click="goToIssueTab(item.value)" :key="item.value" style="width: 32%" class="flex tab-div">
              <icon-svg class="font_size" :name="`issue-${item.name}`" :style="`background:${item.color};box-shadow: 0 5px 10px ${item.shadow};`"></icon-svg>
              <!-- <i :class="[item.icon, 'font_size']" :style="`background:${item.color};box-shadow: 0 5px 10px ${item.shadow};`"></i> -->
              <div class="flex-column" style="justify-content: flex-start;">
                <div class="value-number" :style="`color:${item.color}`">{{issueCounts[index]}}</div>
                <div class="value-label" style="">
                  <span>{{item.label}}</span>
                  <i style="" class="el-icon-caret-right" @click.stop="openList(item, 0)"></i>
                </div>
              </div>
          </div>
        </div>
      </div>
      <div class="flex"  :style="`flex-grow:1;${showIssue ? 'max-height: calc(100% - 280px);' : 'min-height: calc(100%);'}max-height: calc(100% - 280px); overflow: hidden;`">
        <div v-if="envirVersion === 'product'" class="container border task-div" :style="`${showIssue ? '' : 'width:49%;margin-right:10px'}`">
          <div class="title">{{$t('homeCard.partiIter')}}</div>
          <div class="container-task flex-column">
            <div v-for="(item, index) in iterationTab" :key="item.value" style="height:100px" class="flex tab-div" @click="openList(item, 2)">
              <div class="font_size" :style="`font-size: 50px;display:flex;align-items:center;justify-content: center;background-color:${item.color};border-radius:50%;`">
                <img style="width:36px" :src="imageList[index]" alt="" srcset="">
              </div>
                <div class="flex-column" style="justify-content: space-between;">
                  <div class="value-number" :style="`color:${item.color}`">{{iterCounts[index]}}</div>
                  <div class="value-label" style="">
                    <span>{{item.label}}</span>
                <i class="el-icon-caret-right"></i>
                  </div>
                </div>
            </div>
          </div>
        </div>
        <div class="container border task-div" :style="`${showIssue ? '' : 'width:49%;margin-right:0'}`">
          <div class="title">{{$t('homeCard.task')}}</div>
          <div class="container-task flex-column">
            <div v-for="(item, index) in taskTab" :key="item.value" style="height:100px" class="flex tab-div" @click="goToTaskTab(item.value)">
              <icon-svg class="font_size" :name="`issue-${item.icon}`" :style="`background:${item.color};box-shadow: 0 5px 10px ${item.shadow};`"></icon-svg>
                <!-- <i :class="[item.icon, 'font_size']" :style="`background:${item.color};box-shadow: 0 5px 10px ${item.shadow};`"></i> -->
                <div class="flex-column" style="justify-content: space-between;">
                  <div class="value-number" :style="`color:${item.color}`">{{taskCounts[index]}}</div>
                  <div class="value-label" style="">
                    <span>{{item.label}}</span>
                <i class="el-icon-caret-right" @click.stop="openList(item, 1)"></i>
                  </div>
                </div>
            </div>
          </div>
        </div>
        <div class="border issueat-div container-issueat" :style="`${showIssue ? 'width: 32%;flex-grow: 1;' : 'display:none'}`">
          <div class="title flex" style="align-items:center">
              <span>@You</span>
            <span class="number-badge">{{atList.length}}</span>
          </div>
          <div class="content">
            <div v-for="item in atList" :key="item.id" class="at-div pointer" style="max-width: 500px;" @click="goToIssueDetail(item.issId)">
              <div class="issue-hover  one-line">
                <div class="" style="font-size:16px;"><a>#{{item.issId}}&nbsp;{{item.issTitle}}</a></div>
              </div>
              <div class="one-line"><span style="color:red;">{{item.fromUserName}}</span> @ you:
                <span>{{item.comment}}</span>
              </div>
                <div class="at-time" style="    display: flex;justify-content: flex-end;"><i class="el-icon-time"></i>{{formatDate('yyyy-MM-dd hh:mm:ss', new Date(item.timestamp))}}</div>
              <!-- <div class="flex" style="justify-content: flex-start;align-items:flex-end;flex-wrap: wrap;color: #606266;">
                <div><span style="color:red;">{{item.fromUserName}}</span> @ you：
                <span class="one-line" style="" :title="item.comment">{{item.comment}}</span>
                </div>
                <div class="at-time"><i class="el-icon-time"></i>2020-11-22 20:00:00</div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right border ">
      <div class=" container-issueat">
      <div class="title flex" style="align-items:center;margin-bottom:10px">
        <span>{{$t('homeCard.warning')}}</span>
        <span class="number-badge">{{warnList.length}}</span>
      </div>
      <div class="content border" v-loading="warnLoading" :style="`${isNpi ? '' : 'height:720px !important;'}`">
        <div v-for="(item,index) in warnList" :key="index" class="at-div pointer" @click="goToDetail(item.type, item.id, item)" style="padding:5px">
          <div class="flex">
            <div>
              <span style="display:inline-block;width:54px;"><el-tag size="mini" :type="item.type === 1 ? 'warning' : (item.type === 2 ? 'success' : 'primary')">{{item.type === 1 ? $t('homeCard.issue') : item.type === 3 ? $t('homeCard.task') : $t('homeCard.iteration')}}</el-tag>
             </span>
              <span :style="`color:${item.overTime < 0 ? '#e74c3c' : 'orange'};`">{{item.overTime < 0 ? $t('homeCard.overdue') : $t('homeCard.expire')}}<span style="font-weight:500"> {{Math.abs(item.overTime)}} {{$t('homeCard.day')}}</span></span>
              <!-- <span :style="`color:${item.overTime < 0 ? '#e74c3c' : 'orange'};font-weight:bold;`">{{item.overTime < 0 ? $t('homeCard.overdue') : $t('homeCard.expire')}}<span style="font-weight:500"> {{Math.abs(item.overTime)}} {{$t('homeCard.day')}}</span></span> -->
            </div>
          </div>
          <div class="warn-hover">
            <div class="one-line" style="font-size:16px;">
              <span style="display:inline-block;width:58px;">#{{item.id}}</span><span>{{item.title}}</span>
            </div>
          </div>
        </div>
      </div>
      </div>
      <div  class="content border" v-loading="warnLoading">
      <div v-if="$envirVersion === 'npi'" class="title flex" style="align-items:center;padding:10px" >
              <span>{{$t('homeCard.announce')}}</span>
              <span class="number-badge">{{annList.length}}</span>
              <span class="selectTotal" @click="goToAnn" >{{$t('homeCard.allAnn')}}></span>
      </div>
      <div class="content" v-if="$envirVersion === 'npi'" style="padding: 0 10px">
        <div v-for="item in annList" :key="item.id" class="space" style="max-width: 500px;cursor:pointer" @click="goToAnnDetail(item.annId)">
            <span  style="font-size:15px;">#{{item.annId}}&nbsp;{{item.annTitle}}</span>
            <span style="font-size:15px;"><i class="el-icon-time"></i>{{formatDate('yyyy-MM-dd', new Date(item.timestamp))}}</span>
        </div>
        <div v-for="item in anndataForm" :key="item.annId" class="space" style="max-width: 500px;cursor:pointer" @click="goToAnnDetail(item.annId)">
            <span  class="selected">#{{item.annId}}&nbsp;{{item.title}}</span>
            <span  class="selected"><i class="el-icon-time"></i>{{formatDate('yyyy-MM-dd', new Date(item.creTime))}}</span>
        </div>
      </div>
      </div>

    </div>
<!--    <list-dialog v-if="listDialogVisible" ref="listDialog" :orgId="orgId" :orgName="orgName" @close="listDialogVisible = false"></list-dialog>-->
  </div>
</template>
<script>
import { formatDate } from '@/utils/validate'
// import ListDialog from './issue-task-dialog'
import { getIssueCounts, getIssueTaskWarning, getPartiIterCounts, showAllAnnounce } from '@/api' // getIssueAtList
export default {
  data () {
    return {
      languageType: this.$cookie.get('languageType'),
      isNpi: false,
      anndataForm: [],
      issueCounts: [],
      taskCounts: [],
      iterCounts: [],
      warnList: [],
      listDialogVisible: false,
      orgId: null, // 部门主管
      orgName: '',
      showIssue: true, // 有无问题列表权限
      warnLoading: false,
      clientHeight: '',
      imageList: [
        require('@/assets/img/warning.png'),
        require('@/assets/img/bell.png'),
        require('@/assets/img/time.png')
      ]
      // atList: []
    }
  },
  computed: {
    atList () {
      return this.$store.state.common.wsDataList
    },
    annList () {
      return this.$store.state.common.AnnWsDataList
    },
    issueTab () {
      return this.$t('homeCard.issueStatus')
    },
    taskTab () {
      return this.$t('homeCard.taskStatus')
    },
    iterationTab () {
      return this.$t('homeCard.iterationTab')
    },
    envirVersion () {
      return this.$store.state.common.envirVersion
    }
  },
  components: {
    // ListDialog
  },
  activated () {
    this.clientHeight = document.body.clientHeight
    // this.listDialogVisible = false
    if (!this.isAuth('issue:issueinfo:count')) this.showIssue = false
    if (this.$envirVersion === 'npi') this.isNpi = true
    this.getDataList()
  },
  methods: {
    formatDate,
    getDataList () {
      getIssueCounts().then(data => {
        this.issueCounts.splice(0, 1, data.issueCounts.newCreate)
        this.issueCounts.splice(1, 1, data.issueCounts.inProgress)
        this.issueCounts.splice(2, 1, data.issueCounts.onHold)
        this.issueCounts.splice(3, 1, data.issueCounts.solved)
        this.issueCounts.splice(4, 1, data.issueCounts.closed)
        this.taskCounts.splice(0, 1, data.taskCounts.unStarted)
        this.taskCounts.splice(1, 1, data.taskCounts.processing)
        this.taskCounts.splice(2, 1, data.taskCounts.completed)
        this.orgId = data.issueCounts.org.orgId
        this.orgName = this.languageType === '0' ? data.issueCounts.org.orgName : data.issueCounts.org.orgNameEn
      })
      this.warnLoading = true
      getIssueTaskWarning().then(data => {
        this.warnList = data.warningList
      }).finally(() => {
        this.warnLoading = false
      })
      getPartiIterCounts().then(data => {
        this.iterCounts.splice(0, 1, data.count.overdueCount)
        this.iterCounts.splice(1, 1, data.count.aboutToExpire)
        this.iterCounts.splice(2, 1, data.count.processingCount)
      })
      showAllAnnounce().then(data => {
        console.log('data', data.page.list)
        data.page.list.forEach(el => {
          if (el.readStatus === 1) {
            this.anndataForm.push(el)
          }
        })
        console.log('anndataForm', this.anndataForm)
      })
    },
    // 跳转到问题列表相应状态
    goToIssueTab (status) {
      if (!this.isAuth('issue:issueinfo:count')) return this.$message.warning(this.$t('homeCard.noToIssue'))
      this.$store.commit('common/saveIssueCommonSearch', {}) // 清空原issue查询状态
      if (this.orgId) {
        this.$store.commit('common/saveIssueTabName', 'all')
      } else {
        this.$store.commit('common/saveIssueTabName', [4, 5].includes(status) ? 'mySolved' : 'myUnsolved')
      }
      this.$store.commit('common/saveIssueHomeToIssue', {tabIndex: this.orgId ? 7 : [4, 5].includes(status) ? 5 : 1, status: status, orgId: this.orgId, orgName: this.orgName})
      this.$router.push('/issue-issueinfo')
    },
    goToTaskTab (status) {
      this.$store.commit('common/saveHomeToTask', {state: status})
      this.$router.push('/issue-myTask')
    },
    goToIssueDetail (id) {
      this.$router.push({
        path: '/issue-reply',
        query: {
          replyInfo: this.$Base64.encode(JSON.stringify({
            issId: id
          }))
        }
      })
    },
    goToAnn () {
      this.$router.push({
        path: '/ann-annlistForhomeCard'
      })
    },
    goToAnnDetail (id) {
      this.$router.push({
        path: '/ann-detail/?annId=' + `${id}`,
        query: {
          type: 1,
          replyInfo: this.$Base64.encode(JSON.stringify({
            annId: id
          }))
        }
      })
      this.annId = id
      let atNotifyObj = window.atNotify
      Object.keys(atNotifyObj).forEach((key) => {
        if (key.includes(`#${this.annId}#`)) {
          atNotifyObj[key].close()
          this.$store.commit('common/deleteAnnWsDataList', key)
        }
      })
    },
    goToDetail (type, id, item) {
      if (type === 1) this.goToIssueDetail(id)
      else if (type === 3) {
        this.$store.commit('common/saveHomeToTask', {id: id})
        this.$router.push('/issue-myTask')
      } else {
        this.$store.commit('common/updataInfoiterationName', item.title)
        this.$store.commit('common/updataIterationUserId', item.issUserId)
        this.$router.push({
          path: '/proManagement-detail',
          query: {
            info: this.$Base64.encode(JSON.stringify({
              proId: Number(item.iterProId),
              proName: item.iterProName,
              proManager: item.iterProManageer,
              iterId: id,
              underPro: false,
              issueReply: true
            }))
          }
        })
      }
    },
    openList (item, itemType) {
      this.listDialogVisible = true
      this.$nextTick(() => {
        this.$refs.listDialog.getDataList(item, itemType)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.selected {
  font-size: 15px;
  color: darkgray;
}
.space {
  display: flex;
  justify-content: space-between;
  padding: 0 0 10px 0px;
}
.home-card{
  font-size: 1rem;
  line-height: 1.3;
  // height: calc(100vh - 80px);
  min-height: 90vh;
  // overflow-y: scroll;
  display: flex;
  background: #f1f4f5;
  margin: -20px;
  .title{
    font-size: 24px;
    // font-weight: bold;
    .number-badge{
      display: inline-block;
      margin-left: 10px;
      padding: 1px 8px;
      font-size:12px;
      font-weight:600;
      // float: right;
      background: #e74c3c;
      color: #fff;
      border-radius: 10px;
    }
    .selectTotal{
      width: 68%;
      display: flex;
      margin-left: 10px;
      padding: 1px 8px;
      font-size:12px;
      font-weight:600;
      cursor: pointer;
      justify-content: flex-end;
      // float: right;
      // background: #e74c3c;
      color: rgb(0, 0, 0);
      border-radius: 10px;
    }
    .el-tag--danger{
          color:#fff;
          font-weight: bold;
          background: red;
          padding: 1px 5px;
        }
  }
  .one-line{
    white-space: nowrap;
    overflow: hidden;
    text-overflow:ellipsis;
  }
  .left{
    // width: 66%;
    flex-grow: 1;
    // max-height: 100vh;
    margin-right: 10px;
    .value-number{
      font-size: 30px;
      // font-weight:bold;
    }
    .value-label{
      // color: #bbb;
      font-size: 14px;
    }
    .issue-div{
      margin-bottom: 10px;
      height: 280px;
    }
    .task-div{
      width: 32%;
      flex-grow: 1;
      margin-right: 10px;
      // height: 100%;
      .container-task{
        // height: calc(100% - 50px);
        justify-content: space-around;
      }
    }
  }
  .issueat-div{
    .at-div{
      padding: 5px 0;
      // border-bottom: 1px solid #eee;
      &:first-child{
        padding-top: 0;
      }
      .issue-hover{
          color:#45c2b5;
        }
      &:hover {
        .issue-hover{
          color: #17b3a3;

        }
        .warn-hover{
          color: #17b3a3;
        }
      }
      .at-time{
        display: inline-flex;
        align-items: center;
        font-size: 14px;
        color: #bbb;
      }
    }
  }
  .right{
    width: 30%;
    flex-shrink: 0;
    background: #fff;
    // height: 50%;
    // height: 100%;
    // overflow-y: scroll;
  }
  .border{
    border-radius: 4px;
    // border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
  .flex{
    display: flex;
  }
  .flex-column{
    display: flex;
    flex-direction: column;
  }
  .container-issueat{
    background: #fff;
    position: relative;
    .title{
      width: 100%;
      padding: 20px 20px 10px;
    }
    .content{
      margin-bottom: 10px;
      height: 372px !important;
      padding: 0 20px;
      overflow-y: auto;
      height:calc(100% - 70px);
    }
  }
  .container{
    background: #fff;
    padding: 20px;
    .container-issue{
      width: 100%;
      flex-wrap: wrap;
      // display: inline-grid;
      // grid-template-columns: repeat(3, 30%);
      // grid-template-rows: repeat(2, 100px);
      // gap: 0 20px;
    }
    .tab-div{
      align-items: center;
      flex-shrink: 1;
      padding: 23px;
      &:hover{
        cursor: pointer;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        transition: box-shadow 1s;
      }
    }
  }
  .font_size {
    padding: 5px;
    // color: #fff;
    border-radius: 5px;
    margin-right: 15px;
    // font-size: 34px;
    width: 60px;
        height: 60px;
        fill: #fff;

  }
  .el-icon-caret-right{
&:hover{transform: scale(1.5);}
  }
  .el-tag--primary {
    color: #409eff;
  }
}
</style>
