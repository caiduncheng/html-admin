<template>
  <el-container class="card-list_com">
  <el-header>
    <el-checkbox-group
      @change="checkChange"
      style="display:inline-block"
      v-model="checkStatus"
      :min="1"
      :max="5">
      <el-checkbox v-for="status in statusList" :label="status.value" :key="status.value" v-show="!($envirVersion === 'product' && status.value === 4)">
        <template>
          <span  class="status-mark" :style="{'background-color': status.background, 'color': status.color}">{{status.label}}</span>
        </template>
      </el-checkbox>
    </el-checkbox-group>
    <el-checkbox :indeterminate="false" v-model="checkAll" @change="handleCheckAllChange">{{$t('cardList.selectAll')}}</el-checkbox>
  </el-header>
  <el-main>
    <el-row :gutter="20">
      <el-table v-if="dataList.length === 0" v-loading="dataListLoading"></el-table>
      <div class="container">
          <div class="card-item" @click="clickCard(item)" v-for="(item, index) in dataList" :key="index">
            <div style="width:100%" ><div class="card-header"  @click.stop="" :style="iterate ? 'position:relative' : ''">
              <div class="card-project-name" @click.stop="">
                <span ><div class="titles" :style="{'background-color': statusList[item.status-1].background}"></div>
                <span class="card-project-id" :style="{'color': statusList[item.status-1].background}">{{item.code}}</span></span>
                <span v-if="iterate" :title="item.title">
                  {{item.title}}
                  <el-tag style="position:absolute;top:-20px;right:-22px;" size="mini" type="danger" v-if="item.endDate && ![3,5].includes(item.status)  ? Date.parse(new Date(item.endDate.substr(0, 10).replace(/-/g,'/'))) < new Date().setHours(0, 0, 0, 0) : false">{{$t('cardList.overdue')}}</el-tag>
                </span>
              </div>
              <!-- <div class="card-header-right">
                <div class="card-project-status" :style="{'background-color': statusList[item.status-1].background, 'color': '#fff'}">
                  {{statusList[item.status-1].label}}
                </div>
              </div> -->
            </div>
            <div v-if="!iterate" class="card-project-name" @click.stop="" style="margin-top: 5px;-webkit-line-clamp: 2;min-height: 40px;width:100%" :title="item.title">{{item.title}}</div>
            <div class="card-content">
              <div class="card-list-item"  @click.stop="" v-if="iterate && item.oaOrderNo">
                <div class="card-list-item-left">OA No</div>
                <div class="card-list-item-right" :style="{'color': statusList[item.status-1].background}">{{item.oaOrderNo}}</div>
              </div>
              <div class="card-list-item pointer" v-if="iterate">
                <div class="card-list-item-left">{{$t('cardList.time')}}</div>
                <div class="card-list-item-right">
                  {{item.startDate && item.startDate.substr(2, 8).replace(/-/g, '/')}} - {{item.endDate && item.endDate.substr(2, 8).replace(/-/g, '/')}}
                </div>
              </div>
              <div class="card-list-item pointer">
                <div class="card-list-item-left">{{$t('cardList.leader')}}</div>
                <div class="card-list-item-right">{{item.username}}</div>
              </div>
              <div class="card-list-item pointer" v-if="!iterate">
                <div class="card-list-item-left">{{$t('issueTabContent.customer')}}</div>
                <div class="card-list-item-right" v-if="ifNPI && item.spName">{{item.spName}}</div>
                <div class="card-list-item-right" v-else-if="!ifNPI && item.cusName">{{item.cusName}}</div>
                <div class="card-list-item-right" v-else>{{'No Customer'}}</div>
              </div>
              <div class="card-list-item pointer" v-if="iterate && !ifNPI">
                <div class="card-list-item-left" style="width:32%">{{$t('infoiterationContent.scategory')}}</div>
                <div class="card-list-item-right" :title="item.scategory">{{lang === '0' ? item.scategory && item.scategory.split('/')[0] : item.scategory && item.scategory.split('/')[1]}}</div>
              </div>
              <div class="card-list-item pointer" v-if="!iterate">
                <div class="card-list-item-left">{{$t('cardList.desc')}}</div>
                <div class="card-list-item-right" :title="item.desc">{{item.desc}}</div>
              </div>
              <!-- 下载附件 -->
              <div class="card-list-item" v-if="item.status === 3 && item.attEnclId">
                <a :id="'a-' + item.attEnclId" :href="downloadUrl" target='_blank'></a>
                <div class="card-list-item-left" style="width:29%">{{$t('cardList.selfTestTable')}}</div>
                <el-tooltip :content="item.attFileName" placement="top">
                  <div class="card-list-item-right" style="-webkit-line-clamp: 1;width:100%">
                    <a   href="javascript:void(0)" @click.stop="downloadFile(item.attEnclId)">{{item.attFileName}}</a>
                  </div>
                </el-tooltip>
              </div>
              <div class="card-list-item" v-if="item.status === 3 && item.checklistFlag">
                <a :id="'a-' + item.attEnclScId" :href="downloadUrl" target='_blank'></a>
                <div class="card-list-item-left" style="width:29%">{{$t('cardList.selfCheckTable')}}</div>
                <!-- <div class="card-list-item-right" style="-webkit-line-clamp: 1;width:100%">
                  <a   href="javascript:void(0)" @click.stop="showTable(item.code)">{{'点击查看自查表'}}</a>
                </div> -->
                <el-tooltip :content="item.attScFileName" placement="top">
                  <div class="card-list-item-right" style="-webkit-line-clamp: 1;width:100%">
                    <a   href="javascript:void(0)" @click.stop="downloadFile(item.attEnclScId)">{{item.attScFileName}}</a>
                  </div>
                </el-tooltip>
              </div>
              <div class="card-list-item pointer">
                <div class="card-list-item-left" style="line-height:30px;">{{iterate ? $t('cardList.task') : $t('cardList.iterate')}}</div>
                <div class="card-list-item-right-status">
                  <div class="card-footer-status-item">
                    <div class="status-count" style="color:#1890ff">{{ item.count && item.count.nostartCounts}}</div>
                    <div class="status-desc" >{{$t('cardList.unstart')}}</div>
                  </div>
                <div class="card-footer-status-item">
                  <div class="status-count" style="color:#FAAD14">{{ item.count && item.count.ingCounts}}</div>
                  <div class="status-desc" >{{$t('cardList.inProcess')}}</div>
                </div>
                <div class="card-footer-status-item">
                  <div class="status-count" style="color:#52C41A">{{ item.count && item.count.finishCounts}}</div>
                  <div class="status-desc" >{{$t('cardList.release')}}</div>
                </div>
                </div>
              </div>

              <!-- <div v-if="$envirVersion === 'npi' && underPro" class="card-list-item pointer">
                <div class="card-list-item-left" style="line-height:30px;">{{$t('cardList.demand')}}</div>
                <div class="card-list-item-right-status">
                  <div class="card-footer-status-item">
                    <div class="status-count" style="color:#1890ff">{{ item.demandCounts && item.demandCounts.finishCounts}}</div>
                    <div class="status-desc" >{{$t('cardList.finished')}}</div>
                  </div>
                  <div class="card-footer-status-item">
                    <div class="status-count" style="color:#FAAD14">{{ item.demandCounts && item.demandCounts.ingCounts}}</div>
                    <div class="status-desc" >{{$t('cardList.deal')}}</div>
                  </div>
                </div>
              </div> -->
