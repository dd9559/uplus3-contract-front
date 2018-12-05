import axios from 'axios'
const qs = require('qs')

let errorMsg = {
  '400':'系统繁忙，请稍后再试',
  '403':'无该功能权限',
  '410':'重复请求',
  '500':'网络异常，请稍后再试',
}
axios.interceptors.response.use((response)=>{
  // debugger
  let res=response.data
  if(res.status===200){
    return response
  }else if(res.status===110){
    return Promise.reject('无该功能权限')
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
    return axios.get(url,{params:param}).then(res => {
      return res
    })
  },
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
