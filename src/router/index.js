import Vue from 'vue'
import Router from 'vue-router'
// 模块懒加载
const Index = () => import('@/pages/index')
const contractTemplate = () => import('@/pages/setting/contractTemplate')
const postProcess = () => import('@/pages/setting/postProcess')
const Company = () => import('@/pages/setting/company')
const postSigning = () => import('@/pages/postSigning/index')
const postManage = () => import('@/pages/postSigning/postManage')
const postMonitor = () => import('@/pages/postSigning/postMonitor')
const postReceive = () => import('@/pages/postSigning/postReceive')

const paperSet = () => import('@/pages/finance/paperSet') //票据管理

//业绩模块
const actualAchievement = () => import('@/pages/achievement/actualAchievement')
const receivableAchievement = () => import('@/pages/achievement/receivableAchievement')
const storeReceive = () => import('./../pages/achievement/storeReceive.vue')

const actualHarvest = () => import('@/pages/finance/actualHarvest')
const moneyCheck = () => import('@/pages/finance/moneyCheck')
const Bill = () => import('@/pages/finance/bill')
const billDetails = () => import('@/pages/finance/billDetails')


Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    component: Index,
    children: [{
      path: 'contractTemplate',
      component: contractTemplate
    },
      {
        path: 'postProcess',
        component: postProcess
      },
      {
        path: 'company',
        component: Company
      },
      {
        path: 'actualHarvest',
        component: actualHarvest
      },
      {
        path: 'moneyCheck',
        component: moneyCheck
      },
      {
        path: 'actualAchievement',
        component: actualAchievement
      },
      {
        path: 'receivableAchievement',
        component: receivableAchievement
      },
      {
        path: 'storeReceive',
        component: storeReceive
      },
      {
        path: 'paperSet',
        component: paperSet
      },
      {
        path: 'Bill',
        component: Bill
      },
      {
        path: 'billDetails',
        component: billDetails
      }]
  }]
})

