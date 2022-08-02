<template>
  <div  class="app-container">
      <el-row type="flex" justify="end" style="margin-bottom: 10px;margin-top: 10px;border: 1px solid lightgray">
        <el-select v-model="listQuery.manufacturerCode"
                   :placeholder="$t('manufacturer.selectTip')"
                   style="margin: 5px 40px 5px 0px;width: 300px"
                   @change="selectManuHandle"
                   clearable>
          <el-option
            v-for="item in manufacturerList"
            :key="item.manufacturerId"
            :label="item.name"
            :value="item.manufacturerCode">
          </el-option>
        </el-select>
        <el-button type="primary"
                   @click="addManuHandle"
                   style="margin: 5px 10px 5px 0px"
                   v-if="isAuth('10400600.MANAGE')"
                   icon="el-icon-circle-plus-outline">{{$t('manufacturer.addBtn')}}
        </el-button>
      </el-row>
    <el-row :gutter="5" width=100%>
      <el-col class="leftPart" :span="4" :style="{ 'height': colHeight + 'px' }">

        <el-card v-for="model in deviceModels" :key="model.modelId"
                 @click.native="handleSelect(model)"
                 :class="{active: modelId == model.modelId}">
          <el-row type="flex" align="middle">
            <el-col :span="6" style="margin-left: 5px">
              <img style="height:48px;width:48px" v-bind:src=" iconView(model.iconUrl)" />
            </el-col>
            <el-col :span="10">
              <div>
                <el-row justify="start">
                  <span style="font-size: 14px;">{{ model.modelCode }}</span>
                  <el-tag style="margin-left: 10px" size="mini" effect="dark" :hit="true">{{model.devNum}}</el-tag>
<!--                  <span style="margin-left: 10px"><el-badge class="mark" type="primary" :value="model.devNum" ></el-badge></span>-->
                </el-row>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="20">
        <div style="width: 100%;">
                <el-input  v-model.trim="listQuery.devSn"
                           :placeholder="$t('device.sn')"
                           @keyup.enter.native="search()"
                           clearable
                           @clear="search"
                           maxlength="32"
                           @blur="() => listQuery.devSn = listQuery.devSn.trim()"
                           style="width: 255px;margin-bottom: 5px"></el-input>

                <el-button type="primary" @click="search()" icon="el-icon-search" style="margin-bottom: 5px">{{$t('common.query')}}</el-button>

                <el-button type="warning"  @click="reset" icon="el-icon-refresh-right" style="margin-bottom: 5px">{{$t('device.resetBtn')}}</el-button>

          <el-table
            :data="dataList"
            v-loading="dataListLoading"
            stripe
            border
            height="calc(100vh - 230px)"
            style="width: 100%;">

            <el-table-column prop="modelCode" :label="$t('device.modelCode')" header-align="center" align="center" ></el-table-column>
            <el-table-column prop="devSn" :label="$t('device.sn')" header-align="center" align="center" >
