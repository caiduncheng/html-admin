<template lang="html">
  <div class="editor" id="editorbar">
    <div ref="toolbar" class="toolbar" @click="watchLink($event)">
    </div>
    <div ref="editor" class="text">
    </div>
   <!-- <textarea  :value="value" ref="editor" class="text"></textarea> -->
  <el-dialog
    width="30%"
    title="File list"
    :visible.sync="linkListVisible"
    append-to-body>
    <div style="height: 300px; overflow: auto;">
      <div v-for="item in filesList" style="line-height:36px">
        <el-tooltip effect="dark" :content="item.enclName" placement="top">
          <a class="encl" href="javascript:void(0)" @click="insertLink(item.enclName, item.enclSrc)">{{showFileName(item.enclName, 40)}}</a>
        </el-tooltip>
      </div>
    </div>
  </el-dialog>
  <!-- <quote-faq ref="quoteFAQ" v-if="quoteFAQVisible" @close="quoteFAQVisible = false" @quoteTheInfoId="quoteTheInfoId"></quote-faq> -->
  <!-- @用户弹出框 -->
  <!-- <table-radio-checkbox
    v-if="atDialog"
    ref="atUserDia"
    @confirm="confirmAt"
    @cancel="atDialog=false"
    dialogWidth="600px"
    :title="'username'"
    :searchKey="['userName']"
    :placeholderList="[]"
    :tableColumnLabel="['', $t('promod.modMembers')]"
    :tableColumnProp="['userId', 'username']"
    :chEnName="{'show': 0, 'enName': 'enName', 'chName': 'chName'}"
    :isRadio="false">
  </table-radio-checkbox> -->
  </div>
</template>

<script>
import E from 'wangeditor'
import { showFileName } from '@/utils'
// import QuoteFaq from '@/components/wangEditor-extend/quoteFAQ'
// import TableRadioCheckbox from '@/components/dialogs/table-radio-checkbox'

