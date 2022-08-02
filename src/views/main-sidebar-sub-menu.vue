<template>
  <el-submenu 
    v-if="menu.list && menu.list.length >= 1"
    :index="menu.menuId + ''"
    :popper-class="'site-sidebar--' + sidebarLayoutSkin + '-popper'">
    <template slot="title">
      <icon-svg :name="menu.icon || ''" class="site-sidebar__menu-icon"></icon-svg>
      <span>{{ $t(`menuList.${menu.menuId}`) }}</span>
    </template>
    <sub-menu
      v-for="item in menu.list" 
      :key="item.menuId"
      :menu="item"
      :dynamicMenuRoutes="dynamicMenuRoutes">
    </sub-menu>
  </el-submenu>
  <el-menu-item v-else :index="menu.menuId + ''" @click="gotoRouteHandle(menu)">
    <icon-svg :name="menu.icon || ''" class="site-sidebar__menu-icon"></icon-svg>
    <span>{{ $t(`menuList.${menu.menuId}`) }}</span>
  </el-menu-item>
</template>

<script>
  import SubMenu from './main-sidebar-sub-menu'
  export default {
    name: 'sub-menu',
    props: {
      menu: {
        type: Object,
        required: true
      },
      dynamicMenuRoutes: {
        type: Array,
        required: true
      }
    },
    components: {
      SubMenu
    },
    computed: {
      sidebarLayoutSkin: {
        get () { return this.$store.state.common.sidebarLayoutSkin }
      },
      lang () {
        return this.$cookie.get('languageType')
      }
    },
    methods: {
      // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
      gotoRouteHandle (menu) {
        // console.log(menu)
        var route = this.dynamicMenuRoutes.filter(item => item.meta.menuId === menu.menuId)
        if (route.length >= 1) {
          this.$router.push({ name: route[0].name })
        }
        // 清空issue-proManagement项目store查询缓存
        this.$store.commit('issue/saveProSearchParams', {})
        this.$store.commit('common/updateTabName', this.lang === '0' ? menu.name : menu.nameEn)
        // 清空issue-info store高级查询及普通查询缓存
        this.$store.commit('common/clearIssueAdvancedSearch')
        this.$store.commit('common/saveIssueCommonSearch', {})
        this.$store.commit('common/saveIssueTabName', '')
      }
    }
  }
</script>
