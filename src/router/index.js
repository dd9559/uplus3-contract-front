import Vue from 'vue'
import Router from 'vue-router'
// 模块懒加载
const Index = () => import('@/pages/index')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Index
    }
  ]
})
