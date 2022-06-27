import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission'// permission control
// 引入全局注册公共组件
import Components from '@/components'
// 注册自定义指令
import * as directives from '@/directives'
import * as filters from '@/filters'
Vue.use(ElementUI, { locale })
// 注册自定义指令
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})

// 注册格式化过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// 注册自定义指令
Vue.use(Components)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