export default {
  name: 'Editorbar',
  components: {
    // TableRadioCheckbox
    // QuoteFaq
  },
  data () {
    return {
      editor: null,
      info_: null,
      imgData: null,
      linkListVisible: false,
      atDialog: false,
      quoteFAQVisible: false
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    isClear: {
      type: Boolean,
      default: false
    },
    copyFromLink: {
      type: Boolean,
      default: false
    },
    filesList: {
      type: Array,
      default: null
    },
    issId: {
      default: 0
    },
    noMenus: { // 不显示的菜单名,例：['quoteFAQ', 'referenceFile']
      type: Array,
      default: () => []
    }
  },
  watch: {
    isClear (val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear()
        this.info_ = null
      }
    }
  },
  mounted () {
    this.seteditor()
    this.editor.txt.html(this.value)
    this.$store.commit('common/updaValTxt', this.editor.txt.text().replace(/&nbsp;/g, ' '))
  },
  methods: {
    seteditor () {
      const self = this
      this.editor = new E(this.$refs.toolbar, this.$refs.editor)
      this.editor.config.uploadImgShowBase64 = true // base 64 存储图片
      this.editor.config.uploadImgServer = ''// 配置服务器端地址
      this.editor.config.uploadImgHeaders = { }// 自定义 header
      this.editor.config.uploadFileName = '' // 后端接受上传文件的参数名
      this.editor.config.uploadImgMaxSize = 10 * 1024 * 1024 // 将图片大小限制为 2M
      this.editor.config.uploadImgMaxLength = 6 // 限制一次最多上传 3 张图片
      this.editor.config.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间
      this.editor.config.showLinkImg = false // 隐藏网络图片
      this.editor.config.tooltip = true // 显示tooltip
      this.editor.config.focus = false //
      // 配置菜单
      let menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        // 'emoticon', // 表情
        // 'image', // 插入图片
        'table', // 表格
        // 'code', // 插入代码
        'undo', // 撤销
        'redo', // 重复
        'referenceFile', // 引用文件
        'quoteFAQ' // 引用faq
        // 'at'
      ]
      // 删除外部传入不需要显示的菜单项
      if (this.noMenus.length > 0) {
        this.noMenus.forEach(item => {
          let index1 = menus.indexOf(item)
          if (index1 > -1) menus.splice(index1, 1)
        })
      }
      this.editor.config.menus = menus
      this.editor.config.onblur = (newHtml) => {
        this.$emit('blur', newHtml)
        console.log('onfocus', newHtml) // 获取最新的 html 内容
      }
      this.editor.config.linkCheck = (text, link) => {
        if (!text.trim() || !link.trim()) {
          return 'Link text or link URL is required'
        }
        return true
      }
      this.editor.config.adornLink = (link) => {
        return this.$http.adornUrl(link) + '?token=' + this.$cookie.get('token')
      }
      this.editor.config.booleanJudge = () => {
        return this.copyFromLink
      }
      // this.editor.config.uploadImgHooks = {
      //   before: (xhr, editor, files) => {
      //     self.imgData = files[0]
      //   },
      //   fail: (xhr, editor, result) => {
      //     console.log('插入图片失败')
      //     // 插入图片失败回调
      //   },
      //   success: (xhr, editor, result) => {
      //     console.log('图片上传成功')
      //     // 图片上传成功回调
      //   },
      //   timeout: (xhr, editor) => {
      //     console.log('网络超时')
      //     // 网络超时的回调
      //   },
      //   error: (xhr, editor) => {
      //     console.log('图片上传错误')
      //     // 图片上传错误的回调
      //   },
      //   customInsert: (insertImg, result, editor) => {
      //     console.log('图片上传成功')
      //     // 图片上传成功，插入图片的回调
      //   }
      // }
      // this.editor.config.uploadImgServer = this.$http.adornUrl('/issue/file/upcommentfile')
      // this.editor.config.uploadImgParams = {
      //   // 如果版本 <=v3.1.0 ，属性值会自动进行 encode ，此处无需 encode
      //   // 如果版本 >=v3.1.1 ，属性值不会自动 encode ，如有需要自己手动 encode
      //   token: this.$cookie.get('token'),
      //   file: this.imgData
      // }
      this.editor.config.customUploadImg = function (files, insert) {
        // 压缩画质
        let fileImg = files[0] // 获取文件对象
        // 判断图片类型
        if (fileImg.type === 'image/jpg' || fileImg.type === 'image/png' || fileImg.type === 'image/jpeg') {
          self.compressImg(fileImg).then((newFileImg) => {
            const maxSize = 5 * 1024 * 1024
            if (newFileImg.size > maxSize) {
              self.$message.warning(self.$t('issueAddUpdate.maxSize', {size: '5'}))
              return
            }
            var formdata = new FormData()
            console.log(newFileImg)
            formdata.append('file', newFileImg)
            formdata.append('issId', 0)
            formdata.append('type', 0)
            self.$http({
              url: self.$http.adornUrl('/issue/file/upcommentfile'),
              method: 'post',
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              data: formdata,
              uploading: true
            }).then(({data}) => {
              // return `${self.$http.adornUrl(data.url)}?token=${self.$cookie.get('token')}`
              const imgUrl = self.$http.adornUrl(data.url)
              self.$http({
                url: self.$http.adornUrl('/sys/config/tokenCheck'),
                method: 'get'
              }).then(({data}) => {
                if (data && data.code === 0) {
                  insert(imgUrl)
                } else {
                  self.$message.error(data.msg)
                }
              }).catch((e) => {
                if (e.code === 'ECONNABORTED') {
                  self.$message.error(e.message)
                }
              })
            }).catch((e) => {
              if (e.code === 'ECONNABORTED') {
                self.$message.error(e.message)
              }
            })
          })
        } else {
          self.$message.warning(self.$t('issueAddUpdate.uploadFormatErr'))
        }
        // files 是 input 中选中的文件列表
        // insert 是获取图片 url 后，插入到编辑器的方法
        // .then((imgUrl) => {
        //   insert(imgUrl)
        // })
        // 上传代码返回结果之后，将图片插入到编辑器中
      }
      this.editor.config.onchange = (html) => {
        // console.log(`valTxt: ${this.editor.txt.text().replace(/&nbsp;/g, ' ')}`)
        this.$store.commit('common/updaValTxt', this.editor.txt.text().replace(/&nbsp;/g, ' '))
        if (html === '<p><br></p>') {
          this.info_ = ''
        } else {
          this.info_ = html // 绑定当前逐渐地值
        }
        // console.log(this.info_)
        this.$emit('change', this.info_) // 将内容同步到父组件中
      }
      //
      this.editor.config.lang = {
        '设置标题': 'title',
        '字号': 'font size',
        '字体': 'font',
        '文字颜色': 'font color',
        '背景色': 'background color',
        '设置列表': 'list',
        '有序列表': 'ordered',
        '无序列表': 'unordered',
        '对齐方式': 'alignment',
        '靠左': 'left',
        '靠右': 'right',
        '居中': 'center',
        '正文': 'p',
        '链接文字': 'link text',
        '链接': 'link',
        '上传图片': 'upload image',
        '上传': 'upload',
        '创建': 'init',
        '插入表格': 'insert table',
        '行': 'row',
        '列': 'column',
        '表格': ' table',
        '插入': 'insert',
        '的': '',
        '代码': ' code'
        // 还可自定添加更多
      }
      // 关闭粘贴样式的过滤
      this.editor.config.pasteFilterStyle = false
      // 自定义处理粘贴的文本内容
      this.editor.config.pasteTextHandle = function (content) {
        console.log('处理粘贴文本')
        // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
        // return content + '<p>在粘贴内容后面追加一行</p>'
        if (content === '' && !content) return ''
        let input = content
        console.log('input----', input)
        // 1. remove line breaks / Mso classes
        var stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")?)/g
        var output = input.replace(stringStripper, ' ')
        // 2. strip Word generated HTML comments
        var commentSripper = new RegExp('<!--(.*?)-->', 'g')
        output = output.replace(commentSripper, '')
        var tagStripper = new RegExp('<(/)*(meta|link|span|\\?xml:|st1:|o:|font)(.*?)>', 'gi')
        // 3. remove tags leave content if any
        output = output.replace(tagStripper, '')
        // 4. Remove everything in between and including tags '<style(.)style(.)>'
        var badTags = ['style', 'script', 'applet', 'embed', 'noframes', 'noscript']
        for (let i = 0; i < badTags.length; i++) {
          tagStripper = new RegExp('<' + badTags[i] + '.*?' + badTags[i] + '(.*?)>', 'gi')
          output = output.replace(tagStripper, '')
        }
        // 5. remove attributes ' style="..."'
        var badAttributes = ['style', 'start']
        for (let i = 0; i < badAttributes.length; i++) {
          var attributeStripper = new RegExp(' ' + badAttributes[i] + '="(.*?)"', 'gi')
          output = output.replace(attributeStripper, '')
        }
        console.log('output----', output)
        return output
      }
      this.editor.create()
      var classValRef = document.getElementsByClassName('w-e-icon-ref')[0]
      var classValAt = document.getElementsByClassName('w-e-icon-at')[0]
      var classValFAQ = document.getElementsByClassName('w-e-icon-faq')[0]
      if (classValRef) {
        classValRef.setAttribute('class', 'ali-icon-fujian')
      }
      if (classValAt) {
        // classValAt.setAttribute('class', 'icon-ali-icon-at')
      }
      if (classValFAQ) {
        classValFAQ.setAttribute('class', 'hush-icon-yinyong')
      }
    },
    showFileName,
    watchLink (e) {
      const _thisDom = e.target
      let nodeClassName = ''
      if (_thisDom.hasChildNodes()) {
        nodeClassName = _thisDom.firstElementChild.getAttribute('class')
      } else {
        nodeClassName = _thisDom.getAttribute('class')
      }
      if (nodeClassName === 'ali-icon-fujian' && (!this.filesList || this.filesList.length === 0)) {
        this.$message.warning('No file')
      }
      if (nodeClassName === 'ali-icon-fujian' && this.filesList && this.filesList.length > 0) {
        this.linkListVisible = true
      }
      if (nodeClassName === 'icon-ali-icon-at') {
        this.showAtDia()
      }
      if (nodeClassName === 'hush-icon-yinyong') {
        this.showFAQDia()
      }
    },
    // showAtDia () {
    //   this.atDialog = true
    //   this.$nextTick(() => {
    //     this.$refs.atUserDia.getDataList({'url': `/issue/comment/at`}, {'issId': this.issId})
    //   })
    // },
    insertLink (enclName, enclSrc) {
      enclSrc = this.$http.adornUrl(enclSrc)
      // enclSrc = this.$http.adornUrl(enclSrc) + '?token=' + this.$cookie.get('token')
      // this.editor.cmd.do('insertHTML', '<a href="' + enclSrc + '" target="_blank">' + enclName + '</a>')
      this.editor.cmd.do('insertHTML', '<a class="refInsertTagA" href="' + enclSrc + '" target="_blank">' + enclName + '</a>')
      this.linkListVisible = false
    },
    // confirmAt (name, id) {
    //   let html = ''
    //   for (let i = 0; i < id.length; i++) {
    //     // contenteditable="false"
    //     html += `<span>&nbsp;</span><span style="background-color:#fff;border:none;outline:none;color:#ff0000;" contenteditable="false" class="at" data-issId="${id[i]}">@${name[i]}</span><span>&nbsp;</span>`
    //     // document.execCommand('insertHTML', false, '‍' + html + '‍')
    //   }
    //   console.log(html)
    //   this.editor.cmd.do('insertHtml', `<p style="display:inline;">${html}</p>`)
    //   // this.editor.cmd.do('insertHtml', ' ')
    //   this.atDialog = false
    // },
    clearEditor () {
      this.copyFromLink = false
      this.editor.txt.clear()
    },
    dataURLtoFile (dataurl, filename) { // 将base64转换为文件
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, {type: mime})
    },
    compressImg (fileImg) {
      return new Promise((resolve, reject) => {
        var newFileImg = {}
        var self = this
        var reader = new FileReader()
        reader.readAsDataURL(fileImg)
        reader.onload = (e) => {
          var img = new Image()
          img.src = e.target.result
          // base64地址图片加载完毕后执行
          img.onload = function () {
            // 缩放图片需要的canvas（也可以在DOM中直接定义canvas标签，这样就能把压缩完的图片不转base64也能直接显示出来
            var canvas = document.createElement('canvas')
            var context = canvas.getContext('2d')
            // 图片原始尺寸
            var originWidth = this.width
            var originHeight = this.height
            // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
            // var maxWidth = 300
            // var maxHeight = 300
            // 目标尺寸
            var targetWidth = originWidth
            var targetHeight = originHeight
            // 图片尺寸超过最大尺寸的限制
            // if (originWidth > maxWidth || originHeight > maxHeight) {
            //   if (originWidth / originHeight > maxWidth / maxHeight) {
            //       // 更改宽度，按照宽度限定尺寸
            //     targetWidth = maxWidth
            //     targetHeight = Math.round(maxWidth * (originHeight / originWidth))
            //   } else {
            //     targetHeight = maxHeight
            //     targetWidth = Math.round(maxHeight * (originWidth / originHeight))
            //   }
            // }
                // 对图片进行缩放
            canvas.width = targetWidth
            canvas.height = targetHeight
                    // 清除画布
            context.clearRect(0, 0, targetWidth, targetHeight)
                    // 图片压缩
            context.drawImage(img, 0, 0, targetWidth, targetHeight)
                    // 第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/
                    // 压缩后的base64文件
            self.imageUrl = canvas.toDataURL('image/jpeg', 0.5)
            // self.imageUrl = canvas.toDataURL(fileImg.type, 0.5)
            newFileImg = self.dataURLtoFile(self.imageUrl, fileImg.name)
            resolve(newFileImg)
          }
        }
      })
    },
    // 提供给父组件调用，更新替换文本值
    updateTextValue (value) {
      this.editor.txt.html(value)
      // 同时更新ValTxt
      this.$store.commit('common/updaValTxt', this.editor.txt.text().replace(/&nbsp;/g, ' '))
    },
    // 打开faq框
    showFAQDia () {
      this.quoteFAQVisible = true
      this.$nextTick(() => {
        this.$refs.quoteFAQ.init()
      })
    },
    // 引用faq
    quoteTheInfoId (infoId, title) {
      this.editor.cmd.do('insertHTML', '&nbsp;<i class="hush-icon-yinyong" style="color:#17b3a3;font-size:12px;"></i><a class="quoteFAQ-btn" href="#" data-infoid="' + infoId + '">' + title + '</a>')
      this.quoteFAQVisible = false
    }
  }
}
</script>

<style lang="css" scoped>
.editor {
  width: 100%;
  margin: 0 auto;
}
.toolbar {
  border: 1px solid #ccc;
}
.text {
  border: 1px solid #ccc;
  height: 300px;
}
.encl {
  text-decoration: none;
  cursor: pointer;
  color: #17B3A3;
}
.encl:hover {
  text-decoration: none;
}

</style>
<style>

.quoteFAQ-btn{
  background: none;
  border: none;
  color: #17B3A3;
}
.reply .quoteFAQ-btn:hover{
  cursor: pointer;
  text-decoration: underline;
}
</style>