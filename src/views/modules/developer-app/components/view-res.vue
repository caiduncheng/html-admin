<template>
  <div>
<!--    <el-button @click="appVisible = true">看图片</el-button>-->
    <!-- app版本选择提示框 -->
    <el-dialog :visible.sync="appImagesVisible" :title="$t('developer_app.app_image')">
      <div>
        <el-col :span="2" v-for="i in appImageList" :key="i.appFileId" style="margin-top: 1.5%">
          <div>
            <el-row type="flex" justify="center">
              <el-image :src="iconView(i.iconUrl)" style="width: 100px;height: 100px;background: #FFFFFF"/>
            </el-row>
          </div>
        </el-col>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="appPermissionVisible" :title="$t('developer_app.permission_list')">
      <div>
        <el-table
          :data="appPermissionList"
          v-loading="dataListLoading"
          border
          ref="multipleTable"
          style="margin-top: 2%; width: 100%;"
        >
          <el-table-column
            prop="permission"
            header-align="center"
            align="left"
            width="300px"
            :label="$t('developer_app.auth')">
          </el-table-column>
          <el-table-column
            prop="permission"
            header-align="center"
            align="left"
            :label="$t('developer_app.explanation')">
            <template slot-scope="scope">
              {{ $t('developer_app.permission.' + scope.row.permission) }}
            </template>

          </el-table-column>
<!--          <el-table-column
            prop="linkman"
            header-align="center"
            align="center"
            label="权限说明">
          </el-table-column>-->
        </el-table>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="initialReviewVisibleVisible" :title="$t('developer_app.initial_examine.examine')" width="30%">
      <div style="margin: 10px 0 10px 0" >
        <el-form :model='reviewDataForm' >
          <el-form-item :label="$t('developer_app.initial_examine.result_explanation')" style="margin: 10px 50px 10px 0">
            <el-input v-model='reviewDataForm.examineResultExplain' maxlength="256" :placeholder="$t('developer_app.initial_examine.result_explanation_tip')" show-word-limit clearable></el-input>
          </el-form-item>
          <el-form-item :label="$t('developer_app.initial_examine.result_remark')" prop='remark' style="margin: 10px 50px 10px 0">
            <el-input v-model='reviewDataForm.examineResultRemark' maxlength="1024" :placeholder="$t('developer_app.initial_examine.result_remark_tip')" show-word-limit clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div align="center" style="margin: 10px 0 10px 0">
      <span>
        <el-button type='danger' @click='rejectHandle' :loading="rejectLoading">{{ $t('developer.reject') }}</el-button>
        <el-button type='primary' @click='passHandle' :loading="passLoading">{{ $t('developer.pass') }}</el-button>
      </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getAppVersionImage, getAppVersionPermission, initialExamine} from '@/api/developer-app'

