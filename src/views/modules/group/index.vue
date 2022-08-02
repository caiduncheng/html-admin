<template>
  <div class="mod-menu group">

    <el-col class="leftPart" :span="6" :style="{ 'height': colHeight + 'px' }">
      <div style="margin-top: 30px" v-loading="dataListLoading">
        <el-form :inline="true" :model="dataForm" >
          <el-form-item style="font-size: 20px">{{$t('group.title')}}</el-form-item>
          <el-form-item style="margin-right: 19px;">
            <el-input v-model="dataForm.groupName" :placeholder="$t('group.name')"
                      @blur="() => dataForm.groupName = dataForm.groupName.trim()"
                      @keyup.enter.native="getGroupList()"
                      clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getGroupList()" icon="el-icon-search"></el-button>
          </el-form-item>
<!--          <el-button @click="showDetailHandle(scope.row.orderNo)"><i class="el-icon-plus"></i></el-button>-->
          <el-popover
            placement="bottom"
            width="250"
            @show = "viewAddGroupVisible"
            v-model="addGroupVisible">
            <div style="text-align: right; margin: 0">
              <el-form :model="dataForm">
                <el-input v-model="dataForm.addGroupName" :placeholder="$t('group.addGroup')" style="padding: 8px"
                          maxlength="64"
                          @blur="() => dataForm.addGroupName = dataForm.addGroupName.trim()"
                          show-word-limit
                          clearable></el-input>
              </el-form>
              <div align="center" style="margin: 10px 0 10px 0">
                <span>
                  <el-button  size="mini" type="danger" @click="addGroupVisible=false">{{$t('common.cancel')}}</el-button>
                <el-button type="primary" size="mini" :loading="addGroupLoading" @click="addGroupHandle()">{{$t('common.confirm')}}</el-button>
                </span>
              </div>
            </div>
            <el-button v-if="isAuth('10400800.MANAGE')" type="success" slot="reference" icon="el-icon-plus"></el-button>
          </el-popover>
        </el-form>
      </div>
      <!--      分割线-->
      <el-divider content-position="left"></el-divider>
      <!--   分组卡片 -->
      <el-card v-for="item in groupList" :key="item.categoryId"
               @click.native="getGroupDetails(item.groupId, item.groupName)"
               :class="{active: groupId== item.groupId}">
        <span style="float: left;margin-left: 30%">
            <h4 style="display: inline-block">{{ item.groupName }}</h4>
          </span>
      </el-card>
    </el-col>
<!--    布局右边-->
    <el-col :span="18" class="rightPart">
<!--      图片-->
      <div class="banner">
        <div>
          <span class="group-name" style="line-height: 100px; font-size: 30px;">{{this.rightPartGroupName}}</span>
          <div style="float: right; margin-top: 1%">
<!--            <el-button>
              <icon-svg class="icon-group" name="qrcode"></icon-svg>
            </el-button>-->
            <el-tooltip class="item" effect="dark" :content="$t('group.deleteGroup')" placement="top">
              <el-button v-if="this.rightPartGroupId !== 1 && isAuth('10400800.MANAGE')" :loading="delGroupLoading" @click="delGroupHandle()">
                <icon-svg class="icon-group" name="trash"></icon-svg>
              </el-button>
            </el-tooltip>
          </div>
        </div>

      </div>
      <div style="padding: 0 0 0 20px">
        <el-tabs>
          <el-tab-pane :label="$t('group.application')">
            <application :groupId="this.rightPartGroupId"/>
          </el-tab-pane>
          <el-tab-pane :label="$t('group.operatorList')">
            <OperatorList :groupId="this.rightPartGroupId"/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-col>
  </div>
</template>

<script>
import { sysGroupSelect, addGroup, deleteGroup } from '../../../api/group'
import Application from './components/application.vue'
import OperatorList from './components/operator-list.vue'

export default {
  components: {
    Application,
    OperatorList
  },
  data () {
    return {
      dataForm: {
        groupName: '',
        remark: '',
        addGroupName: ''
      },
      rightPartGroupName: '',
      rightPartGroupId: '',
      addGroupVisible: false,
      groupList: [],
      appList: [],
      loading: false,
      dataListLoading: false,
      addGroupLoading: false,
      delGroupLoading: false,
      noMore: false,
      busy: false,
      pageNo: 1,
      pageSize: 18,
      rows: 0,
      groupId: null,
      clickAppId: 0
    }
  },
  computed: {
    colHeight () {
      return this.$store.state.common.documentClientHeight - 85 - 80
    }
  },
  activated () {
    this.dataForm.groupName = ''
    this.getGroupList()
  },
  methods: {
    getGroupList () {
      this.dataListLoading = true
      sysGroupSelect({
        'groupName': this.dataForm.groupName
      }).then(data => {
        this.groupList = data
        this.rightPartGroupName = data[0].groupName
        this.rightPartGroupId = data[0].groupId
        if (!data[0]) {
          console.log(data[0].groupId)
        }
      })
      this.dataListLoading = false
    },
    viewAddGroupVisible () {
      this.dataForm.addGroupName = ''
      this.dataForm.remark = ''
    },
    addGroupHandle () {
      this.addGroupLoading = true
      if (this.dataForm.addGroupName === '') {
        this.addGroupLoading = false
        return this.$message.warning('group can not be empty')
      }
      addGroup({'groupName': this.dataForm.addGroupName, 'remark': this.dataForm.remark}).then(data => {
        console.log(data)
        this.addGroupLoading = false
        this.getGroupList()
      }).catch((e) => {
        this.addGroupLoading = false
      })
      this.dataForm.addGroupName = ''
      this.dataForm.remark = ''
      this.addGroupVisible = false
    },
    getGroupDetails (groupId, groupName) {
      this.rightPartGroupName = groupName
      this.rightPartGroupId = groupId
    },
    delGroupHandle () {
      console.log(this.rightPartGroupName)
      this.$confirm(this.$t('group.tip_delete_group', {pkgName: this.rightPartGroupName}), '', {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.delGroupLoading = true
        deleteGroup(this.rightPartGroupId).then(data => {
          this.delGroupLoading = false
          this.getGroupList()
        }).catch((e) => {
          this.delGroupLoading = false
        })
      })
    }
  }
}
</script>

<style lang="scss">
.group {
  .banner {
    background-image: url('../../../assets/group-banner.png');
    height: 100px;
    background-size: cover;
    background-position: center;
    color: #e2e6ed;
  }
  .loadTxt {
    text-align: center;
    width: 100%;
    color: $--color-primary-text-sec;
    // z-index: 99;
  }

  .leftPart {
    // border-right: 1px solid $--color-primary-text;
    overflow-y: auto;
    .content {
      width: auto;
      display: inline-block;
    }
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

  .rightPart {
    .flex{
      display: flex;
    }
    flex-wrap: wrap;
    align-content: flex-start;
    overflow: auto;
    .icon-group{
      float: right;
      width: 40px;
      height: 40px;
      stroke: #252525;
      stroke-width: 26px;
      fill: #252525;
    }
    .app-item {
      height: 240px;

      .el-image {
        width: 100px;
        height: 100px;
        border-radius: 5px;
      }

      cursor: pointer;
      text-align: center;
      margin: 2px 0 10px;
      transition: all .5s;

      p {
        margin: 0;
        line-height: 1.2rem;
        font-size: small;
      }

      &:hover {
        transform: scale(1.1);
      }
    }
  }
}

.active {
  background-color: #ffffff !important;
  border: 1px solid #409EFF;
}

.el-form-item {
  margin-bottom: 10px;
}

.el-form {
  margin-top: 10px;
}
</style>
