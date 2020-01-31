import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 导入公共样式
import './assets/css/common.css'
// 导入UI组件
import './plugins/element.js'
// 字体图标
import './assets/fonts/iconfont.css'
// 注册第三方组件
import treeTable from 'vue-table-with-tree-grid'
// 时间过滤器
Vue.filter('dataFormat',(dateStr) => {
  const dt = new Date(dateStr)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')

  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor, /* { default global options } */)
Vue.component('tree-table', treeTable)

Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
