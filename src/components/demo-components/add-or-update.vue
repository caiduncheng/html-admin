<template>
  <el-dialog
  class="add-or-update ding-el-dialog"
  :title="id ? $t('common.modify') : $t('common.add')"
  :close-on-click-modal="false"
  :visible.sync="visible"
  width="700px"
  append-to-body
  :before-close="cancel">
    <el-form
      @submit.native.prevent
      :model="dataForm"
      :rules="rules"
      inline-message
      label-position="top"
      label-width="auto"
      ref="dataForm">
      <el-form-item label="Title" prop="title">
        <el-input v-model="dataForm.title" clearable></el-input>
      </el-form-item>
      <el-form-item label="Inventory" prop="inventory">
        <el-input v-model="dataForm.inventory" ></el-input>
      </el-form-item>
      <el-form-item label="Variants" prop="variants">
        <el-select v-model="dataForm.variants" >
          <el-option v-for="item in varList" :key="item.val" :value="item.val" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="File input" prop="file">
        <el-input
          v-model="dataForm.fileName"
          readonly
          ref="elInput"
          :class="['ding-input-browse', {'focusClass': isFocus}]"
          @click.native="triggerClick"
          @focus="focus"
          @blur="isFocus=false"
        >
          <el-button slot="append" @click="$refs.elInput.focus()">Browse</el-button>
        </el-input>
        <input v-show="false" @change="upload" type="file" ref="inputer">
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{$t('common.cancel')}}</el-button>
      <el-button type="primary" @click="dataformSubmit()">{{$t('common.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {dataformMixins} from '@/mixins/dataform-mixins'
import {getTransInfo, saveOrUpdateTrans} from '@/api'

export default {
  mixins: [dataformMixins],
  data () {
    return {
      isFocus: false,
      id: 0,
      visible: false,
      varList: [
        {label: 111, val: 0},
        {label: 222, val: 1},
        {label: 333, val: 2}
      ],
      dataForm: {
        title: '',
        inventory: '',
        variants: 0,
        prices: '',
        sales: '',
        fileName: ''
      },
      mixinsPropsRulesList: [
        {key: 'title', value: this.$t('demand.title')}
      ]
    }
  },
  methods: {
    init (id) {
      this.id = id
      this.visible = true
      if (id) {
        getTransInfo(id).then(data => {
          // 只需要获取dataForm里定义的字段，注意不要直接this.dataForm = data.info可能会导致表单验证失效
          Object.keys(this.dataForm).forEach(key => {
            this.dataForm[key] = data.info[key] || this.dataForm[key]
          })
        })
      }
    },
    focus () {
      this.isFocus = true
    },
    triggerClick () {
      this.$refs.inputer.click()
      console.log(111)
    },
    upload () {
      let inputDOM = this.$refs.inputer
      const fileData = inputDOM.files[0]
      // debugger
      this.dataForm.fileName = fileData.name
    },
    dataformSubmit () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          saveOrUpdateTrans({...this.dataForm, 'id': this.id}, 'id', this.id).then(() => {
            this.$message.success(this.$t('common.operate_success'))
            this.$emit('refreshDataList')
            this.cancel()
          })
        }
      })
    }
  }
}
 </script>

 <style lang="scss">
  .focusClass {
    border: 1px solid $--color-primary;
    border-radius: 5px
  }
 </style>