<!--
              <div v-if="$envirVersion === 'npi' && underPro" class="card-list-item pointer">
                <div class="card-list-item-left" style="line-height:30px;">{{$t('cardList.issue')}}</div>
                <div class="card-list-item-right-status">
                  <div class="card-footer-status-item">
                    <div class="status-count" style="color:#1890ff">{{ item.issCounts && item.issCounts.closeCounts}}</div>
                    <div class="status-desc" >{{$t('cardList.closed')}}</div>
                  </div>
                  <div class="card-footer-status-item">
                    <div class="status-count" style="color:#FAAD14">{{ item.issCounts && item.issCounts.ingCounts}}</div>
                    <div class="status-desc" >{{$t('cardList.deal')}}</div>
                  </div>
                </div>
              </div> -->

            </div></div>

            <div class="card-footer">
              <div class="card-list-item" style="flex-grow:1;" v-if="[3, 5].includes(item.status) && item.finishTime">
                <div class="card-list-item-left" style="width: 42.81%;">{{statusList[item.status - 1].label}}</div>
                <div class="card-list-item-right">
                  {{item.finishTime && item.finishTime.substr(2, 8).replace(/-/g, '/')}}
                </div>
              </div>

              <div class="action-icons" v-else-if="!underPro">
                <el-tooltip v-if="item.btnAuth" class="item" effect="dark" :content="$t('infoiterationContent.modify')" placement="top">
                  <div class="icon" @click.stop="$emit('addOrUpdateHandle', item.code)">
                    <img src="../../assets/img/edit.png" alt="" srcset="">
                  </div>
                </el-tooltip>
                <el-tooltip v-if="item.btnAuth" class="item" effect="dark" :content="$t('infoiterationContent.transmit')" placement="top">
                  <div class="icon" @click.stop="$emit('otherDo', item.code)">
                    <img src="../../assets/img/transmit.png" alt="" srcset="">
                  </div>
                </el-tooltip>
                <el-tooltip v-if="item.btnAuth && item.status !== 1" class="item" effect="dark" :content="$t('infoiterationContent.release')" placement="top">
                  <div class="icon" @click.stop="$emit('release', item.code, 'release', item.scategory, item.modId, item.checklistFlag)">
                    <img src="../../assets/img/release.png" alt="" srcset="">
                  </div>
                </el-tooltip>
                <el-tooltip v-if="item.btnAuth && $envirVersion === 'npi'" class="item" effect="dark" :content="item.status === 4 ? $t('infoiterationContent.switchOn') : $t('infoiterationContent.hold')" placement="top">
                  <div class="icon" v-if="item.status === 4" @click.stop="$emit('holdOrOn', item.code, item.status)">
                    <img src="../../assets/img/start.png" alt="" srcset="">
                  </div>
                  <div v-else class="icon" @click.stop="$emit('holdOrOn', item.code, item.status)">
                    <icon-svg class="icon-jiesuo" name="jiesuo"></icon-svg>
                  </div>
                </el-tooltip>
                <el-tooltip v-if="item.btnAuth && $envirVersion === 'npi'" class="item" effect="dark" :content="$t('infoiterationContent.termination')" placement="top">
                  <div class="icon" @click.stop="$emit('ifEnd', item.code, 'termination')">
                    <img src="../../assets/img/renew.png" alt="" srcset="">
                  </div>
                </el-tooltip>
              </div>
              <div v-if="$envirVersion === 'npi' && underPro && isAuth('issue:issueinfo:update')" class="action-buttons">
                <el-tooltip class="item" effect="dark" :content="$t('infoiterationContent.modify')" placement="top">
                   <!-- <el-button style="font-weight: bold;"  type="text" size="small" @click.stop="addOrUpdateHandle(item.proId)">{{$t('project.modify')}}</el-button> -->
                  <div class="icon" @click.stop="addOrUpdateHandle(item.id)">
                    <img src="../../assets/img/edit.png" alt="" srcset="">
                  </div>
                </el-tooltip>
              </div>

              <div v-if="$envirVersion === 'product'" class="action-buttons" :style="underPro ? 'width:100%' : ''">
                <div @click.stop="clickDetail(item)" class="cation-button" :style="{'background-color': statusList[item.status-1].background, 'color': '#fff'}">{{$t('proManagement.survey')}}</div>
              </div>
            </div>
          </div>
        </div>
    </el-row>
  </el-main>
  <el-footer>
    <div class="block">
    <el-pagination
      v-if="paginationShow"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[8, 64, 126, 1024]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage">
    </el-pagination>
  </div>
  </el-footer>
   <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" @close="addOrUpdateVisible=false"></add-or-update>
  <self-check-table v-if="showChcekTable" ref="selfCheckTable" @cancelSubmit="showChcekTable=false" :cannotEdit="true"></self-check-table>
