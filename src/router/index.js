import Vue from 'vue'
import Router from 'vue-router'
// 模块懒加载

const Index = () => import("@/pages/Index");

//设置模块
const contractTemplate = () => import('@/pages/setting/contractTemplate')
const contraPreview = () => import('@/pages/setting/contraPreview')

const postProcess = () => import('@/pages/setting/postProcess')
const Company = () => import('@/pages/setting/company')
const moneyType = () => import('@/pages/setting/moneyType')
const operationLog = () => import('@/pages/setting/operationLog')
const approvalProcess = () => import('@/pages/setting/approvalProcess')

//票据管理
const paperSet = () => import('@/pages/finance/paperSet')

// 签后
const postManage = () => import('@/pages/postSigning/postManage')
const postMonitor = () => import('@/pages/postSigning/postMonitor')
const postReceive = () => import('@/pages/postSigning/postReceive')

//业绩模块
const actualAchievement = () => import('@/pages/achievement/actualAchievement')
const receivableAchievement = () => import('@/pages/achievement/receivableAchievement')
const storeReceive = () => import('./../pages/achievement/storeReceive.vue')

const actualHarvest = () => import('@/pages/finance/actualHarvest')
const moneyCheck = () => import('@/pages/finance/moneyCheck')
const Bill = () => import('@/pages/finance/bill')
const billDetails = () => import('@/pages/finance/billDetails')
const payBill=()=>import('@/pages/finance/payBill')
const payResult=()=>import('@/pages/finance/payResult')
const receiptBill=()=>import('@/pages/finance/receiptBill')
const receiptResult=()=>import('@/pages/finance/receiptResult')

// 合同模块
const newIntention = () => import("@/pages/contract/contractList/newIntention")
const editIntention = () => import("@/pages/contract/contractList/editIntention")
const detailIntention = () => import("@/pages/contract/contractList/detailIntention")
const adjustCheck = () => import("@/pages/contract/contractList/adjustCheck");
const settleCheck = () => import("@/pages/contract/contractList/settleCheck");
const contractList = () => import("@/pages/contract/contractList/contractList")
const addContract = () => import("@/pages/contract/contractList/addContract")
const contractDetails = () => import("@/pages/contract/contractList/contractDetails")
const contractPreview = () => import("@/pages/contract/contractList/contractPreview")
const layerAudit = () => import("@/pages/contract/contractDialog/layerAudit");
const layerSettle = () => import("@/pages/contract/contractDialog/layerSettle");
const changeCancel = () => import("@/pages/contract/contractDialog/changeCancel");
const routingRecord = () => import("@/pages/contract/contractList/routingRecord");

const Login =()=>import("@/login")

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      component: Index,
      redirect: '/login',
      children: [
        // 设置模块
        {
          path: "contractTemplate",
          component: contractTemplate
        },
        {
          path: "contraPreview",
          component: contraPreview
        },
        {
          path: "postProcess",
          component: postProcess
        },
        {
          path: "company",
          component: Company
        },
        {
          path: "moneyType",
          component: moneyType
        },
        {
          path: "operationLog",
          component: operationLog
        },
        {
          path: "approvalProcess",
          component: approvalProcess
        },
        //设置模块 end
        {
          path: "actualHarvest",
          component: actualHarvest
        },
        {
          path: "moneyCheck",
          component: moneyCheck
        },
        // 业绩板块
        {
          path: "actualAchievement",
          component: actualAchievement
        },
        {
          path: "receivableAchievement",
          component: receivableAchievement
        },
        {
          path: "storeReceive",
          component: storeReceive
        },
        // 业绩板块 end
        {
          path: "Bill",
          component: Bill
        },
        {
          path: "billDetails",
          component: billDetails,
          meta:{
            getParent:true
          }
        },
        // 合同——合同列表——新增意向金
        {
          path: "newIntention",
          component: newIntention
        },
        {
          path: "editIntention",
          component: editIntention
        },
        {
          path: "detailIntention",
          component: detailIntention
        },
        {
          path: "adjustCheck",
          component: adjustCheck
        },
        {
          path: "settleCheck",
          component: settleCheck
        },
        {
          path: "layerAudit",
          component: layerAudit
        },
        {
          path: "payBill",
          component: payBill,
          meta:{
            getParent:true
          }
        },
        {
          path: "payResult",
          component: payResult
        },
        {
          path: "receiptBill",
          component: receiptBill,
          meta:{
            getParent:true
          }
        },
        {
          path: "receiptResult",
          component: receiptResult
        },
        {
          path: "contractList",
          component: contractList
        },
        // 票据管理
        {
          path: "paperSet",
          component: paperSet
        },
        // 签后
        {
          path: "postReceive",
          component: postReceive
        },
        {
          path: "postManage",
          component: postManage
        },
        {
          path: "postMonitor",
          component: postMonitor
        },
        //新增合同
        {
          path: "addContract",
          component: addContract
        },
        //合同详情
        {
          path: "contractDetails",
          component: contractDetails
        },
        //合同预览
        {
          path: "contractPreview",
          component: contractPreview
        },
        //调佣申请弹层（最后需要删掉）
        {
          path: "layerAudit",
          component: layerAudit
        },
        //结算申请弹层（最后需要删掉）
        {
          path: "layerSettle",
          component: layerSettle
        },
        //变更/解约弹层（最后需要删掉）
        {
          path: "changeCancel",
          component: changeCancel
        },
        //分账记录
        {
          path: "routingRecord",
          component: routingRecord
        },
        {
          path: 'login',
          component:Login
        }
      ]
    }
  ]
});



