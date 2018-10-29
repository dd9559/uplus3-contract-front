import Vue from 'vue'
import Router from 'vue-router'
// 模块懒加载
const Index = () => import('@/pages/index')
const Setting =()=>import('@/pages/setting/index')
const contractTemplate =()=>import('@/pages/setting/contractTemplate')
const postProcess=()=>import('@/pages/setting/postProcess')
const Company=()=>import('@/pages/setting/company')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Index,
      children:[
        {
          path:'setting',
          // redirect: '/setting/contractTemplate',
          component: Setting,
          children:[
            {
              path:'contractTemplate',
              component:contractTemplate
            },
            {
              path:'postProcess',
              component:postProcess
            },
            {
              path:'company',
              component:Company
            }
          ]
        }
      ]
    }
  ]
})
