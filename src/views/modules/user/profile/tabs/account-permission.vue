<template>
  <el-tree :data="treeData" :props="defaultProps"></el-tree>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AccountPermission',
  computed: {
    ...mapGetters(['userInfo']),
    treeData () {
      return this.userInfo.menuFunctionList.map((data, index, arr) => {
        // if (temp.find(v => v.menuId === ))
        // temp.push(data)
        console.log(data)
        return {
          label: data.menuName,
          children: [
            {
              label: data.funName
            }
          ]
        }
      })
    }
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  }
}
</script>

<style scoped>
</style>
