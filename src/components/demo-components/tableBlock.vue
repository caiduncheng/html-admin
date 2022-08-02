<template>
  <div class="table-components">
    <el-table
      class="ding-el-table"
      :data="dataList"
      stripe
      @selection-change="selectionChangeHandle"
    >
      <el-table-column type="selection" width="50"  align="left"></el-table-column>
      <!-- <el-table-column prop="id" align="left" label="ID"></el-table-column> -->
      <el-table-column width="400" prop="title" align="left" label="" show-overflow-tooltip>
        <template slot-scope="scope">
          <a href="#" class="pointer" @click="">{{scope.row.title}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="inventory" align="left" label="Inventory"></el-table-column>
      <el-table-column prop="variants" align="left" label="Variants"></el-table-column>
      <el-table-column prop="price" align="left" label="Prices"></el-table-column>
      <el-table-column prop="sales" align="left" label="Sales"></el-table-column>
      <el-table-column prop="" align="center" label="">
        <template slot="header">
          <!-- <i class="el-icon-more"></i> -->
          <el-dropdown trigger="click">
            <span class="el-dropdown-link pointer">
              <el-button class="ding-el-table-more" icon="el-icon-more"></el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="addOrupdate()">Add new</el-dropdown-item>
              <el-dropdown-item :disabled="dataListSelections.length === 0" @click.native="delteHandle()">Bulk delete</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" circle @click="addOrupdate(scope.row.id)"></el-button>
          <el-button style="color: #DC143C" icon="el-icon-delete" circle @click="delteHandle(scope.row, scope.$index)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <add-or-update v-if="visible" ref="addOrUpdate" @refreshDataList="$emit('refreshDataList')"></add-or-update>
  </div>
</template>

<script>
import {delTrans} from '@/api'
import AddOrUpdate from './add-or-update'

export default {
  props: ['dataList'],
  components: {
    AddOrUpdate
  },
  data () {
    return {
      visible: false,
      dataListSelections: []
    }
  },
  methods: {
    addOrupdate (id) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    delteHandle (row, index) {
      // debugger
      var ids = row ? [row.id] : this.dataListSelections.map(item => {
        return item.id
      })
      var titles = row ? [row.title] : this.dataListSelections.map(item => {
        return item.title
      })
      this.$confirm(`确定删除${titles.join(',')}吗？`, '提示', {
      // this.$confirm(`${this.$t('user.makesure')}${names.join(',')}${this.$t('user.go')}${user ? this.$t('user.userDelete') : this.$t('user.bulkDelete')}${this.$t('user.operation')}`, this.$t('user.prompt'), {
        confirmButtonText: 'comfirm',
        cancelButtonText: 'cancel',
        type: 'warning'
      }).then(() => {
        delTrans(ids).then((data) => {
          this.$message.success('操作成功')
          if (data.isMock) {
            // 使用mock时模拟删除操作
            this.dataList.splice(index, 1)
          } else {
            // 真实开发通知父组件调用getDataList刷新table
            this.$emit('refreshDataList')
          }
        })
      }).catch((e) => {
        console.log(e)
      })
    }
  }
}
</script>


<style lang="scss">
 .table-components {
   .title {
     width: 400px
   }
 }
</style>