<!--                <template slot-scope="scope">
                    <div>
                        <el-tooltip
                            class="item"
                            effect="dark"
                            :content="scope.row.isOnline ? $t('common.online') : $t('common.offline')"
                            placement="top"
                        >
                            <icon-svg
                                name="tablet"
                                style="cursor: pointer; font-size: 14px"
                                :class="scope.row.isOnline ? 'device-online' : 'device-offline'"
                            />
                        </el-tooltip>
                        {{ scope.row.devSn }}
                    </div>
                </template>-->
            </el-table-column>
            <el-table-column prop="operatorName" :label="$t('device.operatorName')" header-align="center"align="center"></el-table-column>
            <el-table-column prop="isOnline" :label="$t('device.status')" header-align="center" align="center">
              <template slot-scope="scope">
                <el-tag size="mini" :class="`flow-state-tag-${scope.row.isOnline}`" v-if="scope.row.isOnline == 1">{{$t('device.online')}}</el-tag>
                <el-tag size="mini" :class="`flow-state-tag-${scope.row.isOnline}`" v-if="scope.row.isOnline == 0">{{$t('device.offline')}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="activeTime" :label="$t('device.activeTime')" header-align="center" align="center">
              <template slot-scope="scope">
                <span>{{formatDate(scope.row.activateTime)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              :label="$t('common.operate')">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="Terminal Full View" placement="top">
                  <el-button type="text" v-if="scope.row.bindOperatorId"  @click="terminalView(scope.row.devId, scope.row.bindOperatorId)" icon="el-icon-view"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <br>
          <el-pagination
            v-if="paginationShow"
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <add-manufacturer v-if="addManufacturerVisible" ref="addManufacturer" @refreshDataList=""
                      @close="addManufacturerVisible = false"></add-manufacturer>
  </div>
</template>
<script>
import { pageMixins } from '@/mixins/pagination-mixins'
import { formatDate } from '@/utils/formatDate'
import AddManufacturer from './add-manufacturer'
import {getDeviceModel, getManufacturer, getDeviceList} from '../../../api/device'
export default {
  mixins: [pageMixins],
  components: {
    AddManufacturer
  },
  data () {
    return {
      modelCodeCondition: '',
      addManufacturerVisible: false,
      addOrUpdateDeviceVisible: false,
      listQuery: {
        manufacturerCode: '',
        modelCode: '',
        devSn: ''
      },
      modelCodeQuery: {
        modelCode: ''
      },
      firmOptions: [],
      deviceModels: [],
      paginationShow: true,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataList: [
      ],
      manufacturerList: [],
      modelId: null
    }
  },
  computed: {
    colHeight () {
      return this.$store.state.common.documentClientHeight - 82 - 80
    }

  },
  activated () {
    this.getDeviceModels()
    this.getManufacturers()
    this.getDeviceList()
  },
  methods: {
    iconView (src) {
      if (src) {
        return process.env.ICON_API + src
      }
      return 'static/img/Android.png'
    },
    getDeviceModels () {
      this.deviceModels = []
      let param = {
        manufacturerCode: this.listQuery.manufacturerCode
      }
      getDeviceModel(param).then(data => {
        data.forEach(item => {
          if (item.deviceModelSelectVos !== null) {
            item.deviceModelSelectVos.forEach(item2 => {
              this.deviceModels.push(item2)
            })
          }
        })
        console.log(this.deviceModels)
      }).catch(e => {
        console.log(`err:${JSON.stringify(e)}`)
      })
    },
    getManufacturers () {
      getManufacturer().then(data => {
        this.manufacturerList = data
        console.log(this.manufacturerList)
      })
    },
    getDeviceList () {
      this.dataListLoading = true
      getDeviceList(Object.assign({pageNo: this.pageIndex, pageSize: this.pageSize}, this.listQuery)).then(data => {
        console.log(data)
        this.dataList = data.data
        this.totalPage = data.rows
        this.dataListLoading = false
      }).catch(e => {
        console.log(`err:${JSON.stringify(e)}`)
        this.dataListLoading = false
      })
    },
    reset () {
      this.listQuery.modelCode = ''
      this.listQuery.devSn = ''
      this.listQuery.devStatus = null
      this.pageIndex = 1
      this.getDeviceList()
    },
    handleSelect (model) {
      this.modelId = model.modelId
      this.listQuery.modelCode = model.modelCode
      this.search()
    },
    selectManuHandle () {
      this.listQuery.modelCode = ''
      this.listQuery.devSn = ''
      this.getDeviceModels()
      this.getDeviceList()
    },
    sizeChangeHandle (val) {
      this.pageSize = val
      this.getDeviceList()
    },
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDeviceList()
    },
    search () {
      this.pageIndex = 1
      this.getDeviceList()
    },
    addManuHandle () {
      this.addManufacturerVisible = true
      this.$nextTick(() => {
        this.$refs.addManufacturer.init()
      })
    },
    goToDetail (data) {
      this.$router.push({
        name: 'terminalDetail',
        query: {
          manufacturerCode: data.manufacturerCode,
          modelCode: data.modelCode,
          devSn: data.devSn
        }
      })
    },
    formatDate (timeStamp) {
      if (timeStamp !== undefined) {
        return formatDate(timeStamp, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    terminalView (devId, bindOperatorId) {
      this.$router.push({
        name: 'device-view',
        params: {
          devId: devId,
          bindOperatorId: bindOperatorId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.device-online {
    color: #059669;
}
.device-offline {
    color: #d97706;
}
  .disable-icon:hover{
    color: rgb(255, 27, 12);
  }
  .terminal-manage{
    margin-top: 15px;
  }
  .same{
    padding: 0;text-align:center;
    margin: 0 auto;
    height: 47px;vertical-align: middle;font-size:0px;
    width: 195px;
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
</style>
