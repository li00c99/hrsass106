import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404']

// 前置路由守卫
router.beforeEach(async (to, from, next) => {
  // 说明有token
  NProgress.start()
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/') // 登入页直接跳转主页
    } else {
      if (!store.getters.userId) { // 当有token但是没有userId的时候发起获取用户请求
        await store.dispatch('user/getUserInfo')
      }
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) { // 判断是否白名单
      next() // 放行
    } else {
      next('/login') // 返回登入页
    }
  }
  NProgress.done()
})
// 后置路由守卫
router.afterEach(function () {
  NProgress.done()
})

