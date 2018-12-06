// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'babel-polyfill'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import ScreeningTop from '@/components/ScreeningTop';
import fileUp from '@/components/up'
import uploadCell from '@/components/uploadCell'
import preview from '@/components/preview'
import {api} from '@/assets/js/ajax'
import {TOOL} from "@/assets/js/common"

Vue.use(ElementUI);

Vue.config.productionTip = false

Vue.prototype.$ajax=api   //axios请求封装
Vue.prototype.$tool=TOOL  //工具方法封装

Vue.filter("formatDate", TOOL.dateFormat);
Vue.filter("formatTime", TOOL.timeFormat);
Vue.filter("formatNull", TOOL.nullFormat);
Vue.filter("formatChinese", TOOL.toChineseNumber)

Vue.component("ScreeningTop",ScreeningTop);
Vue.component("fileUp",fileUp)
Vue.component("uploadCell",uploadCell)
Vue.component("preview",preview)

router.beforeEach((to,from,next)=>{
  // debugger
  if(to.matched.some(record=>record.meta.getParent)){
    if(from.path!=='/'){
      localStorage.setItem('route',from.fullPath)
    }
    next()
  }else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