</el-container>
</template>

<script>
import AddOrUpdate from './project-add-or-update'
import { commonApi as projectOrIterListApi } from '@/api'
import { pageMixins } from '@/mixins/pagination-mixins'
import SelfCheckTable from '@/plugins/selfCheckTable'

/* eslint-disable */
export default {
  components: {
    SelfCheckTable,
    AddOrUpdate
  },
  props: ['renderParams', 'underPro', 'iterate'],
  mixins: [pageMixins],
  data () {
    return {
      addOrUpdateVisible: false,
      addOrUpdateVisibleMod: false,
      dataListLoading: false,
      isTeamPro: JSON.parse(window.localStorage.getItem('isTeamPro')),
      lang: this.$cookie.get('languageType'),
      pageSize: 8,
      // checkStatus: this.underPro ? [1, 2] : [1, 2, 4],
      checkStatus: this.underPro ? [1, 2, 3] : [1, 2, 3, 4, 5],
      // checkStatus: [1, 2],
      method: '',
      outerParams: {},
      dataList: [],
      // isIndeterminate: true,
      checkAll: false,
      downloadUrl: '',
      showChcekTable: false,
      loginUserId: this.$cookie.get('loginUserId')
    }
  },
  computed: {
    statusList () {
      // return this.underPro ? this.$t('common.taskStatus') : this.$envirVersion === 'product' ? this.$t('common.taskStatus2Product') : this.$t('common.taskStatus2')
      return this.underPro ? this.$t('common.taskStatus') : this.$t('common.taskStatus2')
    },
    ifNPI () {
      return this.$envirVersion === 'npi'
    }
  },
  created () {
    // this.getDataList()
  },
  methods: {
    addOrUpdateHandle (id) {
      this.dataList.proName = ''
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    showTable (iterId) {
      this.showChcekTable = true
      this.$nextTick(() => {
        this.$refs.selfCheckTable.init('', iterId)
      })
    },
    downloadFile (enclId) {
      this.$http({
        url: this.$http.adornUrl('/sys/config/tokenCheck'),
        method: 'get'
      }).then(({data}) => {
        if (data.code === 0) {
          this.downloadUrl = this.$http.adornUrl(`/sys/config/downFile/${enclId}`) + '?token=' + this.$cookie.get('token')
          // console.log('url+' + this.downloadUrl)
          this.$nextTick(() => {
            var a = document.querySelector(`#a-${enclId}`)
            var e = document.createEvent('MouseEvents')
            e.initEvent('click', false, true) // 字符串值。事件的类型。;事件是否起泡。;是否可以用 preventDefault() 方法取消事件。
            a.dispatchEvent(e)
          })
        }
      })
    },
    getDataList (method, outerParams) {
      if (this.dataListLoading) return
      this.dataListLoading = true
      this.paginationShow = false
      this.dataList = []
      this.method = method || this.method
      this.outerParams = outerParams || this.outerParams
      this.pageIndex = outerParams && outerParams.pageIndex ? outerParams.pageIndex : this.pageIndex
      // 为了做checkStatus的缓存，先取外部store传入，再删去，避免Object.assign后传给后台
      this.checkStatus = outerParams && outerParams.checkStatus ? outerParams.checkStatus : this.checkStatus
      delete this.outerParams.checkStatus
      const params = {
        'limit': this.pageSize,
        'page': this.pageIndex
      }
      params.states = this.checkStatus.join(',')
      // 这里Object.assign一个{}，避免污染params
      if (this.method === '/issue/project/list') {
        this.$store.commit('issue/saveProSearchParams', Object.assign({}, params, this.outerParams, {'checkStatus': this.checkStatus}))
      }
      if (this.method === '/issue/iterate/list') {
        this.$store.commit('issue/saveIterSearchParams', Object.assign({}, params, this.outerParams, {'checkStatus': this.checkStatus}))
      }
      projectOrIterListApi(this.method, Object.assign(params, this.outerParams), '', {loadding: false}).then((data) => {
        // this.dataList = data.page.list
        if ((this.outerParams.oaOrderNo || this.outerParams.iterId || this.outerParams.iterName) && data.page.list.length === 1) {
          this.$store.commit('issue/saveProSearchParams', {'iterId': '', 'oaOrderNo': '', 'iterName': ''})
          this.$router.push({
            path: '/proManagement-detail',
            query: {
              info: this.$Base64.encode(JSON.stringify({
                proId: Number(data.page.list[0].proId),
                proName: data.page.list[0].proName,
                proManager: data.page.list[0].proManager,
                oaOrderNo: this.outerParams.oaOrderNo,
                iterId: this.outerParams.iterId,
                iterName: this.outerParams.iterName
              }))
            }
          })
        }
        data.page.list.forEach((item, index) => {
          let obj = {}
          // if (item.scategory !== '系统/System') {
          //   obj.slefCheckForm = true
          // }
          let renderParamsKey = Object.keys(this.renderParams)
          let renderParamsVal = Object.values(this.renderParams)
          for (let i = 0; i < renderParamsKey.length; i++) {
            if (renderParamsKey[i] === 'username') {
              const usernameArr = renderParamsVal[i].split('/')
              obj['username'] = this.getChEnName(item[usernameArr[0]], item[usernameArr[1]])
            } else {
              obj[renderParamsKey[i]] = item[renderParamsVal[i]]
            }
          }
          if (!this.underPro) {
            obj.btnAuth = ![3, 5].includes(item.state) && [item.issUserId, item.proManager].includes(item.loginUserId) && !this.isTeamPro

          }
          this.dataList.push(obj)
          console.log('datalist', this.dataList)
        })
        this.totalPage = data.page.totalCount
      }).finally(() => {
        this.dataListLoading = false
        this.paginationShow = true
      })
    },
    // boxChange
    checkChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.statusList.length
      // this.isIndeterminate = checkedCount >= 0 && checkedCount < this.statusList.length
      this.pageIndex = 1
      this.getDataList()
    },
    // 点击卡片跳转
    clickCard (item) {
      this.$emit('cardEvent', item, this.pageIndex, this.pageSize)
    },
    // 点击概览
    clickDetail (item) {
      this.$emit('detailEvent', item)
    },
    // 搜索oa单号时跳转进迭代卡片默认显示全部状态
    fromSearchOaOrderNo () {
      this.checkStatus = [1, 2, 3, 4, 5]
    },
    handleCheckAllChange(val) {
      this.pageIndex = 1
      this.checkStatus = val ? (this.iterate ? [1, 2, 3, 4, 5] : [1, 2, 3]) : [1]
      // this.isIndeterminate = false
      this.getDataList()
    }
  }
}
</script>

