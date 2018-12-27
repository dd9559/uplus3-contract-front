import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    path:[],
    slider:[],
    collapse: true,//侧边栏是否收起
    user:null,
    fullscreenLoading:false
  },
  mutations: {
    setPath (state,payload) {
      localStorage.setItem('router',JSON.stringify(payload))
      state.path=payload
    },
    setUser(state,payload){
      sessionStorage.setItem('userMsg',JSON.stringify(payload))
      state.user=payload
    },
    setLoading(state,payload){
      state.fullscreenLoading=payload
    },
    setCollapse(state,payload){
      state.collapse=payload
    }
  },
  actions:{
    asyncUser({commit},payload){
      commit('setUser',payload)
    }
  },
  getters:{
    getPath:state=>{
      return state.path
    },
    getUser:state=>{
      return state.user
    },
    getLoading:state=>{
      return state.fullscreenLoading
    },
    getCollapse:state=>{
      return state.collapse
    }
  }
})
export {
  store
}
