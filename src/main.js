// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'babel-polyfill'
import App from './App'
import router from './router'
import {store} from './store'
import ELEMENT from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';

import ScreeningTop from '@/components/ScreeningTop';
import fileUp from '@/components/up'
import uploadCell from '@/components/uploadCell'
import preview from '@/components/preview'
import selectTree from '@/components/selectTree'
import scrollBar from '@/components/scrollBar'
import {api} from '@/assets/js/ajax'
import {TOOL} from "@/assets/js/common"

Vue.use(ELEMENT);

Vue.config.productionTip = false

Vue.prototype.$ajax=api   //axios请求封装
Vue.prototype.$tool=TOOL  //工具方法封装
Vue.prototype.$routerObj=router

Vue.filter("formatDate", TOOL.dateFormat);
Vue.filter("formatTime", TOOL.timeFormat);
Vue.filter("formatNull", TOOL.nullFormat);
Vue.filter("formatChinese", TOOL.toChineseNumber)

Vue.component("ScreeningTop",ScreeningTop);
Vue.component("fileUp",fileUp)
Vue.component("uploadCell",uploadCell)
Vue.component("preview",preview)
Vue.component("selectTree",selectTree)
Vue.component("scrollBar", scrollBar)

Vue.directive('focus', {
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
Vue.directive('loadmore', {
  bind(el, binding) {

    // 获取element-ui定义好的scroll盒子
    const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');

    SELECTWRAP_DOM.addEventListener('scroll', function() {

      /*
      * scrollHeight 获取元素内容高度(只读)
      * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
      * clientHeight 读取元素的可见高度(只读)
      * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
      * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
      */
      const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight;

      if(CONDITION) {
        binding.value();
      }
    });
  }
})

//防止提交按钮 重复提交
Vue.directive("dbClick", {
  inserted(el, binding) {
    el.addEventListener("click", e => {
      if (!el.disabled) {
        el.disabled = true;
        let timer = setTimeout(() => {
          el.disabled = false;
        }, 3000);
      }
    });
  }
});

router.beforeEach((to,from,next)=>{
  let pathList = localStorage.getItem('router')
  store.commit('setPath',pathList?JSON.parse(pathList):[])

  // let userMsg = localStorage.getItem('userMsg')
  // console.log(store.state.user)
  if(!store.state.user&&to.path!=='/login'){
    // debugger
    api.get('/api/me').then(res=>{
      res=res.data
      if(res.status===200){
        store.commit('setUser',res.data)
      }
    }).catch(error=>{

    })
  }

  if(to.matched.some(record=>record.meta.root)){
    if(to.path==='/moneyCheck'){
      to.meta.list=parseInt(to.query.type)===1?['财务','收款审核']:['财务','付款审核']
    }
    let arr = TOOL.getRouter(to.meta.list,to.fullPath)
    store.commit('setPath',arr)
    next()
  }else {
    next()
  }
})



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

