<template>
<div>
    <table-radio-checkbox
      v-if="visible && checkboxType === 'sp'"
      ref="spRadio"
      @confirm="returnInfo"
      @cancel="visible=false"
      dialogWidth="500px"
      :title="$t('actRequire.customer')"
      :searchKey="['spName']"
      :placeholderList="[]"
      :tableColumnLabel="['', $t('actRequire.customer')]"
      :tableColumnProp="['spId', 'spName']"
      :isRadio="true">
    </table-radio-checkbox>

    <table-radio-checkbox
      v-if="visible && (checkboxType === 'user' || checkboxType === 'usermanalist')"
      ref="userRadio"
      @confirm="returnInfo"
      @cancel="visible=false"
      dialogWidth="500px"
      :title="$t('log.userList')"
      :searchKey="['username']"
      :placeholderList="[$t('log.username')]"
      :tableColumnLabel="['', $t('log.username')]"
      :tableColumnProp="['userId', 'username']"
      :chEnName="{'show': 0, 'enName': 'enName', 'chName': 'chName'}"
      :isRadio="true">
    </table-radio-checkbox>

    <table-radio-checkbox
      v-if="visible && checkboxType === 'agent'"
      ref="issRadio"
      @confirm="returnInfo"
      @cancel="visible=false"
      dialogWidth="500px"
      :title="$t('log.userList')"
      :searchKey="['username']"
      :placeholderList="[$t('log.username')]"
      :tableColumnLabel="['', $t('log.username')]"
      :tableColumnProp="['userId', 'username']"
      :chEnName="{'show': 0, 'enName': 'enName', 'chName': 'chName'}"
      :isRadio="true">
    </table-radio-checkbox>
</div>
</template>

<script>
import TableRadioCheckbox from './table-radio-checkbox'

export default {
  components: {
    TableRadioCheckbox
  },
  computed: {
    departIssType () {
      return this.$store.getters['common/departIssType']
    }
  },
  props: ['checkboxType'],
  data () {
    return {
      visible: false,
      name: '',
      id: ''
    }
  },
  methods: {
    getCheckList () {
      this.visible = true
      this.$nextTick(() => {
        switch (this.checkboxType) {
          case 'sp':
            this.$refs.spRadio.init({'url': '/sys/serviceprovider/list'}, {'departIssType': this.departIssType})
            break
          case 'user':
            this.$refs.userRadio.init({'url': '/sys/user/list'}, {'proUserType': 1})
            break
          case 'usermanalist':
            this.$refs.userRadio.init({'url': '/sys/user/usermanalist'}, {'type': 1})
            break
          case 'agent':
            this.$refs.issRadio.getDataList({'url': '/sys/user/agentlist'}, {'departIssType': this.departIssType})
            break
        }
      })
    },
    returnInfo (name, id, singleObj) {
      this.id = id
      this.name = name
      this.$emit('confirm', {name, id, singleObj})
    }
  }
}
</script>
