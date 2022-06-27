import Layout from '@/layout'
//  {  path: '', component: '' }
// 每个子模块 其实 都是外层是layout  组件位于layout的二级路由里面
export default {
  path: '/employees', // 路径
  component: Layout,
  children: [{
    path: '',
    component: () => import('@/views/employees'),
    meta: {
      title: '员工', // meta属性的里面的属性 随意定义 但是这里为什么要用title呢 因为左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
      icon: 'people'
    }
  }, {
    path: 'detail/:id',
    component: () => import('@/views/employees/detail'),
    hidden: true,
    meta: {
      title: '员工详情'
    }
  }]
}
