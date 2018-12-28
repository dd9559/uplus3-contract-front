import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    path:[],
    slider:[],
    collapse: true,//侧边栏是否收起
    user:null,
    fullscreenLoading:false,
    bodyScollShow:0
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
    },
    bodyScollShowFn(state,payload){
      if(state.bodyScollShow>999){
        state.bodyScollShow = 0;
      }else{
        state.bodyScollShow++;
      }
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
    },
    getBodyScollShow:state=>{
      return state.bodyScollShow
    }
  }
})
export {
  store
}
