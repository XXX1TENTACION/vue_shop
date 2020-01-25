import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 导入公共样式
import './assets/css/common.css'
// 导入UI组件
import './plugins/element.js'
// 字体图标
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
