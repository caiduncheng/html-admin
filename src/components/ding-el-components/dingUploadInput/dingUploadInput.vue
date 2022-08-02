<template>
<div class="ding-upload-input">
  <el-input 
    v-model="value"
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
</div>
</template>

<script>
export default {
  props: ['propsModel'],
  name: 'dingUploadInput',
  data () {
    return {
      value: null,
      isFocus: false
    }
  },
  created () {
    this.value = this.propsModel
  },
  methods: {
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
      this.value = fileData.name
    }
  }
}
</script>

<style lang="scss">
.ding-upload-input {
  .focusClass {
    border: 1px solid $--color-primary;
    border-radius: 5px
  }
}
</style>
