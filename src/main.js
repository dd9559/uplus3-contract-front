// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'babel-polyfill'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import {api} from '@/assets/js/ajax'
import {TOOL} from "@/assets/js/common"

Vue.use(ElementUI);

Vue.config.productionTip = false

Vue.prototype.$ajax=api   //axios请求封装
Vue.prototype.$tool=TOOL  //工具方法封装

Vue.filter("formatDate", TOOL.dateFormat);
Vue.filter("formatTime", TOOL.timeFormat);
Vue.filter("formatNull", TOOL.nullFormat);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

