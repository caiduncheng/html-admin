<template>
  <div>
    <el-dialog
      :width="dialogWidth"
      custom-class="table-radio-checkbox"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="visible"
      :title="title"
      @close="cancel">
      <div v-if="secondTitle">
        <slot name="second-title"></slot>
      </div>
      <div style="margin-bottom: 15px;width: 100%; display:flex;">
        <el-input
          size="small"
          v-for="(item, index) in searchKey"
          :key="index"
          v-model="searchVal[item]"
          :placeholder="placeholderList[index] || title"
          @keyup.enter.native="search()"
          @clear="search"
          clearable 
          style="width: 200px;margin-right:10px;">
        </el-input>
        
        <el-button v-if="searchKey && searchKey.length" size="small" type="primary" @click="search()">{{$t('common.query')}}</el-button>
      </div>
      <el-table
        v-loading="dataListLoading"
        border
        size="small"
        ref="tableRadioCheckbox"
        :data="dataList"
        :row-key="row => row[this.tableColumnProp[0]]"
        @row-click="changeRowCheck"
        @selection-change="selectionChangeHandle"
        style="margin-top:10px;">
        <el-table-column
          v-if="!isRadio"
          :reserve-selection="true"
          type="selection"
          width="40">
        </el-table-column>
        <el-table-column v-else align="center" width="40">
          <template slot-scope="scope">
            <el-radio @change.native="radioChange(scope.row)" :label="scope.row[tableColumnProp[0]]" v-model="radioData" class="textRadio"></el-radio>
          </template>
        </el-table-column>
        <!-- éèidå -->
        <el-table-column
          v-for="(item, index) in tableColumnLabel.slice(1)"
          :key="index"
          align="center"
          :label="item"
          show-overflow-tooltip
          :width="tableColumnWidth.slice(1)[index]">
          <template slot-scope="scope">{{ index !== chEnName.show ? scope.row[tableColumnProp.slice(1)[index]] : scope.row.chEnName }}</template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="total, prev, pager, next"
        :page-size="pageSize"
        :total="totalPage"
        :current-page="pageIndex"
        @current-change="currentChangeHandle">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="confirm">{{$t('common.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
/**
 * ç»ä»¶ä½ç½®æ¾å¨<el-form-item>å¤é¢
 */
// import { commonApi } from '@/api'
import { pageMixins } from '@/mixins/pagination-mixins'
export default {
  mixins: [pageMixins],
  props: {
    dialogWidth: { // æ¾ç¤ºçdialogå®½åº¦
      default: '',
      type: String
    },
    title: { // dialogæ é¢
      default: '',
      type: String
    },
    secondTitle: { // å¯æ é¢ï¼å¤é¨ä¼ å¥slot
      default: false,
      type: Boolean
    },
    searchKey: { // inputæç´¢å³é®å­
      default: [],
      type: Array
    },
    placeholderList: {
      default: [],
      type: Array
    },
    tableColumnLabel: { // tableåå,åºå®ç¬¬ä¸ä¸ªä¼ idå­æ®µ
      default: [],
      type: Array
    },
    tableColumnProp: { // ä¸tableColumnLabelå¯¹åº
      default: [],
      type: Array
    },
    tableColumnWidth: { // tableåå®½,éè¦åä¼ 
      default: () => [],
      type: Array
    },
    chEnName: { // showæ¾ç¤ºä¸­è±æçåå·
      default: () => {
        return {show: -1, enName: '', chName: ''}
      },
      type: Object
    },
    isRadio: { // trueä¸ºåéè¡¨æ ¼ï¼falseå¤é
      default: true,
      type: Boolean
    },
    isConfirmToCancel: { // true:æç¡®å®é®åç´æ¥å³é­dialog; false:å¤é¨è°ç¨cancel()å³é­
      default: true,
      type: Boolean
    }
  },
  data () {
    return {
      visible: false,
      dataList: [],
      searchVal: {}, // æ¥è¯¢ obkjectçvalue
      sendObj: {}, // httpè¯·æ±åæ°å¯¹è±¡
      outerParams: {}, // å¤é¨å¶ä»åæ°
      // tableColumnPropVal: {}, // tableå¯¹åºprop
      radioData: '',
      selections: [], // å¤éæ°æ®
      radioSelections: {} // åéæ°æ®
    }
  },
  methods: {
    changeRowCheck (row) {
      if (this.isRadio) {
        this.radioData = row[this.tableColumnProp[0]]
        this.radioChange(row)
      } else {
        this.$refs.tableRadioCheckbox.toggleRowSelection(row)
      }
    },
    init (sendObj, outerParams) {
      this.getDataList(sendObj, outerParams)
    },
    getDataList (sendObj, outerParams) {
      if (sendObj) this.sendObj = sendObj
      if (outerParams) this.outerParams = outerParams
      this.visible = true
      if (outerParams.type === 'cost') {
        this.dataList = [
          {id: 1, name: 'å¥é¤1', type: 'æç»ç«¯', info: '1å¹´ / 100å'},
          {id: 2, name: 'xxx', type: 'åç»ç®', info: '100å'},
          {id: 3, name: 'xxxxxxx', type: 'é¢ä»è´¹', info: '2å¹´ / 10ä¸æ¬¡ / 300å'},
          {id: 4, name: 'xxxxx', type: 'æç»ç«¯', info: '6ä¸ªæ / 100å'}
        ]
      } else {
        this.dataList = [
          {id: 1, name: 'å®¢æ·1', shortName: 'ç®ç§°1'},
          {id: 2, name: 'xxxx', shortName: 'xxxxxxxx'},
          {id: 3, name: 'xxxxxxxxxxx', shortName: 'xx'},
          {id: 4, name: 'xxxxxxx', shortName: 'xxx'}
        ]
      }
      // this.dataListLoading = true
      // let params = {
      //   'limit': this.pageSize,
      //   'page': this.pageIndex
      // }
      // params = Object.assign(params, this.outerParams)
      // commonApi(this.sendObj.url, Object.assign(params, this.searchVal), this.sendObj.isPost, {loadding: false}).then((data) => {
      //   this.dataList = data.page.list
      //   this.totalPage = data.page.totalCount
      // }).finally(() => {
      //   this.dataListLoading = false
      // })
    },
    cancel () {
      this.visible = false
      this.$emit('cancel')
    },
    confirm () {
      let names = []
      let ids = []
      // é»è®¤this.tableColumnProp[1]ä¸ºä¼ åºçname
      if (this.selections.length > 0) {
        this.selections.forEach(item => {
          names.push(this.chEnName.show === -1 ? item[this.tableColumnProp[1]] : item.chEnName)
          ids.push(item[this.tableColumnProp[0]])
        })
      }
      if (this.isRadio) {
        names = this.chEnName.show === -1 ? this.radioSelections[this.tableColumnProp[1]] : this.radioSelections.chEnName
        ids = this.radioSelections[this.tableColumnProp[0]]
      }
      this.$emit('confirm', names, ids, this.isRadio ? this.radioSelections : this.selections)
      if (this.isConfirmToCancel) this.cancel()
    },
    // selectionChange (rows, row) {
    //   debugger
    //   this.selections = rows
    // },
    selectionChangeHandle (rows) {
      this.selections = rows
    },
    radioChange (row) {
      this.radioSelections = row
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">
.table-radio-checkbox{
  .textRadio .el-radio__label{
    display:none;
  }
  .el-table__header-wrapper .el-table__header .has-gutter .el-table-column--selection .cell{
    display: none;
  }
  .second-title {
    font-weight: 500;
  }
  .el-dialog__body{
    padding-top: 10px;
    padding-bottom: 10px;
  }
  // .el-input__validateIcon{
  //   display: none;
  // }
}
</style>
