import axios from 'axios'
const qs = require('qs')

let errorMsg = {
  '400':'系统繁忙，请稍后再试',
  '403':'无该功能权限',
  '410':'重复请求',
  '500':'网络异常，请稍后再试',
}
let times = 0

axios.defaults.headers.common['Cache-Control']='no-cache'
axios.interceptors.response.use((response)=>{
  // debugger
  let res=response.data
  if(res.status===200){
    times = 0
    return response
  }else if(res.status===110){
    return Promise.reject('无该功能权限')
  }else if(res.status===120){
    times++
    if(times===1&&Vue.prototype.$routerObj.currentRoute.path!=='/login'){
      Vue.prototype.$message('请到U+客户端登录')
      console.log(times,Vue.prototype.$routerObj,Vue.prototype.$routerObj.currentRoute.path)
      Vue.prototype.$routerObj.push({
        path:'login'
      })
    }
    // return Promise.reject('请登录')
  }else if(res.status===300){
    return Promise.reject(res)
  }else {
    return Promise.reject(res.message)
  }
},error => {
  return Promise.reject(error)
})

let api = {
  post: function(url, param) {
    return axios
      .post(url, qs.stringify(param))
      .then(res => {
        return res
      })
  },
  postJSON: function(url, param,type=1) {
    let jsonParam = JSON.stringify(param)
    console.log(jsonParam)
    let headers = {
      post: {}
    }
    headers.post['Content-Type'] = type===1?'application/json':'application/x-www-form-urlcoded'
    return axios.post(url, jsonParam, { headers: headers }).then(res => {
      return res
    })
  },
  get: function(url, param) {
    param = Object.assign({},param,{
      dayRandomTime:new Date().getTime()
    })
    return axios.get(url,{params:param}).then(res => {
      return res
    })
  },
  // getFile: function(url, param) {
  //   let header = {}
  //   header['Content-Type'] = 'video/mpeg'
  //   return axios.get(url,{params:param}).then(res => {
  //     return res
  //   })
  // },
  delete: function(url, param) {
    return axios
      .delete(url, {
        params: param
      })
      .then(res => {
        return res
      })
  },
  put: function(url, param,type=1) {
    let header={}
    if(type===1){
      header['Content-Type']='application/json'
    }
    return axios.put(url, type===1?JSON.stringify(param):qs.stringify(param),{headers:header}).then(res => {
      return res
    })
  }
}
export { api,errorMsg }
