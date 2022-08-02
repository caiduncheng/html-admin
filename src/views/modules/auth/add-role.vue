<template>

</template>
<script>
export default {
  components: {},
  data () {
    return {
      dataListLoading: false,
      dataList: [],
      dataForm: {},
      pageNo: 1,
      pageSize: 10,
      rows: 0
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    getDataList () {
      console.log(this.$store.state.common.menuFunctionList)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
