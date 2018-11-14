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

Vue.use(ElementUI);

Vue.config.productionTip = false

Vue.prototype.$ajax=api
Vue.prototype.$axios=axios

// 时间格式化
let padDate = function (va) {
  va = va < 10 ? "0" + va : va;
  return va;
};

Vue.filter("formatDate", function (value) {
  var time = new Date(value);
  var year = time.getFullYear();
  var month = padDate(time.getMonth() + 1);
  var day = padDate(time.getDate());
  return (
    year + "-" + month + "-" + day
  );
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