export default {
  components: {},
  data () {
    return {
      rejectLoading: false,
      passLoading: false,
      form: {
        name: '应用列表',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      reviewDataForm: {
        examineResult: 0,
        examineResultExplain: null,
        examineResultRemark: null
      },
      currentDate: new Date(),
      appImageList: [],
      appPermissionList: [],
      autoDownload: true,
      appVersionId: '',
      dataListLoading: false,
      appImagesVisible: false,
      appPermissionVisible: false,
      initialReviewVisibleVisible: false,
      curClickItem: {},
      apkVersions: [],
      apkVersionForm: {
        appFileId: undefined
      },
      apkVersionRule: {
        appFileId: [
          {required: true, message: 'Please select a version', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    iconView (icon) {
      if (icon) {
        return process.env.ICON_API + icon
      }
      return 'static/img/Android.png'
    },
    init (appVersionId, resType) {
      this.appVersionId = appVersionId
      console.log(resType)
      if (resType === 'image') {
        this.appImagesVisible = true
        this.getImageDataList()
      }

      if (resType === 'permission') {
        this.appPermissionVisible = true
        this.getPermissionDataList()
      }

      if (resType === 'initialReview') {
        this.initialReviewVisibleVisible = true
      }
    },
    getImageDataList () {
      this.dataListLoading = true
      getAppVersionImage(this.appVersionId).then(res => {
        console.log(res)
        this.appImageList = res.iconList
      })
      // this.appImageList = [{'iconUrl': '/toms/downloads/temp/abc_btn_radio_to_on_mtrl_015.png'}, {'iconUrl': '/toms/downloads/temp/abc_ic_star_black_36dp.png'}, {'iconUrl': '/toms/downloads/temp/abc_menu_hardkey_panel_mtrl_mult.9.png'}, {'iconUrl': '/toms/downloads/temp/blue_wait_bg.png'}, {'iconUrl': '/toms/downloads/temp/btn_close_tip.png'}, {'iconUrl': '/toms/downloads/temp/cer_install_icon.png'}, {'iconUrl': '/toms/downloads/temp/download_app_tip.png'}, {'iconUrl': '/toms/downloads/temp/download_process_bg.png'}, {'iconUrl': '/toms/downloads/temp/drawable-land-hdpi-v4 big_circle.png'}, {'iconUrl': '/toms/downloads/temp/drawable-land-hdpi-v4 cer_install_with_sd_icon.png'}, {'iconUrl': '/toms/downloads/temp/drawable-land-hdpi-v4 cer_install_with_tool_icon.png'}, {'iconUrl': '/toms/downloads/temp/drawable-land-hdpi-v4 init_add_device_icon.png'}, {'iconUrl': '/toms/downloads/temp/drawable-land-hdpi-v4 init_backup_icon.png'}, {'iconUrl': '/toms/downloads/temp/drawable-land-hdpi-v4 init_recovery_icon.png'}, {'iconUrl': '/toms/downloads/temp/drawable-land-hdpi-v4 small_circle.png'}, {'iconUrl': '/toms/downloads/temp/drawable-land-hdpi-v4 warn_install_error.png'}, {'iconUrl': '/toms/downloads/temp/drawable-ldpi-v4 ic_launcher.png'}, {'iconUrl': '/toms/downloads/temp/drawable-mdpi-v4 ic_launcher.png'}, {'iconUrl': '/toms/downloads/temp/drawable-xhdpi-v4 abc_btn_switch_to_on_mtrl_00001.9.png'}, {'iconUrl': '/toms/downloads/temp/drawable-xhdpi-v4 abc_btn_switch_to_on_mtrl_00012.9.png'}, {'iconUrl': '/toms/downloads/temp/drawable-xhdpi-v4 abc_popup_background_mtrl_mult.9.png'}, {'iconUrl': '/toms/downloads/temp/drawable-xhdpi-v4 ic_launcher.png'}, {'iconUrl': '/toms/downloads/temp/drawable-xxhdpi-v4 abc_btn_switch_to_on_mtrl_00001.9.png'}, {'iconUrl': '/toms/downloads/temp/drawable-xxhdpi-v4 abc_btn_switch_to_on_mtrl_00012.9.png'}, {'iconUrl': '/toms/downloads/temp/drawable-xxhdpi-v4 abc_popup_background_mtrl_mult.9.png'}, {'iconUrl': '/toms/downloads/temp/drawable-xxhdpi-v4 ic_launcher.png'}, {'iconUrl': '/toms/downloads/temp/drawable-xxxhdpi-v4 abc_btn_switch_to_on_mtrl_00001.9.png'}, {'iconUrl': '/toms/downloads/temp/drawable-xxxhdpi-v4 abc_btn_switch_to_on_mtrl_00012.9.png'}, {'iconUrl': '/toms/downloads/temp/drawable-xxxhdpi-v4 abc_ic_star_black_48dp.png'}, {'iconUrl': '/toms/downloads/temp/empty_update.png'}, {'iconUrl': '/toms/downloads/temp/gray_wait_bg.png'}, {'iconUrl': '/toms/downloads/temp/ic_defualt.png'}, {'iconUrl': '/toms/downloads/temp/ic_failed.png'}, {'iconUrl': '/toms/downloads/temp/ic_setting_menu_setting_normal.png'}, {'iconUrl': '/toms/downloads/temp/ic_success.png'}, {'iconUrl': '/toms/downloads/temp/init_group_icon.png'}, {'iconUrl': '/toms/downloads/temp/init_install_icon.png'}, {'iconUrl': '/toms/downloads/temp/init_item_update_fail.png'}, {'iconUrl': '/toms/downloads/temp/init_item_update_success.png'}, {'iconUrl': '/toms/downloads/temp/init_select_item_bg.png'}, {'iconUrl': '/toms/downloads/temp/init_start_btn.png'}, {'iconUrl': '/toms/downloads/temp/init_success_icon.png'}, {'iconUrl': '/toms/downloads/temp/init_warn_btn_bg.png'}, {'iconUrl': '/toms/downloads/temp/init_warn_btn_press_bg.png'}, {'iconUrl': '/toms/downloads/temp/init_welcome_bg.png'}, {'iconUrl': '/toms/downloads/temp/land_device_init_bottom.png'}, {'iconUrl': '/toms/downloads/temp/land_init_opertor_space_bg.png'}, {'iconUrl': '/toms/downloads/temp/land_init_success.png'}, {'iconUrl': '/toms/downloads/temp/level_1_lock.png'}, {'iconUrl': '/toms/downloads/temp/level_1_unlock.png'}, {'iconUrl': '/toms/downloads/temp/level_2_lock.png'}, {'iconUrl': '/toms/downloads/temp/level_2_unlock.png'}, {'iconUrl': '/toms/downloads/temp/level_3_lock.png'}, {'iconUrl': '/toms/downloads/temp/level_3_unlock.png'}, {'iconUrl': '/toms/downloads/temp/level_4_lock.png'}, {'iconUrl': '/toms/downloads/temp/level_4_unlock.png'}, {'iconUrl': '/toms/downloads/temp/loading.gif'}, {'iconUrl': '/toms/downloads/temp/locksreen_bg.png'}, {'iconUrl': '/toms/downloads/temp/lock_dark.png'}, {'iconUrl': '/toms/downloads/temp/lock_light.png'}, {'iconUrl': '/toms/downloads/temp/main_menu_icon.png'}, {'iconUrl': '/toms/downloads/temp/main_top_bg.png'}, {'iconUrl': '/toms/downloads/temp/manage_trans_icon.png'}, {'iconUrl': '/toms/downloads/temp/menu_apps_manager.png'}, {'iconUrl': '/toms/downloads/temp/menu_cer_update.png'}, {'iconUrl': '/toms/downloads/temp/menu_online.png'}, {'iconUrl': '/toms/downloads/temp/menu_params.png'}, {'iconUrl': '/toms/downloads/temp/mipmap-hdpi-v4 ic_launcher.png'}, {'iconUrl': '/toms/downloads/temp/mipmap-mdpi-v4 ic_launcher.png'}, {'iconUrl': '/toms/downloads/temp/mipmap-xhdpi-v4 ic_launcher.png'}, {'iconUrl': '/toms/downloads/temp/mipmap-xhdpi-v4 ic_launcher_foreground.png'}, {'iconUrl': '/toms/downloads/temp/mipmap-xxhdpi-v4 ic_launcher.png'}, {'iconUrl': '/toms/downloads/temp/mipmap-xxhdpi-v4 ic_launcher_foreground.png'}, {'iconUrl': '/toms/downloads/temp/mipmap-xxxhdpi-v4 ic_launcher.png'}, {'iconUrl': '/toms/downloads/temp/mipmap-xxxhdpi-v4 ic_launcher_foreground.png'}, {'iconUrl': '/toms/downloads/temp/new_group.png'}, {'iconUrl': '/toms/downloads/temp/online_test_item_app_query.png'}, {'iconUrl': '/toms/downloads/temp/online_test_item_autotest.png'}, {'iconUrl': '/toms/downloads/temp/online_test_item_data_upload.png'}, {'iconUrl': '/toms/downloads/temp/online_test_item_device_info_upload.png'}, {'iconUrl': '/toms/downloads/temp/online_test_item_download_params.png'}, {'iconUrl': '/toms/downloads/temp/online_test_item_order_query.png'}, {'iconUrl': '/toms/downloads/temp/ota_icon.png'}, {'iconUrl': '/toms/downloads/temp/pospp_dialog_dialog_common_wait_ring.png'}, {'iconUrl': '/toms/downloads/temp/product_connectkeypos_bg.png'}, {'iconUrl': '/toms/downloads/temp/product_insideiccard_bg.png'}, {'iconUrl': '/toms/downloads/temp/sdcard.png'}, {'iconUrl': '/toms/downloads/temp/sync_log_check.png'}, {'iconUrl': '/toms/downloads/temp/sys_tool.png'}, {'iconUrl': '/toms/downloads/temp/unkown.png'}, {'iconUrl': '/toms/downloads/temp/update_float_logo.png'}]
    },
    getPermissionDataList () {
      this.dataListLoading = true
      getAppVersionPermission(this.appVersionId).then(res => {
        console.log(res)
        this.appPermissionList = res.permissionList
        this.dataListLoading = false
      })
      // this.appImageList = [{'iconUrl': '/toms/downloads/temp/abc_btn_radio_to_on_mtrl_015.png'}, {'iconUrl': '/toms/downloads/temp/abc_ic_star_black_36dp.png'}, {'iconUrl': '/toms/downloads/temp/abc_menu_hardkey_panel_mtrl_mult.9.png'}, {'iconUrl': '/toms/downloads/temp/blue_wait_bg.png'}, {'iconUrl': '/toms/downloads/temp/btn_close_tip.png'}, {'iconUrl': '/toms/downloads/temp/cer_install_icon.png'}, {'iconUrl': '/toms/downloads/temp/download_app_tip.png'}, {'iconUrl': '/toms/downloads/temp/download_process_bg.png'}, {'iconUrl': '/toms/downloads/temp/drawable-land-hdpi-v4 big_circle.png'}, {'iconUrl': '/toms/downloads/temp/drawable-land-hdpi-v4 cer_install_with_sd_icon.png'}, {'iconUrl': '/toms/downloads/temp/drawable-land-hdpi-v4 cer_install_with_tool_icon.png'}, {'iconUrl': '/toms/downloads/temp/drawable-land-hdpi-v4 init_add_device_icon.png'}, {'iconUrl': '/toms/downloads/temp/drawable-land-hdpi-v4 init_backup_icon.png'}, {'iconUrl': '/toms/downloads/temp/drawable-land-hdpi-v4 init_recovery_icon.png'}, {'iconUrl': '/toms/downloads/temp/drawable-land-hdpi-v4 small_circle.png'}, {'iconUrl': '/toms/downloads/temp/drawable-land-hdpi-v4 warn_install_error.png'}, {'iconUrl': '/toms/downloads/temp/drawable-ldpi-v4 ic_launcher.png'}, {'iconUrl': '/toms/downloads/temp/drawable-mdpi-v4 ic_launcher.png'}, {'iconUrl': '/toms/downloads/temp/drawable-xhdpi-v4 abc_btn_switch_to_on_mtrl_00001.9.png'}, {'iconUrl': '/toms/downloads/temp/drawable-xhdpi-v4 abc_btn_switch_to_on_mtrl_00012.9.png'}, {'iconUrl': '/toms/downloads/temp/drawable-xhdpi-v4 abc_popup_background_mtrl_mult.9.png'}, {'iconUrl': '/toms/downloads/temp/drawable-xhdpi-v4 ic_launcher.png'}, {'iconUrl': '/toms/downloads/temp/drawable-xxhdpi-v4 abc_btn_switch_to_on_mtrl_00001.9.png'}, {'iconUrl': '/toms/downloads/temp/drawable-xxhdpi-v4 abc_btn_switch_to_on_mtrl_00012.9.png'}, {'iconUrl': '/toms/downloads/temp/drawable-xxhdpi-v4 abc_popup_background_mtrl_mult.9.png'}, {'iconUrl': '/toms/downloads/temp/drawable-xxhdpi-v4 ic_launcher.png'}, {'iconUrl': '/toms/downloads/temp/drawable-xxxhdpi-v4 abc_btn_switch_to_on_mtrl_00001.9.png'}, {'iconUrl': '/toms/downloads/temp/drawable-xxxhdpi-v4 abc_btn_switch_to_on_mtrl_00012.9.png'}, {'iconUrl': '/toms/downloads/temp/drawable-xxxhdpi-v4 abc_ic_star_black_48dp.png'}, {'iconUrl': '/toms/downloads/temp/empty_update.png'}, {'iconUrl': '/toms/downloads/temp/gray_wait_bg.png'}, {'iconUrl': '/toms/downloads/temp/ic_defualt.png'}, {'iconUrl': '/toms/downloads/temp/ic_failed.png'}, {'iconUrl': '/toms/downloads/temp/ic_setting_menu_setting_normal.png'}, {'iconUrl': '/toms/downloads/temp/ic_success.png'}, {'iconUrl': '/toms/downloads/temp/init_group_icon.png'}, {'iconUrl': '/toms/downloads/temp/init_install_icon.png'}, {'iconUrl': '/toms/downloads/temp/init_item_update_fail.png'}, {'iconUrl': '/toms/downloads/temp/init_item_update_success.png'}, {'iconUrl': '/toms/downloads/temp/init_select_item_bg.png'}, {'iconUrl': '/toms/downloads/temp/init_start_btn.png'}, {'iconUrl': '/toms/downloads/temp/init_success_icon.png'}, {'iconUrl': '/toms/downloads/temp/init_warn_btn_bg.png'}, {'iconUrl': '/toms/downloads/temp/init_warn_btn_press_bg.png'}, {'iconUrl': '/toms/downloads/temp/init_welcome_bg.png'}, {'iconUrl': '/toms/downloads/temp/land_device_init_bottom.png'}, {'iconUrl': '/toms/downloads/temp/land_init_opertor_space_bg.png'}, {'iconUrl': '/toms/downloads/temp/land_init_success.png'}, {'iconUrl': '/toms/downloads/temp/level_1_lock.png'}, {'iconUrl': '/toms/downloads/temp/level_1_unlock.png'}, {'iconUrl': '/toms/downloads/temp/level_2_lock.png'}, {'iconUrl': '/toms/downloads/temp/level_2_unlock.png'}, {'iconUrl': '/toms/downloads/temp/level_3_lock.png'}, {'iconUrl': '/toms/downloads/temp/level_3_unlock.png'}, {'iconUrl': '/toms/downloads/temp/level_4_lock.png'}, {'iconUrl': '/toms/downloads/temp/level_4_unlock.png'}, {'iconUrl': '/toms/downloads/temp/loading.gif'}, {'iconUrl': '/toms/downloads/temp/locksreen_bg.png'}, {'iconUrl': '/toms/downloads/temp/lock_dark.png'}, {'iconUrl': '/toms/downloads/temp/lock_light.png'}, {'iconUrl': '/toms/downloads/temp/main_menu_icon.png'}, {'iconUrl': '/toms/downloads/temp/main_top_bg.png'}, {'iconUrl': '/toms/downloads/temp/manage_trans_icon.png'}, {'iconUrl': '/toms/downloads/temp/menu_apps_manager.png'}, {'iconUrl': '/toms/downloads/temp/menu_cer_update.png'}, {'iconUrl': '/toms/downloads/temp/menu_online.png'}, {'iconUrl': '/toms/downloads/temp/menu_params.png'}, {'iconUrl': '/toms/downloads/temp/mipmap-hdpi-v4 ic_launcher.png'}, {'iconUrl': '/toms/downloads/temp/mipmap-mdpi-v4 ic_launcher.png'}, {'iconUrl': '/toms/downloads/temp/mipmap-xhdpi-v4 ic_launcher.png'}, {'iconUrl': '/toms/downloads/temp/mipmap-xhdpi-v4 ic_launcher_foreground.png'}, {'iconUrl': '/toms/downloads/temp/mipmap-xxhdpi-v4 ic_launcher.png'}, {'iconUrl': '/toms/downloads/temp/mipmap-xxhdpi-v4 ic_launcher_foreground.png'}, {'iconUrl': '/toms/downloads/temp/mipmap-xxxhdpi-v4 ic_launcher.png'}, {'iconUrl': '/toms/downloads/temp/mipmap-xxxhdpi-v4 ic_launcher_foreground.png'}, {'iconUrl': '/toms/downloads/temp/new_group.png'}, {'iconUrl': '/toms/downloads/temp/online_test_item_app_query.png'}, {'iconUrl': '/toms/downloads/temp/online_test_item_autotest.png'}, {'iconUrl': '/toms/downloads/temp/online_test_item_data_upload.png'}, {'iconUrl': '/toms/downloads/temp/online_test_item_device_info_upload.png'}, {'iconUrl': '/toms/downloads/temp/online_test_item_download_params.png'}, {'iconUrl': '/toms/downloads/temp/online_test_item_order_query.png'}, {'iconUrl': '/toms/downloads/temp/ota_icon.png'}, {'iconUrl': '/toms/downloads/temp/pospp_dialog_dialog_common_wait_ring.png'}, {'iconUrl': '/toms/downloads/temp/product_connectkeypos_bg.png'}, {'iconUrl': '/toms/downloads/temp/product_insideiccard_bg.png'}, {'iconUrl': '/toms/downloads/temp/sdcard.png'}, {'iconUrl': '/toms/downloads/temp/sync_log_check.png'}, {'iconUrl': '/toms/downloads/temp/sys_tool.png'}, {'iconUrl': '/toms/downloads/temp/unkown.png'}, {'iconUrl': '/toms/downloads/temp/update_float_logo.png'}]
    },
    rejectHandle () {
      if (!this.reviewDataForm.examineResultExplain) {
        this.$message.warning(this.$t('developer_app.initial_examine.examine_result_explain'))
        return
      }
      this.rejectLoading = true
      this.reviewDataForm.examineResult = 2
      console.log(this.reviewDataForm)
      initialExamine(this.appVersionId, this.reviewDataForm).then(res => {
        this.initialReviewVisibleVisible = false
        this.$emit('refreshDataList')
      }).catch(e => {
        this.rejectLoading = false
        console.log(`err:${JSON.stringify(e)}`)
      })
      this.rejectLoading = false
    },
    passHandle () {
      this.passLoading = true
      this.reviewDataForm.examineResult = 1
      console.log(this.reviewDataForm)
      initialExamine(this.appVersionId, this.reviewDataForm).then(res => {
        this.initialReviewVisibleVisible = false
        this.$emit('refreshDataList')
      }).catch(e => {
        this.rejectLoading = false
        console.log(`err:${JSON.stringify(e)}`)
      })
      this.passLoading = false
    }
  }

}
</script>

<style lang='scss' scoped>
/*.block .image {
  width: 48px;
  height: 48px;
  margin-bottom: 20px;
  position: center;
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
}*/


</style>