<style lang="scss">
  .card-list_com {

    .el-button+.el-button {
        margin-left: 0;
    }
    .el-button--small {
      padding: 5px;
      // margin-left: 5px;
    }
    .el-header {
      height: auto !important;
    }
    .status-mark {
      display: inline-block;
      // height: 22px;
      // width: 40px;
      vertical-align: middle;
      border-radius: 5px;
      color: #fff;
      padding: 2px 10px;
    }
    .el-card{
      height: 230px;
    }
    .el-card__header {
      padding: 20px 20px 0px 20px;
      border-bottom:none;
    }
    .el-card__body {
      // height: 176px;
      padding: 10px 20px 20px;
      p {
        margin: 5px 0;
      }
    }
    .container {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      box-sizing: border-box;
      // justify-content: space-evenly;
      .card-item {
          box-sizing: border-box;
          width: 24%; // 320px
          // max-width: 25%;
          padding:14px 10px 14px;
          // margin:8px; // 30px
          margin:0.5%; // 30px
          background-color: #FFFFFF;
          border-radius: 15px;
          box-shadow: 0 5px 40px #e4e4e4;
          // flex: auto;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .card-item:hover {
          box-shadow: 0 10px 40px #c7c7c7;
          transition: box-shadow 1s;
        }

        .card-header{
          display: flex;
          justify-content: space-between;
          .card-header-right{
            min-width: 74px;
          }
          .el-tag--danger{
            color:#fff;
            font-weight: bold;
            background: red;
          }
        }

        .card-project-name {
          display: flex;
          // align-items: center;
          flex-wrap: nowrap;
          // width: 70%;
          font-size: 18px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          word-break: break-all;
          -webkit-line-clamp: 3; // 2
          -webkit-box-orient: vertical;
        }

        .card-project-status {
          // display: flex;
          border-radius: 30px;
          padding: 5px;
          font-size: 12px;
          text-align: center;
        }

        .card-project-id {
          font-size: 16px;
          margin-right: 5px;
          font-weight: bold;
        }

        .titles{
          display: inline-flex;
          width: 4px;
          height: 13px;
          border-radius: 2px;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          padding: 6px 0 0 0; // 20 0
        }

        .card-list-item{
          display: flex;
          padding: 8px 0;

        }

        .card-list-item-left{
          width: 24.5%;
          color: #999999;
          font-size: 0.9rem;
        }

        .card-list-item-right{
          width: 80%;
          font-size: 1rem;
          padding:0 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        .card-list-item-right-status{
          width: 80%;
          display: flex;
          // padding: 0 10px;
          // justify-content: space-evenly;
          justify-content: space-between;
        }

        .card-footer{
          display: flex;
          // border-top:1px solid #e4e4e4;
          // padding-top: 20px;
        }

        .card-footer-status-item{
          display: flex;
          // justify-content: flex-start;
          flex-direction: column;
          // margin-right: 20px;
        }

        .status-count {
          text-align: center;
        }

        .status-desc {
          padding-top:5px;
          font-size: 12px;
          color: #000;
        }

        .cation-button{
          cursor: pointer;
          border-radius: 5px;
          padding: 5px 12px;
          font-size: 12px;
        }

        .action-buttons {
          display: flex;
          justify-content: flex-end;
          width: 30%;
        }

        .card-footer{
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .action-icons {
          display: flex;
          width: 60%;
          justify-content: space-around;
        }

        .icon img {
          width: 20px;
          height: 20px;
        }
        .icon {
          cursor: pointer;
          outline: none;
        }
        .icon-jiesuo{
          width: 20px;
          height: 20px;
          stroke: #252525;
          stroke-width: 26px;
          fill: #252525;
        }
    }
  }
</style>


