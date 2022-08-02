export const dataformMixins = {
  data () {
    return {
      dataForm: {},
      mixinsPropsRulesList: [], // 需要控制规则的表单数据
      //
      rules: {},
      visible: false
    }
  },
  created () {
    this.visible = true
    if (this.mixinsPropsRulesList.length) {
      this.dealRules(this.mixinsPropsRulesList)
      // console.log(this.rules)
    }
  },
  methods: {
    dealRules (mixinsPropsRulesList) {
      mixinsPropsRulesList.forEach((item) => {
        let singleRuleObj = {}
        if (item.slefDefined) {
          // slefDefined 若有则直接取
          singleRuleObj[item.key] = item.slefDefined
        } else {
          singleRuleObj[item.key] = []
          singleRuleObj[item.key].push({
            required: true,
            message: this.$t('common.isRequired', {msg: item.value}),
            trigger: item.trigger ? item.trigger : 'blur'
          })
        }
        this.rules = { ...this.rules, ...singleRuleObj }
      })
    },
    cancel () {
      this.visible = false
      this.$emit('cancel')
    },
    clrerInput (keyArr) {
      keyArr.forEach(key => {
        this.dataForm[key] = ''
      })
      // 阻止冒泡
      event.cancelBubble = true
    }
  }
}
