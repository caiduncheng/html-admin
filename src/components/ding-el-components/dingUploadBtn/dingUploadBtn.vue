<template>
  <el-button class="fileinput-button" :size="propsSize || 'mini'" :type="propsType || 'primary'">
    <i :class="propsIcon || defaultIcon"></i>
    <span>{{propsTxt || defaultTxt}}</span>
    <input id="fileupload-btn" @change="upload" type="file" name="file" ref="inputer">
  </el-button>
</template>

<script>
export default {
  props: ['propsTxt', 'propsIcon', 'propsSize', 'propsType'],
  name: 'dingUploadBtn',
  data () {
    return {
      defaultTxt: 'Upload',
      defaultIcon: 'el-icon-upload2'
    }
  },
  methods: {
    upload () {
      let inputDOM = this.$refs.inputer
      const fileData = inputDOM.files[0]
      // debugger
      this.$emit('emitAfterUpload', fileData)
    }
  }
}
</script>

<style lang="scss">
.fileinput-dropzone,
.fileinput-button {
  position: relative;
  overflow: hidden;
  display: inline-block;

  input {
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    direction: ltr;
    cursor: pointer;
    z-index: 2;
  }

  // @include hover-focus {
  //   .fileinput-button-label {
  //     opacity: 1;
  //   }
  // }
}

.fileinput-dropzone {
  display: block;
  padding: 2.5rem;
  text-align: center;
  // color: $text-muted;
  // border-radius: $border-radius;
  // border: 2px dashed $border-color;
  transition: all 200ms;

  &.hover {
    // color: $body-color;
    // border-color: $input-focus-border-color
  }
}

.fileinput-button-label {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  // background-color: rgba($primary, .86);
  // color: $white;
  // font-size: $font-size-sm;
  text-align: center;
  opacity: 0;
  cursor: pointer;
  z-index: 1;
  transition: opacity 200ms;
}
</style>
