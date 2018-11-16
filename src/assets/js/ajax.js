import axios from 'axios'
const qs = require('qs')

let errorMsg = {
  '400':'系统繁忙，请稍后再试',
  '403':'无该功能权限',
  '410':'重复请求',
  '500':'网络异常，请稍后再试',
}

let api = {
  post: function(url, param) {
    return axios
      .post(url, qs.stringify(param))
      .then(res => {
        return res
      })
  },
  postJSON: function(url, param) {
    let jsonParam = JSON.stringify(param)
    console.log(jsonParam)
    let headers = {
      post: {}
    }
    headers.post['Content-Type'] = 'application/json'
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
  put: function(url, param) {
    return axios.put(url, qs.stringify(param)).then(res => {
      return res
    })
  }
}
export { api,errorMsg }
