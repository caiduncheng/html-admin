<template>
  <div  @click="$emit('click')">

    <el-row type="flex" justify="center">
      <img :src="icon"  class="image"  style="width: 65px;height: 65px"/>
    </el-row>
    <el-row type="flex" justify="center" style="color: dodgerblue">
      {{ name }}
    </el-row>
    <el-row type="flex" justify="center" style="color: darkgray">
      {{ version }}
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: 'static/img/Android.png'
    },
    name: {
      type: String,
      default: ''
    },
    active: {
      type: Boolean,
      default: false
    },
    version: {
      type: String,
      default: ''
    },
    upload: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.block {
  width: 80px;
  float: left;
  padding: 5px;
  background-color: #ffffff;
  height: 130px;
  border-radius: 5px;
  box-sizing: border-box;
  position: relative;
  margin: 15px;
  cursor: pointer;
  &[type='upload'] {
    background-image: url('/static/img/upload.png');
  }
}
.block .image {
  width: 60px;
  height: 60px;
  margin-bottom: 5px;
  display: inline-block;
}
.block .content {
  width: auto;
  display: inline-block;
}

.block span {
  display: block;
  color: #333;
}

.block p {
  padding-left: 20px;
  float: left;
  width: 160px;
}

.block.active {
  border: 1px solid rgba(244, 244, 244, 0.8);
  color: rgba(2, 2, 11, 0.73);
  background-color: rgba(244, 244, 244, 0.8);
}

.block span:first-child {
  margin-top: 3px;
  font-size: 16px;
  margin-bottom: 5px;
  font-weight: 500;
  width: 100%;
}

.upload-ota {
}
</style>
