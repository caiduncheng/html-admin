const windowHeight = window.screen.height
export const pageMixins = {
  data () {
    return {
      paginationShow: true,
      dataListLoading: false, // 加载数据时的loading动画
      pageIndex: 1, // current
      pageIndexOther: 1,
      // pageSize: 10, // 若不需要动态加载list数量
      pageSize: windowHeight < 1080 ? 10 : windowHeight === 1080 ? 15 : 20, // 根据页面分辨率设置每页数目
      pageSizeOther: windowHeight < 1080 ? 10 : windowHeight === 1080 ? 15 : 20, // 若同个文件有两个分页组件
      pageSizeList: [10, 15, 20, 50, 100],
      // pageSizeList: [10, 20, 50, 100],
      totalCount: 0,
      totalCountOther: 0
    }
  },
  computed: {
  },
  watch: {
    // 判断最后一页是否为空
    totalCount (newVal, oldVal) {
      if (newVal <= (this.pageIndex - 1) * this.pageSize && newVal !== 0) {
        this.pageIndex--
        this.getDataList()
      }
    },
    totalCountOther (newVal, oldVal) {
      if (newVal <= (this.pageIndexOther - 1) * this.pageSizeOther && newVal !== 0) {
        this.pageIndexOther--
        this.getDataList('other')
      }
    }
  },
  created () {
  },
  methods: {
    search () {
      this.pageIndex = 1
      this.getDataList()
    },
    searchOther () {
      this.pageIndexOther = 1
      this.getDataList('other')
    },
    // 改变页码数量
    sizeChangeHandle (val, otherFlag) {
      if (otherFlag) {
        this.pageIndexOther = 1
        this.pageSizeOther = val
        this.getDataList('other')
      } else {
        this.pageIndex = 1
        this.pageSize = val
        this.getDataList()
      }
    },
    // 上一页 下一页
    currentChangeHandle (val, otherFlag) {
      if (otherFlag) {
        this.pageIndexOther = val
        this.getDataList('other')
      } else {
        this.pageIndex = val
        this.getDataList()
      }
    },
    // 清除搜索栏
    clear () {
      this.search()
      // 阻止冒泡
      event.cancelBubble = true
    },
    clrerDialog (keyArr) {
      keyArr.forEach(key => {
        this.dataForm[key] = ''
      })
      this.search()
      // 阻止冒泡
      event.cancelBubble = true
    }
  }
}
